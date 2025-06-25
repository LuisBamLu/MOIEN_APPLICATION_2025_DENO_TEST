<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { Browser } from '@capacitor/browser';
    import haversine from 'haversine-distance';
    import { getLocalizedTextBySlug, getMap, getJsonText, logError, getCeilInteger } from 'senselogic-gist';
    import { calculateCarbonEmission, fetchData, flyFade, getFormattedPrice, shake } from '$lib/base';
    import { countNightsBetweenArrivalDateAndDepartureDate } from '$lib/booking';
    import { languageTagStore } from '$store/languageTagStore';
    import { defaultLocationStore } from '$store/locationStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { totalGuestCounterStore, bookedPropertyStore } from '$store/bookingStore';
    import CheckoutPageHeader from '$component/page/checkout/CheckoutPageHeader.svelte';
    import CheckoutPageEmissionStep from '$component/page/checkout/CheckoutPageEmissionStep.svelte';
    import CheckoutPageCalculationStep from '$component/page/checkout/CheckoutPageCalculationStep.svelte';
    import CheckoutPagePaymentStep from '$component/page/checkout/CheckoutPagePaymentStep.svelte';
    import CheckoutPageActions from '$component/page/checkout/CheckoutPageActions.svelte';
    import CheckoutPageSuccessModal from '$component/page/checkout/CheckoutPageSuccessModal.svelte';
    import { linear } from 'svelte/easing';
    import { toast } from '$lib/toast';
    import { profileSignedInStore } from '$store/profileStore';

    // -- VARIABLES

    export let id;
    let isLoading = true;
    let bookingId = id;
    let checkoutStepArray =
        [
            'Emission Start',
            'Emission Calculation',
            'Payment'
        ];
    let activeStep = 0;
    let featureByTypeIdMap = getMap( $bookedPropertyStore.featureArray, 'typeId' );
    let nightCountByPriceMap = $bookedPropertyStore.nightCountByPriceMap;
    let hasInstantBooking = featureByTypeIdMap[ 'has-instant-booking' ]?.value === 'true';
    let basePrice = getBasePrice();
    let donation = getCeilInteger( basePrice * 0.01 * $bookedPropertyStore.conversionRate );
    let compensation = 0;
    $: nightCount
        = countNightsBetweenArrivalDateAndDepartureDate(
            $filterParameterByKeyMapStore.bookingParameters.arrivalDate,
            $filterParameterByKeyMapStore.bookingParameters.departureDate
            );
    $: totalPrice =
        basePrice
        + donation * ( 1 / $bookedPropertyStore.conversionRate )
        + compensation * ( 1 / $bookedPropertyStore.conversionRate )
        + getExtraFee( 'short-term-cleaning-fee' )
        + getExtraFee( 'short-term-sheets-fee' )
        + getExtraFee( 'short-term-towels-fee' )
        + getExtraFee( 'short-term-other-fee' );
    let cancellationPolicyId = null;
    let paymentMethodArray = [];
    let selectedPaymentMethodId = null;
    let isSubmitting = false;
    let errorMessage = null;
    let carbonEmission = 0;
    let departureCity =
        {
            latitude: $defaultLocationStore.latitude,
            longitude: $defaultLocationStore.longitude
        };
    let vehicleTypeByIdMap =
        {
            bike: { id: 'bike', label: 'Bike¨fr:Vélo¨de:Fahrrad', grams: 0 },
            train: { id: 'train', label: 'Train¨de:ZUg', grams: 14 },
            bus: { id: 'bus', label: 'Bus', grams: 68 },
            car: { id: 'car', label: 'Car¨fr:Voiture¨de:Auto', grams: 104, fourPassangers: 42 },
            suv: { id: 'suv', label: 'SUV', grams: 158, fourPassangers: 55 },
            motorcycle: { id: 'motorcycle', label: 'Motorbike¨fr:Moto¨de:Motorrad', grams: 72 },
            plane: { id: 'plane', label: 'Plane¨fr:Avion¨de:Flugzeug', grams: 285 }
        };
    let selectedVehicleTypeId = 'train';
    let selectedCity =
        {
            id: '',
            code: '',
            countryCode: '',
            name: '',
            searchName: '',
            provinceName: '',
            countryName: '',
            latitude: $defaultLocationStore.latitude,
            longitude: $defaultLocationStore.longitude
        };
    let cityName = '';
    let distance;
    let isSuccessModalOpen = false;
    let errorMap = {};
    let bookingStatus = null;
    let transitionDirection;
    let previousStep = 1;
    let rentalBooking =
        {
            status: 'requested'
        };

    // ~~

    async function handleSubmitBooking(
        )
    {
        if ( !cityName )
        {
            errorMap[ 'cityName' ] = true;
            errorMessage = 'select-city-label';

            return;
        }
        else
        {
            departureCity = selectedCity;
            errorMap[ 'cityName' ] = false;
            errorMessage = '';
        }

        if ( activeStep === 0 )
        {
            compensation = getCeilInteger( calculateCompensation( carbonEmission ) );
        }

        if ( activeStep < 2 )
        {
            activeStep++;

            return;
        }

        if ( checkoutStepArray[ activeStep ] === 'Success' )
        {
            navigate( '/' );
        }

        if ( !selectedPaymentMethodId && hasInstantBooking )
        {
            toast.error( 'Please select a payment method' );

            return;
        }

        let data =
            {
                propertyUserId: $bookedPropertyStore.userId,
                price:
                    basePrice
                    + compensation
                    + getExtraFee( 'short-term-cleaning-fee' )
                    + getExtraFee( 'short-term-sheets-fee' )
                    + getExtraFee( 'short-term-towels-fee' )
                    + getExtraFee( 'short-term-other-fee' ),
                paymentMethodId: selectedPaymentMethodId,
                conversionId: $bookedPropertyStore.conversionId,
                rentalBooking:
                    {
                        id: bookingId,
                        propertyId: $bookedPropertyStore.id,
                        guestCount: $totalGuestCounterStore ?? 1,
                        arrivalDate: $filterParameterByKeyMapStore.bookingParameters.arrivalDate,
                        departureDate: $filterParameterByKeyMapStore.bookingParameters.departureDate,
                        dayCount: nightCount,
                        donation: donation * ( 1 / $bookedPropertyStore.conversionRate ),
                        carbonCompensationDonation: compensation * ( 1 / $bookedPropertyStore.conversionRate ),
                        cleaningFee: getExtraFee( 'short-term-cleaning-fee' ),
                        sheetsFee: getExtraFee( 'short-term-sheets-fee' ),
                        towelsFee: getExtraFee( 'short-term-towels-fee' ),
                        otherFee: getExtraFee( 'short-term-other-fee' ),
                        totalPrice: totalPrice,
                        cancellationPolicyId: cancellationPolicyId,
                        status: 'requested',
                        conversionRate: $bookedPropertyStore.conversionRate,
                    },
                browserInfo:
                    {
                        JavaEnabled: navigator.javaEnabled(),
                        Language: navigator.language,
                        ColorDepth: window.screen.colorDepth,
                        ScreenHeight: window.screen.height,
                        ScreenWidth: window.screen.width,
                        TimeZoneOffset: new Date().getTimezoneOffset(),
                        UserAgent: navigator.userAgent,
                        JavascriptEnabled: true
                    }
            };

        isSubmitting = true;
        errorMessage = '';

        try
        {
            let bookingData
                = await fetchData(
                    '/api/rental-booking/add',
                    {
                        method: 'POST',
                        credentials: 'include',
                        body: getJsonText( { data: data, type: 'addRentalBooking' } ),
                        redirect: 'follow'
                    }
                    );

            if ( bookingData.secureModeRedirectUrl )
            {
                Browser.open( { url: bookingData.secureModeRedirectUrl, windowName: '_self' } );
                isSubmitting = false;

                return;
            }

            if ( bookingData.error )
            {
                toast.error( bookingData.error );
            }
            else
            {
                rentalBooking = bookingData.rentalBooking;

                setTimeout(
                    () =>
                    {
                        isSuccessModalOpen = true;
                        bookingStatus = rentalBooking.status;
                    },
                    500
                    );
            }
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    async function populatePaymentMethodArrayFromPaymentMethodMap(
        paymentMethodMap
        )
    {
        for ( let card of paymentMethodMap.cardArray )
        {
            if ( card.Active && card.Currency === $profileSignedInStore.currencyCode )
            {
                let expirationDate = card.ExpirationDate.substring( 0, 2 ) + '/' + card.ExpirationDate.substring( 2, 4 );
                let cardLabel = card.CardProvider === 'unknown' ? '' : card.CardProvider;
                let cardAliasCount = card.Alias.length;
                let cardAlias = [ '••••', card.Alias.slice( cardAliasCount - 4, cardAliasCount ) ].join( ' ' );

                paymentMethodArray.push(
                    {
                        label: `${ card.CardProvider } ${ cardAlias }`,
                        description:
                            getLocalizedTextBySlug( 'expiration-label', $languageTagStore )
                            + ': '
                            + expirationDate,
                        icon: card.CardProvider.toLowerCase(),
                        value: card.Id
                    }
                    );
            }
        }

        for ( let wallet of paymentMethodMap.walletArray )
        {
            if ( wallet.Currency === $profileSignedInStore.currencyCode )
            {
                paymentMethodArray.push(
                    {
                        label: wallet.Description,
                        description:
                            getLocalizedTextBySlug( 'balance-label', $languageTagStore )
                            + ': '
                            + getFormattedPrice( wallet.Balance.Amount / 100, $languageTagStore, wallet.Currency ),
                        value: wallet.Id
                    }
                    );
            }
        }

        for ( let bankAccount of paymentMethodMap.bankAccountArray )
        {
            // if ( bankAccount.Currency === $profileSignedInStore.currencyCode )
            // {
                paymentMethodArray.push(
                    {
                        label: bankAccount.OwnerName,
                        description: `${ bankAccount.IBAN } · ${ bankAccount.BIC }`,
                        value: bankAccount.Id
                    }
                    );
            // }
        }
    }

    // ~~

    function calculateCompensation(
        carbonEmission
        )
    {
        const tonne = 1000;
        const carbonCreditPrice = 72;

        return ( carbonEmission / tonne ) * carbonCreditPrice;
    }

    // ~~

    function getExtraFee(
        featureTypeId
        )
    {
        return valueToNumber( featureByTypeIdMap[ featureTypeId ]?.value ?? 0 );
    }

    // ~~

    function valueToNumber(
        value
        )
    {
        return ( Number.isNaN( Number( value ) ) ? 0 : Number( value ) );
    }

    // ~~

    function getBasePrice(
        )
    {
        let basePrice = 0;

        for ( let [ nightCount, price ] of Object.entries( nightCountByPriceMap ) )
        {
            basePrice += Number( nightCount ) * price;
        }

        return basePrice;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                if ( $bookedPropertyStore.id === null )
                {
                    navigate( `/${ $languageTagStore }/search` );

                    return;
                }

                let data
                    = await fetchData(
                        '/api/page/checkout',
                        {
                            method: 'POST',
                            credentials: 'include',
                            body: getJsonText( { propertyId: $bookedPropertyStore.id } )
                        }
                        );

                if ( data.cancellationPolicy )
                {
                    cancellationPolicyId = data.cancellationPolicy.value;
                }

                populatePaymentMethodArrayFromPaymentMethodMap( data.profilePaymentMethodMap );
            }
            catch ( error )
            {
                logError( error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );

    // ~~

    $:
    {
        let departure = { latitude: departureCity.latitude, longitude: departureCity.longitude };
        let destination = { latitude: $bookedPropertyStore.latitude, longitude: $bookedPropertyStore.longitude };
        carbonEmission
            = calculateCarbonEmission(
                departure,
                destination,
                vehicleTypeByIdMap[ selectedVehicleTypeId ],
                $totalGuestCounterStore
                );
    };

    // ~~

    $:
    {
        distance =
            (
                haversine(
                    { latitude: departureCity.latitude, longitude: departureCity.longitude },
                    { latitude: $bookedPropertyStore.latitude, longitude: $bookedPropertyStore.longitude }
                    )
                / 1000
            ).toFixed( 2 );
    }

    // ~~

    $:
    {
        let stepDirection = activeStep > previousStep ? 'forward' : activeStep < previousStep ? 'backward' : null;

        transitionDirection =
            stepDirection === 'forward'
            ? 50
            : ( stepDirection === 'backward' ? -50 : 0 );

        previousStep = activeStep;
    }

    // ~~

    $: transitionDirection;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .checkout-page
    {
        overflow-y: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .checkout-page.success
    {
        background-color: blueColor950;
    }

    .checkout-page.wait
    {
        cursor: wait !important;
    }

    .checkout-page-container
    {
        position: relative;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;
        // -ms-overflow-style: none;
        overflow-y: scroll;
        scrollbar-width: none;
        margin-top: 1.5rem;
        max-height: calc( 100dvh - 13.5rem );
        width: 100%;

        +media( desktop )
        {
            max-height: unset;
            max-width: 76.875rem;
        }
    }

    .checkout-page::-webkit-scrollbar
    {
        display: none
    }
</style>

<div class="checkout-page" class:success={ activeStep === 3 } class:wait={ isSubmitting } >
    <CheckoutPageHeader bind:activeStep={ activeStep }/>
    {#key activeStep}
        <div
            class="checkout-page-container"
            out:flyFade={ { duration: 350, easing: linear, x: -transitionDirection } }
            in:flyFade={ { delay: 350, duration: 350, easing: linear, x: transitionDirection } }
        >
            {#if checkoutStepArray[ activeStep ] === 'Emission Start' }
                <CheckoutPageEmissionStep
                    vehicleTypeByIdMap={ vehicleTypeByIdMap }
                    handleSubmit={ handleSubmitBooking }
                    bind:cityName={ cityName }
                    bind:selectedCity={ selectedCity }
                    bind:selectedVehicleTypeId={ selectedVehicleTypeId }
                    bind:errorMap={ errorMap }
                />
            {:else if checkoutStepArray[ activeStep ] === 'Emission Calculation' }
                <CheckoutPageCalculationStep
                    selectedCity={ selectedCity }
                    distance={ distance }
                    selectedVehicleType={ vehicleTypeByIdMap[ selectedVehicleTypeId ] }
                    carbonEmission={ carbonEmission }
                    handleSubmit={ handleSubmitBooking }
                    bind:compensation={ compensation }
                />
            {:else if checkoutStepArray[ activeStep ] === 'Payment' }
                <CheckoutPagePaymentStep
                    nightCount={ nightCount }
                    compensation={ compensation }
                    hasInstantBooking={ hasInstantBooking }
                    featureByTypeIdMap={ featureByTypeIdMap }
                    isSubmitting={ isSubmitting }
                    getExtraFee={ getExtraFee }
                    handleSubmit={ handleSubmitBooking }
                    populatePaymentMethodArrayFromPaymentMethodMap={ populatePaymentMethodArrayFromPaymentMethodMap }
                    basePrice={ basePrice }
                    bind:donation={ donation }
                    bind:totalPrice={ totalPrice }
                    bind:paymentMethodArray={ paymentMethodArray }
                    bind:selectedPaymentMethodId={ selectedPaymentMethodId }
                    bind:isLoading={ isLoading }
                />
            {/if}
        </div>
    {/key}
    <CheckoutPageActions
        isSubmitting={ isSubmitting }
        checkoutStepArray={ checkoutStepArray }
        activeStep={ activeStep }
        totalPrice={ totalPrice }
        handleSubmitBooking={ handleSubmitBooking }
    />
</div>
<CheckoutPageSuccessModal bookingStatus={ rentalBooking.status } bind:isOpen={ isSuccessModalOpen } bookingId={ bookingId } />

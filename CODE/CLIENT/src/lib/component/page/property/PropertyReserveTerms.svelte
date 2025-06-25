<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { getJsonText, getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import { fetchData, getFormattedPrice, getLocalizedMonthName } from '$lib/base';
    import { setUrlQueryParameter } from '$lib/url';
    import { countNightsBetweenArrivalDateAndDepartureDate } from '$lib/booking';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { authModalStore } from '$store/authModalStore';
    import { bookedPropertyStore, guestCounterStore, totalGuestCounterStore } from '$store/bookingStore';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import FilterDate from '$component/filter/FilterDate.svelte';
    import PropertyRules from '$component/page/property/PropertyRules.svelte';
    import PropertyGuestAccordion from './PropertyGuestAccordion.svelte';
    import CounterInput from '../../element/CounterInput.svelte';
    import PropertyPriceRules from './PropertyPriceRules.svelte';
    import { toast } from '$lib/toast';
    import { isVerifyIdentityModalOpen } from '$store/propertyArray';
    import ConfirmEmailChange from '$src/lib/page/ConfirmEmailChange.svelte';

    // -- VARIABLES

    export let property;
    export let cityName;
    export let visit = null;
    export let isScheduleVisitModalOpen = false;
    export let featureByTypeIdMap;
    export let propertyLeaseContract;
    export let profileDocumentByTypeIdMap = {};
    export let rentalBookingArray = [];
    export let rentalDayByDateMap = {};
    export let modal = null;
    export let showPropertySummaryPopup;
    export let shortTermTotalPrice = 0;
    export let nightCountByPriceMap = {};
    export let shortTermNightsCount = 0;
    export let conversionRate = 1;
    export let conversionId = null;
    export let profile = {};
    let termSelected = 'short-term';
    let isAvailableForBothTerms = property.isAvailableForLongTerm && property.isAvailableForShortTerm;
    let dateContainerElement;
    let dateIndex = null;
    let query = new URLSearchParams( window.location.search );
    let longTermMonthlyPrice = valueToNumber( property.longTermMonthlyPrice );
    let longTermAgencyFee = getExtraFee( 'long-term-agency-fee' );
    let longTermMonthlyCharge = getExtraFee( 'long-term-monthly-charges' );
    let longTermAnnualTaxes = getExtraFee( 'long-term-annual-taxes' );
    let longTermExtraFeeMonthly = longTermMonthlyCharge + longTermAnnualTaxes / 12;
    let longTermTotalPriceMonthly = longTermMonthlyPrice + longTermExtraFeeMonthly;
    let longTermTotalPriceFirstMonth = longTermMonthlyPrice + longTermAgencyFee + longTermExtraFeeMonthly;
    let totalGuestCount = 0;
    let hasExtraFees =
        (
            featureByTypeIdMap[ 'short-term-cleaning-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-sheets-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-towels-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-other-fee' ] !== undefined
        );
    let shortTermExtraFeeFeatureTypeIdArray =
        [
            'short-term-cleaning-fee',
            'short-term-sheets-fee',
            'short-term-towels-fee',
            'short-term-other-fee'
        ];
    let isSubmitting = false;

    // -- FUNCTIONS

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

    function handleDatePicker(
        selectedDateIndex
        )
    {
        if ( selectedDateIndex === dateIndex )
        {
            dateIndex = null;
        }
        else
        {
            dateIndex = selectedDateIndex;
        }
    }

    // ~~

    function handleDateSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.bookingParameters.arrivalDate = event.detail.arrivalDate;
                updatedParameters.bookingParameters.departureDate = event.detail.departureDate;

                return updatedParameters;
            }
            );
        setUrlQueryParameter( query, 'arrivalDate', event.detail.arrivalDate );
        setUrlQueryParameter( query, 'departureDate', event.detail.departureDate );
    }

    // ~~

    async function handleCancelVisitRequest(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/update-rental-visit',
                {
                    method: 'POST',
                    body:
                        getJsonText(
                            {
                                previousVisitId: visit ? visit.id : undefined,
                                visitId: visit.id,
                                visit: {}
                            }
                            ),
                    credentials: 'include'
                }
                );

        if ( result.visit )
        {
            visit = result.visit;
        }
        else
        {
            visit = null;
        }

        isSubmitting = false;
    }

    // ~~

    async function handleAcceptVisitRequest(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/update-rental-visit',
                {
                    method: 'POST',
                    body:
                        JSON.stringify(
                            {
                                visitId: visit.id,
                                visit: { status: 'booked' }
                            }
                            ),
                    credentials: 'include'
                }
                );

        visit = result.visit;
        isSubmitting = false;
    }

    // ~~

    function goToBooking(
        )
    {
        if ( !$profileSignedInStore )
        {
            $authModalStore = 'sign-in';
        }
        else if ( $profileSignedInStore.governmentIdValidationStatusId !== 'accepted' )
        {
            isVerifyIdentityModalOpen.set( true );
        }
        else if ( !$profileSignedInStore.currencyCode )
        {
            isVerifyIdentityModalOpen.set( true );
        }
        // else if ( $profileSignedInStore.emailValidationStatusId !== 'verified' )
        // {
        //     isVerifyIdentityModalOpen.set( true );
        // }
        else
        {
            if ( shortTermNightsCount > 0 )
            {
                $bookedPropertyStore =
                    {
                        ...property,
                        cityName: cityName,
                        nightCountByPriceMap,
                        conversionRate,
                        conversionId,
                        profile
                    };

                if ( $totalGuestCounterStore < 1 )
                {
                    $guestCounterStore =
                        {
                            adult: $filterParameterByKeyMapStore.bookingParameters.adultCount || 1,
                            children: $filterParameterByKeyMapStore.bookingParameters.childrenCount || 0,
                            infant: $filterParameterByKeyMapStore.bookingParameters.infantCount || 0,
                            pet: $filterParameterByKeyMapStore.bookingParameters.petCount || 0
                        }
                }

                let maximumGuestCount =
                    Number( featureByTypeIdMap?.[ 'maximum-adult-count' ]?.value )
                    + Number( featureByTypeIdMap?.[ 'maximum-child-count' ]?.value );

                if( $guestCounterStore > maximumGuestCount )
                {
                    toast.error( 'maximum-guest-count-exceeded' );
                    return;
                }

                navigate( '/booking/checkout/' + getRandomTuid() );
            }
            else
            {
                dateIndex = 0;
                dateContainerElement.scrollIntoView( { behavior: 'smooth' } );
                toast.error( 'property-rental-night-count-error' );
            }
        }
    }

    // ~~

    function setShortTermTotalPrice(
        )
    {
        nightCountByPriceMap = {};
        shortTermTotalPrice = getExtraFee( 'short-term-cleaning-fee' )
            + getExtraFee( 'short-term-sheets-fee' )
            + getExtraFee( 'short-term-towels-fee' )
            + getExtraFee( 'short-term-other-fee' );
        let arrivalDateString = $filterParameterByKeyMapStore.bookingParameters.arrivalDate.slice( 0, 10 );
        let departureDateString = $filterParameterByKeyMapStore.bookingParameters.departureDate.slice( 0, 10 );
        let departureDateMilisecondCount = new Date( departureDateString ).getTime();
        let date = new Date( arrivalDateString );

        while ( date.getTime() < departureDateMilisecondCount )
        {
            let dayPrice = getDayPrice( date.toISOString().slice( 0, 10 ) );

            if ( nightCountByPriceMap[ dayPrice ] === undefined )
            {
                nightCountByPriceMap[ dayPrice ] = 0;
            }

            nightCountByPriceMap[ dayPrice ] += 1;
            shortTermTotalPrice += dayPrice;
            date.setUTCDate( date.getUTCDate() + 1 );
        }
    }

    // ~~

    function getDayPrice(
        dateString
        )
    {
        let rentalDay = rentalDayByDateMap[ dateString ];

        if ( rentalDay !== undefined )
        {
            if ( shortTermNightsCount > 30 )
            {
                if ( rentalDay.hasShortTermProlongedStayDiscount )
                {
                    return rentalDay.shortTermProlongedStayDailyPrice;
                }
                else if ( rentalDay.hasShortTermExtendedStayDiscount )
                {
                    return rentalDay.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return rentalDay.shortTermDailyPrice;
                }
            }
            else if ( shortTermNightsCount > 7 )
            {
                if ( rentalDay.hasShortTermExtendedStayDiscount )
                {
                    return rentalDay.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return rentalDay.shortTermDailyPrice;
                }
            }
            else
            {
                return rentalDay.shortTermDailyPrice;
            }
        }
        else
        {
            if ( shortTermNightsCount > 30 )
            {
                if ( property.hasShortTermProlongedStayDiscount )
                {
                    return property.shortTermProlongedStayDailyPrice;
                }
                else if ( property.hasShortTermExtendedStayDiscount )
                {
                    return property.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return property.shortTermDailyPrice;
                }
            }
            else if ( shortTermNightsCount > 7 )
            {
                if ( property.hasShortTermExtendedStayDiscount )
                {
                    return property.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return property.shortTermDailyPrice;
                }
            }
            else
            {
                return property.shortTermDailyPrice;
            }
        }
    }

    // -- STATEMENTS

    $: totalGuestCount =
        ( $filterParameterByKeyMapStore?.bookingParameters?.adultCount ?? 0 )
        + ( $filterParameterByKeyMapStore?.bookingParameters?.childrenCount ?? 0 )
        + ( $filterParameterByKeyMapStore?.bookingParameters?.infantCount ?? 0 );

    // ~~

    $: shortTermNightsCount
        = countNightsBetweenArrivalDateAndDepartureDate(
            $filterParameterByKeyMapStore.bookingParameters.arrivalDate,
            $filterParameterByKeyMapStore.bookingParameters.departureDate
            );

    // ~~

    $:
    {
        if ( $filterParameterByKeyMapStore.bookingParameters.arrivalDate
             && $filterParameterByKeyMapStore.bookingParameters.departureDate )
        {
            setShortTermTotalPrice();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-reserve
    {
        display: none;
        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            z-index: 1;
            position: sticky;
            top: 5.5rem;

            margin-top: 1.5rem;
            max-width: 27.875rem;
            border-radius: 1.5rem;
            padding: 1.5rem;

            display: flex;

            background-color: grayColor950;
            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .property-reserve-modal
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            z-index: 1;
            position: sticky;
            top: 5.5rem;

            margin-top: 1.5rem;
            border-radius: 1.5rem;
            padding: 1.5rem;

            background-color: grayColor950;
            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .property-reserve-close-modal
    {
        display: flex;
        justify-content: flex-end;
        button
        {
            border: none;

            background-color: transparent;
        }
    }

    .property-reserve-modal .property-reserve-button
    {
        width: 100%;
        border-radius: 0.75rem;
        padding: 0.75rem 1.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;

        background-color: blueColor;
    }

    .property-reserve-toggler-modal
    {
        border: 2px solid grayColor700;
        border-radius: 1rem;

        display: flex;

        background-color: grayColor900;

        cursor: pointer;
    }

    .property-reserve-toggler-item
    {
        width: 50%;
        border-radius: 0.5rem;
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        padding: 1rem 1.5rem;

        background-color: transparent;

        text-align: center;

        cursor: pointer;
        transition: all 400ms ease-in-out, color 400ms ease-in-out;

        +media( desktop )
        {
            &:hover
            {
                background-color: grayColor950;

                color: greenColor;

                transition: all 400ms ease-in-out, color 400ms ease-in-out;
            }
        }
    }

    .property-reserve-toggler-item.is-selected
    {
        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: greenColor;
    }

    .property-reserve-short-term,
    .property-reserve-long-term
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-reserve-short-term,
    {
        border-bottom: 2px solid grayColor700;
        padding-bottom: 5.5rem;

        +media( desktop )
        {
            border-bottom: unset;
            padding-bottom: 0;
        }
    }

    .property-reserve-short-term-date-container
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .property-reserve-short-term-date-item
    {
        min-width: 20vh;
        border: 2px solid grayColor700;
        border-radius: 1rem;
        padding: 1.5rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        transition: all 200ms ease-in-out;
    }

    .property-reserve-short-term-date-item.is-selected
    {
        border-color: greenColor800;

        background-color: greenColor950;

        color: greenColor100;
    }

    .property-reserve-short-term-date-picker
    {
        margin-top: 1rem;
    }

    .property-reserve-long-term-button
    {
        border-radius: 0.75rem;
        padding: 0.75rem 1.5rem;

        background-color: blueColor;
    }

    :global( .property-reserve-short-term-date-picker >div )
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .property-reserve-guest-number
    {
        margin-top: 1rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: grayColor900;
    }

    .property-reserve-guest-counter
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .counter-divider
    {
        border-bottom: 1px solid grayColor700;
        padding-bottom: 1rem;
    }

    .property-reserve-price-rules
    {
        width: 100%;
        border: 2px solid grayColor700;
        border-radius: 1rem;
        padding: 1.25rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor900;
    }

    .property-reserve-price-rules-container,
    .property-reserve-price-rules-total-container
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .property-reserve-price-rules-total-container
    {
        border-top: 1px solid grayColor700;
        padding-top: 1rem;
    }
</style>

{#if modal }
    <div class="property-reserve-modal">
        <div class="property-reserve-close-modal">
            <button on:click={ () => modal = false }>
                <div class="red-close-icon size-150"/>
            </button>
        </div>
        {#if isAvailableForBothTerms }
            <div class="property-reserve-toggler-modal">
                <button
                    class="font-size-90 font-weight-700 color-gray property-reserve-toggler-item"
                    class:is-selected={ termSelected === 'short-term' }
                    on:click={ () => ( termSelected = 'short-term' ) }
                >
                    { getLocalizedTextBySlug( 'short-term-label', $languageTagStore ) }
                </button>
                <button
                    class="font-size-90 font-weight-700 color-gray property-reserve-toggler-item"
                    class:is-selected={ termSelected === 'long-term' }
                    on:click={ () => ( termSelected = 'long-term' ) }
                >
                    { getLocalizedTextBySlug( 'long-term-label', $languageTagStore ) }
                </button>
            </div>
        {/if}
        {#if property.isAvailableForShortTerm && ( isAvailableForBothTerms ? termSelected === 'short-term' : true ) }
            <div class="property-reserve-short-term">
                <div class="property-reserve-short-term-date">
                    <div class="property-reserve-short-term-date-container" bind:this={ dateContainerElement }>
                        <button
                            class="property-reserve-short-term-date-item"
                            class:is-selected={ dateIndex === 0 }
                            on:click={ () => handleDatePicker( 0 ) }
                        >
                            <div
                                class="font-size-75 font-weight-500 color-gray property-reserve-short-term-date-label"
                                class:color-green={ dateIndex === 0 }
                            >
                                { getLocalizedTextBySlug( 'date-from-label', $languageTagStore ) }
                            </div>
                            <div
                                class="font-size-90 font-weight-700 color-black property-reserve-short-term-date-value"
                                class:color-green-100={ dateIndex === 0 }
                            >
                                {#if $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                                    {
                                        new Date( $filterParameterByKeyMapStore.bookingParameters.arrivalDate )
                                            .toLocaleString( $languageTagStore, { dateStyle: 'short', timeZone: 'UTC' } )
                                    }
                                {/if}
                            </div>
                        </button>
                        <div class="green-right-arrow-icon size-150 property-reserve-short-term-date-icon">
                        </div>
                        <button
                            class="property-reserve-short-term-date-item"
                            class:is-selected={ dateIndex === 1 }
                            on:click={ () => handleDatePicker( 1 ) }
                        >
                            <div
                                class="font-size-75 font-weight-500 color-gray property-reserve-short-term-date-label"
                                class:color-green={ dateIndex === 1 }
                            >
                                { getLocalizedTextBySlug( 'date-to-label', $languageTagStore ) }
                            </div>
                            <div
                                class="font-size-90 font-weight-700 color-black property-reserve-short-term-date-value"
                                class:color-green-100={ dateIndex === 1 }
                            >
                                {#if $filterParameterByKeyMapStore.bookingParameters.departureDate }
                                    {
                                        new Date( $filterParameterByKeyMapStore.bookingParameters.departureDate )
                                            .toLocaleString( $languageTagStore, { dateStyle: 'short', timeZone: 'UTC' } )
                                    }
                                {/if}
                            </div>
                        </button>
                    </div>
                    {#if dateIndex !== null }
                        <div class="property-reserve-short-term-date-picker">
                            <FilterDate
                                dateRange=
                                    {
                                        $filterParameterByKeyMapStore.bookingParameters.departureDate
                                        ? [ new Date( $filterParameterByKeyMapStore.bookingParameters.arrivalDate ),
                                            new Date( $filterParameterByKeyMapStore.bookingParameters.departureDate ) ]
                                        : [ null, null ]
                                    }
                                rentalBookingArray={ rentalBookingArray }
                                rentalDayByDateMap={ rentalDayByDateMap }
                                bind:dateIndex={ dateIndex }
                                on:dateSelected={ handleDateSelected }
                            />
                        </div>
                    {/if}
                </div>
                <PropertyGuestAccordion
                    label={ getLocalizedTextBySlug( 'who-label', $languageTagStore) }
                    actionLabel="{ totalGuestCount } { getLocalizedTextBySlug( 'filter-guests-label', $languageTagStore ) }"
                >
                    <div class="property-reserve-guest-number">
                        <div class="property-reserve-guest-counter counter-divider">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-adult-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-adult-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.adultCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-adult-count' ]?.value || 10 }
                            />
                        </div>
                        <div class="property-reserve-guest-counter counter-divider">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-children-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-children-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.childrenCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-child-count' ]?.value || 10 }
                            />
                        </div>
                        <div class="property-reserve-guest-counter">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-infant-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-infant-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.infantCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-infant-count' ]?.value || 10 }
                            />
                        </div>
                    </div>
                </PropertyGuestAccordion>
                <PropertyPriceRules
                    shortTermNightsCount={ shortTermNightsCount }
                    shortTermExtraFeeFeatureTypeIdArray={ shortTermExtraFeeFeatureTypeIdArray }
                    property={ property }
                    hasExtraFees={ hasExtraFees }
                    featureByTypeIdMap={ featureByTypeIdMap }
                    shortTermTotalPrice={ shortTermTotalPrice }
                    nightCountByPriceMap={ nightCountByPriceMap }
                    getExtraFee={ getExtraFee }
                    conversionRate={ conversionRate }
                />
                <PropertyRules featureByTypeIdMap={ featureByTypeIdMap } />
                <button
                    class="property-reserve-button"
                    on:click={ goToBooking }
                    disabled={ $profileSignedInStore?.userId === property.userId }
                >
                    <span class="font-size-100 font-weight-700 color-white">
                        { getLocalizedTextBySlug( 'reserve-label', $languageTagStore ) }
                    </span>
                </button>
            </div>
        {/if}
        {#if property.isAvailableForLongTerm && ( isAvailableForBothTerms ? termSelected === 'long-term' : true ) }
            <div class="property-reserve-long-term">
                <div class="property-reserve-price-rules">
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    property.longTermMonthlyPrice * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-monthly-charges-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermMonthlyCharge * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-annual-taxes-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermAnnualTaxes * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-agency-fee-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermAgencyFee * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    {#if longTermAgencyFee > 0 }
                        <div class="property-reserve-price-rules-total-container">
                            <div class="font-size-100 font-weight-500 color-black property-reserve-price-rules-total-label">
                                { getLocalizedTextBySlug( 'total-first-month-label', $languageTagStore ) }
                            </div>
                            <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-total-price">
                                {
                                    getFormattedPrice(
                                        longTermTotalPriceFirstMonth * conversionRate,
                                        $languageTagStore,
                                        $profileSignedInStore?.currencyCode ?? 'EUR'
                                        )
                                }
                            </div>
                        </div>
                    {/if}
                    <div class="property-reserve-price-rules-total-container">
                        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-label">
                            { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-price">
                            {
                                getFormattedPrice(
                                    longTermTotalPriceMonthly,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                </div>
                <div class="font-size-90 font-weight-500 color-black property-reserve-long-term-avaiability">
                    { getLocalizedTextBySlug( 'available-from-label', $languageTagStore ) } { getLocalizedMonthName( 6 ) }, 2024
                </div>
                {#if propertyLeaseContract !== null }
                    <ModalButton
                        variant="contained"
                        text={ getLocalizedTextBySlug( 'property-rental-edit-lease-contract-label', $languageTagStore ) }
                        on:click={ () => navigate( '/dashboard/edit-lease-contract/' + propertyLeaseContract.id ) }
                    />
                {:else if visit !== null }
                    {#if visit.status === 'rescheduled-by-host' }
                        <ModalButton
                            variant="contained"
                            text={ getLocalizedTextBySlug( 'property-rental-accept-reschedule-label', $languageTagStore ) }
                            bind:isLoading={ isSubmitting }
                            on:click={ handleAcceptVisitRequest }
                        />
                    {/if}
                    <ModalButton
                        variant={ visit.status === 'rescheduled-by-host' ? 'text' : 'contained' }
                        text={ getLocalizedTextBySlug( 'property-rental-cancel-visit-request-label', $languageTagStore ) }
                        bind:isLoading={ isSubmitting }
                        on:click={ handleCancelVisitRequest }
                    />
                {:else}
                    <button
                        class="font-size-100 font-weight-700 color-white property-reserve-long-term-button"
                        on:click={ () => { isScheduleVisitModalOpen = true; modal = false } }
                    >
                        { getLocalizedTextBySlug( 'book-visit-label', $languageTagStore ) }
                    </button>
                {/if}
                <div class="font-size-90 font-weight-500 color-gray property-reserve-long-term-avaiability">
                    { getLocalizedTextBySlug( 'cancelation-disclosure-text', $languageTagStore ) }
                </div>
            </div>
        {/if}
    </div>
{:else}
    <div class="property-reserve">
        {#if isAvailableForBothTerms }
            <div class="property-reserve-toggler-modal">
                <button
                    class="font-size-90 font-weight-700 color-gray property-reserve-toggler-item"
                    class:is-selected={ termSelected === 'short-term' }
                    on:click={ () => ( termSelected = 'short-term' ) }
                >
                    { getLocalizedTextBySlug( 'short-term-label', $languageTagStore ) }
                </button>
                <button
                    class="font-size-90 font-weight-700 color-gray property-reserve-toggler-item"
                    class:is-selected={ termSelected === 'long-term' }
                    on:click={ () => ( termSelected = 'long-term' ) }
                >
                    { getLocalizedTextBySlug( 'long-term-label', $languageTagStore ) }
                </button>
            </div>
        {/if}
        {#if property.isAvailableForShortTerm && ( isAvailableForBothTerms ? termSelected === 'short-term' : true ) }
            <div class="property-reserve-short-term">
                <div class="property-reserve-short-term-date">
                    <div class="property-reserve-short-term-date-container" bind:this={ dateContainerElement }>
                        <button
                            class="property-reserve-short-term-date-item"
                            class:is-selected={ dateIndex === 0 }
                            on:click={ () => handleDatePicker( 0 ) }
                        >
                            <div
                                class="font-size-75 font-weight-500 color-gray property-reserve-short-term-date-label"
                                class:color-green={ dateIndex === 0 }
                            >
                                { getLocalizedTextBySlug( 'date-from-label', $languageTagStore ) }
                            </div>
                            <div
                                class="font-size-90 font-weight-700 color-black property-reserve-short-term-date-value"
                                class:color-green-100={ dateIndex === 0 }
                            >
                                {#if $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                                    {
                                        new Date( $filterParameterByKeyMapStore.bookingParameters.arrivalDate )
                                            .toLocaleString( $languageTagStore, { dateStyle: 'short', timeZone: 'UTC' } )
                                    }
                                {/if}
                            </div>
                        </button>
                        <div class="green-right-arrow-icon size-150 property-reserve-short-term-date-icon">
                        </div>
                        <button
                            class="property-reserve-short-term-date-item"
                            class:is-selected={ dateIndex === 1 }
                            on:click={ () => handleDatePicker( 1 ) }
                        >
                            <div
                                class="font-size-75 font-weight-500 color-gray property-reserve-short-term-date-label"
                                class:color-green={ dateIndex === 1 }
                            >
                                { getLocalizedTextBySlug( 'date-to-label', $languageTagStore ) }
                            </div>
                            <div
                                class="font-size-90 font-weight-700 color-black property-reserve-short-term-date-value"
                                class:color-green-100={ dateIndex === 1 }
                            >
                                {#if $filterParameterByKeyMapStore.bookingParameters.departureDate }
                                    {
                                        new Date( $filterParameterByKeyMapStore.bookingParameters.departureDate )
                                            .toLocaleString( $languageTagStore, { dateStyle: 'short', timeZone: 'UTC' } )
                                    }
                                {/if}
                            </div>
                        </button>
                    </div>
                    {#if dateIndex !== null }
                        <div class="property-reserve-short-term-date-picker">
                            <FilterDate
                                dateRange=
                                    {
                                        $filterParameterByKeyMapStore.bookingParameters.departureDate
                                        ? [ new Date( $filterParameterByKeyMapStore.bookingParameters.arrivalDate ),
                                            new Date( $filterParameterByKeyMapStore.bookingParameters.departureDate ) ]
                                        : [ null, null ]
                                    }
                                rentalBookingArray={ rentalBookingArray }
                                rentalDayByDateMap={ rentalDayByDateMap }
                                bind:dateIndex={ dateIndex }
                                on:dateSelected={ handleDateSelected }
                            />
                        </div>
                    {/if}
                </div>
                <PropertyGuestAccordion
                    label={ getLocalizedTextBySlug( 'who-label', $languageTagStore) }
                    actionLabel="{ totalGuestCount } { getLocalizedTextBySlug( 'filter-guests-label', $languageTagStore ) }"
                >
                    <div class="property-reserve-guest-number">
                        <div class="property-reserve-guest-counter counter-divider">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-adult-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-adult-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.adultCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-adult-count' ]?.value || 10 }
                            />
                        </div>
                        <div class="property-reserve-guest-counter counter-divider">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-children-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-children-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.childrenCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-child-count' ]?.value || 10 }
                            />
                        </div>
                        <div class="property-reserve-guest-counter">
                            <div>
                                <div class="font-size-100 font-weight-700 color-gray-100">
                                    { getLocalizedTextBySlug( 'guest-infant-label', $languageTagStore ) }
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                                    { getLocalizedTextBySlug( 'guest-infant-helper-label' ) }
                                </div>
                            </div>
                            <CounterInput
                                bind:count={ $filterParameterByKeyMapStore.bookingParameters.infantCount }
                                maxCount={ featureByTypeIdMap?.[ 'maximum-child-count' ]?.value || 10 }
                            />
                        </div>
                    </div>
                </PropertyGuestAccordion>
                <PropertyPriceRules
                    shortTermNightsCount={ shortTermNightsCount }
                    shortTermExtraFeeFeatureTypeIdArray={ shortTermExtraFeeFeatureTypeIdArray }
                    property={ property }
                    hasExtraFees={ hasExtraFees }
                    featureByTypeIdMap={ featureByTypeIdMap }
                    shortTermTotalPrice={ shortTermTotalPrice }
                    nightCountByPriceMap={ nightCountByPriceMap }
                    getExtraFee={ getExtraFee }
                    conversionRate={ conversionRate }
                />
                <PropertyRules featureByTypeIdMap={ featureByTypeIdMap } />
                <ModalButton
                    variant="light"
                    text={ getLocalizedTextBySlug( 'summary-label', $languageTagStore ) }
                    on:click={ () => showPropertySummaryPopup = true }
                />
                <ModalButton
                    text={ getLocalizedTextBySlug( 'reserve-label', $languageTagStore ) }
                    disabled={ $profileSignedInStore?.userId === property.userId }
                    on:click={ goToBooking }
                />
            </div>
        {/if}
        {#if property.isAvailableForLongTerm && ( isAvailableForBothTerms ? termSelected === 'long-term' : true ) }
            <div class="property-reserve-long-term">
                <div class="property-reserve-price-rules">
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    property.longTermMonthlyPrice * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-monthly-charges-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermMonthlyCharge * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-annual-taxes-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermAnnualTaxes * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    <div class="property-reserve-price-rules-container">
                        <div class="font-size-90 font-weight-500 color-gray  property-reserve-price-rules-label">
                            { getLocalizedTextBySlug( 'extra-fees-agency-fee-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                            {
                                getFormattedPrice(
                                    longTermAgencyFee * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                    {#if longTermAgencyFee > 0 }
                        <div class="property-reserve-price-rules-total-container">
                            <div class="font-size-100 font-weight-500 color-black property-reserve-price-rules-total-label">
                                { getLocalizedTextBySlug( 'total-first-month-label', $languageTagStore ) }
                            </div>
                            <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-total-price">
                                {
                                    getFormattedPrice(
                                        longTermTotalPriceFirstMonth * conversionRate,
                                        $languageTagStore,
                                        $profileSignedInStore?.currencyCode ?? 'EUR'
                                        )
                                }
                            </div>
                        </div>
                    {/if}
                    <div class="property-reserve-price-rules-total-container">
                        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-label">
                            { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
                        </div>
                        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-price">
                            {
                                getFormattedPrice(
                                    longTermTotalPriceMonthly * conversionRate,
                                    $languageTagStore,
                                    $profileSignedInStore?.currencyCode ?? 'EUR'
                                    )
                            }
                        </div>
                    </div>
                </div>
                <div class="font-size-90 font-weight-500 color-black property-reserve-long-term-avaiability">
                    { getLocalizedTextBySlug( 'available-from-label', $languageTagStore ) } { getLocalizedMonthName( 6 ) }, 2024
                </div>
                {#if propertyLeaseContract !== null }
                    <ModalButton
                        variant="contained"
                        text={ getLocalizedTextBySlug( 'property-rental-edit-lease-contract-label', $languageTagStore ) }
                        on:click={ () => navigate( '/dashboard/edit-lease-contract/' + propertyLeaseContract.id ) }
                    />
                {:else if visit !== null }
                    {#if visit.status === 'rescheduled-by-host' }
                        <ModalButton
                            variant="contained"
                            text={ getLocalizedTextBySlug( 'property-rental-accept-reschedule-label', $languageTagStore ) }
                            bind:isLoading={ isSubmitting }
                            on:click={ handleAcceptVisitRequest }
                        />
                    {/if}
                    <ModalButton
                        variant={ visit.status === 'rescheduled-by-host' ? 'text' : 'contained' }
                        text={ getLocalizedTextBySlug( 'property-rental-cancel-visit-request-label', $languageTagStore ) }
                        bind:isLoading={ isSubmitting }
                        on:click={ handleCancelVisitRequest }
                    />
                {:else}
                    <ModalButton
                        text={ getLocalizedTextBySlug( 'book-visit-label', $languageTagStore ) }
                        on:click={ () => isScheduleVisitModalOpen = true }
                    />
                {/if}
                <div class="font-size-90 font-weight-500 color-gray property-reserve-long-term-avaiability">
                    { getLocalizedTextBySlug( 'cancelation-disclosure-text', $languageTagStore ) }
                </div>
            </div>
        {/if}
    </div>
{/if}

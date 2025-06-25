<script>
    // -- IMPORTS

    import { slide } from 'svelte/transition';
    import { navigate } from 'svelte-routing';
    import { getJsonText, getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import { countNightsBetweenArrivalDateAndDepartureDate } from '$lib/booking';
    import { authModalStore } from '$store/authModalStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { bookedPropertyStore, guestCounterStore, totalGuestCounterStore } from '$store/bookingStore';
    import PropertyReserveTerms from '$component/page/property/PropertyReserveTerms.svelte';
    import PropertyReserveSummary from '$component/page/property/PropertyReserveSummary.svelte';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { isVerifyIdentityModalOpen } from '$store/propertyArray';
    import { onMount } from 'svelte';

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
    export let profile = {};
    let shortTermTotalPrice = 0;
    let nightCountByPriceMap = {};
    let shortTermNightsCount = 0;
    let showPropertySummaryPopup = false;
    let isReserveTermsOpen = false;
    let conversionRate = 1;
    let conversionId;
    let isLoading = true;

    // -- FUNCTIONS

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

                navigate( '/booking/checkout/' + getRandomTuid() );
            }
            else
            {
                isReserveTermsOpen = true;
            }
        }
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

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let data
                = await fetchData(
                    '/api/get-currency-conversion-rate',
                    {
                        method: 'POST',
                        body: getJsonText(
                            {
                                sourceCurrencyCode: property.currencyCode,
                                targetCurrencyCode: $profileSignedInStore?.currencyCode ?? 'EUR'
                            }
                            )
                    }
                    );

            if ( data.conversionRate )
            {
                conversionRate = data.conversionRate.rate;
                conversionId = data.conversionRate.id;
            }

            isLoading = false;
        }
        )

    $: $guestCounterStore =
        {
            adult: $filterParameterByKeyMapStore.bookingParameters.adultCount ?? 0,
            children: $filterParameterByKeyMapStore.bookingParameters.childrenCount ?? 0,
            infant: $filterParameterByKeyMapStore.bookingParameters.infantCount ?? 0,
            pet: $filterParameterByKeyMapStore.bookingParameters.petCount ?? 0
        }

    // ~~

    $: shortTermNightsCount
        = countNightsBetweenArrivalDateAndDepartureDate(
            $filterParameterByKeyMapStore.bookingParameters.arrivalDate,
            $filterParameterByKeyMapStore.bookingParameters.departureDate
            );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-footer-reserve
    {
        z-index: 400;
        position: fixed;
        bottom: 4rem;
        left: 0;

        width: 100%;
        border-top: 1px solid grayColor700;
        padding: 1rem 1.5rem;

        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;

        background: grayColor900;

        +media( desktop )
        {
            display: none;
        }
    }

    .property-footer-reserve-button
    {
        border-radius: 0.5rem;
        padding: 1.2rem 2.5rem;

        background: blueColor;
        &:disabled
        {
            opacity: 80%;
        }
    }

    .property-footer-reserve-summary
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;
    }

    .property-reserve-terms-modal
    {
        z-index: 500;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        overflow: auto;
        height: 100%;
        width: 100%;
        padding: 1rem;

        display: flex;
        justify-content: center;

        background: white;
    }
</style>

{#if !isLoading }
    {#if isReserveTermsOpen }
        <dialog class="property-reserve-terms-modal" transition:slide>
            <PropertyReserveTerms
                { property }
                { cityName }
                { featureByTypeIdMap }
                { propertyLeaseContract }
                { profileDocumentByTypeIdMap }
                { rentalBookingArray }
                { profile }
                rentalDayByDateMap={ rentalDayByDateMap }
                conversionRate={ conversionRate }
                conversionId={ conversionId }
                bind:shortTermTotalPrice={ shortTermTotalPrice }
                bind:nightCountByPriceMap={ nightCountByPriceMap }
                bind:shortTermNightsCount={ shortTermNightsCount }
                bind:visit={ visit }
                bind:modal={ isReserveTermsOpen }
                bind:isScheduleVisitModalOpen={ isScheduleVisitModalOpen }
                bind:showPropertySummaryPopup={ showPropertySummaryPopup }
            />
        </dialog>
    {/if}
    <PropertyReserveTerms
        { property }
        { cityName }
        { featureByTypeIdMap }
        { propertyLeaseContract }
        { profileDocumentByTypeIdMap }
        { rentalBookingArray }
        { profile }
        rentalDayByDateMap={ rentalDayByDateMap }
        conversionRate={ conversionRate }
        conversionId={ conversionId }
        bind:shortTermTotalPrice={ shortTermTotalPrice }
        bind:nightCountByPriceMap={ nightCountByPriceMap }
        bind:shortTermNightsCount={ shortTermNightsCount }
        bind:visit={ visit }
        bind:isScheduleVisitModalOpen={ isScheduleVisitModalOpen }
        bind:showPropertySummaryPopup={ showPropertySummaryPopup }
    />
    <footer class="property-footer-reserve">
        <button
            class="property-footer-reserve-summary"
            on:click={ () => isReserveTermsOpen = true }
        >
            <span class="font-size-100 color-blue font-weight-700">
                {
                    getFormattedPrice(
                        property.shortTermDailyPrice * conversionRate,
                        $languageTagStore,
                        $profileSignedInStore?.currencyCode ?? 'EUR'
                        )
                }
                &#x2022;
                {
                    getFormattedPrice(
                        property.longTermMonthlyPrice * conversionRate,
                        $languageTagStore,
                        $profileSignedInStore?.currencyCode ?? 'EUR'
                        )
                }
            </span>
            <span class="font-size-75 color-gray-300">
                {#if $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                    { $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                {/if}
                {#if $filterParameterByKeyMapStore.bookingParameters.departureDate }
                    - { $filterParameterByKeyMapStore.bookingParameters.departureDate }
                {/if}
                {#if $totalGuestCounterStore }
                    &#x2022; { $totalGuestCounterStore } { getLocalizedTextBySlug( 'filter-guests-label', $languageTagStore ) }
                {/if}
           </span>
        </button>
        <button
            class="property-footer-reserve-button"
            disabled={ $profileSignedInStore?.userId === property.userId }
            on:click={ goToBooking }
        >
            <span class="font-size-100 font-weight-700 color-white">
                { getLocalizedTextBySlug( 'reserve-label', $languageTagStore ) }
            </span>
        </button>
    </footer>
    <PropertyReserveSummary
        property={ property }
        featureByTypeIdMap={ featureByTypeIdMap }
        totalPrice={ shortTermTotalPrice }
        nightCount={ shortTermNightsCount }
        nightCountByPriceMap={ nightCountByPriceMap }
        getExtraFee={ getExtraFee }
        bind:conversionRate={ conversionRate }
        bind:isOpen={ showPropertySummaryPopup }
    />
{/if}

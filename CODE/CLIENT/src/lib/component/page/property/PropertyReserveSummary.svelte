<script>
    // - IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import { disableScroll, enableScroll } from '$lib/scroll';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { totalGuestCounterStore } from '$store/bookingStore';
    import PropertyRules from '$component/page/property/PropertyRules.svelte';
    import PropertyCancellationPolicy from '$component/page/property/PropertyCancellationPolicy.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import PropertyPriceRules from './PropertyPriceRules.svelte';

    // - VARIABLES

    export let nightCount;
    export let totalPrice;
    export let property;
    export let featureByTypeIdMap;
    export let nightCountByPriceMap;
    export let getExtraFee = () => {};
    export let isOpen = false;
    export let conversionRate = 1;
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

    // - FUNCTIONS

    function formatDate(
        date
        )
    {
        return new Date( date ).toLocaleDateString( $languageTagStore, { month: 'short', day: '2-digit', year: 'numeric' } );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            disableScroll();

            return () =>
            {
                enableScroll();
            };
        }
        );
</script>

<style lang="stylus">
    // - IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // - CLASSES

    .property-reserve-summary-date
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .property-reserve-summary-date-container
    {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .property-reserve-summary-date-item
    {
        min-height: 5.875rem;
        min-width: 9.25rem;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1.5rem;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background-color: whiteColor;
    }

    .property-reserve-summary-guests
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem
    }

    .property-reserve-summary-guests-group
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem;

        display: flex;
        justify-content: space-between;

        background-color: whiteColor;
    }

    .property-reserve-summary-guests-label
    {
        display: flex;
        gap: 0.75rem;
    }
</style>

<ModalRoot bind:isOpen={ isOpen } >
    <ModalHeader
        title={ getLocalizedTextBySlug( 'summary-label', $languageTagStore ) }
        onClose={ () => isOpen = false }
    />
    <ModalContent>
        <PropertyPriceRules
            shortTermNightsCount={ nightCount }
            shortTermExtraFeeFeatureTypeIdArray={ shortTermExtraFeeFeatureTypeIdArray }
            property={ property }
            hasExtraFees={ hasExtraFees }
            featureByTypeIdMap={ featureByTypeIdMap }
            shortTermTotalPrice={ totalPrice }
            nightCountByPriceMap={ nightCountByPriceMap }
            conversionRate={ conversionRate }
            getExtraFee={ getExtraFee }
        />
        <div class="property-reserve-summary-date">
            <div class="property-reserve-summary-date-container">
                <div class="property-reserve-summary-date-item">
                    <div class="font-size-75 font-weight-500 color-gray">
                        { getLocalizedTextBySlug( 'date-from-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-90 font-weight-700 color-gray-100">
                        {#if $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                            { formatDate( $filterParameterByKeyMapStore.bookingParameters.arrivalDate ) }
                        {/if}
                    </div>
                </div>
                <div class="green-right-arrow-icon size-150" />
                <div class="property-reserve-summary-date-item">
                    <div class="font-size-75 font-weight-500 color-gray property-reserve-short-term-date-label">
                        { getLocalizedTextBySlug( 'date-to-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-90 font-weight-700 color-gray-100">
                        {#if $filterParameterByKeyMapStore.bookingParameters.departureDate }
                            { formatDate( $filterParameterByKeyMapStore.bookingParameters.departureDate ) }
                        {/if}
                    </div>
                </div>
            </div>
        </div>
        {#if $totalGuestCounterStore }
            <div class="property-reserve-summary-guests">
                <div class="font-size-100 font-weight-700 color-gray-100">
                    { getLocalizedTextBySlug( 'guests-label', $languageTagStore ) }
                </div>
                <div class="property-reserve-summary-guests-group">
                    <div class="property-reserve-summary-guests-label">
                        <div class="green-guests-icon size-150" />
                        <div class="font-size-90 font-size-500 color-gray-300">
                            { getLocalizedTextBySlug( 'who-label', $languageTagStore ) }
                        </div>
                    </div>
                    <div class="font-size-90 font-weight-900 color-100">
                        { $totalGuestCounterStore } { getLocalizedTextBySlug( 'guests-label', $languageTagStore ) }
                    </div>
                </div>
            </div>
        {/if}
        <PropertyRules featureByTypeIdMap={ featureByTypeIdMap } />
        <PropertyCancellationPolicy featureByTypeIdMap={ featureByTypeIdMap } />
    </ModalContent>
</ModalRoot>

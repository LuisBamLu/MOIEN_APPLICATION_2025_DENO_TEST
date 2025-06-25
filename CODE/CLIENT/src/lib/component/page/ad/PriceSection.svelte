<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, isNaN } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import BoldAccordion from '$component/element/BoldAccordion.svelte';
    import PriceInput from '../../element/PriceInput.svelte';

    // -- VARIABLES

    export let shortTermDailyPrice;
    export let shortTermExtendedStayDailyPrice;
    export let shortTermProlongedStayDailyPrice;
    export let propertyFeatureByTypeIdMap;
    export let hasShortTermExtendedStayDiscount;
    export let hasShortTermProlongedStayDiscount;
    export let handleFeatureChange = ( event ) => {}
    let isEditingPropertyPrice = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .ad-page-save-button
    {
        margin-top: 1rem;
    }
</style>

<div class="ad-page-section">
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-property-price-label', $languageTagStore ) }
        bind:isEditing={ isEditingPropertyPrice }
    >
        <div class="price-list">
            <PriceInput
                required={ true }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-costs-basic-per-night-label', $languageTagStore ) }
                bind:value={ shortTermDailyPrice }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-costs-week-per-night-label', $languageTagStore ) }
                bind:value={ shortTermExtendedStayDailyPrice }
                bind:basePrice={ shortTermDailyPrice }
                on:change=
                    {
                        ( event ) =>
                        {
                            hasShortTermExtendedStayDiscount =
                                event.detail !== null
                                && event.detail !== undefined
                                && event.detail !== ''
                                && Number( event.detail ) !== 0
                                && !isNaN( Number( event.detail ) );
                        }
                    }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-costs-month-per-night-label', $languageTagStore ) }
                bind:value={ shortTermProlongedStayDailyPrice }
                bind:basePrice={ shortTermDailyPrice }
                on:change=
                    {
                        ( event ) =>
                        {
                            hasShortTermProlongedStayDiscount =
                                event.detail !== null
                                && event.detail !== undefined
                                && event.detail !== ''
                                && Number( event.detail ) !== 0
                                && !isNaN( Number( event.detail ) );
                        }
                    }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-extra-costs-cleaning-fee-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'short-term-cleaning-fee' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { featureTypeId: 'short-term-cleaning-fee', value: event.detail } ) }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-extra-costs-sheet-cost-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'short-term-sheets-fee' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { featureTypeId: 'short-term-sheets-fee', value: event.detail } ) }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-extra-costs-towel-fee-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'short-term-towels-fee' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { featureTypeId: 'short-term-towels-fee', value: event.detail } ) }
            />
        </div>
        <button
            class="font-size-100 font-weight-700 color-blue ad-page-save-button"
            type="button"
            on:click={ () => isEditingPropertyPrice = false }
        >
            <div class="font-size-100 font-weight-700 color-blue-100">
                { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            </div>
        </button>
    </BoldAccordion>
</div>

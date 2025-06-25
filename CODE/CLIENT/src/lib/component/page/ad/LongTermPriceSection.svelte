<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import BoldAccordion from '$component/element/BoldAccordion.svelte';
    import PriceInput from '$component/element/PriceInput.svelte';

    // -- VARIABLES

    export let longTermMonthlyRent;
    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
    let isEditingPropertyPrice = true;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    .ad-page-save-button
    {
        margin-top: 1rem;
    }
</style>

<div class="ad-page-section">
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-long-term-rental-fees-label', $languageTagStore ) }
        bind:isEditing={ isEditingPropertyPrice }
    >
        <div class="price-list">
            <PriceInput
                required={ true }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-long-term-monthly-price-label', $languageTagStore ) }
                bind:value={ longTermMonthlyRent }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-long-term-monthly-charges-price-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'long-term-monthly-charges' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'long-term-monthly-charges' } ) }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-long-term-annual-taxes-price-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'long-term-annual-taxes' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'long-term-annual-taxes' } ) }
            />
            <PriceInput
                required={ false }
                priceNameLabel={ getLocalizedTextBySlug( 'ad-long-term-agency-fee-price-label', $languageTagStore ) }
                value={ propertyFeatureByTypeIdMap[ 'long-term-agency-fee' ]?.value ?? 0 }
                on:change={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'long-term-agency-fee' } ) }
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

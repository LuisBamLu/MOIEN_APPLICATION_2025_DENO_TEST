<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import BoldAccordion from '$component/element/BoldAccordion.svelte';
    import AdPageSection from '$component/page/ad/AdPageSection.svelte';
    import LongTermPriceSection from '$component/page/ad/LongTermPriceSection.svelte';
    import FeatureTypeBySubcategoryInput from '$component/page/ad/FeatureTypeBySubcategoryInput.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let property;
    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
</script>

<AdPageSection>
    <LongTermPriceSection
        handleFeatureChange={ handleFeatureChange }
        bind:longTermMonthlyRent={ property.longTermMonthlyPrice }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-long-term-extra-expenses-label', $languageTagStore ) }
    >
        <FeatureTypeBySubcategoryInput
            category="booking-options"
            subCategory="long-term-charges"
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
</AdPageSection>

<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AdPageSection from '$component/page/ad/AdPageSection.svelte';
    import FeatureTypeBySubcategoryInput from '$component/page/ad/FeatureTypeBySubcategoryInput.svelte';

    // -- VARIABLES

    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
</script>

<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-long-term-rental-equipment-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'ad-long-term-rental-equipment-helper', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="equipments"
        subCategory="essentials"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>
<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-exteriror-label', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'ad-exterior-helper', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="equipment-and-services"
        subCategory="exterior"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>
<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-features-label', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="equipment-and-services"
        subCategory="recreational-facilities"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>
<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-safety-features-label', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="equipments"
        subCategory="safety"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>
<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-accessibility-features-label', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="accessibility-features"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>
<AdPageSection
    label={ getLocalizedTextBySlug( 'ad-points-of-interest-label', $languageTagStore ) }
>
    <FeatureTypeBySubcategoryInput
        category="equipments"
        subCategory="location"
        on:featureChange={ event => handleFeatureChange( event.detail ) }
        bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    />
</AdPageSection>

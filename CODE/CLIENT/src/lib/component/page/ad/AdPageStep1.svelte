<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import PropertyTypeSection from '$component/page/ad/PropertyTypeSection.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import AdPageSection from '$component/page/ad/AdPageSection.svelte';
    import Accordion from '$component/element/Accordion.svelte';
    import FeatureTypeBySubcategoryInput from '$component/page/ad/FeatureTypeBySubcategoryInput.svelte';
    import HeatingSection from '$component/page/ad/HeatingSection.svelte';
    import EnergyDiagnosisSection from '$component/page/ad/EnergyDiagnosisSection.svelte';
    import LabelledCheckbox from '$component/element/LabelledCheckbox.svelte';

    // -- VARIABLES

    export let propertyTypeArray = [];
    export let heatingTypeArray = [];
    export let energyDiagnosisArray = [];
    export let property;
    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .ad-total-area-section
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 0 1rem;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;
        align-items: flex-start;
    }

    .ad-total-area-label
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: end;
    }
</style>

<PropertyTypeSection
    propertyTypeArray={ propertyTypeArray }
    bind:typeId={ property.typeId }
/>
<AdPageSection label={ getLocalizedTextBySlug( 'ad-general-label', $languageTagStore ) }>
    <Accordion label={ getLocalizedTextBySlug( 'ad-description-of-property-label', $languageTagStore ) } >
        <FeatureTypeBySubcategoryInput
            category='description-and-equipment'
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </Accordion>
    <div class="ad-total-area-section">
        <div class="ad-total-area-label">
            {#if ( propertyFeatureByTypeIdMap[ 'property-area' ]?.value ?? 0 ) < 1 }
                <div class="red-400-x-circle-icon size-150 property-reserve-short-term-rule-icon">
                </div>
            {/if}
            <div class="font-size-90 font-weight-500 color-gray property-reserve-short-term-rule-label">
                { getLocalizedTextBySlug( 'ad-area-of-property-label', $languageTagStore ) }
            </div>
        </div>
        <div class="ad-total-area-content">
            <div class="font-size-90 font-weight-700 color-gray property-reserve-short-term-rule-label">
                { propertyFeatureByTypeIdMap[ 'property-area' ]?.value ?? 0 } m²
            </div>
        </div>
    </div>
    <HeatingSection
        heatingTypeArray={ heatingTypeArray }
        bind:heatingTypeId={ property.heatingTypeId }
    />
    <EnergyDiagnosisSection
        energyDiagnosisArray={ energyDiagnosisArray }
        bind:energyDiagnosisId={ property.energyDiagnosisId }
    />
    <LabelledCheckbox
        label={ getLocalizedTextBySlug( 'ad-renovated-label' ) }
        name="property-renovated"
        checked={ propertyFeatureByTypeIdMap[ 'is-renovated' ]?.value }
        on:change={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'is-renovated' } ) }
    />
</AdPageSection>

<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import AdDescriptionSection from '$component/page/ad/AdDescriptionSection.svelte';
    import AdTitleSection from '$component/page/ad/AdTitleSection.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Accordion from '$component/element/Accordion.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import FeatureTypeBySelected from '$component/page/ad/FeatureTypeBySelected.svelte';

    // -- VARIABLES

    export let property;
    export let propertyFeatureByTypeIdMap;

    // -- FUNCTIONS

    function handlePromoteChange(
        event
        )
    {
        propertyFeatureByTypeIdMap[ event.detail.featureType.id ].isPromoted = event.detail.value;
    }
</script>

<AdTitleSection
    languageArray={ $languageArrayStore }
    bind:title={ property.title }
/>
<AdDescriptionSection
    languageArray={ $languageArrayStore }
    bind:description={ property.description }
/>
<div>
    <div class="font-size-100 font-weight-700 color-gray-100">
        { getLocalizedText( 'Promote¨fr:Promouvoir¨de:Fördern', $languageTagStore ) }
    </div>
    <Accordion
        label=
            {
                getLocalizedText(
                    'Select features to promote'
                    + '¨fr:Sélectionnez les fonctionnalités à promouvoir'
                    + '¨de:Wählen Sie die zu bewerbenden Funktionen aus',
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySelected
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
            on:promoteChange={ handlePromoteChange }
        />
    </Accordion>
</div>

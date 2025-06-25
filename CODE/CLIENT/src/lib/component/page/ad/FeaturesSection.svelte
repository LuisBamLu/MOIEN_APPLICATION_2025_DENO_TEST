<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import FeatureType from '$component/page/ad/FeatureType.svelte';

    // -- VARIABLES

    export let featureByIdMap;

    // -- CONSTANTS

    const dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleFeatureChange(
        value
        )
    {
        dispatch( 'featureChange', value );
    }
</script>

<div class="ad-page-section">
    <div class="font-size-100 font-weight-700 color-gray-100">
        { getLocalizedTextBySlug( 'ad-property-features-label', $languageTagStore ) }
    </div>
    <FeatureType
        featureByIdMap={ featureByIdMap }
        on:change={ event => handleFeatureChange( event.detail ) }
    />
</div>

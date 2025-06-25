<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import Tag from '$component/element/Tag.svelte';

    // -- VARIABLES

    export let featureType;
    export let propertyFeatureByTypeIdMap;
    let maximumPromoteCount = 3;
    let dispatch = createEventDispatcher();
    $: promotedFeatureArray = Object.values( propertyFeatureByTypeIdMap ).filter( feature => feature.isPromoted );

    // -- FUNCTIONS

    function handlePromoteChange(
        featureType,
        value,
        )
    {
        dispatch( 'change', { featureType, value } );
    }
</script>

{#if promotedFeatureArray.length === maximumPromoteCount }
    {#if propertyFeatureByTypeIdMap[ featureType.id ].isPromoted }
        <Tag
            name="feature-{ featureType.id }"
            label={ getLocalizedText( featureType.name ) }
            isSelected={ propertyFeatureByTypeIdMap[ featureType.id ].isPromoted }
            on:change={ ( event ) => handlePromoteChange( featureType, event.detail ) }
        />
    {/if}
{:else}
    <Tag
        name="feature-{ featureType.id }"
        label={ getLocalizedText( featureType.name ) }
        isSelected={ propertyFeatureByTypeIdMap[ featureType.id ].isPromoted }
        on:change={ ( event ) => handlePromoteChange( featureType, event.detail ) }
    />
{/if}

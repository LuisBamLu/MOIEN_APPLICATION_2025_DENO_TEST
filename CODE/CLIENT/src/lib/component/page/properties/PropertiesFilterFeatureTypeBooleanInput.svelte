<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import Tag from '../../element/Tag.svelte';

    // -- VARIABLES

    export let featureType;

    // -- FUNCTIONS

    function handleFeatureTypeBooleanChange(
        featureType,
        value
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                if ( value === true )
                {
                    updatedParameters.featureParameters[ featureType.id ] = value;
                }
                else
                {
                    delete updatedParameters.featureParameters[ featureType.id ];
                }

                return updatedParameters;
            }
            );
    }
</script>

{#if featureType.valueTypeId === 'boolean' }
    <Tag
        isSelected={ $filterParameterByKeyMapStore.featureParameters[ featureType.id ] }
        label={ getLocalizedText( featureType.name ) }
        on:change={ ( event ) => handleFeatureTypeBooleanChange( featureType, event.detail ) }
    />
{/if}

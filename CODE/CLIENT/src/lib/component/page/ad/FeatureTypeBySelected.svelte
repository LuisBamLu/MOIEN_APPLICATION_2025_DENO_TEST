<script>
    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import FeatureTypeInputPromote from './FeatureTypeInputPromote.svelte';

    // -- VARIABLES

    export let propertyFeatureByTypeIdMap;
    let isLoading = true;
    let featureTypeArray = [];
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handlePromoteChange(
        featureType, value
        )
    {
        dispatch( 'promoteChange', { featureType, value } );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            for ( let category of Object.getOwnPropertyNames( $featureTypeByCategoryAndSubCategoryArrayStore) )
            {
                for ( let subCategory of Object.getOwnPropertyNames( $featureTypeByCategoryAndSubCategoryArrayStore[ category ].subCategory ) )
                {
                    for ( let featureType of $featureTypeByCategoryAndSubCategoryArrayStore[ category ].subCategory[ subCategory ].featureTypeArray )
                    {
                        featureTypeArray.push( featureType );
                    }
                }
            }

            featureTypeArray = featureTypeArray.filter(
                ( featureType ) =>
                {
                    if ( featureType.subcategoryId === 'long-term-charges' )
                    {
                        return false;
                    }

                    if ( featureType.id === 'is-renovated' )
                    {
                        return false;
                    }

                    return featureType.valueTypeId === 'boolean';
                }
                );

            featureTypeArray = featureTypeArray.filter(
                ( featureType ) =>
                {
                    return String( propertyFeatureByTypeIdMap[ featureType.id ]?.value ) === 'true';
                }
                );

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .feature-type-item-content-container
    {
        display: flex;
        flex-direction: column;
    }

    .feature-type-item-content-item-array
    {
        width: 100%;
        padding: 0.75rem 0;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
</style>

<div class="feature-type-item-content-container">
    <div class="feature-type-item-content-item-array">
        {#if isLoading }
            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
        {:else}
            {#each featureTypeArray as featureType }
                <FeatureTypeInputPromote
                    featureType={ featureType }
                    propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                    on:change={ event => handlePromoteChange( event.detail.featureType, event.detail.value ) }
                />
            {/each}
        {/if}
    </div>
</div>

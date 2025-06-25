<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import FeatureTypeInput from '$component/page/ad/FeatureTypeInput.svelte';

    // -- VARIABLES

    export let category;
    export let subCategory = null;
    export let propertyFeatureByTypeIdMap;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleFeatureChange(
        featureTypeId,
        value
        )
    {
        dispatch( 'featureChange', { featureTypeId, value } );
    }

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
        {#if subCategory !== null }
            {#each $featureTypeByCategoryAndSubCategoryArrayStore[ category ].subCategory[ subCategory ].featureTypeArray as featureType }
                <FeatureTypeInput
                    featureType={ featureType }
                    propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                    on:change={ ( e ) => handleFeatureChange( featureType.id, e.detail.value ) }
                />
            {/each}
        {:else}
            {#each Object.entries( $featureTypeByCategoryAndSubCategoryArrayStore[ category ].subCategory )
                as [ featureSubCategoryId, featureSubCategory ]
            }
                <div class="font-size-100 color-gray-100 font-weight-700">
                    { getLocalizedText( featureSubCategory.name, $languageTagStore ) }
                </div>
                <div class="feature-type-item-content-item-array">
                    {#each featureSubCategory.featureTypeArray as featureType }
                        <FeatureTypeInput
                            featureType={ featureType }
                            propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                            on:change={ ( e ) => handleFeatureChange( featureType.id, e.detail.value ) }
                        />
                    {/each}
                </div>
            {/each}
        {/if}
    </div>
</div>

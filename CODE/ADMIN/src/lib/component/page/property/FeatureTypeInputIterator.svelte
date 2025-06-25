<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import FeatureTypeInput from './FeatureTypeInput.svelte';

    // -- VARIABLES

    /** @type {{propertyFeatureByTypeIdMap?: any, property?: any}} */
    let { propertyFeatureByTypeIdMap = $bindable(null), property = null } = $props();
    let featureTypeByCategoryAndSubCategoryArray = $state({});
    let isLoading = $state(true);

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/feature-type/get-by-category-and-subcategory-map',
                    {
                        method: 'POST',
                        body: JSON.stringify( { type: 'getFeatureByCategoryAndSubCategoryMap' } ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );
            featureTypeByCategoryAndSubCategoryArray = result.featureTypeByCategoryAndSubCategoryArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .feature-type-input-iterator
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .feature-type-category-container
    {
        display: flex;
        flex-direction: column;
    }

    .feature-type-subcategory-container
    {
        border-bottom: 1px solid grayColor700;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>

<div class="feature-type-input-iterator">
    {#if isLoading }
        { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
    {:else}
        {#each Object.values( featureTypeByCategoryAndSubCategoryArray ) as featureTypeCategory }
                <div class='feature-type-category-container'>
                    <div class="font-size-100 font-weight-700 color-gray-100">
                        { getLocalizedText( featureTypeCategory.name, $languageTagStore ) }
                    </div>
                    {#each Object.values( featureTypeCategory.subCategory ) as featureTypeSubcategory }
                        <div class="feature-type-subcategory-container">
                            <div class="font-size-75 font-weight-700 color-gray-100">
                                { getLocalizedText( featureTypeSubcategory.name ) }
                            </div>
                            {#each featureTypeSubcategory.featureTypeArray as featureType }
                                <FeatureTypeInput
                                    property={ property }
                                    featureType={ featureType }
                                    bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                                />
                            {/each}
                        </div>
                    {/each}
                </div>
        {/each}
    {/if}
</div>

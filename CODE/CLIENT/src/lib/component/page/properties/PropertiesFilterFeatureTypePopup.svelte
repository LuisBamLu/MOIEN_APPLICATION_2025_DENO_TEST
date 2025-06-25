<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import PropertiesFilterFeatureTypeNumberInput from '$component/page/properties/PropertiesFilterFeatureTypeNumberInput.svelte';
    import PropertiesFilterFeatureTypeBooleanInput from '$component/page/properties/PropertiesFilterFeatureTypeBooleanInput.svelte';
    import PropertiesFilterFeatureTypeBookingOptionInput from '$component/page/properties/PropertiesFilterFeatureTypeBookingOptionInput.svelte';

    // -- VARIABLES

    export let termType = 'short-term';
    let openFeatureTypeCategory = [];

    // -- FUNCTIONS

    function toggleFeatureTypeCategory(
        featureTypeCategoryId
        )
    {
        if ( openFeatureTypeCategory.includes( featureTypeCategoryId ) )
        {
            openFeatureTypeCategory = openFeatureTypeCategory.filter( key => key !== featureTypeCategoryId );
        }
        else
        {
            openFeatureTypeCategory = [ ...openFeatureTypeCategory, featureTypeCategoryId ];
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .properties-filter-feature-type-popup
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .properties-filter-feature-type-popup-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .properties-filter-feature-type-popup-items
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .properties-filter-feature-type-popup-item
    {
        display: flex;
        flex-direction: column;
    }

    .properties-filter-feature-type-popup-item:last-child
    {
        border-bottom: unset;
    }

    .properties-filter-feature-type-popup-item button
    {
        padding: 0.5rem 0;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .properties-filter-feature-type-popup-item button span
    {
        transition: transform 400ms ease-in-out;
    }

    .properties-filter-feature-type-popup-item.is-selected button span
    {
        transform: rotate( -90deg );

        transition: transform 400ms ease-in-out;
    }

    .properties-filter-feature-type-popup-item-content
    {
        overflow: hidden;
        height: 0;

        display: flex;
        flex-direction: column;

        opacity: 0;

        transition: height 400ms ease-in-out, opacity 400ms ease-in-out;
    }

    .properties-filter-feature-type-popup-item-content-container
    {
        display: flex;
        flex-direction: column;
    }

    .properties-filter-feature-type-popup-item-content-items.boolean
    {
        padding: 0.75rem 0;

        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .properties-filter-feature-type-popup-item-content.is-selected
    {
        height: auto;

        opacity: 1;

        transition: height 400ms ease-in-out, opacity 400ms ease-in-out;
    }
</style>

<div class="properties-filter-feature-type-popup">
    <div class="properties-filter-feature-type-popup-container">
        <div class="properties-filter-feature-type-popup-items">
            {#each Object.entries( $featureTypeByCategoryAndSubCategoryArrayStore ) as [ featureTypeCategoryId, featureTypeCategory ] }
                <div
                    class="properties-filter-feature-type-popup-item"
                    class:is-selected={ openFeatureTypeCategory.includes( featureTypeCategoryId ) }
                >
                        <button on:click|preventDefault={ () => toggleFeatureTypeCategory( featureTypeCategoryId ) }>
                            <div class="font-size-100 font-weight-700 color-gray">
                                { getLocalizedText( featureTypeCategory.name ) }
                            </div>
                            <span class="green-right-caret-icon size-150"></span>
                        </button>
                    <div
                        class="properties-filter-feature-type-popup-item-content"
                        class:is-selected={ openFeatureTypeCategory.includes( featureTypeCategoryId ) }
                    >
                    {#each Object.entries( featureTypeCategory.subCategory ) as [ featureTypeSubCategoryId, featureTypeSubCategory ] }
                        {#if termType !== 'short-term'
                            || ( featureTypeCategoryId !== 'booking-options' || featureTypeSubCategoryId === '' )
                        }
                            <div class="properties-filter-feature-type-popup-item-content-container">
                                <div class="font-size-90 font-weight-700 color-gray">
                                    { getLocalizedText( featureTypeSubCategory.name ) }
                                </div>
                                {#if featureTypeSubCategory.featureTypeArray
                                    .some(
                                        featureType => featureType.valueTypeId === 'integer'
                                        || featureType.valueTypeId === 'real'
                                        )
                                }
                                    <div class="properties-filter-feature-type-popup-item-content-items integer">
                                        {#each featureTypeSubCategory.featureTypeArray as featureType }
                                            <PropertiesFilterFeatureTypeNumberInput
                                                featureType={ featureType }
                                                termType={ termType }
                                                featureTypeSubCategoryId={ featureTypeSubCategoryId }
                                            />
                                        {/each}
                                    </div>
                                {/if}
                                {#if featureTypeSubCategory.featureTypeArray
                                    .some( featureType => featureType.valueTypeId === 'boolean' )
                                }
                                    <div class="properties-filter-feature-type-popup-item-content-items boolean">
                                        {#each featureTypeSubCategory.featureTypeArray as featureType }
                                            <PropertiesFilterFeatureTypeBooleanInput
                                                featureType={ featureType }
                                            />
                                        {/each}
                                    </div>
                                {/if}
                                {#if featureTypeSubCategory.featureTypeArray
                                    .some( featureType => featureType.valueTypeId === 'booking-option' )
                                    && termType === 'short-term'
                                }
                                    <div class="properties-filter-feature-type-popup-item-content-items booking-option">
                                        {#each featureTypeSubCategory.featureTypeArray as featureType }
                                            <PropertiesFilterFeatureTypeBookingOptionInput
                                                featureType={ featureType }
                                            />
                                        {/each}
                                    </div>
                                {/if}
                            </div>
                            {/if}
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

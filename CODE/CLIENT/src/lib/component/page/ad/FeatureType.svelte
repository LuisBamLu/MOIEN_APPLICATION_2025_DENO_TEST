<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import { getValueByTypeId } from '$lib/base';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import CounterInput from '$component/element/CounterInput.svelte';
    import Tag from '$component/element/Tag.svelte';

    // -- VARIABLES

    export let featureByIdMap;
    let openFeatureTypeCategory = [];
    let dispatch = createEventDispatcher();

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

    // ~~

    function handleFeatureChange(
        featureType,
        value
        )
    {
        dispatch( 'change', { featureType, value } );
    }

    // -- STATEMENTS

    $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ][ 'subCategory' ][ 'general' ][ 'featureTypeArray' ] =
        $featureTypeByCategoryAndSubCategoryArrayStore
            [ 'equipment-and-services' ]
            [ 'subCategory' ]
            [ 'general' ]
            [ 'featureTypeArray' ]
                .filter(
                    ( featureType ) =>
                    {
                        return featureType.id !== 'has-long-term-rental'
                            && featureType.id !== 'has-short-term-rental';
                    }
                    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .feature-type
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .feature-type-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .feature-type-items
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
    }

    .feature-type-item
    {
        border-bottom: 1px solid grayColor700;

        display: flex;
        flex-direction: column;
    }

    .feature-type-item:last-child
    {
        border-bottom: unset;
    }

    .feature-type-item button
    {
        padding: 1rem 0;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .feature-type-item button span
    {
        transition: transform 400ms ease-in-out;
    }

    .feature-type-item.selected button span
    {
        transform: rotate( -90deg );

        transition: transform 400ms ease-in-out;
    }

    .feature-type-item-content
    {
        overflow: hidden;
        height: 0;

        display: flex;
        flex-direction: column;

        opacity: 0;

        transition: height 400ms ease-in-out, opacity 400ms ease-in-out;
    }

    .feature-type-item-content-container
    {
        display: flex;
        flex-direction: column;
    }

    .feature-type-item-content-items
    {
        width: 100%;
        padding: 0.75rem 0;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .feature-type-item-content.selected
    {
        height: auto;

        opacity: 1;

        transition: height 400ms ease-in-out, opacity 400ms ease-in-out;
    }

    .feature-type-item-integer
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="feature-type">
    <div class="feature-type-container">
        <div class="feature-type-items">
            {#each Object.entries( $featureTypeByCategoryAndSubCategoryArrayStore ) as [ featureTypeCategoryId, featureTypeCategory ] }
                <div
                    class="feature-type-item"
                    class:selected={ openFeatureTypeCategory.includes( featureTypeCategoryId ) }
                >
                    <button on:click|preventDefault={ () => toggleFeatureTypeCategory( featureTypeCategoryId ) }>
                        <div class="font-size-100 font-weight-700 color-black">
                            { getLocalizedText( featureTypeCategory.name ) }
                        </div>
                        <span class="green-right-caret-icon size-150"></span>
                    </button>
                    <div
                        class="feature-type-item-content"
                        class:selected={ openFeatureTypeCategory.includes( featureTypeCategoryId ) }
                    >
                        {#each Object.entries( featureTypeCategory.subCategory ) as [ featureTypeSubCategoryId, featureTypeSubCategory ] }
                            <div class="feature-type-item-content-container">
                                <div class="font-size-90 font-weight-700 color-black">
                                    { getLocalizedText( featureTypeSubCategory.name ) }
                                </div>
                                <div class="feature-type-item-content-items">
                                    {#each featureTypeSubCategory.featureTypeArray as featureType }
                                        {#if featureType.valueTypeId === 'integer' }
                                            <div class="feature-type-item-integer">
                                                <div class="feature-type-item-integer-content">
                                                    <div class="font-size-90 font-weight-500 color-black feature-type-item-integer-label">
                                                        { getLocalizedText( featureType.name ) }
                                                    </div>
                                                </div>
                                                <div class="feature-type-item-integer-counter">
                                                    <CounterInput
                                                        name="feature-{ featureType.id }"
                                                        count=
                                                            {
                                                                getValueByTypeId( featureType.id, featureByIdMap )
                                                                && !isNaN( getValueByTypeId( featureType.id, featureByIdMap ) )
                                                                ? getValueByTypeId( featureType.id, featureByIdMap )
                                                                : featureType.defaultValue
                                                            }
                                                        minCount={ featureType.minimumValue }
                                                        maxCount={ featureType.maximumValue }
                                                        on:change={ event => handleFeatureChange( featureType, event.detail ) }
                                                    />
                                                </div>
                                            </div>
                                        {:else if featureType.valueTypeId === 'boolean' || featureType.valueTypeId === 'booking-option' }
                                            <div class="feature-type-item-boolean">
                                                <Tag
                                                    name="feature-{ featureType.id }"
                                                    label={ getLocalizedText( featureType.name ) }
                                                    isSelected={ getValueByTypeId( featureType.id, featureByIdMap ) }
                                                    on:change={ event => handleFeatureChange( featureType, event.detail ) }
                                                />
                                            </div>
                                        {/if}
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    </div>
                </div>
            {/each}
        </div>
    </div>
</div>

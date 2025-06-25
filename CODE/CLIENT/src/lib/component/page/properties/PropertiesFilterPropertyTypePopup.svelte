<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { propertyTypeArrayStore } from '$store/propertyTypeArrayStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import Tag from '$component/element/Tag.svelte';

    // -- VARIABLES

    let showAll = false;

    // -- FUNCTIONS

    function handlePropertyTypeSelected(
        propertyType,
        event
        )
    {
        let isActive = event.detail

        if ( isActive )
        {
            filterParameterByKeyMapStore.update(
                currentParameters =>
                {
                    return { ...currentParameters, propertyParameters: { ...currentParameters.propertyParameters, typeId: propertyType } };
                }
                );
        }
        else
        {
            filterParameterByKeyMapStore.update(
                currentParameters =>
                {
                    return { ...currentParameters, propertyParameters: { ...currentParameters.propertyParameters, typeId: null } };
                }
                );
        }
    }

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .properties-filter-property-type-popup
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: flex-start;
    }

    .properties-filter-property-type-popup-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .properties-filter-property-type-popup-items
    {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
</style>

<div class="properties-filter-property-type-popup">
    <div class="font-size-100 font-weight-700 color-gray">
        { getLocalizedTextBySlug( 'filter-property-type-label', $languageTagStore ) }
    </div>
    <div class="properties-filter-property-type-popup-container">
        <div class="properties-filter-property-type-popup-items">
            {#each $propertyTypeArrayStore.slice( 0, showAll ? $propertyTypeArrayStore.length : 4 ) as propertyType }
                <Tag
                    isSelected={ $filterParameterByKeyMapStore.propertyParameters.typeId === propertyType.id }
                    label={ getLocalizedText( propertyType.name ) }
                    on:change={ ( event ) => handlePropertyTypeSelected( propertyType.id, event ) }
                />
            {/each}
            <button class="font-size-90 font-weight-600 color-black tag" on:click={ () => showAll = !showAll }>
                {#if showAll }
                    { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                {/if}
            </button>
        </div>
    </div>
</div>

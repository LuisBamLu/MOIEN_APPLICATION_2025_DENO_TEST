<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { rentalTypeArrayStore } from '$store/rentalTypeArrayStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import Tag from '../../element/Tag.svelte';

    // -- FUNCTIONS

    function handleRentalTypeSelected(
        rentalTypeId,
        event
        )
    {
        const isActive = event.detail

        if ( isActive )
        {
            filterParameterByKeyMapStore.update(
                currentParameters =>
                {
                    return { ...currentParameters, propertyParameters: { ...currentParameters.propertyParameters, rentalTypeId: rentalTypeId } };
                }
                );
        }
        else
        {
            filterParameterByKeyMapStore.update(
                currentParameters =>
                {
                    return { ...currentParameters, propertyParameters: { ...currentParameters.propertyParameters, rentalTypeId: null } };
                }
                );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .properties-filter-rental-type-popup
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: flex-start;
    }

    .properties-filter-rental-type-popup-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .properties-filter-rental-type-popup-items
    {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
    }
</style>

<div class="properties-filter-rental-type-popup">
    <div class="font-size-100 font-weight-700 color-gray">
        { getLocalizedTextBySlug( 'filter-rental-type-label', $languageTagStore ) }
    </div>
    <div class="properties-filter-rental-type-popup-container">
        <div class="properties-filter-rental-type-popup-items">
            {#each $rentalTypeArrayStore as rentalType }
                <Tag
                    isSelected={ $filterParameterByKeyMapStore.propertyParameters.rentalTypeId === rentalType.id }
                    label={ getLocalizedText( rentalType.name ) }
                    on:change={ ( event ) => handleRentalTypeSelected( rentalType.id, event ) }
                />
            {/each}
        </div>
    </div>
</div>

<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import { propertyTypeArrayStore } from '$store/propertyTypeArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Tab from '../element/Tab.svelte';

    // -- VARIABLES

    let propertyTypeId = null;

    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handlePropertyTypeSelect(
        _propertyTypeId
        )
    {
        propertyTypeId = _propertyTypeId
        dispatch( 'propertyTypeIdSelected', _propertyTypeId );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .tag-list
    {
        height: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        align-content: flex-start;
        align-items: center;
    }
</style>

<div class="font-size-125 font-weight-600 color-black filter-property-type-title">
    { getLocalizedTextBySlug( 'property-type-label', $languageTagStore ) }
</div>
<div class="tag-list">
    {#each $propertyTypeArrayStore as propertyType }
        <Tab
            isActive={ propertyTypeId === propertyType.id }
            label={ getLocalizedText( propertyType.name, $languageTagStore )  }
            on:click={ () => handlePropertyTypeSelect( propertyType.id ) }
        />
    {/each}
</div>

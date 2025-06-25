<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Tab from '$component/element/Tab.svelte';

    // -- VARIABLES

    export let propertyArray = [];
    export let selectedPropertyId = null;

    // -- FUNCTIONS

    function handleSelectPropertyId(
        propertyId
        )
    {
        if ( selectedPropertyId === propertyId )
        {
            selectedPropertyId = null;
        }
        else
        {
            selectedPropertyId = propertyId
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-tab-list
    {
        overflow-x: scroll;

        display: flex;
        gap: 0.5rem;
        -ms-overflow-style: none;
        scrollbar-width: 0;
    }
</style>

<div class="property-tab-list">
    <Tab
        label={ getLocalizedTextBySlug( 'conversation-filter-all-label', $languageTagStore ) }
        isActive={ !selectedPropertyId }
        on:click={ () => selectedPropertyId = null }
    />
    {#each propertyArray as property }
        <Tab
            label={ getLocalizedText( property.title, $languageTagStore ) }
            isActive={ property.id === selectedPropertyId }
            on:click={ () => handleSelectPropertyId( property.id ) }
        />
    {/each}
</div>

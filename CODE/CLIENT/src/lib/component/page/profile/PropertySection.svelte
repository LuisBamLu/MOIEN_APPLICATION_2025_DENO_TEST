<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import PropertyCard from '../profile/PropertyCard.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let propertyArray;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-list-container
    {
        overflow: scroll;
        scrollbar-width: none;
        width: 100%;

        display: flex;
        gap: 1rem;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'properties-label', $languageTagStore ) }
>
    <div class="property-list-container">
        {#each propertyArray as property }
            <PropertyCard property={ property } />
        {/each}
    </div>
</EditLeaseContractPageSection>

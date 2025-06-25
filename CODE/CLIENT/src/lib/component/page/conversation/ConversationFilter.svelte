<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Tab from '../../element/Tab.svelte';

    // -- VARIABLES

    let filterTermArray =
        [
            {
                slug: 'conversation-filter-all-label',
                value: 'ALL'
            },
            {
                slug: 'conversation-filter-long-term-label',
                value: 'LONG_TERM'
            },
            {
                slug: 'conversation-filter-short-term-label',
                value: 'SHORT_TERM'
            },
        ];
    let filterTerm = 'ALL';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-filter-list
    {
        display: flex;
        gap: 0.5rem;
    }
</style>

<div class="conversation-filter">
     <ul class="conversation-filter-list">
        {#each filterTermArray as filterItem }
            <Tab
                isActive={ filterTerm === filterItem.value }
                label={ getLocalizedTextBySlug( filterItem.slug, $languageTagStore ) }
                on:click={ () => filterTerm = filterItem.value }
            />
        {/each}
    </ul>
</div>

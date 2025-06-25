<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    /** @type {{tabArray?: any}} */
    let { tabArray = [] } = $props();
    let activeTabIndex = $state(0);
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleSelectTab(
        index
        )
    {
        activeTabIndex = index === activeTabIndex ? null : index;

        dispatch( 'change', activeTabIndex );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .tab-container
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 8px;
        align-items: center;
        align-self: stretch;
    }

    .tab-header
    {
        padding: 0rem 1rem;

        display: flex;
        gap: 8px;
        align-items: flex-start;
        align-self: stretch;
    }

    .tab-list
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    .tab-item
    {
        padding: 0.75rem 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: grayColor950;

        line-height: 1.3125rem;
        font-size: 0.875rem;
        font-weight: 600;
        text-align: center;
        color: grayColor500;

        cursor: pointer;
    }

    .tab-item.is-selected
    {
        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: blueColor;
    }

    .tab-content
    {
        width: 100%;
    }
</style>

<div class="tab-container">
    <div class="tab-header">
        <div class="tab-list">
            {#each tabArray as tab, index }
                <button
                    class="tab-item"
                    onclick={() => handleSelectTab( index )}
                    class:is-selected={ index === activeTabIndex }
                >
                    { tab.label }
                </button>
            {/each}
        </div>
    </div>

    <div class="tab-content">
        {#if tabArray[ activeTabIndex ] }
            {@const SvelteComponent = tabArray[ activeTabIndex ].component}
            <SvelteComponent { ...tabArray[ activeTabIndex ].propMap }/>
        {/if}
    </div>
</div>

<script>
    // -- IMPORTS

    import { slide } from 'svelte/transition';

    // -- VARIABLES

    /** @type {{displayName: any, children?: import('svelte').Snippet}} */
    let { displayName, children } = $props();

    let isOpen = $state(false);

    // -- FUNCTIONS

    function toggle(
        )
    {
        isOpen = !isOpen;
    }

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .drawer-menu-item
    {
        border-bottom: 1px solid blueColor;
        padding: 0.5rem 0;
    }

    .drawer-menu-item-button button
    {
        width: 100%;

        display: flex;
        justify-content: space-between;

        background-color: unset;
    }

    .drawer-menu-item-button .drawer-menu-item-arrow
    {
        margin-right: 0.188rem;

        transition: transform 400ms ease-in-out;
    }

    .drawer-menu-item-button [ aria-expanded=false ] .drawer-menu-item-arrow
    {
        transform: rotate( 0.25turn );
    }

    .drawer-menu-item-button [ aria-expanded=true ] .drawer-menu-item-arrow
    {
        transform: rotate( 0turn );
    }
</style>

<div class="drawer-menu-item">
    <div class="drawer-menu-item-button">
        <button onclick={toggle} aria-expanded={ isOpen } type="button">
            <div class="drawer-menu-item-label">
                { displayName }
            </div>
            <div class="drawer-menu-item-arrow">
                <div class="blue-chevron-icon size-150">
            </div>
        </button>
    </div>
    <div class="drawer-menu-item-inner">
        {#if isOpen }
            {@render children?.()}
        {/if}
    </div>
</div>

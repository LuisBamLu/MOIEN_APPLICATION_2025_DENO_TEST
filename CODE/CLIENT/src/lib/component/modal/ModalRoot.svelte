<script>
    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';
    import { enableScroll, disableScroll } from '$lib/scroll';
    import { clickOutside } from '$src/lib/base';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );

    // -- VARIABLES

    export let isOpen = false;
    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let transitionType = isMobileScreen ? slide : fade;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;

        transitionType = isMobileScreen ? slide : fade;
    }

    // ~~

    function handleClickOutsizeEvent(
        )
    {
        isOpen = false;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            window.addEventListener( 'resize', handleResizeEvent );

            return () => window.removeEventListener( 'resize', handleResizeEvent );
        }
        );

    // ~~

    onDestroy(
        () =>
        {
            enableScroll();
        }
        );

    // ~~

    $:
    {
        if ( isOpen )
        {
            disableScroll();
        }
        else
        {
            enableScroll();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .modal-root
    {
        overflow: hidden;
        max-height: var( --mobile-modal-root-max-height, 90% );
        width: 100%;
        border-radius: 1.5rem 1.5rem 0 0;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            max-width: var( --modal-root-max-height, 36rem );
            border-radius: 1.5rem;
        }
    }

    .modal-overlay
    {
        z-index: overlayZIndex;
        position: fixed;
        top: var( --mobile-modal-overlay-top, 0 );
        bottom: var( --mobile-modal-overlay-bottom, 0 );
        left: var( --mobile-modal-overlay-left, 0 );
        right: var( --mobile-modal-overlay-right, 0 );

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: flex-end;

        background: rgba(0,0,0,0.5);

        +media( desktop )
        {
            top: var( --modal-overlay-top, 0 );
            bottom: var( --modal-overlay-bottom, 0 );
            left: var( --modal-overlay-left, 0 );
            right: var( --modal-overlay-right, 0 );

            align-items: center;
        }
    }
</style>

{#if isOpen }
    <div class="modal-overlay" transition:fade>
        <div
            class="modal-root"
            transition:transitionType
            use:clickOutside
            on:clickOutside={ handleClickOutsizeEvent }
        >
            <slot/>
        </div>
    </div>
{/if}

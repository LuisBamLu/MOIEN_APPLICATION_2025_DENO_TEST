<script>
    import { run } from 'svelte/legacy';

    import { clickOutside } from '$src/lib/base';

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fade, slide } from 'svelte/transition';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );

    // -- VARIABLES

    /** @type {{isOpen?: boolean, onClose?: any, children?: import('svelte').Snippet}} */
    let { isOpen = false, onClose = () => {}, children } = $props();
    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let transitionType = $state(isMobileScreen ? slide : fade);

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;

        transitionType = isMobileScreen ? slide : fade;
    }

    // -- STATEMENT

    onMount(
        () =>
        {
            window.addEventListener( 'resize', handleResizeEvent );

            return () => window.removeEventListener( 'resize', handleResizeEvent );
        }
        );

    // ~~

    run(() => {
        if ( isOpen )
        {
            document.body.style.overflow = 'hidden';
        }
        else
        {
            document.body.style.overflow = '';
        }
    });

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .modal-root
    {
        z-index: modalZIndex;
        position: relative;

        overflow: hidden;
        height: 100%;
        max-height: var( --max-height, 80% );
        width: 100%;
        border-radius: 1.5rem 1.5rem 0 0;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            max-width: 36rem;
            border-radius: 1.5rem;
        }
    }

    .modal-overlay
    {
        z-index: overlayZIndex;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: flex-end;

        background: rgba(0,0,0,0.5);
        backdrop-filter: blur(5px);

        +media( desktop )
        {
            align-items: center;
        }
    }
</style>

{#if isOpen }
    <div class="modal-overlay" transition:fade>
        <div class="modal-root" transition:transitionType use:clickOutside onclickOutside={onClose}>
            {@render children?.()}
        </div>
    </div>
{/if}

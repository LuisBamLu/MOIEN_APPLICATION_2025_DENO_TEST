<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import MobileAnimatedBanner from './MobileAnimatedBanner.svelte';
    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { cubicInOut } from 'svelte/easing';

    // -- VARIABLES

    let isOpen = true;

    // -- STATEMENTS

    onMount(
        () =>
        {
            setTimeout(
                () =>
                {
                    isOpen = false;
                },
                5000
                );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .splash-screen
    {
        z-index: 99999;
        position: fixed;
        top: 0;

        height: 100dvh;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        background-color: grayColor900;

        +media( desktop )
        {
            display: none;
        }
    }

    .splash-screen-text-container
    {
        position: absolute;
        top: 39%;

        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        align-items: center;

        animation: slide 500ms ease-in-out;
    }

    @keyframes slide
    {
        0%
        {
            transform: translateY( 100vh );

            opacity: 0;
        }

        100%
        {
            transform: translateY( 0 );

            opacity: 0.9;
        }
    }
</style>

{#if isOpen}
    <div
        class="splash-screen"
        transition:fly={ { y: -900, duration: 800, easing: cubicInOut } }
    >
        <MobileAnimatedBanner />
        <div class="splash-screen-text-container">
            <div class="font-size-125 font-weight-600 color-gray-300">
                { getLocalizedTextBySlug( 'onboarding-welcome-label', $languageTagStore ) }
            </div>
            <div class="moien-logo-icon height-400 width-1200" />
        </div>
    </div>
{/if}

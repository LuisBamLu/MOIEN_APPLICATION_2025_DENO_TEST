<script>
    // -- IMPORTS

    import { linear } from 'svelte/easing';
    import { fly } from 'svelte/transition';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let title;
    export let actionLabel;
    export let type;
    export let actionHref = '#'
    let iconColor = getIconColor();
    let isOpen = true;

    // -- FUNCTION

    function getIconColor(
        )
    {
        switch ( type )
        {
            case 'warning':
                return 'yellow';
            case 'error':
                return 'red-100';
            case 'success':
                return 'green';
            default:
                return 'blue';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl'
    @import '../../../mixin.styl'

    // -- CLASSES

    .call-to-action
    {
        position: relative;

        min-height: 9.6875rem;
        width: 100%;
        max-width: 46rem;
        border: 2px solid;
        border-radius: 0.75rem;
        padding: 1rem;

        display: flex;
    }

    .call-to-action-text-container
    {
        max-width: 90%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-self: stretch;
    }

    .call-to-action-close-icon
    {
        position: absolute;
        top: 1rem;
        right: 1rem;

        height: 1.5rem;
        width: 1.5rem;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .call-to-action-image
    {
        position: absolute;
        bottom: 1rem;
        right: 1rem;

        height: 6rem;
        width: 5.625rem;
    }

    .call-to-action.warning
    {
        border-color: yellowColor800;

        background-color: yellowColor900;

        color: yellowColor100;
    }

    .call-to-action.error
    {
        border-color: redColor800;

        background-color: redColor950;

        color: redColor100;
    }

    .call-to-action.success
    {
        border-color: greenColor900;

        background-color: greenColor950;

        color: greenColor100;
    }

    .call-to-action.informative
    {
        border-color: blueColor900;

        background-color: blueColor950;

        color: blueColor100;
    }
</style>

{#if isOpen }
    <div
        class="call-to-action { type }"
        out:fly={ { x: '100%', duration: 350, easing: linear } }
    >
        <div class="call-to-action-text-container">
            <div class="font-size-100 font-weight-700">
                { title }
            </div>
            <a class="font-size-90 font-weight-700 color-blue-300" href={ actionHref } use:link>
                { actionLabel }
            </a>
        </div>
        <button
            class="call-to-action-close-icon"
            on:click={ () => isOpen = false }
        >
            <div class="{ iconColor }-close-icon size-90" />
        </button>
        <img
            class="call-to-action-image"
            src="/image/supporting-documents/heading.svg"
            alt=""
        >
    </div>
{/if}

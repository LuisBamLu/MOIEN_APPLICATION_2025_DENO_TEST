<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- VARIABLES

    /** @type {{fullWidth?: boolean, invertColor?: boolean, type?: string, style?: any, disabled?: boolean, href?: any, variant?: string, loading?: boolean, title?: any, handleClick?: () => void, children?: import('svelte').Snippet}} */
    let {
        fullWidth = false,
        invertColor = false,
        type = 'button',
        style = null,
        disabled = false,
        href = null,
        variant = '',
        loading = false,
        title = null,
        handleClick = () => {},
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    button,
    a
    {
        z-index: 2;

        border: 1px solid blueColor;
        border-radius: 12px;
        padding: 0.75vw 1.25vw;

        display: flex;
        gap: 1em;
        justify-content: center;
        align-items: center;

        background-color: blueColor;

        font-size: 1em;
        font-weight: 700;
        color: grayColor900;

        cursor: pointer;
        text-wrap: nowrap;
        height: 2.875em;
        width: fit-content;
        min-width: 10em;

        transition: all 0.2s ease-in-out;

        +media( smaller-desktop )
        {
            width: 100%;
            max-width: unset;
        }
    }

    button[disabled]
    {
        pointer-events: none;
        cursor: not-allowed;
    }

    button.full-width,
    a.full-width,
    {
        width: 100%;
        max-width: unset;
    }

    button.invert-color,
    a.invert-color
    {
        border: 1px solid blueColor100;

        background: white;

        color: blueColor100;
    }

    button:hover,
    button:focus,
    a:hover,
    a:focus
    {
        border: 1px solid blueColor500;

        background-color: blueColor500;

        color: grayColor900;
    }

    button.invert-color:hover,
    button.invert-color:focus,
    a.invert-color:hover,
    a.invert-color:focus
    {
        border: 1px solid blueColor500;

        background-color: white;

        color: blueColor500;
    }

    button:disabled,
    button[disabled],
    button[disabled]:hover
    {
        background-color: grayColor700;

        cursor: not-allowed;
    }

    // -- CLASSES

    .error
    {
        background: redColor500;

        color: whiteColor;
    }

    .error:hover,
    .error:focus
    {
        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: redColor500;
    }

    .button-loading-indicator
    {
        display: flex;

        visibility: visible;

        color: rgba(0, 0, 0, 0.26);
    }

    .circular-progress-root
    {
        height: 1rem;
        width: 1rem;

        display: inline-block;

        animation: 1.4s linear 0s infinite normal none running animation-spin;
    }

    .circular-progress-circle
    {
        stroke: grayColor900;
        stroke-dasharray: 80px, 200px;
        stroke-dashoffset: 0;
        animation: 1.4s ease-in-out 0s infinite normal none running animation-spin-dashoffset;
    }

    @keyframes animation-spin-dashoffset
    {
        0%
        {
            stroke-dasharray: 1px, 200px;
            stroke-dashoffset: 0;
        }

        50%
        {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -15px;
        }

        100%
        {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -125px;
        }
    }

    @keyframes animation-spin
    {
        0%
        {
            transform: rotate(0deg);
        }

        100%
        {
            transform: rotate(360deg);
        }
    }
</style>

{#if href }
    <a class="{ variant }" href={ href } class:full-width={ fullWidth } class:invert-color={ invertColor } style={ style } { type }>
        {@render children?.()}
    </a>
{:else}
    <button
        class={ variant }
        class:full-width={ fullWidth }
        class:invert-color={ invertColor }
        style={ style }
        type={ type }
        title={ title }
        disabled={ loading || disabled }
        onclick={bubble('click')}
    >
        {#if loading }
            <span class="button-loading-indicator button-loading-indicator-center">
                <span class="circular-progress-root" role="progressbar" aria-labelledby=":r1q:">
                    <svg class="circular-progress-svg" viewBox="22 22 44 44">
                        <circle class="circular-progress-circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6">
                        </circle>
                    </svg>
                </span>
            </span>
        {:else}
            {@render children?.()}
        {/if}
    </button>
{/if}

<script>

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- CONSTANTS

    const variantColors =
    {
        warning: '#7A3A0F',
        error: '#7A1A23',
        informative: '#010D3C',
        success: '#00584A'
    };

    // -- VARIABLES

    export let message
    export let onRemove = ( param ) => {};
    let timerId;

    // -- FUNCTIONS

    function startTimeout(
        )
    {
        timerId = setTimeout(
            () =>
            {
                onRemove( message.id );
            },
            4000
            );
    }

    // ~~

    function stopTimeout(
        )
    {
        clearTimeout( timerId );
        timerId = null;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            startTimeout();

            return (
                () =>
                {
                    stopTimeout();
                }
                );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .toast
    {
        position: relative;

        width: 95dvw;
        border-radius: 12px;
        padding: 2rem;

        display: flex;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            width: 33.5rem;
        }
    }

    .toast.warning
    {
        border: 1px solid yellowColor800;

        background: yellowColor950;

        color: yellowColor100;
    }

    .toast.error
    {
        border: 1px solid redColor800;

        background: redColor900;

        color: redColor100;
    }

    .toast.informative
    {
        border: 1px solid blueColor900;

        background: blueColor950;

        color: blueColor100;
    }

    .toast.success
    {
        border: 1px solid greenColor800;

        background: greenColor950;

        color: greenColor100;
    }

    .toast p
    {
        flex: 1;

        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 700;
        text-align: left;
    }

    .toast button
    {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;

        overflow: hidden;
        outline: 0;
        border: 0;

        background: transparent;

        color: lightGreyColor;

        cursor: pointer
    }

    .icon
    {
        margin-right: 1rem;
    }
</style>

<div
    class="toast { message.variant }"
    in:fly={ { y: 50 } }
    out:fly={ { y: -50 } }
    on:mouseenter={ stopTimeout }
    on:mouseleave={ startTimeout }
>
    {#if message.icon }
        <div class="{ message.variant }-icon size-150 icon"/>
    {/if}
    <p>{ getLocalizedTextBySlug( message.text, $languageTagStore ) }</p>
    <button on:click={ () => onRemove( message.id ) }>
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1L6 6M11 11L6 6M6 6L11 1L1 11"
                stroke="{ variantColors[ message.variant ] }"
                stroke-width="2"
            />
        </svg>
    </button>
</div>

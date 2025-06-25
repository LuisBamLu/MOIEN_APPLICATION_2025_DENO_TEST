<script>

    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import { toastEmitter } from '$lib/toast';
    import { fly } from 'svelte/transition';
    import { getLocalizedTextBySlug, isSlugText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{message: any, onRemove?: any}} */
    let { message, onRemove = ( param ) => {} } = $props();
    let timerId;

    // -- FUNCTIONS

    function handleStopTimeout(
        )
    {
        clearTimeout( timerId );
    }

    // ~~

    function handleStartTimeout(
        )
    {
        timerId = setTimeout(
            () =>
            {
                onRemove( message.id );
            },
            3000
            );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            handleStartTimeout();

            return (
                () =>
                {
                    handleStopTimeout();
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

        width: 33.5rem;
        border-radius: 12px;
        padding: 2rem;

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .toast.warning
    {
        border: 1px solid orangeColor500;

        background: yellowColor950;

        color: orangeColor;
    }

    .toast.error
    {
        border: 1px solid redColor500;

        background: redColor900;

        color: redColor300;
    }

    .toast.info
    {
        border: 1px solid blueColor500;

        background: blueColor950;

        color: blueColor500;
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
    in:fly={{ y: 50 }}
    out:fly={{ y: -50 }}
    onmouseenter={handleStopTimeout}
    onmouseleave={handleStartTimeout}
>
    {#if message.icon }
        <div class="{ message.variant }-icon size-150 icon"></div>
    {/if}
    <p>
        {#if isSlugText( message.text ) }
            { getLocalizedTextBySlug( message.text, $languageTagStore ) }
        {:else}
            { message.text }
        {/if}
    </p>
    <button onclick={() => onRemove( message.id )}>
        <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M1 1L6 6M11 11L6 6M6 6L11 1L1 11"
                stroke="#B3B3B3"
                stroke-width="2"
            />
        </svg>
    </button>
</div>

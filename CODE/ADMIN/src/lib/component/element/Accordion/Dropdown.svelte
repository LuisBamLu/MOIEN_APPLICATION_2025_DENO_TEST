<script>
    // -- IMPORTS

    import { slide } from 'svelte/transition';
    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    /** @type {{label?: string, placeholder?: string, children?: import('svelte').Snippet}} */
    let { label = '', placeholder = '', children } = $props();
    let isOpen = $state(false);

    // -- FUNCTIONS

    function handleToggleOpen(
        )
    {
        isOpen = !isOpen;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .dropdown-wrapper
    {
        position: relative;

        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .dropdown-wrapper .dropdown-label
    {
        line-height: 2rem;
        font-size: 1.25rem;
        font-weight: 600;
        color: lightGreyColor;
    }

    .dropdown-wrapper .dropdown-button
    {
        border: 1px solid grayColor500;
        padding: 0.75rem 1.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        background: grayColor500;
        box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.40);

        cursor: pointer;
    }

    .dropdown-wrapper .dropdown-button:hover
    {
        background: darkGreyColor;
    }

    .dropdown-wrapper .dropdown-button.is-open
    {
        border: 1px solid lightGoldColor;

        background: linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), #000;
    }

    .dropdown-placeholder
    {
        flex: 1;

        line-height: 2.5rem;
        font-size: 1.5rem;
        font-style: normal;
        text-align: left;
        color: white;
        color: lightGoldColor;
    }

    .dropdown-content
    {
        position: absolute;
        top: 100%;

        width: 100%;
    }
</style>

<div class="dropdown-wrapper" use:clickOutside onclickOutside={() => isOpen = false}>
    <p class="dropdown-label">{ label }</p>
    <button
        class="dropdown-button"
        type="button"
        onclick={handleToggleOpen}
        class:is-open={ isOpen }
    >
        <span class="dropdown-placeholder">{ placeholder }</span>

        <div class="light-gold-chevron-down-icon size-200"></div>
    </button>

    {#if isOpen }
        <div class="dropdown-content" transition:slide>
            {@render children?.()}
        </div>
    {/if}
</div>

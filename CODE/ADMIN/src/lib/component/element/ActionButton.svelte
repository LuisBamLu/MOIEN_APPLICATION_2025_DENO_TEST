<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- VARIABLES

    import Loading from "./Loading.svelte";

    /** @type {{variant?: string, isLoading?: boolean, disabled?: boolean, children?: import('svelte').Snippet}} */
    let {
        variant = 'accept',
        isLoading = false,
        disabled = false,
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .action-button[disabled]
    {
        opacity: 0.5;

        cursor: not-allowed;
    }

    .action-button
    {
        height: 100%;
        border-width: 1px;
        border-style: solid;
        border-radius: 1rem;
        padding: 0.25rem 0.5rem;

        cursor: pointer;
        transition: all 400ms ease-in-out;
    }

    .action-button.accept
    {
        border-color: rgba( 64, 220, 182, 0.35 );

        color: greenColor500;
    }

    .action-button.accept:hover
    {
        border-color: rgba( 64, 220, 182, 1 );

        box-shadow: 0px 0px 4px 0px  rgba( 64, 220, 182, 0.35 );
    }

    .action-button.decline
    {
        border-color: rgba( 240, 56, 74, 0.5 );

        color: redColor500;
    }

    .action-button.decline:hover
    {
        border-color: rgba( 240, 56, 74, 1 );

        box-shadow: 0px 0px 4px 0px  rgba( 240, 56, 74, 0.5 );
    }
</style>

<button
    type="button"
    onclick={bubble('click')}
    class="action-button { variant } font-size-75 font-weight-700"
    disabled={ disabled || isLoading }
>
    {#if isLoading}
        <Loading isSmall/>
    {:else}
        {@render children?.()}
    {/if}
</button>

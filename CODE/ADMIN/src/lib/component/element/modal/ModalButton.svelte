<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- VARIABLES

    /** @type {{variant?: string, disabled?: boolean, fullWidth?: boolean, type?: string, icon?: import('svelte').Snippet, children?: import('svelte').Snippet}} */
    let {
        variant = 'contained',
        disabled = false,
        fullWidth = true,
        type = 'button',
        icon,
        children
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .modal-action-button
    {
        height: 3rem;
        width: fit-content;
        border-radius: 0.5rem;
        padding: 0.75rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        cursor: pointer;
    }

    .modal-action-button:hover
    {
        opacity: 0.9;
    }

    .modal-action-button.full-width
    {
        width: 100%;

        flex: 1 0 0;
    }

    .is-contained
    {
        background: blueColor;

        color: whiteColor;
    }

    .is-outlined,
    .text
    {
        background: transparent;

        color: whiteColor;
    }

    .text
    {
        padding: 0.75rem 0;
    }

    .is-outlined
    {
        border: 1px solid blueColor;
    }

    .has-error
    {
        background: redColor500;

        color: whiteColor;
    }

    :disabled
    {
        opacity: 0.7;

        cursor: not-allowed;
    }
</style>

<button
    { disabled }
    type={ type === 'button' || type === 'reset' || type === 'submit' ? type : 'button' }
    class:full-width={ fullWidth }
    class:has-error={ variant === 'error' }
    class:is-contained={ variant === 'contained' }
    class:is-outlined={ variant === 'outlined' }
    class="modal-action-button font-size-100 font-weight-700"
    onclick={bubble('click')}
>
    {@render icon?.()}

    <div class="text">
        {@render children?.()}
    </div>
</button>

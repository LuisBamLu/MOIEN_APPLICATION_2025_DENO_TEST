<script>
    // -- IMPORTS

    import Loading from '../element/Loading.svelte';

    // -- VARIABLES

    export let type = 'submit';
    export let text = '';
    export let variant = 'contained';
    export let disabled = false;
    export let fullWidth = true;
    export let isLoading = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .modal-action-button
    {
        height: var( --modal-action-button-height, 3.25rem );
        width: fit-content;
        border-radius: 0.75rem;
        padding: var( --modal-action-button-padding, 0.875rem 2.5rem ) !important;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        color: blueColor;

        transition: all 400ms ease-in-out;
        &:hover
        {
            color: blueColor500;
        }
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

        transition: background-color 400ms ease-in-out;
        &:hover
        {
            background: blueColor300;

            color: whiteColor;
        }
    }

    .is-light
    {
        background: whiteColor;

        color: blueColor;

        transition: color 400ms ease-in-out;
        &:hover
        {
            color: blueColor500;
        }
    }

    .is-danger
    {
        background: redColor300;

        color: whiteColor;

        transition: background-color 400ms ease-in-out;
        &:hover
        {
            background-color: redColor500;

            color: whiteColor;
        }
    }

    .is-loading
    {
        border: none;

        background-color: grayColor800;
        &:hover
        {
            background-color: grayColor800;
        }
    }

    .is-outlined
    {
        border: 1px solid blueColor;

        background: transparent;

        color: blueColor;

        transition: all 400ms ease-in-out;
        &:hover
        {
            border-color: blueColor500;

            color: blueColor500;
        }
    }

    .has-error
    {
        background: redColor500;

        color: whiteColor;
    }

    .has-error-secondary
    {
        background: whiteColor;

        color: redColor300;
        &:hover
        {
            color: redColor500;
        }
    }

    :disabled
    {
        opacity: 0.7;

        cursor: not-allowed;
    }
</style>

<button
    class="modal-action-button font-size-100 font-weight-700"
    class:full-width={ fullWidth }
    class:has-error={ variant === 'error' }
    class:is-contained={ variant === 'contained' }
    class:is-light={ variant === 'light' }
    class:is-outlined={ variant === 'outlined' }
    class:is-danger={ variant === 'danger' }
    class:is-loading={ isLoading }
    class:has-error-secondary={ variant === 'error-secondary' }
    type={ type }
    disabled={ disabled || isLoading }
    on:click
    on:mouseenter
>
    {#if isLoading }
        <Loading isSmall={ true }/>
    {:else if text !== '' }
        { text }
    {:else}
        <slot/>
    {/if}
</button>

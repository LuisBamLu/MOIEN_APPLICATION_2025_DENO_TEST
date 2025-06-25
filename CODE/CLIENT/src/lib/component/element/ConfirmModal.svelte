<script>
    // -- IMPORTS
    import { fade } from 'svelte/transition';
    import { clickOutside } from '$lib/base';
    import ModalButton from '../modal/ModalButton.svelte';

    // -- VARIABLES

    export let isOpen = false;
    export let onConfirm = () => {};
    export let onCancel = () => {};
    export let confirmationText;

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

     .modal-overlay
     {
        z-index: overlayZIndex;
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;

        display: flex;
        justify-content: center;
        align-items: center;

        background: rgba(0, 0, 0, 0.5);
    }

    .modal-container
    {
        height: 9.5rem;
        border: 1px solid grayColor900;
        border-radius: 0.75rem;
        padding: 4rem 2rem;

        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        align-items: center;

        background: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .modal-header
    {
        display: flex;
        gap: 1rem;
    }

    .modal-header-text
    {
        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: redColor300;
    }

    .modal-action
    {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;
    }
</style>

{#if isOpen }
    <div class="modal-overlay" transition:fade>
        <div class="modal-container"
            use:clickOutside
            on:clickOutside={ onCancel() }
        >
            <div class="modal-header">
                <div class="orange-filled-warning-icon size-150"/>
                <span class="modal-header-text">{ confirmationText }</span>
            </div>

            <div class="modal-action">
                <ModalButton
                    variant="outlined"
                    disabled={ false }
                    text={ `Cancel` }
                    on:click={ onCancel }
                />

                <ModalButton
                    variant="contained"
                    disabled={ false }
                    text={ `confirm` }
                    on:click={ onConfirm }
                />
            </div>
        </div>
    </div>
{/if}

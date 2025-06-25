<script>

    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fade } from 'svelte/transition';
    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    /** @type {{isOpen?: boolean, onConfirm: any, onCancel: any, confirmationText: any, buttonSlugMap?: any}} */
    let {
        isOpen = $bindable(false),
        onConfirm,
        onCancel,
        confirmationText,
        buttonSlugMap = {
            cancel : 'Cancel',
            confirm : 'Yes, leave',
        }
    } = $props();

    // -- FUNCTIONS

    function handleConfirm(
        )
    {
        onConfirm();

        isOpen = false;
    }

    // ~~

    function handleCancel(
        )
    {
        onCancel();

        isOpen = false;
    }
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
        border: 1px solid var(--Warning-20, #FED584);
        border-radius: 0.75rem;
        padding: 4rem 2rem;

        display: flex;
        flex-direction: column;
        gap: 2rem;
        justify-content: center;
        align-items: center;

        background: var(--Warning-10, #FEF1D1);
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
        color: var(--Warning-90, #7A3A0F);
    }

    .button
    {
        height: 3.25rem;
        border-radius: 0.75rem;
        padding: 0.8125rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
        text-align: center;

        transition: all 200ms cubic-bezier( 0.76, 0, 0.27, 1 );
    }

    .button.cancel
    {
        background: var(--Gray-05, #FAFAFA);

        color: var(--Warning-90, #7A3A0F);
    }

    .button.confirm
    {
        background: var(--Warning-90, #7A3A0F);

        color: var(--Gray-05, #FAFAFA);
    }

    .modal-action
    {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;
    }

    .button.cancel:hover
    {
        color: blueColor300;
    }

    .button.confirm:hover
    {
        background: blueColor300;
    }
</style>

{#if isOpen }
    <div class="modal-overlay" transition:fade>
        <div class="modal-container"
            use:clickOutside
            onclickOutside={onCancel()}
        >
            <div class="modal-header">
                <div class="orange-filled-warning-icon size-150"></div>
                <span class="modal-header-text">{ confirmationText }</span>
            </div>

            <div class="modal-action">
                <button
                    type="button"
                    class="button cancel"
                    onclick={handleCancel}
                >
                    { getLocalizedTextBySlug( buttonSlugMap.cancel, $languageTagStore ) }
                </button>

                <button
                    type="button"
                    class="button confirm"
                    onclick={handleConfirm}
                >
                    { getLocalizedTextBySlug( buttonSlugMap.confirm, $languageTagStore ) }
                </button>
            </div>
        </div>
    </div>
{/if}

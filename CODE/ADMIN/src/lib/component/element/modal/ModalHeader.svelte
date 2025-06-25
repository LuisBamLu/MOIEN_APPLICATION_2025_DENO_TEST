<script>
   // -- IMPORTS

    import { useConfirmationModal } from '$src/lib/confirmation_modal';
    import ConfirmModal from '../ConfirmModal.svelte';

    // -- VARIABLES

   /** @type {{title?: string, onClose?: any}} */
   let { title = '', onClose = () => {} } = $props();
    let
    {
        isConfirmationModalOpen,
        toggleConfirmModal
    } = useConfirmationModal();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .modal-header
    {
        position: relative;

        border-bottom: 1px solid grayColor700;
        padding: 1.25rem 0px;

        display: flex;
        flex-direction: column;
        gap: 1.25rem;
        align-items: center;
        align-self: stretch;

        background: grayColor900;
    }

    .modal-header-title
    {
        width: 100%;

        text-align: center;
    }

    .modal-header-close-button
    {
        position: absolute;
        top: 1.5rem;
        right: 1.5rem;

        cursor: pointer;
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ onClose }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
    />
<header class="modal-header">
    <span class="font-size-100 font-weight-700 color-gray-100 modal-header-title">{ title }</span>
    <button onclick={toggleConfirmModal} class="modal-header-close-button">
        <div class="gray-close-icon size-100"></div>
    </button>
</header>

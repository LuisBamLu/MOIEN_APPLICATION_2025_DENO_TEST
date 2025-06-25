<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { useConfirmationModal } from '$lib/confirmation_modal';
    import { profileSignedInStore } from '$store/profileStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ConfirmModal from './ConfirmModal.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    let
    {
        isConfirmationModalOpen,
        toggleConfirmModal
    } = useConfirmationModal()

    // -- FUNCTIONS

    async function handleSignOut(
        )
    {
       await fetchData( '/api/sign-out', { method: 'POST', credentials: 'include' } );

       $profileSignedInStore = null
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .sign-out-container
    {
        position: sticky;
        bottom: 0;

        overflow: hidden;
        margin-top: auto;
        height: 7vh;
        padding: 0 0.5rem 0.5rem;

        display: flex;
        flex-direction: row;
        justify-content: center;

        background-color: white;
    }

    .sign-out-button
    {
        width: 100%;
        border-radius: 0.5rem;
        padding: 0 1.25rem;

        display: flex;
        align-items: center;

        background-color: white;

        font-size: 0.85rem;
        font-weight: bold;
        text-decoration: none;
        color: blueColor;
        &:hover
        {
            background-color: grayColor900;
        }

        cursor: pointer;
    }

    .sign-out-text
    {
        display: flex;
        gap: 0.5em;
        align-items: center;

        transition: 0.3s;
    }

    .icon
    {
        flex-shrink: 0;
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ handleSignOut }
    onCancel={ toggleConfirmModal }
    confirmationText={ `You have unsaved information, are you sure you wanna leave?` }
/>

<div class="sign-out-container">
    <button class="sign-out-button" onclick={toggleConfirmModal}>
        <span class="sign-out-text font-weight-700">
            <div class="logout-icon icon size-150"></div>
            { getLocalizedTextBySlug( 'auth-log-out-button', $languageTagStore ) }
        </span>
    </button>
</div>

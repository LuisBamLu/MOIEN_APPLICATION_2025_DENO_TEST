<script>
    // -- IMPORTS

    import { isNotificationModalOpen, toggleNotificationModal } from '$store/notificationStore';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import NotificationContent from './NotificationContent.svelte';

    // -- CONSTANTS

    const title =
    {
        edit: getLocalizedTextBySlug( 'edit-notification' ),
        add: getLocalizedTextBySlug( 'add-notification' )
    }
    const buttonLabel =
    {
        edit: getLocalizedTextBySlug( 'edit-label' ),
        create: getLocalizedTextBySlug( 'create-label' ),
        delete: getLocalizedTextBySlug( 'delete-label' )
    }

    // -- VARIABLES

    /** @type {{notification?: any, isEditing?: boolean, handleDeleteNotification: any, handleEditNotification: any, handleAddNotification: any, isSubmitting?: boolean}} */
    let {
        notification = {},
        isEditing = false,
        handleDeleteNotification,
        handleEditNotification,
        handleAddNotification,
        isSubmitting = false
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .loading
    {
        z-index: 99999;
        position: absolute;

        height: 100%;
        width: 100%;
        border-radius: 1.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        backdrop-filter: blur( 5px );
    }

    .button-loading-indicator
    {
        display: flex;

        visibility: visible;

        color: rgba(0, 0, 0, 0.26);
    }

    .circular-progress-root
    {
        height: 2rem;
        width: 2rem;

        display: inline-block;

        animation: 1.4s linear 0s infinite normal none running animation-spin;
    }

    .circular-progress-circle
    {
        stroke: blueColor;
        stroke-dasharray: 80px, 200px;
        stroke-dashoffset: 0;
        animation: 1.4s ease-in-out 0s infinite normal none running animation-spin-dashoffset;
    }

    @keyframes animation-spin-dashoffset
    {
        0%
        {
            stroke-dasharray: 1px, 200px;
            stroke-dashoffset: 0;
        }

        50%
        {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -15px;
        }

        100%
        {
            stroke-dasharray: 100px, 200px;
            stroke-dashoffset: -125px;
        }
    }

    @keyframes animation-spin
    {
        0%
        {
            transform: rotate(0deg);
        }

        100%
        {
            transform: rotate(360deg);
        }
    }
</style>

<ModalRoot isOpen={ $isNotificationModalOpen }>
    {#if isSubmitting }
        <div class="loading">
            <span class="button-loading-indicator button-loading-indicator-center">
                <span class="circular-progress-root" role="progressbar" aria-labelledby=":r1q:">
                    <svg class="circular-progress-svg" viewBox="22 22 44 44">
                        <circle class="circular-progress-circle" cx="44" cy="44" r="20.2" fill="none" stroke-width="3.6">
                        </circle>
                    </svg>
                </span>
            </span>
        </div>
    {/if}

    <ModalHeader
        title={ isEditing ? title.edit : title.add }
        onClose={ toggleNotificationModal }
    />
    <ModalContent>
        <NotificationContent
            notification={ notification }
        />
    </ModalContent>
    <ModalActions>
        {#if isEditing }
            <ModalButton disabled={ isSubmitting } on:click={ handleDeleteNotification }>{ buttonLabel.delete }</ModalButton>
            <ModalButton disabled={ isSubmitting } on:click={ handleEditNotification }>{ buttonLabel.edit }</ModalButton>
        {:else}
            <ModalButton disabled={ isSubmitting } on:click={ () => handleAddNotification( notification ) }>{ buttonLabel.create }</ModalButton>
        {/if}
    </ModalActions>
</ModalRoot>

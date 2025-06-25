<script>
    // -- IMPORTS

    import
    {
        notificationTypeArrayStore,
        selectedNotificationTypeStore,
        isNotificationTypeModalOpen,
        loadNotificationTypeArray,
        handleCreateNotificationType,
        handleDeleteNotificationType,
        handleEditNotificationType,
        toggleNotificationTypeModal,
        isFormModified as isNotificationTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/notificationTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Input from '$component/element/Input.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-notification-type-label',
        addTitle: 'add-notification-type-label'
    };

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
        id:
        {
            type: 'text',
            name: 'ID',
            value: ''
        },
        name:
        {
            type: 'text',
            name: 'Name',
            value: ''
        },
        number:
        {
            type: 'number',
            name: 'Number',
            value: ''
        },
        creationTimestamp:
        {
            type: 'timestamp',
            name: 'Creation Date',
            value: ''
        },
        updateTimestamp:
        {
            type: 'timestamp',
            name: 'Update Date',
            value: ''
        }
    };

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
    }

    // ~~

    function handleUpdateNotificationTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedNotificationTypeStore.update( ( notificationType ) => ( { ...notificationType, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="admin-menu-notification-type-label"
    selectedObject={ selectedNotificationTypeStore }
    objectArrayStore={ notificationTypeArrayStore }
    isObjectModalOpen={ isNotificationTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadNotificationTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateNotificationType( arrayProcessing ) }
    handleEditObject={ () => handleEditNotificationType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteNotificationType( arrayProcessing ) }
    toggleObjectModal={ toggleNotificationTypeModal }
    isFormModified={ $isNotificationTypeFormModified }
    showButton={ hasUserPermission( 'add-notification-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedNotificationTypeStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateNotificationTypeLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedNotificationTypeStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

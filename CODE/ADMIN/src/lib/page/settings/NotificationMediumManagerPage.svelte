<script>
    // -- IMPORTS

    import
    {
        notificationMediumArrayStore,
        selectedNotificationMediumStore,
        isNotificationMediumModalOpen,
        loadNotificationMediumArray,
        handleCreateNotificationMedium,
        handleDeleteNotificationMedium,
        handleEditNotificationMedium,
        toggleNotificationMediumModal,
        isFormModified as isNotificationMediumFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/notificationMediumStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Input from '$component/element/Input.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-notification-medium-label',
        addTitle: 'add-notification-medium-label'
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
        $notificationMediumArrayStore = $notificationMediumArrayStore.sort(
            ( a, b ) => ( a.number - b.number || a.name - b.name )
            );
    }

    // ~~

    function handleUpdateNotificationMediumLocalizedInput(
        event
        )
    {
        handleChange();
        selectedNotificationMediumStore.update( ( notificationMedium ) => ( { ...notificationMedium, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="admin-menu-notification-medium-label"
    selectedObject={ selectedNotificationMediumStore }
    objectArrayStore={ notificationMediumArrayStore }
    isObjectModalOpen={ isNotificationMediumModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadNotificationMediumArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateNotificationMedium( arrayProcessing ) }
    handleEditObject={ () => handleEditNotificationMedium( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteNotificationMedium( arrayProcessing ) }
    toggleObjectModal={ toggleNotificationMediumModal }
    isFormModified={ $isNotificationMediumFormModified }
    showButton={ hasUserPermission( 'add-notification-medium' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedNotificationMediumStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateNotificationMediumLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedNotificationMediumStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

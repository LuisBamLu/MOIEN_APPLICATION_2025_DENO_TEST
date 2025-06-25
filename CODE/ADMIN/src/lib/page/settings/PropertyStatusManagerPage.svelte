<script>
    // -- IMPORTS

    import
    {
        propertyStatusArrayStore,
        selectedPropertyStatusStore,
        isPropertyStatusModalOpen,
        loadPropertyStatusArray,
        handleCreatePropertyStatus,
        handleDeletePropertyStatus,
        handleEditPropertyStatus,
        togglePropertyStatusModal,
        isFormModified as isPropertyStatusFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/propertyStatusStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Input from '$component/element/Input.svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-property-status-label',
        addTitle: 'add-property-status-label'
    };

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
        id :
        {
            type: 'text',
            name: 'ID',
            value: ''
        },
        number:
        {
            type: 'number',
            name: 'Number',
            value: ''
        },
        name:
        {
            type: 'text',
            name: 'Name',
            value: ''
        },
        color:
        {
            type: 'color',
            name: 'Color',
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

    function handleUpdatePropertyStatusLocalizedInput(
        event
        )
    {
        handleChange();
        selectedPropertyStatusStore.update( ( propertyStatus ) => ( { ...propertyStatus, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="property-status-label"
    selectedObject={ selectedPropertyStatusStore }
    objectArrayStore={ propertyStatusArrayStore }
    isObjectModalOpen={ isPropertyStatusModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadPropertyStatusArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreatePropertyStatus( arrayProcessing ) }
    handleEditObject={ () => handleEditPropertyStatus( arrayProcessing ) }
    handleDeleteObject={ () => handleDeletePropertyStatus( arrayProcessing ) }
    toggleObjectModal={ togglePropertyStatusModal }
    isFormModified={ $isPropertyStatusFormModified }
    showButton={ hasUserPermission( 'add-property-status' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedPropertyStatusStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdatePropertyStatusLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedPropertyStatusStore.number }
                fullWidth
                name="number"
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Color</span>
            <Input
                type="color"
                bind:value={ $selectedPropertyStatusStore.color }
                fullWidth
                name="color"
                class="color"
            />
        </div>
    </form>
</AdminPage>

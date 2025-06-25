<script>
    // -- IMPORTS

    import
    {
        documentTypeArrayStore,
        selectedDocumentTypeStore,
        isDocumentTypeModalOpen,
        loadDocumentTypeArray,
        handleCreateDocumentType,
        handleDeleteDocumentType,
        handleEditDocumentType,
        toggleDocumentTypeModal,
        isFormModified as isDocumentTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/documentTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { onMount } from 'svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Input from '$component/element/Input.svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-document-type-label',
        addTitle: 'add-document-type-label'
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
        // $documentTypeArrayStore = $documentTypeArrayStore.sort();
    }

    // ~~

    function handleUpdateDocumentTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedDocumentTypeStore.update( ( documentType ) => ( { ...documentType, [ event.detail.name ]: event.detail.text } ) );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            addNavigationEventListener();

            return () => removeNavigationEventListener();
        }
        );
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="personal-information-document-type"
    selectedObject={ selectedDocumentTypeStore }
    objectArrayStore={ documentTypeArrayStore }
    isObjectModalOpen={ isDocumentTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadDocumentTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateDocumentType( arrayProcessing ) }
    handleEditObject={ () => handleEditDocumentType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteDocumentType( arrayProcessing ) }
    toggleObjectModal={ toggleDocumentTypeModal }
    isFormModified={ $isDocumentTypeFormModified }
    showButton={ hasUserPermission( 'add-document-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedDocumentTypeStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateDocumentTypeLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedDocumentTypeStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

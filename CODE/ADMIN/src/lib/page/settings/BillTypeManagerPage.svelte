<script>
    // -- IMPORTS

    import
    {
        billTypeArrayStore,
        handleCreateBillType,
        handleDeleteBillType,
        handleEditBillType,
        isBillTypeModalOpen,
        loadBillTypeArray,
        selectedBillTypeStore,
        toggleBillTypeModal,
        isFormModified as isBillTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/billTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
        id :
        {
            type: 'text',
            name: 'ID',
            value: ''
        },
        title:
        {
            type: 'text',
            name: 'Title',
            value: ''
        },
        creationTimestamp:
        {
            type: 'timestamp',
            name: 'Creation',
            value: ''
        },
        updateTimestamp:
        {
            type: 'timestamp',
            name: 'Update',
            value: ''
        }
    };
    let titleSlugMap =
    {
        editTitle: 'edit-bill-type-label',
        addTitle: 'add-bill-type-label'
    };

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
        $billTypeArrayStore = $billTypeArrayStore.sort(
            ( a, b ) => ( a.title - b.title )
            );
    }

    // ~~

    function handleUpdateBillTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedBillTypeStore.update( ( billType ) => ( { ...billType, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="admin-menu-bill-type-label"
    selectedObject={ selectedBillTypeStore }
    objectArrayStore={ billTypeArrayStore }
    isObjectModalOpen={ isBillTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadBillTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateBillType( arrayProcessing ) }
    handleEditObject={ () => handleEditBillType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteBillType( arrayProcessing ) }
    toggleObjectModal={ toggleBillTypeModal }
    isFormModified={ $isBillTypeFormModified }
    showButton={ hasUserPermission( 'add-bill-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Title</span>
            <InputLocalizedForm
                name='title'
                itemsString={ $selectedBillTypeStore.title }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateBillTypeLocalizedInput }
            />
        </div>
    </form>
</AdminPage>

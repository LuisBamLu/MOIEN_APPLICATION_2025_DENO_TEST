<script>
    // -- IMPORTS

    import
    {
        spaceTypeArrayStore,
        selectedSpaceTypeStore,
        isSpaceTypeModalOpen,
        loadSpaceTypeArray,
        handleCreateSpaceType,
        handleDeleteSpaceType,
        handleEditSpaceType,
        toggleSpaceTypeModal,
        isFormModified as isSpaceTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/spaceTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
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
        $spaceTypeArrayStore = $spaceTypeArrayStore.sort(
            ( a, b ) => ( a.minimumValue - b.minimumValue || a.name - b.name )
            );
    }

    // ~~

    function handleUpdateSpaceTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedSpaceTypeStore.update( ( spaceType ) => ( { ...spaceType, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="space-type-label"
    selectedObject={ selectedSpaceTypeStore }
    objectArrayStore={ spaceTypeArrayStore }
    isObjectModalOpen={ isSpaceTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadSpaceTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateSpaceType( arrayProcessing ) }
    handleEditObject={ () => handleEditSpaceType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteSpaceType( arrayProcessing ) }
    toggleObjectModal={ toggleSpaceTypeModal }
    isFormModified={ $isSpaceTypeFormModified }
    showButton={ hasUserPermission( 'add-space-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedSpaceTypeStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateSpaceTypeLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedSpaceTypeStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

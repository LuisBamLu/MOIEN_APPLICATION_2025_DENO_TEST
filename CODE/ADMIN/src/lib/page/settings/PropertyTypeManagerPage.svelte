<script>
    // -- IMPORTS

    import
    {
        propertyTypeArrayStore,
        selectedPropertyTypeStore,
        isPropertyTypeModalOpen,
        loadPropertyTypeArray,
        handleCreatePropertyType,
        handleDeletePropertyType,
        handleEditPropertyType,
        togglePropertyTypeModal,
        isFormModified as isPropertyTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/propertyTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Input from '$component/element/Input.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-property-type-label',
        addTitle: 'ad-property-type-label'
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
        $propertyTypeArrayStore = $propertyTypeArrayStore.sort(
            ( a, b ) => ( a.minimumValue - b.minimumValue || a.name - b.name )
            );
    }

    // ~~

    function handleUpdatePaymentTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedPropertyTypeStore.update( ( propertyType ) => ( { ...propertyType, [ event.detail.name ]: event.detail.text } ) );
    }
</script>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="property-type-label"
    selectedObject={ selectedPropertyTypeStore }
    objectArrayStore={ propertyTypeArrayStore }
    isObjectModalOpen={ isPropertyTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadPropertyTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreatePropertyType( arrayProcessing ) }
    handleEditObject={ () => handleEditPropertyType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeletePropertyType( arrayProcessing ) }
    toggleObjectModal={ togglePropertyTypeModal }
    isFormModified={ $isPropertyTypeFormModified }
    showButton={ hasUserPermission( 'add-property-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedPropertyTypeStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdatePaymentTypeLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedPropertyTypeStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

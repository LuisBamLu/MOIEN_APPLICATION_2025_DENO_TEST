<script>
    // -- IMPORTS

    import
    {
        paymentTypeArrayStore,
        handleCreatePaymentType,
        handleDeletePaymentType,
        handleEditPaymentType,
        isPaymentTypeModalOpen,
        loadPaymentTypeArray,
        selectedPaymentTypeStore,
        togglePaymentTypeModal,
        isFormModified as isPaymentTypeFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from
    '$store/paymentTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Input from '$component/element/Input.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { onMount } from 'svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-payment-type-label',
        addTitle: 'add-payment-type-label'
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
        $paymentTypeArrayStore = $paymentTypeArrayStore.sort(
            ( a, b ) => ( a.minimumValue - b.minimumValue || a.name - b.name )
            );
    }

    // ~~

    function handleUpdatePaymentTypeLocalizedInput(
        event
        )
    {
        handleChange();
        selectedPaymentTypeStore.update( ( paymentType ) => ( { ...paymentType, [ event.detail.name ]: event.detail.text } ) );
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
    pageTitle="payment-type-label"
    selectedObject={ selectedPaymentTypeStore }
    objectArrayStore={ paymentTypeArrayStore }
    isObjectModalOpen={ isPaymentTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadPaymentTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreatePaymentType( arrayProcessing ) }
    handleEditObject={ () => handleEditPaymentType( arrayProcessing ) }
    handleDeleteObject={ () => handleDeletePaymentType( arrayProcessing ) }
    toggleObjectModal={ togglePaymentTypeModal }
    isFormModified={ $isPaymentTypeFormModified }
    showButton={ hasUserPermission( 'add-payment-type' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                name='name'
                itemsString={ $selectedPaymentTypeStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdatePaymentTypeLocalizedInput }
            />
        </div>

        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Number</span>
            <Input
                type="number"
                bind:value={ $selectedPaymentTypeStore.number }
                fullWidth
                name="number"
            />
        </div>
    </form>
</AdminPage>

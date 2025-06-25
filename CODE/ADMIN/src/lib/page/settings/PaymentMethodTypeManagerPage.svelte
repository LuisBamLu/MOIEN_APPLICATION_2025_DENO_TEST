<script>
    // -- IMPORTS

    import
    {
        paymentMethodTypeArrayStore,
        handleCreatePaymentMethodType,
        handleDeletePaymentMethodType,
        handleEditPaymentMethodType,
        selectedPaymentMethodTypeStore,
        isPaymentMethodTypeModalOpen,
        loadPaymentMethodTypeArray,
        togglePaymentMethodTypeModal
    }
    from '$store/paymentMethodTypeStore';
    import AdminPage from '$component/element/AdminPage.svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-payment-method-type-label',
        addTitle: 'add-payment-method-type-label'
    };

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
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
        $paymentMethodTypeArrayStore = $paymentMethodTypeArrayStore.sort(
            ( a, b ) => ( a.minimumValue - b.minimumValue || a.name - b.name )
            );
    }
</script>

<AdminPage
    pageTitle="payment-method-type-label"
    selectedObject={ selectedPaymentMethodTypeStore }
    objectArrayStore={ paymentMethodTypeArrayStore }
    isObjectModalOpen={ isPaymentMethodTypeModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadPaymentMethodTypeArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ handleCreatePaymentMethodType }
    handleEditObject={ handleEditPaymentMethodType }
    handleDeleteObject={ handleDeletePaymentMethodType }
    toggleObjectModal={ togglePaymentMethodTypeModal }
/>

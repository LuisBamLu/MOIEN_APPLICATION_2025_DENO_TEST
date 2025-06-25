<script>
    // -- IMPORTS

    import
    {
        cancellationPolicyArrayStore,
        isCancellationPolicyModalOpen,
        toggleCancellationPolicyModal,
        selectedCancellationPolicyStore,
        loadCancellationPolicyArray,
        handleCreateCancellationPolicy,
        handleEditCancellationPolicy,
        handleDeleteCancellationPolicy,
        isFormModified as isCancellationPolicyFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/cancellationPolicyStore.js';
    import AdminPage from '$component/element/AdminPage.svelte';
    import { fetchData, getFilterParameterByKeyMap } from '$lib/base';
    import CancellationPolicyView from '$component/page/cancellation_policy/CancellationPolicyView.svelte';
    import { hasUserPermission } from '$store/profileStore';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-cancellation-policy-label',
        addTitle: 'add-cancellation-policy-label',
    };

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
        id :
            {
                type : 'text',
                name : 'ID',
                value : ''
            },
        name :
            {
                type : 'text',
                name : 'Name',
                value : ''
            },
        number :
            {
                type : 'number',
                name : 'Number',
                value : ''
            },
        partialRefundRatio :
            {
                type : 'number',
                name : 'Partial refund ratio (%)',
                value : ''
            },
        partialRefundMinimumDayCount :
            {
                type : 'number',
                name : 'Partial refund minimum (days)',
                value : ''
            },
        fullRefundMinimumDayCount :
            {
                type : 'number',
                name : 'Full refund minimum (days)',
                value : ''
            },
        penaltyDayCount :
            {
                type : 'number',
                name : 'Penalty (days)',
                value : ''
            },
        // creationTimestamp :
        //     {
        //         type : 'date',
        //         name : 'Created at',
        //         value : ''
        //     },
        // updateTimestamp :
        //     {
        //         type : 'date',
        //         name : 'Update at',
        //         value : ''
        //     },
    };

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .page-section
    {
        min-height: 100dvh;
        padding-top: 4.5rem;

        display: grid;
        grid-template-columns: min-content 1fr;

        background: pageBackgroundColor;
    }

    .main-section
    {
        padding-bottom: 4.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cancellation-policy-tool-bar
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .add-button
    {
        border-radius: 1rem;
        padding: 0.7rem;

        background: greenColor;

        cursor: pointer;
    }
</style>

<AdminPage
    pageTitle="admin-menu-cancellation-policy-manager-label"
    selectedObject={ selectedCancellationPolicyStore }
    objectArrayStore={ cancellationPolicyArrayStore }
    isObjectModalOpen={ isCancellationPolicyModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadCancellationPolicyArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateCancellationPolicy( arrayProcessing ) }
    handleEditObject={ () => handleEditCancellationPolicy( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteCancellationPolicy( arrayProcessing ) }
    toggleObjectModal={ toggleCancellationPolicyModal }
    isFormModified={ $isCancellationPolicyFormModified }
    showButton={ hasUserPermission( 'add-cancellation-policy' ) }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <CancellationPolicyView
        cancellationPolicy={ $selectedCancellationPolicyStore }
        on:change={ handleChange }
    />
</AdminPage>

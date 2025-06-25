<script>
    // -- IMPORTS

    import
    {
        visitStatusArrayStore,
        handleCreateVisitStatus,
        handleDeleteVisitStatus,
        handleEditVisitStatus,
        isVisitStatusModalOpen,
        loadVisitStatusArray,
        selectedVisitStatusStore,
        toggleVisitStatusModal
    }
    from '$store/visitStatusStore';
    import AdminPage from '$component/element/AdminPage.svelte';

    // -- CONSTANTS

    const titleSlugMap =
    {
        editTitle: 'edit-diagnosis-label',
        addTitle: 'add-diagnosis-label'
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
        $visitStatusArrayStore = $visitStatusArrayStore.sort(
            ( a, b ) => ( a.number - b.number || a.name - b.name )
            );
    }
</script>

<AdminPage
    pageTitle="visit-status-label"
    selectedObject={ selectedVisitStatusStore }
    objectArrayStore={ visitStatusArrayStore }
    isObjectModalOpen={ isVisitStatusModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadVisitStatusArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ handleCreateVisitStatus }
    handleEditObject={ handleEditVisitStatus }
    handleDeleteObject={ handleDeleteVisitStatus }
    toggleObjectModal={ toggleVisitStatusModal }
/>

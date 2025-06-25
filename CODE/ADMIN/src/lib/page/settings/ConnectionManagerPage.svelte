<script>
    // -- IMPORTS

    import
    {
        connectionArrayStore,
        isConnectionModalOpen,
        toggleConnectionModal,
        selectedConnectionStore,
        loadConnectionArray,
        handleCreateConnection,
        handleEditConnection,
        handleDeleteConnection,
        isFormModified as isConnectionFormModified,
        addNavigationEventListener,
        finalizeNavigation,
        handleChange,
        isConfirmationModalOpen,
        removeNavigationEventListener,
        toggleConfirmModal,
        isSubmitting
    }
    from '$store/connectionStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import Input from '$component/element/Input.svelte';
    import Select from '$component/element/Select.svelte';
    import { hasUserPermission } from '$store/profileStore';
    import { getFormattedDateText, getFormattedTimeText, isArray } from 'senselogic-gist';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { isNullOrUndefined } from '$lib/base';

    // -- VARIABLES

    let filterParameterByKeyMap =
    {
        id :
            {
                name : 'ID',
                type : 'text',
                value : '',
            },
        browserAddress :
            {
                name : 'IP',
                type : 'text',
                value : '',
            },
        dateTime :
            {
                name : 'Date',
                type : 'datetime',
                value : '',
            },
        isFailed :
            {
                name : 'Failed',
                type : 'boolean',
                value : '',
            },
        attemptCount :
            {
                name : 'Attempts',
                type : 'text',
                value : '',
            }
    };
    let filterableColumnByColumnNameMap =
        {
            id: { columnLabel: 'ID', type: 'text' },
            browserAddress: { columnLabel: 'Browser Address', type: 'text' },
            dateTime: { columnLabel: 'Date and Time', type: 'date' },
            isFailed: { columnLabel: 'Failed Attempt', type: 'boolean' },
            attemptCount: { columnLabel: 'Attempt Count', type: 'text' }
        };
    let titleSlugMap =
    {
        editTitle: 'edit-connection-label',
        addTitle: 'add-connection-label'
    };
    let isEditing = $derived(!isNullOrUndefined( $selectedConnectionStore.id ));

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
        if ( !isArray( $connectionArrayStore ) || $connectionArrayStore.length === 0 )
        {
            return;
        }

        $connectionArrayStore = $connectionArrayStore.map(
            ( connection ) =>
            {
                let formattedDate = new Date( connection.dateTime );
                let date = getFormattedDateText(
                    formattedDate,
                    'short'
                    );
                let time = getFormattedTimeText(
                    formattedDate,
                    'short'
                    );

                return (
                    {
                        ...connection,
                        dateTime : date + ' - ' + time
                    }
                    );
            }
            );
    }
</script>

<style lang="stylus">
    // -- ELEMENTS

    form
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    // -- CLASSES

    .input-row
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        align-self: stretch;
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="admin-menu-connection-manager-label"
    selectedObject={ selectedConnectionStore }
    objectArrayStore={ connectionArrayStore }
    isObjectModalOpen={ isConnectionModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    filterableColumnByColumnNameMap={ filterableColumnByColumnNameMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadConnectionArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateConnection( arrayProcessing ) }
    handleEditObject={ () => handleEditConnection( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteConnection( arrayProcessing ) }
    toggleObjectModal={ toggleConnectionModal }
    showButton={ hasUserPermission( 'add-connection' ) }
    isFormModified={ $isConnectionFormModified }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange}>
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">ID</span>
            <Input fullWidth name="id" placeholder="ID" type="text" bind:value={ $selectedConnectionStore.id } required readonly/>
        </div>
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">IP</span>
            <Input fullWidth name="browserAddress" placeholder="IP" type="text" bind:value={ $selectedConnectionStore.browserAddress } required readonly={ isEditing }/>
        </div>
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Failed</span>
            <Select fullWidth name="isFailed" bind:value={ $selectedConnectionStore.isFailed }>
                <option value={ true }>Failed</option>
                <option value={ false }>Not failed</option>
            </Select>
        </div>
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Attempts</span>
            <Input fullWidth name="attemptCount" placeholder="Attempts" type="number" bind:value={ $selectedConnectionStore.attemptCount } required/>
        </div>
    </form>
</AdminPage>

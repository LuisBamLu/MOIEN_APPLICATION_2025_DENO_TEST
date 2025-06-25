<script>
    // -- IMPORTS

    import { TemplateEngine } from '$lib/template_engine';
    import NotificationHead from '$component/page/notifications/NotificationHead.svelte';
    import
        {
            mediumArrayStore,
            typeArrayStore,
            loadNotificationArray,
            notificationArrayStore,
            toggleNotificationModal,
            isNotificationLoading
        } from '$store/notificationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import SearchBar from '$component/element/SearchBar/SearchBar.svelte';
    import { onMount } from 'svelte';
    import { fetchData, formatDate, getOptionArray } from '$lib/base';
    import NotificationModal from '$component/page/notifications/NotificationModal.svelte';
    import GenericTableContainer from '$component/element/GenericTableContainer.svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import ToolBar from '$component/element/ToolBar.svelte';
    import AdminTable from '$component/element/AdminTable/AdminTable.svelte';

    // -- CONSTANTS

    const filterParameterByKeyMap =
    $state({
        id:
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
        message:
        {
            type: 'text',
            name: 'Message',
            value: ''
        },
        notificationMedium:
        {
            type: 'select',
            name: 'Channel',
            optionArray: [],
            value: ''
        },
        date:
        {
            type: 'date',
            name: 'Date',
            value: ''
        },
        notificationType:
        {
            type: 'select',
            name: 'Action',
            optionArray: [],
            value: ''
        }
    });

    // -- VARIABLES

    let columnHeaderArray = [];
    let isEditing = false;
    let isLoading = $state(true);
    let isSubmitting = $state(false);
    let notificationArray = [];
    let searchColumn = '';
    let searchTerm = '';
    let selectedNotificationIndex = null;

    // -- FUNCTIONS

    async function handleDeleteNotification( notification )
    {
        isSubmitting = true;

        try
        {
            await fetchData( '/api/notification/delete',
                { method: 'POST', body: JSON.stringify( { notification } ) }
                );

            notificationArrayStore.update(
                ( _notificationArray ) => _notificationArray.filter(
                    ( _notification ) => _notification.id !== notification.id
                    )
                );
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isSubmitting = false;

            toggleNotificationModal();
        }
    }

    // ~~

    async function handleEditNotification( notification )
    {
        isSubmitting = true;

        try
        {
            await fetchData( '/api/notification/edit',
                { method: 'POST', body: JSON.stringify( { notification } ) }
                );

            $notificationArrayStore.update(
                ( _notificationArray ) => _notificationArray.map(
                    ( _notification ) => _notification.id === notification.id ? notification : _notification
                    )
                );
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isSubmitting = false;

            toggleNotificationModal();
        }

        toggleNotificationModal();
    }

    // ~~

    async function handleAddNotification( notification )
    {
        isSubmitting = true;

        try
        {
            notification.date = new Date( notification.date );

            await fetchData( '/api/notification/add',
                { method: 'POST', body: JSON.stringify( { notification } ), credentials: 'include' }
                );

            await loadNotificationArray();
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isSubmitting = false;

            toggleNotificationModal();
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadNotificationArray();

            for ( let key of Object.keys( filterParameterByKeyMap ) )
            {
                columnHeaderArray.push( filterParameterByKeyMap[ key ].name )
            }

            filterParameterByKeyMap.notificationMedium.optionArray = getOptionArray( $mediumArrayStore );
            filterParameterByKeyMap.notificationType.optionArray = getOptionArray( $typeArrayStore );

            isLoading = false;
        }
        );

    // ~~

    let notificatonArray = $derived($notificationArrayStore?.eventArray.map( ( _notification ) =>
        (
            {
                    id : _notification.id,
                    title : new TemplateEngine( _notification.variableMap.notification.subject, _notification.variableMap, $languageTagStore).render(),
                    message : new TemplateEngine( _notification.variableMap.notification.content, _notification.variableMap, $languageTagStore).render(),
                    notificationType : _notification.variableMap.notification.notificationType,
                    date : formatDate( _notification.sendAtTimestamp ),
                    notificationMedium : _notification.notificationMedium
                }
            )
        ));
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .page-container
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;
    }

    .manager-page
    {
        overflow-x: hidden;
        height: 93vh;
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .loading
    {
        height: 70%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        font-size: 1.5rem;
        font-weight: 700;
        color: grayColor100;
    }

    .main-section
    {
        width: 100%;
        padding: 0 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<div class="page-container">
    <Sidebar/>

    <div class="manager-page">
        {#if isLoading }
            <div class="loading">
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            </div>
        {:else}
            <main class="display-flex flex-direction-column gap-100 main-section">
                <NotificationModal
                    notification={ notificatonArray[ selectedNotificationIndex ?? 0 ] }
                    isEditing={ isEditing }
                    isSubmitting={ isSubmitting }
                    handleDeleteNotification={ handleDeleteNotification }
                    handleEditNotification={ handleEditNotification }
                    handleAddNotification={ handleAddNotification }
                />
                <NotificationHead/>
                <ToolBar
                    term={ searchTerm }
                    column={ searchColumn }
                    filterParameterByKeyMap={ filterParameterByKeyMap }
                    handleClick={ toggleNotificationModal }
                    label="add-notification-label"
                />
                <AdminTable
                    rowArray={ notificatonArray }
                    columnHeaderArray={ columnHeaderArray }
                    handleClick={ toggleNotificationModal }
                />
            </main>
        {/if}
    </div>
</div>

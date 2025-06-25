// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let notificationPermissionArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let notificationTypeArrayStore = writable( [] );
export let notificationMediumArrayStore = writable( [] );
export let selectedNotificationPermissionStore = writable( getInitialState() );
export let isNotificationPermissionLoading = writable( true );
export let errorMessage = writable( null );
export let hasMorePageStore = writable( false );
export let isNotificationPermissionModalOpen = writable( false );
export let
{
    addNavigationEventListener,
    finalizeNavigation,
    handleChange,
    interceptNavigation,
    isConfirmationModalOpen,
    isFormModified,
    pendingNavigation,
    removeNavigationEventListener,
    toggleConfirmModal
} = useConfirmationModal();
let url = '/admin/page/notification-permission';

// -- FUNCTIONS

export async function loadNotificationPermissionArray(
    page = 1,
    limit = 15
    )
{
    isNotificationPermissionLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '/list?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        notificationTypeArrayStore.set(
            response.notificationTypeArray
            );

        notificationMediumArrayStore.set(
            response.notificationMediumArray
            );

        hasMorePageStore.set(
            response.hasMorePage
            );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );

        let notificationPermissionArray = [];

        for ( let notificationPermission of response.notificationPermissionArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === notificationPermission.userId );
            let notificationType = response.notificationTypeArray.find( ( notificationType ) => notificationType.id === notificationPermission.TypeId );
            let notificationMedium = response.notificationMediumArray.find( ( notificationMedium ) => notificationMedium.id === notificationPermission.notificationMediumId );
            notificationPermission.userName = notificationPermission.userName ?? ( profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown' );
            notificationPermission.notificationType = notificationPermission.notificationType ?? ( notificationType ? notificationType.name : 'Unknown' );
            notificationPermission.notificationMedium = notificationPermission.notificationMedium ?? ( notificationMedium ? notificationMedium.name : 'Unknown' );
            notificationPermission.userProfile = profile;

            notificationPermissionArray = [ ...notificationPermissionArray, notificationPermission ];
        }

        if ( page === 1 )
        {
            notificationPermissionArrayStore.set(
                notificationPermissionArray
                );
        }
        else
        {
            notificationPermissionArrayStore.update(
                _notificationPermissionArray => _notificationPermissionArray.concat( notificationPermissionArray )
                );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isNotificationPermissionLoading.set( false );
    }
}

// ~~

export async function handleCreateNotificationPermission(
    finallyFunction = () => {}
    )
{
    notificationPermissionArrayStore.set(
        await handleCreateObject(
            notificationPermissionArrayStore,
            selectedNotificationPermissionStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditNotificationPermission(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetNotificationPermission = hasUserPermission( 'set-notification-permission' );

        if ( !hasSetNotificationPermission )
        {
            return;
        }

        let notificationPermissionData = get( selectedNotificationPermissionStore )
        let { id : notificationPermissionId, ...updatedNotificationPermission } = notificationPermissionData;

        let response = await fetchData(
            url + '/' + notificationPermissionId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { notificationPermissionData : updatedNotificationPermission } )
            }
            );

        notificationPermissionArrayStore.update(
            notificationPermissionArray =>
                notificationPermissionArray.map( notificationPermission => notificationPermission.id === notificationPermissionId
                    ? notificationPermissionData
                    : notificationPermission
                )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleNotificationPermissionModal();
    }
}

// ~~

export async function handleDeleteNotificationPermission(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveNotificationPermission = hasUserPermission( 'remove-notification-permission' );

        if ( !hasRemoveNotificationPermission )
        {
            return;
        }

        let notificationPermissionData = get( selectedNotificationPermissionStore )
        let { id : notificationPermissionId } = notificationPermissionData;

        let response = await fetchData(
            url + '/' + notificationPermissionId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        notificationPermissionArrayStore.update(
            notificationPermissionArray =>
                notificationPermissionArray.filter( notificationPermission => notificationPermission.id !== notificationPermissionId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleNotificationPermissionModal();
    }
}

export function toggleNotificationPermissionModal(
    )
{
    let isOpen = get( isNotificationPermissionModalOpen );
    isNotificationPermissionModalOpen.set( !isOpen );
    isOpen = get( isNotificationPermissionModalOpen );

    if ( !isOpen )
    {
        selectedNotificationPermissionStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    return (
        {
            id : null,
            notificationType : '',
            notificationMedium : '',
            isGranted : false,
            userId : null
        }
        );
}

// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { getJsonText, logError } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let notificationTypeArrayStore = writable( [] );
export let selectedNotificationTypeStore = writable( getInitialState() );
export let isNotificationTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isNotificationTypeModalOpen = writable( false );
export let isSubmitting = writable( false );
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
let url = '/admin/api/notification-type';

// -- FUNCTIONS

export async function loadNotificationTypeArray(
    )
{
    isNotificationTypeLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/notification-type',
            { method: 'POST', credentials: 'include' }
            );

        notificationTypeArrayStore.set(
            response
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isNotificationTypeLoading.set( false );
    }
}

// ~~

export async function handleCreateNotificationType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedNotificationTypeStore,
        url + '/add',
        finallyFunction,
        toggleNotificationTypeModal,
        loadNotificationTypeArray,
        'add-notification-type',
        isSubmitting
        );
}

// ~~

export async function handleEditNotificationType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedNotificationTypeStore,
        url + '/set/',
        finallyFunction,
        toggleNotificationTypeModal,
        loadNotificationTypeArray,
        'set-notification-type',
        isSubmitting
        );
}

// ~~

export async function handleDeleteNotificationType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedNotificationTypeStore,
        url + '/remove/',
        finallyFunction,
        toggleNotificationTypeModal,
        loadNotificationTypeArray,
        'remove-notification-type',
        isSubmitting
        );
}

// ~~

export function toggleNotificationTypeModal(
    )
{
    let isOpen = get( isNotificationTypeModalOpen );
    isNotificationTypeModalOpen.set( !isOpen );
    isOpen = get( isNotificationTypeModalOpen );

    if ( !isOpen )
    {
        selectedNotificationTypeStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let notificationTypeArray = get( notificationTypeArrayStore );
    let notificationTypeCount = notificationTypeArray.length;

    return (
        {
            id : null,
            number : notificationTypeCount + 1,
            name : ''
        }
        );
}

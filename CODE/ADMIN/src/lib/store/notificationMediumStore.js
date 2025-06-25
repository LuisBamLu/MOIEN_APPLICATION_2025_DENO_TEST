// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { getJsonText, logError } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let notificationMediumArrayStore = writable( [] );
export let selectedNotificationMediumStore = writable( getInitialState() );
export let isNotificationMediumLoading = writable( true );
export let errorMessage = writable( null );
export let isNotificationMediumModalOpen = writable( false );
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
let url = '/admin/api/notification-medium';

// -- FUNCTIONS

export async function loadNotificationMediumArray(
    )
{
    isNotificationMediumLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/notification-medium',
            { method: 'POST', credentials: 'include' }
            );

        notificationMediumArrayStore.set(
            response
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isNotificationMediumLoading.set( false );
    }
}

// ~~

export async function handleCreateNotificationMedium(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedNotificationMediumStore,
        url + '/add',
        finallyFunction,
        toggleNotificationMediumModal,
        loadNotificationMediumArray,
        'add-notification-medium',
        isSubmitting
        );
}

// ~~

export async function handleEditNotificationMedium(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedNotificationMediumStore,
        url + '/set/',
        finallyFunction,
        toggleNotificationMediumModal,
        loadNotificationMediumArray,
        'set-notification-medium',
        isSubmitting
        );
}

// ~~

export async function handleDeleteNotificationMedium(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedNotificationMediumStore,
        url + '/remove/',
        finallyFunction,
        toggleNotificationMediumModal,
        loadNotificationMediumArray,
        'remove-notification-medium',
        isSubmitting
        );
}

// ~~

export function toggleNotificationMediumModal(
    )
{
    let isOpen = get( isNotificationMediumModalOpen );
    isNotificationMediumModalOpen.set( !isOpen );
    isOpen = get( isNotificationMediumModalOpen );

    if ( !isOpen )
    {
        selectedNotificationMediumStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let notificationMediumArray = get( notificationMediumArrayStore );
    let notificationMediumCount = notificationMediumArray.length;

    return (
        {
            id : null,
            number : notificationMediumCount + 1,
            name : ''
        }
        );
}

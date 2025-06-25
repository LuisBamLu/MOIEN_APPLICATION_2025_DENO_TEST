// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { getJsonText, logError } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let connectionStore = writable( null );
export let connectionArrayStore = writable( [] );
export let selectedConnectionStore = writable( getInitialState() );
export let isConnectionLoading = writable( true );
export let errorMessage = writable( null );
export let isConnectionModalOpen = writable( false );
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
let url = '/admin/page/connection';

// -- FUNCTIONS

export async function loadConnectionArray(
    )
{
    isConnectionLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '/list?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { type: 'getConnectionArray' } ) }
        );

        connectionArrayStore.set(
            response.connectionArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isConnectionLoading.set( false );
    }
}

// ~~

export async function handleCreateConnection(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedConnectionStore,
        url + '/add',
        finallyFunction,
        toggleConnectionModal,
        loadConnectionArray,
        'add-connection',
        isSubmitting
        );
}

// ~~

export async function handleEditConnection(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedConnectionStore,
        url + '/set/',
        finallyFunction,
        toggleConnectionModal,
        loadConnectionArray,
        'set-connection',
        isSubmitting
        );
}

// ~~

export async function handleDeleteConnection(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedConnectionStore,
        url + '/remove/',
        finallyFunction,
        toggleConnectionModal,
        loadConnectionArray,
        'remove-connection',
        isSubmitting
        );
}

export function toggleConnectionModal(
    )
{
    let isOpen = get( isConnectionModalOpen );
    isConnectionModalOpen.set( !isOpen );
    isOpen = get( isConnectionModalOpen );

    if ( !isOpen )
    {
        selectedConnectionStore.set( getInitialState() );
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
            browserAddress : '0.0.0.0',
            isFailed: false,
            attemptCount: 0
        }
        );
}

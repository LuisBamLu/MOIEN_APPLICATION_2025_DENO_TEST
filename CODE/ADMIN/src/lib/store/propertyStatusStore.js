// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';

// -- VARIABLES

export let propertyStatusArrayStore = writable( [] );
export let selectedPropertyStatusStore = writable( getInitialState() );
export let isPropertyStatusLoading = writable( true );
export let errorMessage = writable( null );
export let isPropertyStatusModalOpen = writable( false );
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
let url = '/admin/api/property-status';

// -- FUNCTIONS

export async function loadPropertyStatusArray(
    )
{
    isPropertyStatusLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/property-status/get',
            { method: 'POST', credentials: 'include' }
        );

        propertyStatusArrayStore.set(
            response.propertyStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPropertyStatusLoading.set( false );
    }
}

// ~~

export async function handleCreatePropertyStatus(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedPropertyStatusStore,
        url + '/add',
        finallyFunction,
        togglePropertyStatusModal,
        loadPropertyStatusArray,
        'add-property-status',
        isSubmitting
        );
}

// ~~

export async function handleEditPropertyStatus(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedPropertyStatusStore,
        url + '/set/',
        finallyFunction,
        togglePropertyStatusModal,
        loadPropertyStatusArray,
        'set-property-status',
        isSubmitting
        );
}

// ~~

export async function handleDeletePropertyStatus(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedPropertyStatusStore,
        url + '/remove/',
        finallyFunction,
        togglePropertyStatusModal,
        loadPropertyStatusArray,
        'remove-property-status',
        isSubmitting
        );
}

export function togglePropertyStatusModal(
    )
{
    let isOpen = get( isPropertyStatusModalOpen );
    isPropertyStatusModalOpen.set( !isOpen );
    isOpen = get( isPropertyStatusModalOpen );

    if ( !isOpen )
    {
        selectedPropertyStatusStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let propertyStatusArray = get( propertyStatusArrayStore );
    let propertyStatusCount = propertyStatusArray.length;

    return (
        {
            id : null,
            number : propertyStatusCount + 1,
            name : '',
            color : ''
        }
        );
}

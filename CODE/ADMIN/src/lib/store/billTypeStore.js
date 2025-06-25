// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { getJsonText, logError } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let billTypeArrayStore = writable( [] );
export let selectedBillTypeStore = writable( getInitialState() );
export let isBillTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isBillTypeModalOpen = writable( false );
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
let url = '/admin/api/bill-type';

// -- FUNCTIONS

export async function loadBillTypeArray(
    )
{
    isBillTypeLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/bill-type',
            { method: 'POST', credentials: 'include' }
        );

        billTypeArrayStore.set(
            response.billTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isBillTypeLoading.set( false );
    }
}

// ~~

export async function handleCreateBillType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedBillTypeStore,
        url + '/add',
        finallyFunction,
        toggleBillTypeModal,
        loadBillTypeArray,
        'add-bill-type',
        isSubmitting
        );
}

// ~~

export async function handleEditBillType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedBillTypeStore,
        url + '/set/',
        finallyFunction,
        toggleBillTypeModal,
        loadBillTypeArray,
        'set-bill-type',
        isSubmitting
        );
}

// ~~

export async function handleDeleteBillType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedBillTypeStore,
        url + '/remove/',
        finallyFunction,
        toggleBillTypeModal,
        loadBillTypeArray,
        'remove-bill-type',
        isSubmitting
        );
}

export function toggleBillTypeModal(
    )
{
    let isOpen = get( isBillTypeModalOpen );
    isBillTypeModalOpen.set( !isOpen );
    isOpen = get( isBillTypeModalOpen );

    if ( !isOpen )
    {
        selectedBillTypeStore.set( getInitialState() );
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
            title : ''
        }
        );
}

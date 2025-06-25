// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, isDefinedAndNotNull } from '$lib/base';
import { getJsonObject, getJsonText, getLocalizedTextBySlug, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { useConfirmationModal } from '$lib/confirmation_modal';

// -- VARIABLES

export let cancellationPolicyArrayStore = writable( [] );
export let selectedCancellationPolicyStore = writable( getInitialState() );
export let isCancellationPolicyLoading = writable( true );
export let errorMessage = writable( null );
export let isCancellationPolicyModalOpen = writable( false );
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
let url = '/admin/api/cancellation-policy';

// -- FUNCTIONS

export async function loadCancellationPolicyArray(
    )
{
    isCancellationPolicyLoading.set( true );

    try
    {
        let response = await fetchData(
            url + '/list',
            { method: 'POST', credentials: 'include' }
        );

        cancellationPolicyArrayStore.set(
            response.cancellationPolicyArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isCancellationPolicyLoading.set( false );
    }
}

// ~~

export async function handleCreateCancellationPolicy(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedCancellationPolicyStore,
        url + '/add',
        finallyFunction,
        toggleCancellationPolicyModal,
        loadCancellationPolicyArray,
        'add-cancellation-policy',
        isSubmitting
        );
}

// ~~

export async function handleEditCancellationPolicy(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedCancellationPolicyStore,
        url + '/set/',
        finallyFunction,
        toggleCancellationPolicyModal,
        loadCancellationPolicyArray,
        'set-cancellation-policy',
        isSubmitting
        );
}

// ~~

export async function handleDeleteCancellationPolicy(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedCancellationPolicyStore,
        url + '/remove/',
        finallyFunction,
        toggleCancellationPolicyModal,
        loadCancellationPolicyArray,
        'remove-cancellation-policy',
        isSubmitting
        );
}

// ~~

export function toggleCancellationPolicyModal(
    )
{
    let isOpen = get( isCancellationPolicyModalOpen );
    isCancellationPolicyModalOpen.set( !isOpen );
    isOpen = get( isCancellationPolicyModalOpen );

    if ( !isOpen )
    {
        selectedCancellationPolicyStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let cancellationPolicyArray = get( cancellationPolicyArrayStore );
    let cancellationPolicyCount = cancellationPolicyArray.length;

    return (
        {
            id : null,
            number : cancellationPolicyCount + 1,
            name : '',
            partialRefundMinimumDayCount: 0,
            partialRefundRatio: 0,
            fullRefundMinimumDayCount: 0,
            penaltyDayCount: 0,
        }
        );
}

// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getTextSlug, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, logError } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let paymentTypeArrayStore = writable( [] );
export let selectedPaymentTypeStore = writable( getInitialState() );
export let isPaymentTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isPaymentTypeModalOpen = writable( false );
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
let url = '/admin/api/payment-type';

// -- FUNCTIONS

export async function loadPaymentTypeArray(
    )
{
    isPaymentTypeLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/payment-type',
            { method: 'POST', credentials: 'include' }
        );

        paymentTypeArrayStore.set(
            response.paymentTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPaymentTypeLoading.set( false );
    }
}

// ~~

export async function handleCreatePaymentType(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedPaymentTypeStore,
        url + '/add',
        finallyFunction,
        togglePaymentTypeModal,
        loadPaymentTypeArray,
        'add-document-type',
        isSubmitting
        );
}

// ~~

export async function handleEditPaymentType(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedPaymentTypeStore,
        url + '/set/',
        finallyFunction,
        togglePaymentTypeModal,
        loadPaymentTypeArray,
        'set-document-type',
        isSubmitting
        );
}

// ~~

export async function handleDeletePaymentType(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedPaymentTypeStore,
        url + '/remove/',
        finallyFunction,
        togglePaymentTypeModal,
        loadPaymentTypeArray,
        'remove-document-type',
        isSubmitting
        );
}

// ~~

export function togglePaymentTypeModal(
    )
{
    let isOpen = get( isPaymentTypeModalOpen );
    isPaymentTypeModalOpen.set( !isOpen );
    isOpen = get( isPaymentTypeModalOpen );

    if ( !isOpen )
    {
        selectedPaymentTypeStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let paymentTypeArray = get( paymentTypeArrayStore );
    let paymentTypeCount = paymentTypeArray.length;

    return (
        {
            id : null,
            number : paymentTypeCount + 1,
            name : ''
        }
        );
}

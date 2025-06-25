// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';

// -- VARIABLES

export let paymentStatusArrayStore = writable( [] );
export let selectedPaymentStatusStore = writable( getInitialState() );
export let isPaymentStatusLoading = writable( true );
export let errorMessage = writable( null );
export let isPaymentStatusModalOpen = writable( false );
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
let url = '/api/admin/page/payment-status';

// -- FUNCTIONS

export async function loadPaymentStatusArray(
    )
{
    isPaymentStatusLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        let paymentStatusArray = [];

        for ( let paymentStatus of response.paymentStatusArray )
        {
            paymentStatus.color = paymentStatus.color || 'N/A';
            paymentStatusArray.push( paymentStatus );
        }

        paymentStatusArrayStore.set(
            paymentStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPaymentStatusLoading.set( false );
    }
}

// ~~

export async function handleCreatePaymentStatus(
    finallyFunction = () => {}
    )
{
    paymentStatusArrayStore.set(
        await handleCreateObject(
            paymentStatusArrayStore,
            selectedPaymentStatusStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditPaymentStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetPaymentStatusPermission = hasUserPermission( 'set-payment-status' );

        if ( !hasSetPaymentStatusPermission )
        {
            return;
        }

        let paymentStatusData = get( selectedPaymentStatusStore )
        let { id : paymentStatusId, ...updatedPaymentStatus } = paymentStatusData;

        let response = await fetchData(
            url + '/' + paymentStatusId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { paymentStatusData : updatedPaymentStatus } )
            }
            );

        paymentStatusArrayStore.update(
            paymentStatusArray =>
                paymentStatusArray.map( paymentStatus => paymentStatus.id === paymentStatusId
                    ? paymentStatusData
                    : paymentStatus
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
        togglePaymentStatusModal();
    }
}

// ~~

export async function handleDeletePaymentStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemovePaymentStatusPermission = hasUserPermission( 'remove-payment-status' );

        if ( !hasRemovePaymentStatusPermission )
        {
            return;
        }

        let paymentStatusData = get( selectedPaymentStatusStore )
        let { id : paymentStatusId } = paymentStatusData;

        let response = await fetchData(
            url + '/' + paymentStatusId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        paymentStatusArrayStore.update(
            paymentStatusArray =>
                paymentStatusArray.filter( paymentStatus => paymentStatus.id !== paymentStatusId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        togglePaymentStatusModal();
    }
}

export function togglePaymentStatusModal(
    )
{
    let isOpen = get( isPaymentStatusModalOpen );
    isPaymentStatusModalOpen.set( !isOpen );
    isOpen = get( isPaymentStatusModalOpen );

    if ( !isOpen )
    {
        selectedPaymentStatusStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let paymentStatusArray = get( paymentStatusArrayStore );
    let paymentStatusCount = paymentStatusArray.length;

    return (
        {
            id : null,
            number : paymentStatusCount + 1,
            name :  '',
            color : ''
        }
        );
}

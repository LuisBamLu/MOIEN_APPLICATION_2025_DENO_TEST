// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '../toast';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let paymentMethodStatusArrayStore = writable( [] );
export let selectedPaymentMethodStatusStore = writable( getInitialState() );
export let isPaymentMethodStatusLoading = writable( true );
export let errorMessage = writable( null );
export let isPaymentMethodStatusModalOpen = writable( false );
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
let url = '/api/admin/page/payment-method-status';

// -- FUNCTIONS

export async function loadPaymentMethodStatusArray(
    )
{
    isPaymentMethodStatusLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        paymentMethodStatusArrayStore.set(
            response.paymentMethodStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPaymentMethodStatusLoading.set( false );
    }
}

// ~~

export async function handleCreatePaymentMethodStatus(
    finallyFunction = () => {}
    )
{
    paymentMethodStatusArrayStore.set(
        await handleCreateObject(
            paymentMethodStatusArrayStore,
            selectedPaymentMethodStatusStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditPaymentMethodStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetPaymentMethodStatusPermission = hasUserPermission( 'set-payment-method-status' );

        if ( !hasSetPaymentMethodStatusPermission )
        {
            return;
        }

        let paymentMethodStatusData = get( selectedPaymentMethodStatusStore )
        let { id : paymentMethodStatusId, ...updatedPaymentMethodStatus } = paymentMethodStatusData;

        let response = await fetchData(
            url + '/' + paymentMethodStatusId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { paymentMethodStatusData : updatedPaymentMethodStatus } )
            }
            );

        paymentMethodStatusArrayStore.update(
            paymentMethodStatusArray =>
                paymentMethodStatusArray.map( paymentMethodStatus => paymentMethodStatus.id === paymentMethodStatusId
                    ? paymentMethodStatusData
                    : paymentMethodStatus
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
        togglePaymentMethodStatusModal();
    }
}

// ~~

export async function handleDeletePaymentMethodStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemovePaymentMethodStatusPermission = hasUserPermission( 'remove-payment-method-status' );

        if ( !hasRemovePaymentMethodStatusPermission )
        {
            return;
        }

        let paymentMethodStatusData = get( selectedPaymentMethodStatusStore )
        let { id : paymentMethodStatusId } = paymentMethodStatusData;

        let response = await fetchData(
            url + '/' + paymentMethodStatusId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        paymentMethodStatusArrayStore.update(
            paymentMethodStatusArray =>
                paymentMethodStatusArray.filter( paymentMethodStatus => paymentMethodStatus.id !== paymentMethodStatusId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        togglePaymentMethodStatusModal();
    }
}

export function togglePaymentMethodStatusModal(
    )
{
    let isOpen = get( isPaymentMethodStatusModalOpen );
    isPaymentMethodStatusModalOpen.set( !isOpen );
    isOpen = get( isPaymentMethodStatusModalOpen );

    if ( !isOpen )
    {
        selectedPaymentMethodStatusStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let paymentMethodStatusArray = get( paymentMethodStatusArrayStore );
    let paymentMethodStatusCount = paymentMethodStatusArray.length;

    return (
        {
            id : null,
            number : paymentMethodStatusCount + 1,
            name :  '',
            color : ''
        }
        );
}

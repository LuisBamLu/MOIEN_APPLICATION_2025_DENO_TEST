// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';

// -- VARIABLES

export let paymentMethodTypeArrayStore = writable( null );
export let selectedPaymentMethodTypeStore = writable( null );
export let isPaymentMethodTypeLoading = writable( true );
export let errorMessage = writable( null );
export let isPaymentMethodTypeModalOpen = writable( false );
let url = '/api/payment-method-type';

// -- FUNCTIONS

export async function loadPaymentMethodTypeArray(
    )
{
    isPaymentMethodTypeLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        paymentMethodTypeArrayStore.set(
            response.paymentMethodTypeArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPaymentMethodTypeLoading.set( false );
    }
}

// ~~

export async function handleCreatePaymentMethodType(
    finallyFunction = () => {}
    )
{
    paymentMethodTypeArrayStore.set(
        await handleCreateObject(
            paymentMethodTypeArrayStore,
            selectedPaymentMethodTypeStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditPaymentMethodType(
    finallyFunction = () => {}
    )
{
    paymentMethodTypeArrayStore.set(
        await handleEditObject(
            paymentMethodTypeArrayStore,
            selectedPaymentMethodTypeStore,
            url + '/set',
            finallyFunction
            )
        );
}

// ~~

export async function handleDeletePaymentMethodType(
    finallyFunction = () => {}
    )
{
    paymentMethodTypeArrayStore.set(
        await handleDeleteObject(
            paymentMethodTypeArrayStore,
            selectedPaymentMethodTypeStore,
            url + '/delete',
            finallyFunction
            )
        );
}

export function togglePaymentMethodTypeModal(
    )
{
    let isOpen = get( isPaymentMethodTypeModalOpen );
    isPaymentMethodTypeModalOpen.set( !isOpen );
}

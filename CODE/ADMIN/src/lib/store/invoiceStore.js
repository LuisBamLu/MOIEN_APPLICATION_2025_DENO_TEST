// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '$lib/toast';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let invoiceArrayStore = writable( [] );
export let currencyArrayStore = writable( [] );
export let billArrayStore = writable( [] );
export let billLineArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let selectedInvoiceStore = writable( getInitialState() );
export let isInvoiceLoading = writable( true );
export let errorMessage = writable( null );
export let isInvoiceModalOpen = writable( false );
export let hasMorePage = writable( false );
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
let url = '/api/admin/page/invoice';

// -- FUNCTIONS

export async function loadInvoiceArray(
    page = 1,
    limit = 15
    )
{
    isInvoiceLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        invoiceArrayStore.set(
            response.invoiceArray
            );

        currencyArrayStore.set(
            response.currencyArray
            );

        billArrayStore.set(
            response.billArray
            );

        hasMorePage.set( response.hasMorePage );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( billLineArrayStore, response.billLineArray );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isInvoiceLoading.set( false );
    }
}

// ~~

export async function handleAddInvoice(
    finallyFunction = () => {}
    )
{
    invoiceArrayStore.set(
        await handleCreateObject(
            invoiceArrayStore,
            selectedInvoiceStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditInvoice(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetInvoicePermission = hasUserPermission( 'set-invoice' );

        if ( !hasSetInvoicePermission )
        {
            return;
        }

        let invoiceData = get( selectedInvoiceStore )
        let { id : invoiceId, ...updatedInvoice } = invoiceData;

        let response = await fetchData(
            url + '/' + invoiceId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { invoiceData : updatedInvoice } )
            }
            );

        invoiceArrayStore.update(
            invoiceArray =>
                invoiceArray.map( invoice => invoice.id === invoiceId
                    ? invoiceData
                    : invoice
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
        toggleInvoiceModal();
    }
}

// ~~

export async function handleDeleteInvoice(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveInvoicePermission = hasUserPermission( 'remove-invoice' );

        if ( !hasRemoveInvoicePermission )
        {
            return;
        }

        let invoiceData = get( selectedInvoiceStore )
        let { id : invoiceId } = invoiceData;

        let response = await fetchData(
            url + '/' + invoiceId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        invoiceArrayStore.update(
            invoiceArray =>
                invoiceArray.filter( invoice => invoice.id !== invoiceId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleInvoiceModal();
    }
}

export function toggleInvoiceModal(
    )
{
    let isOpen = get( isInvoiceModalOpen );
    isInvoiceModalOpen.set( !isOpen );
    isOpen = get( isInvoiceModalOpen );

    if ( !isOpen )
    {
        selectedInvoiceStore.set( getInitialState() );
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
            title : '',
            currencyCode : '',
            billIdArray : [],
            userId : null
        }
        );
}

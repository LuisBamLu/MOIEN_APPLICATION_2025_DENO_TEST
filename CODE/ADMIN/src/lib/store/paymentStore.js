// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, formatDate, getFormattedPrice, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { getJsonText, getLocalizedTextBySlug, getMap } from 'senselogic-gist';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { hasUserPermission } from './profileStore';
import { toast } from '$lib/toast';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let paymentArrayStore = writable( [] );
export let paymentMethodArrayStore = writable( [] );
export let paymentTypeArrayStore = writable( [] );
export let paymentStatusArrayStore = writable( [] );
export let currencyCodeArrayStore = writable( [] );
export let profileArrayStore = writable( [] );
export let selectedPaymentStore = writable( getInitialState() );
export let isPaymentLoading = writable( true );
export let errorMessage = writable( null );
export let isPaymentModalOpen = writable( false );
export let hasMorePage = writable( false );
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
let url = '/api/admin/page/payment';

// -- FUNCTIONS

export async function loadPaymentArray(
    page = 1,
    limit = 15
    )
{
    isPaymentLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        let paymentArray = [];

        for ( let payment of response.paymentArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === payment.userId );
            let type = response.paymentTypeArray.find( ( type ) => type.id === payment.typeId );
            let status = response.paymentStatusArray.find( ( status ) => status.id === payment.statusId );
            let payer = response.profileArray.find( ( payer ) => payer.userId === payment.payerUserProfileId );
            let payee = response.profileArray.find( ( payee ) => payee.userId === payment.payeeUserProfileId );
            let currency = response.currencyArray.find( ( currency ) => currency.code === payment.currencyCode );

            paymentArray.push(
                {
                    ...payment,
                    userName: profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown',
                    type: type ? type.name : 'Unknown',
                    status: status ? status.name : 'Unknown',
                    payerUserProfileName: payer ? `${ payer.firstName } ${ payer.lastName }` : 'Unknown',
                    payeeUserProfileName: payee ? `${ payee.firstName } ${ payee.lastName }` : 'Unknown',
                    userProfileName: profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown',
                    userProfile : profile,
                    payeeProfile : payee,
                    payerProfile : payer,
                    currencyName: currency ? currency.singularName : 'Unknown',
                    formattedInvoiceDate: payment.invoiceDate ? formatDate( payment.invoiceDate ) : 'DD/MM/YYYY',
                    formattedDueDate: payment.dueDate ? formatDate( payment.dueDate ) : 'DD/MM/YYYY',
                    formattedAmount: getFormattedPrice( payment.amount || 0 ),
                }
                );
        }

        if ( page === 1 )
        {
            paymentArrayStore.set( paymentArray );
        }
        else
        {
            paymentArrayStore.update(
                ( _paymentArray ) => _paymentArray.concat( paymentArray )
                );
        }

        paymentTypeArrayStore.set( response.paymentTypeArray );

        currencyCodeArrayStore.set( response.currencyArray );

        paymentStatusArrayStore.set( response.paymentStatusArray );

        profileArrayStore.update(
            ( profileArray ) =>
            {
                let newProfileArray = profileArray.concat( response.profileArray );
                let profileByUserIdMap = getMap( newProfileArray, 'userId' );

                return Object.values( profileByUserIdMap );
            }
            );

        paymentMethodArrayStore.set( response.paymentMethodArray );

        hasMorePage.set(
            response.hasMorePage
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isPaymentLoading.set( false );
    }
}

// ~~

export async function handleCreatePayment(
    finallyFunction = () => {}
    )
{
    await handleCreateObject(
        selectedPaymentStore,
        url + '/add',
        finallyFunction,
        togglePaymentModal,
        loadPaymentArray,
        'add-payment',
        isSubmitting
        );
}

// ~~

export async function handleEditPayment(
    finallyFunction = () => {}
    )
{
    await handleEditObject(
        selectedPaymentStore,
        url + '/set/',
        finallyFunction,
        togglePaymentModal,
        loadPaymentArray,
        'set-payment',
        isSubmitting
        );
}

// ~~

export async function handleDeletePayment(
    finallyFunction = () => {}
    )
{
    await handleDeleteObject(
        selectedPaymentStore,
        url + '/remove/',
        finallyFunction,
        togglePaymentModal,
        loadPaymentArray,
        'remove-payment',
        isSubmitting
        );
}

export function togglePaymentModal(
    )
{
    let isOpen = get( isPaymentModalOpen );
    isPaymentModalOpen.set( !isOpen );
    isOpen = get( isPaymentModalOpen );

    if ( !isOpen )
    {
        selectedPaymentStore.set( getInitialState() );
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
            typeId: null,
            methodId: null,
            payerUserProfileId: null,
            payeeUserProfileId: null,
            amount: 0,
            currencyCode: null,
            invoiceDate: null,
            dueDate: null,
            transactionId: null,
            mangopayId: null,
            statusId: null,
            userId: null
        }
        );
}

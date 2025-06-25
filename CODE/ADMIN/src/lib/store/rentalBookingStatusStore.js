// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
import { toast } from '../toast';
import { hasUserPermission } from './profileStore';

// -- VARIABLES

export let rentalBookingStatusArrayStore = writable( [] );
export let selectedRentalBookingStatusStore = writable( getInitialState() );
export let isRentalBookingStatusLoading = writable( true );
export let errorMessage = writable( null );
export let isRentalBookingStatusModalOpen = writable( false );
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
let url = '/api/admin/page/rental-booking-status';

// -- FUNCTIONS

export async function loadRentalBookingStatusArray(
    )
{
    isRentalBookingStatusLoading.set( true );

    try
    {
        let response = await fetchData(
            url,
            { method: 'POST', credentials: 'include' }
        );

        rentalBookingStatusArrayStore.set(
            response.rentalBookingStatusArray
            );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isRentalBookingStatusLoading.set( false );
    }
}

// ~~

export async function handleCreateRentalBookingStatus(
    finallyFunction = () => {}
    )
{
    rentalBookingStatusArrayStore.set(
        await handleCreateObject(
            rentalBookingStatusArrayStore,
            selectedRentalBookingStatusStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditRentalBookingStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetRentalBookingStatusPermission = hasUserPermission( 'set-rental-booking-status' );

        if ( !hasSetRentalBookingStatusPermission )
        {
            return;
        }

        let rentalBookingStatusData = get( selectedRentalBookingStatusStore )
        let { id : rentalBookingStatusId, ...updatedRentalBookingStatus } = rentalBookingStatusData;

        let response = await fetchData(
            url + '/' + rentalBookingStatusId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { rentalBookingStatusData : updatedRentalBookingStatus } )
            }
            );

        rentalBookingStatusArrayStore.update(
            rentalBookingStatusArray =>
                rentalBookingStatusArray.map( rentalBookingStatus => rentalBookingStatus.id === rentalBookingStatusId
                    ? rentalBookingStatusData
                    : rentalBookingStatus
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
        toggleRentalBookingStatusModal();
    }
}

// ~~

export async function handleDeleteRentalBookingStatus(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveRentalBookingStatusPermission = hasUserPermission( 'remove-rental-booking-status' );

        if ( !hasRemoveRentalBookingStatusPermission )
        {
            return;
        }

        let rentalBookingStatusData = get( selectedRentalBookingStatusStore )
        let { id : rentalBookingStatusId } = rentalBookingStatusData;

        let response = await fetchData(
            url + '/' + rentalBookingStatusId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        rentalBookingStatusArrayStore.update(
            rentalBookingStatusArray =>
                rentalBookingStatusArray.filter( rentalBookingStatus => rentalBookingStatus.id !== rentalBookingStatusId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleRentalBookingStatusModal();
    }
}

export function toggleRentalBookingStatusModal(
    )
{
    let isOpen = get( isRentalBookingStatusModalOpen );
    isRentalBookingStatusModalOpen.set( !isOpen );
    isOpen = get( isRentalBookingStatusModalOpen );

    if ( !isOpen )
    {
        selectedRentalBookingStatusStore.set( getInitialState() );
        isFormModified.set( false );
    }
}

// ~~

function getInitialState(
    )
{
    let rentalBookingStatusArray = get( rentalBookingStatusArrayStore );
    let rentalBookingStatusCount = rentalBookingStatusArray.length;

    return (
        {
            id : null,
            number : rentalBookingStatusCount + 1,
            name : ''
        }
        );
}

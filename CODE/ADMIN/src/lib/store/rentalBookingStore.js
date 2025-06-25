// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, getFormattedPrice, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { useConfirmationModal } from '$lib/confirmation_modal';
import { toast } from '$lib/toast';
import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
import { hasUserPermission } from './profileStore';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let errorMessage = writable( null );
export let isRentalBookingLoading = writable( true );
export let isRentalBookingModalOpen = writable( false );
export let hasMorePageStore = writable( false );
export let profileArrayStore = writable( [] );
export let rentalBookingArrayStore = writable( [] );
export let cancellationPolicyArrayStore = writable( [] );
export let selectedRentalBookingStore = writable( getInitialState() );
export let propertyArrayStore = writable( [] );
export let rentalBookingStatusArrayStore = writable( [] );
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
let url = '/api/admin/page/rental-booking';

// -- FUNCTIONS

export async function loadRentalBookingArray(
    page = 1,
    limit = 10
    )
{
    isRentalBookingLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );

        rentalBookingStatusArrayStore.set(
            response.rentalBookingStatusArray
            );

        cancellationPolicyArrayStore.set(
            response.cancellationPolicyArray
            );

        hasMorePageStore.set(
            response.hasMorePage
            );

        let rentalBookingArray = [];

        for ( let rentalBooking of response.rentalBookingArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === rentalBooking.userId );
            let property = response.propertyArray.find( ( property ) => property.id === rentalBooking.propertyId );
            let status = response.rentalBookingStatusArray.find( ( status ) => status.id === rentalBooking.status );
            rentalBooking.userName = profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown';
            rentalBooking.propertyTitle = property ? getLocalizedText( property.title ) : 'Unknown';
            rentalBooking.profile = profile;
            rentalBooking.property = property;
            rentalBooking.formattedTotalPrice = getFormattedPrice( rentalBooking.totalPrice || 0 );
            rentalBooking.isNonRefundable = Boolean( rentalBooking.isNonRefundable );
            rentalBooking.statusName = getLocalizedText( status?.name ?? '' );

            rentalBookingArray.push( rentalBooking );
        }

        if ( page === 1 )
        {
            rentalBookingArrayStore.set(
                rentalBookingArray
                );
        }
        else
        {
            rentalBookingArrayStore.update(
                _rentalBookingArray => _rentalBookingArray.concat( rentalBookingArray )
                );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isRentalBookingLoading.set( false );
    }
}

// ~~

export async function handleCreateRentalBooking(
    finallyFunction = () => {}
    )
{
    rentalBookingArrayStore.set(
        await handleCreateObject(
            rentalBookingArrayStore,
            selectedRentalBookingStore,
            url + '/add',
            finallyFunction
            )
        );
}

// ~~

export async function handleEditRentalBooking(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetRentalBookingPermission = hasUserPermission( 'set-rental-booking' );

        if ( !hasSetRentalBookingPermission )
        {
            return;
        }

        let rentalBookingData = get( selectedRentalBookingStore )
        let { id : rentalBookingId, ...updatedRentalBooking } = rentalBookingData;

        let response = await fetchData(
            url + '/' + rentalBookingId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { rentalBookingData : updatedRentalBooking } )
            }
            );

        rentalBookingArrayStore.update(
            rentalBookingArray =>
                rentalBookingArray.map( rentalBooking => rentalBooking.id === rentalBookingId
                    ? rentalBookingData
                    : rentalBooking
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
        toggleRentalBookingModal();
    }
}

// ~~

export async function handleDeleteRentalBooking(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasRemoveRentalBookingPermission = hasUserPermission( 'remove-rental-booking' );

        if ( !hasRemoveRentalBookingPermission )
        {
            return;
        }

        let rentalBookingData = get( selectedRentalBookingStore )
        let { id : rentalBookingId } = rentalBookingData;

        let response = await fetchData(
            url + '/' + rentalBookingId + '/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( {} )
            }
            );

        rentalBookingArrayStore.update(
            rentalBookingArray =>
                rentalBookingArray.filter( rentalBooking => rentalBooking.id !== rentalBookingId )
            );
    }
    catch( error )
    {
        console.log( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleRentalBookingModal();
    }
}

// ~~

export function toggleRentalBookingModal(
    )
{
    let isOpen = get( isRentalBookingModalOpen );
    isRentalBookingModalOpen.set( !isOpen );
    isOpen = get( isRentalBookingModalOpen );

    if ( !isOpen )
    {
        selectedRentalBookingStore.set( getInitialState() );
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
            propertyId: null,
            guestCount: 0,
            arrivalDate: '',
            arrivalTime: null,
            departureDate: '',
            departureTime: null,
            dayCount: 0,
            cleaningFee: null,
            sheetsFee: null,
            towelsFee: null,
            otherFee: null,
            donation: 0,
            carbonCompensationDonation: null,
            totalPrice: 0,
            cancellationPolicyId: null,
            isNonRefundable: null,
            status: '',
            userId: null,
        }
        );
}

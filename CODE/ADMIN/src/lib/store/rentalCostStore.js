// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { urlParamsStore } from './urlParamsStore';
import { getJsonText, getLocalizedText, getLocalizedTextBySlug, logError } from 'senselogic-gist';
import { currencyArrayStore } from './currencyArrayStore';
import { useConfirmationModal } from '../confirmation_modal';
import { hasUserPermission } from './profileStore';
import { toast } from '../toast';

// -- VARIABLES

export let errorMessage = writable( null );
export let isRentalCostLoading = writable( true );
export let isRentalCostModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let selectedRentalCostStore = writable( getInitialState() );
export let propertyArrayStore = writable( [] );
export let rentalCostArrayStore = writable( [] );
export let rentalCostTypeArrayStore = writable( [] );
export let rentalCostFrequencyArrayStore = writable( [] );
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
let url = '/api/admin/page/rental-cost';

// -- FUNCTIONS

export async function loadRentalCostArray(
    page = 1,
    limit = 15
    )
{
    isRentalCostLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );

        rentalCostTypeArrayStore.set(
            response.rentalCostTypeArray
            );

        rentalCostFrequencyArrayStore.set(
            response.rentalCostFrequencyArray
            );

        hasMorePage.set(
            response.hasMorePage
            );

        currencyArrayStore.set(
            response.currencyArray
            );

        if ( page === 1 )
        {
            rentalCostArrayStore.set(
                response.rentalCostArray
                );
        }
        else
        {
            rentalCostArrayStore.update(
                _rentalCostArray => _rentalCostArray.concat( response.rentalCostArray )
                );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isRentalCostLoading.set( false );
    }
}

// ~~

export async function handleCreateRentalCost(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasAddRentalCostPermission = hasUserPermission( 'add-rental-cost' );

        if ( !hasAddRentalCostPermission )
        {
            return;
        }

        let rentalCost = get( selectedRentalCostStore );

        let response = await fetchData(
            url + '/add',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                    {
                        rentalCost
                    }
                    )
            }
            );

        rentalCostArrayStore.update(
            ( rentalCostArray ) => rentalCostArray.concat( response.rentalCost )
            );
        finallyFunction();
    }
    catch ( error )
    {
        logError( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleRentalCostModal();
    }
}

// ~~

export async function handleEditRentalCost(
    finallyFunction = () => {}
    )
{
    try
    {
        let hasSetRentalCostPermission = hasUserPermission( 'set-rental-cost' );

        if ( !hasSetRentalCostPermission )
        {
            return;
        }

        let selectedRentalCost = get( selectedRentalCostStore );
        let { id : rentalCostId, ...updatedRentalCost } = selectedRentalCost;

        let response = await fetchData(
            url + '/' + rentalCostId + '/set',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText(
                    {
                        rentalCost : updatedRentalCost
                    }
                    )
            }
            );

        rentalCostArrayStore.update(
            ( rentalCostArray ) => rentalCostArray.map(
                ( rentalCost ) => rentalCost.id === rentalCostId
                ? selectedRentalCost
                : rentalCost
                )
            );
    finallyFunction();
    }
    catch ( error )
    {
        logError( error );
        toast.error( getLocalizedTextBySlug( error.message ) );
    }
    finally
    {
        toggleRentalCostModal();
    }
}

// ~~

export async function handleDeleteRentalCost(
    finallyFunction = () => {}
    )
{
    rentalCostArrayStore.set(
        await handleDeleteObject(
            rentalCostArrayStore,
            selectedRentalCostStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export function toggleRentalCostModal(
    )
{
    let isOpen = get( isRentalCostModalOpen );
    isRentalCostModalOpen.set( !isOpen );
    isOpen = get( isRentalCostModalOpen );

    if ( !isOpen )
    {
        selectedRentalCostStore.set( getInitialState() );
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
            name : ''
        }
        );
}

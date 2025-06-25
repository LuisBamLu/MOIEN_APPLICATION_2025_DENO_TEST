// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { urlParamsStore } from './urlParamsStore';
import { getJsonText } from 'senselogic-gist';

// -- VARIABLES

export let errorMessage = writable( null );
export let isRentalReviewLoading = writable( true );
export let isRentalReviewModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let rentalReviewArrayStore = writable( [] );
export let selectedRentalReviewStore = writable( {} );
export let propertyArrayStore = writable( [] );
export let hasMorePage = writable( false );
let url = '/api/admin/page/rental-review';

// -- FUNCTIONS

export async function loadRentalReviewArray(
    page = 1,
    limit = 15
    )
{
    isRentalReviewLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );
        mergeStoreAndRemoveDuplicateById( propertyArrayStore, response.propertyArray );
        hasMorePage.set(
            response.hasMorePage
            );

        let rentalReviewArray = [];

        for ( let rentalReview of response.rentalReviewArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === rentalReview.userId );
            let property = response.propertyArray.find( ( property ) => property.id === rentalReview.propertyId );
            rentalReview.userName = profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown';
            rentalReview.propertyTitle = property ? property.title : 'Unknown';
            rentalReview.profile = profile;
            rentalReview.property = property;

            rentalReviewArray = [ ...rentalReviewArray, rentalReview ];
        }

        if ( page === 1 )
        {
            rentalReviewArrayStore.set(
                rentalReviewArray
                );
        }
        else
        {
            rentalReviewArrayStore.update(
                _rentalReviewArray => _rentalReviewArray.concat( rentalReviewArray )
                );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isRentalReviewLoading.set( false );
    }
}

// ~~

export async function handleCreateRentalReview(
    finallyFunction = () => {}
    )
{
    rentalReviewArrayStore.set(
        await handleCreateObject(
            rentalReviewArrayStore,
            selectedRentalReviewStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditRentalReview(
    finallyFunction = () => {}
    )
{
    rentalReviewArrayStore.set(
        await handleEditObject(
            rentalReviewArrayStore,
            selectedRentalReviewStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteRentalReview(
    finallyFunction = () => {}
    )
{
    rentalReviewArrayStore.set(
        await handleDeleteObject(
            rentalReviewArrayStore,
            selectedRentalReviewStore,
            url,
            finallyFunction
            )
        );
}

export function toggleRentalReviewModal(
    )
{
    let isOpen = get( isRentalReviewModalOpen );
    isRentalReviewModalOpen.set( !isOpen );
}

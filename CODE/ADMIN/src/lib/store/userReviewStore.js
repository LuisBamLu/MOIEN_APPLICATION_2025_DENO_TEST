// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject, mergeStoreAndRemoveDuplicateById } from '$lib/base';
import { urlParamsStore } from './urlParamsStore';
import { getJsonText } from 'senselogic-gist';

// -- VARIABLES

export let errorMessage = writable( null );
export let isUserReviewLoading = writable( true );
export let isUserReviewModalOpen = writable( false );
export let profileArrayStore = writable( [] );
export let userReviewArrayStore = writable( [] );
export let selectedUserReviewStore = writable( {} );
export let hasMorePage = writable( false );
let url = '/api/admin/page/user-review';

// -- FUNCTIONS

export async function loadUserReviewArray(
    page = 1,
    limit = 15
    )
{
    isUserReviewLoading.set( true );

    try
    {
        let urlParam = get( urlParamsStore );

        let response = await fetchData(
            url + '?' + urlParam.toString(),
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
            );

        mergeStoreAndRemoveDuplicateById( profileArrayStore, response.profileArray );

        hasMorePage.set(
            response.hasMorePage
            );

        let userReviewArray = [];

        for ( let userReview of response.userReviewArray )
        {
            let profile = response.profileArray.find( ( profile ) => profile.userId === userReview.userId );
            let ratedProfile = response.profileArray.find( ( profile ) => profile.userId === userReview.ratedUserProfileId );
            userReview.userName = profile ? `${ profile.firstName } ${ profile.lastName }` : 'Unknown';
            userReview.ratedUserName = ratedProfile ? `${ ratedProfile.firstName } ${ ratedProfile.lastName }` : 'Unknown';
            userReview.profile = profile;
            userReview.ratedProfile = ratedProfile;

            userReviewArray = [ ...userReviewArray, userReview ];
        }

        if ( page === 1 )
        {
            userReviewArrayStore.set(
                userReviewArray
                );
        }
        else
        {
            userReviewArrayStore.update(
                ( _userReviewArray ) => _userReviewArray.concat( userReviewArray )
                );
        }
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isUserReviewLoading.set( false );
    }
}

// ~~

export async function handleCreateUserReview(
    finallyFunction = () => {}
    )
{
    userReviewArrayStore.set(
        await handleCreateObject(
            userReviewArrayStore,
            selectedUserReviewStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleEditUserReview(
    finallyFunction = () => {}
    )
{
    userReviewArrayStore.set(
        await handleEditObject(
            userReviewArrayStore,
            selectedUserReviewStore,
            url,
            finallyFunction
            )
        );
}

// ~~

export async function handleDeleteUserReview(
    finallyFunction = () => {}
    )
{
    userReviewArrayStore.set(
        await handleDeleteObject(
            userReviewArrayStore,
            selectedUserReviewStore,
            url,
            finallyFunction
            )
        );
}

export function toggleUserReviewModal(
    )
{
    let isOpen = get( isUserReviewModalOpen );
    isUserReviewModalOpen.set( !isOpen );
}

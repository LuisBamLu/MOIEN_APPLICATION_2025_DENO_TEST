// -- IMPORTS

import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { getJsonText, getMapById } from 'senselogic-gist';
import { navigate } from 'svelte5-router';
import { writable, get } from 'svelte/store';
import { urlParamsStore } from './urlParamsStore';

// -- VARIABLES

export let userArrayStore = writable( [] );
export let hasMorePage = writable( true );
export let selectedUserStore = writable( null );
export let userGenderMap = writable( null );
export let userStatusMap = writable( null );
export let userRoleMap = writable( null );
export let userGenderArray = writable( [] );
export let userStatusArray = writable( [] );
export let userRoleArray = writable( [] );
export let validationStatusArray = writable( [] );
export let isUserLoading = writable( true );
export let errorMessage = writable( null );
export let isUserModalOpen = writable( false );

// -- CONSTANTS

const url = '/api/admin/page/users';

// -- FUNCTIONS

export async function loadUserArray(
    page = 1,
    limit = 15
    )
{
    isUserLoading.set( true );
    errorMessage.set( null );

    let urlParams = get( urlParamsStore );

    try
    {
        if ( !get( hasMorePage ) )
        {
            return;
        }

        let response = await fetchData(
            url + '?' + urlParams.toString(),
            {
                method : 'POST',
                credentials : 'include',
                body : getJsonText(
                    {
                        type : 'getProfileArray',
                        page,
                        limit,
                    }
                    )
            }
            );

        if (
            get( userGenderMap ) === null
            || get( userStatusMap ) === null
            || get( userRoleMap ) === null
            )
        {
            getMapStore(
                {
                    userGenderArray : response.userGenderArray,
                    userRoleArray : response.userRoleArray,
                    userStatusArray : response.userStatusArray,
                }
                );
        }

        hasMorePage.set( response.hasMorePage );
        userArrayStore.update(
            ( profileArray ) => profileArray.concat( response.profileArray )
            );
        userGenderArray.set( response.userGenderArray );
        userRoleArray.set( response.userRoleArray );
        userStatusArray.set( response.userStatusArray );
        validationStatusArray.set( response.validationStatusArray );
    }
    catch ( error )
    {
        errorMessage.set( error.message );
    }
    finally
    {
        isUserLoading.set( false );
    }
}

// ~~

function getMapStore(
    {
        userGenderArray,
        userRoleArray,
        userStatusArray,
    }
    )
{
    userGenderMap.set( getMapById( userGenderArray ) );
    userStatusMap.set( getMapById( userStatusArray ) );
    userRoleMap.set( getMapById( userRoleArray ) );
}

// ~~

export async function handleCreateUser(
    finallyFunction = () => {}
    )
{
}

// ~~

export async function handleEditUser(
    profile
    )
{
    selectedUserStore.set( profile );
    navigate( '/admin/edit-view/users/' + profile.userId );
}

// ~~

export async function handleDeleteUser(
    finallyFunction = () => {}
    )
{
}

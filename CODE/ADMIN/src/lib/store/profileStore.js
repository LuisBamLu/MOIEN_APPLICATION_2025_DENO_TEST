// -- IMPORTS

import { writable, get } from 'svelte/store';
import { fetchData, hasMinimumUserRole, isDefinedAndNotNull, isNullOrUndefined } from '$lib/base';
import { isArray, logError } from 'senselogic-gist';

// -- VARIABLES

export let profileSignedInStore = writable( null );
export let isLoadingProfile = writable( false );
export let permissionSlugArrayStore = writable( [] );

// -- FUNCTIONS

export function hasStoreMinimumUserRole(
    minimumUserRole
    )
{
    let profile = get( profileSignedInStore );

    return hasMinimumUserRole( profile.roleSlugArray, minimumUserRole );
}

// ~~

export function hasUserRole(
    roleSlug
    )
{
    let profile = get( profileSignedInStore );

    return (
        isDefinedAndNotNull( profile )
        && profile.roleSlugArray.includes( roleSlug )
        );
}

// ~~

export function hasAnyUserRole(
    roleArray
    )
{
    if ( !isArray( roleArray ) )
    {
        logError( 'The roleArray parameter must be an array' );

        return;
    }

    return roleArray.some( roleSlug => hasUserRole( roleSlug ) );
}

// ~~

export function hasAllUserRoles(
    roleArray
    )
{
    if ( !isArray( roleArray ) )
    {
        logError( 'The roleArray parameter must be an array' );

        return;
    }

    return roleArray.every( roleSlug => hasUserRole( roleSlug ) );
}

// ~~

export function hasUserPermission(
    permissionSlug
    )
{
    let profile = get( profileSignedInStore );

    let permissionSlugArray = get( permissionSlugArrayStore );

    return (
        isDefinedAndNotNull( profile )
        && permissionSlugArray.includes( permissionSlug )
        );
}

// ~~

export function hasAnyUserPermission(
    permissionArray
    )
{
    if ( !isArray( permissionArray ) )
    {
        logError( 'The permissionArray parameter must be an array' );

        return;
    }

    return permissionArray.some( permissionSlug => hasUserPermission( permissionSlug ) );
}

// ~~

export function hasAllUserPermissions(
    permissionArray
    )
{
    if ( !isArray( permissionArray ) )
    {
        logError( 'The permissionArray parameter must be an array' );

        return;
    }

    return permissionArray.every( permissionSlug => hasUserPermission( permissionSlug ) );
}

// ~~

export function getProfileName()
{
    let profile = get( profileSignedInStore );

    return profile ? ( `${profile.firstName} ${ profile.lastName }` ) : '';
}

// ~~

export async function getProfilePermission(
    )
{
    try
    {
        let hasProfileSignedIn = get( profileSignedInStore );

        if ( hasProfileSignedIn )
        {
            let { permissionSlugArray } =
                await fetchData(
                    '/admin/api/permission/list',
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            if ( isDefinedAndNotNull( permissionSlugArray ) )
            {
                permissionSlugArrayStore.set( permissionSlugArray );
            }
        }
    }
    catch( error )
    {
        logError( error );
    }
}

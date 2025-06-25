// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { AppError } from '../../app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../base';
import { userRoleService } from '../../service/user_role_service';
import { userPermissionService } from '../../service/user_permission_service';

// -- FUNCTIONS

export async function getUserRightData(
    request,
    reply
    )
{
    try
    {
        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-message-error', 401 );
        }

        let hasListUserRightPermission = await hasUserPermission( 'list-user-right', profile.roleSlugArray );

        if ( !hasListUserRightPermission )
        {
            throw new AppError( 'unauthorized-message-error', 403 );
        }

        let userRightArray = await userRoleService.getCachedUserRoleArray();
        let userPermissionArray = await userPermissionService.getCachedUserPermissionArray();
        let userPermissionByTypeMap = {};

        for ( let userPermission of userPermissionArray )
        {
            let userPermissionTypeArray = userPermission.slug.split( '-' );
            let userPermissionType = userPermissionTypeArray.slice( 1 ).join( ' ' );
            let userPermissionTypeAlreadyExists = userPermissionByTypeMap[ userPermissionType ];

            if ( !userPermissionTypeAlreadyExists ) userPermissionByTypeMap[ userPermissionType ] = [];

            userPermissionByTypeMap[ userPermissionType ].push( userPermission );
        }

        return reply.send( { userRightArray, userPermissionArray, userPermissionByTypeMap } );
    }
    catch ( error )
    {
        logError( error );

        throw new AppError( error.message );
    }
}

// ~~

export async function setUserRightData(
    request,
    reply
    )
{
    try
    {
        if ( request.body )
        {
            let profile = request.profileLogged;

            if ( isNullOrUndefined( profile ) )
            {
                throw new AppError( 'unauthenticated-message-error', 401 );
            }

            let hasListUserRightPermission = await hasUserPermission( 'set-user-right', profile.roleSlugArray );

            if ( !hasListUserRightPermission )
            {
                throw new AppError( 'unauthorized-message-error', 403 );
            }

            let body = getJsonObject( request.body );

            let { name, permissionSlugArray } = body;
            let { userRoleId } = request.params;
            let updatedUserRole = { name, permissionSlugArray };

            await userRoleService.setUserRoleById( userRoleId, updatedUserRole );

            return reply.send( { message: 'user-role-updated-message' } );
        }
    }
    catch ( error )
    {
        logError( error );

        throw new AppError( error.message );
    }
}

// ~~

export async function removeUserRightData(
    request,
    reply
    )
{
    try
    {
        let { userRoleId } = request.params;
        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-message-error', 401 );
        }

        let hasListUserRightPermission = await hasUserPermission( 'remove-user-right', profile.roleSlugArray );

        if ( !hasListUserRightPermission )
        {
            throw new AppError( 'unauthorized-message-error', 403 );
        }

        await userRoleService.removeUserRoleById( userRoleId );

        return reply.send( { message: 'user-role-removed-message' } );
    }
    catch ( error )
    {
        logError( error );

        throw new AppError( error.message );
    }
}

// ~~

export async function handleAddUserRightAdminApiDataRequest(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-message-error', 401 );
        }

        let hasListUserRightPermission = await hasUserPermission( 'add-user-right', profile.roleSlugArray );

        if ( !hasListUserRightPermission )
        {
            throw new AppError( 'unauthorized-message-error', 403 );
        }

        let userRole = body;
        let nameSlug = getTextSlug( userRole.name );

        await userRoleService.addUserRole(
            {
                id : nameSlug,
                slug : nameSlug,
                number : userRole.number,
                name : userRole.name,
                permissionSlugArray : userRole.permissionSlugArray
            }
            );

        return reply.code( 201 ).send( { message: 'user-role-added-message' } );
    }
    catch ( error )
    {
        logError( error );

        throw new AppError( error.message );
    }
}

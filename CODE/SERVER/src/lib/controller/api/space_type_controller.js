// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { spaceTypeService } from '../../service/space_type_service';
import { AppError } from '../../utils/app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../base';

// -- FUNCTIONS

export async function getSpaceTypeByIdMap(
    request,
    reply
    )
{
    return (
        {
            spaceTypeMap: await spaceTypeService.getCachedSpaceTypeByIdMap()
        }
        );
}

// ~~

export async function getSpaceType(
    request,
    reply
    )
{
    return (
        {
            spaceTypeArray: await spaceTypeService.getCachedSpaceTypeArray()
        }
        );
}

// ~~

export async function setSpaceType(
    request,
    reply
    )
{
    let { spaceTypeId } = request.params;
    let body = JSON.parse( request.body );
    let spaceTypeData = body;

    if ( !spaceTypeId || !spaceTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetSpaceTypePermission = await hasUserPermission( 'set-space-type', profile.roleSlugArray );

    if ( !hasSetSpaceTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let spaceTypeExists = await spaceTypeService.getSpaceTypeById( spaceTypeId );

    if ( !spaceTypeExists )
    {
        throw new AppError( 'space-type-not-found-error', 404 );
    }

    let spaceType = await spaceTypeService.setSpaceTypeById(
        {
            name : spaceTypeData.name,
            number : spaceTypeData.number
        },
        spaceTypeId
        );

    return reply.send( { spaceType, message: 'space-type-updated-message' } );
}

// ~~

export async function addSpaceType(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let spaceTypeData = body;

    if ( !spaceTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddSpaceTypePermission = await hasUserPermission( 'add-space-type', profile.roleSlugArray );

    if ( !hasAddSpaceTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let spaceTypeId = getTextSlug( spaceTypeData.name );
    let spaceType = await spaceTypeService.addSpaceType(
        {
            id : spaceTypeId,
            name : spaceTypeData.name,
            number : spaceTypeData.number
        }
        );

    return reply.status( 201 ).send( { spaceType, message: 'space-type-added-message' } );
}

// ~~

export async function deleteSpaceType(
    request,
    reply
    )
{
    let { spaceTypeId } = request.params;

    if ( !spaceTypeId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveSpaceTypePermission = await hasUserPermission( 'remove-space-type', profile.roleSlugArray );

    if ( !hasRemoveSpaceTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await spaceTypeService.removeSpaceTypeById( spaceTypeId );

    return reply.send( { message: 'space-type-deleted-message' } );
}

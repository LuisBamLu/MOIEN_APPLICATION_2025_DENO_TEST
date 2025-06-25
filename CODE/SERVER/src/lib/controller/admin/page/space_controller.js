// -- IMPORTS

import { bedService } from '../../../service/bed_service';
import { bedTypeService } from '../../../service/bed_type_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { spaceService } from '../../../service/space_service';
import { spaceTypeService } from '../../../service/space_type_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { getJsonObject } from 'senselogic-gist';

// -- FUNCTIONS

async function getSpaceByPropertyid(
    request,
    reply
    )
{
    return (
        {
            spaceArray: await spaceService.getSpaceArrayByPropertyId( request.body.propertyId )
        }
        );
}

// ~~

async function getSpaceArray(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page, limit } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { spaceArray, spaceCount } = await spaceService.getSpaceArray( page, limit, filterArray );

    let [ userIdArray, propertyIdArray ] = [ 'userId', 'propertyId' ].map( key => getUniqueValues( spaceArray, key ) );
    let [ profileArray, propertyArray, spaceTypeArray ] = await Promise.all(
        [
            profileService.getProfileArrayByUserIdArray( userIdArray ),
            propertyService.getPropertyArrayByIdArray( propertyIdArray ),
            spaceTypeService.getSpaceTypeArray()
        ]
        );

    let { hasMorePage } = getHasMorePage( spaceCount, page, limit );

    return reply.send(
        {
            spaceArray,
            profileArray,
            propertyArray,
            spaceTypeArray,
            hasMorePage
        }
        );
}

// ~~

async function getSpaceById(
    request,
    reply
    )
{
    let spaceId = request.params.id
    let space = await spaceService.getSpaceById( spaceId );
    let property = await propertyService.getPropertyById( space.propertyId );
    let bedArray = await bedService.getBedArrayBySpaceId( space.id );
    let profile = await profileService.getProfileByUserId( space.userId );
    let bedTypeByIdMap = await bedTypeService.getCachedBedTypeByIdMap();
    let spaceTypeArray = await spaceTypeService.getCachedSpaceTypeArray();

    return reply.status( 200 ).send( { space, property, bedArray, profile, bedTypeByIdMap, spaceTypeArray  } );
}

// ~~

async function setSpace(
    request,
    reply
    )
{
    let spaceId = request.params.id;
    let body = JSON.parse( request.body );
    let spaceArray = await spaceService.setSpaceById( body.space, spaceId );

    return reply.status( 200 ).send( { space: spaceArray[ 0 ] } );
}

// ~~

async function setSpaceData(
    request,
    reply
    )
{
    let { spaceId } = request.params;
    let body = getJsonObject( request.body );
    let spaceData = body;

    if ( !spaceId || !spaceData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetSpacePermission = await hasUserPermission( 'set-space', profile.roleSlugArray );

    if ( !hasSetSpacePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await spaceService.setSpaceById(
        {
            area : spaceData.area,
            description : spaceData.description,
            name : spaceData.name,
            typeId : spaceData.typeId,
            floorNumber : spaceData.floorNumber,
            userId : spaceData.userId,
            propertyId : spaceData.propertyId
        },
        spaceId
        );

    return reply.send( { message: 'space-updated-message' } );
}

// ~~

async function removeSpaceData(
    request,
    reply
    )
{
    let { spaceId } = request.params;

    if ( !spaceId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveSpacePermission = await hasUserPermission( 'remove-space', profile.roleSlugArray );

    if ( !hasRemoveSpacePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await spaceService.removeSpaceById( spaceId );

    return reply.send( { message: 'space-deleted-message' } );
}

// ~~

async function addSpace(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let spaceArray = await spaceService.addSpace( body.space );

    return reply.status( 200 ).send( { space: spaceArray[ 0 ] } );
}

// ~~

async function removeSpace(
    request,
    reply
    )
{
    let spaceId = request.params.id;
    await spaceService.removeSpaceById( spaceId );
    await bedService.removeBedBySpaceId( spaceId );

    return reply.status( 200 ).send( { message: 'space deleted' } );
}

export
{
    getSpaceByPropertyid,
    getSpaceArray,
    getSpaceById,
    setSpace,
    addSpace,
    removeSpace,
    setSpaceData,
    removeSpaceData
}

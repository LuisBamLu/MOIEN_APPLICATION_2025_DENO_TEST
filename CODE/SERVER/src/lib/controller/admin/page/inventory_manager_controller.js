// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../app_error';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { documentService } from '../../../service/document_service';
import { inventoryService } from '../../../service/inventory_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';

// -- FUNCTIONS

async function getInventoryManager(
    request,
    reply
    )
{
    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasListInventoryPermission = await hasUserPermission( 'list-inventory', profile.roleSlugArray );

    if ( !hasListInventoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { inventoryArray, totalCount } = await inventoryService.getInventoryArray( page, limit, filterArray );
    let [ userIdArray, lessorUserIdArray, tenantUserIdArray, propertyIdArray, documentIdArray ] =
        [ 'userId', 'lessorUserProfileId', 'tenantUserProfileId', 'propertyId', 'documentIdArray' ]
            .map( key => getUniqueValues( inventoryArray, key ) )
    let userProfileIdSet = new Set( [ ...userIdArray, ...lessorUserIdArray, ...tenantUserIdArray ] );
    let userProfileIdArray = Array.from( userProfileIdSet );
    let propertyIdSet = new Set( propertyIdArray );
    propertyIdArray = Array.from( propertyIdSet );
    let { hasMorePage } = getHasMorePage( totalCount, page, limit );

    let [
            profileArray,
            propertyArray,
            documentArray
        ] = await Promise.all(
        [
            profileService.getProfileArrayByUserIdArray( userProfileIdArray ),
            propertyService.getPropertyArrayByIdArray( propertyIdArray ),
            documentService.getDocumentArrayByIdArray( documentIdArray )
        ]
        );

    return (
        {
            inventoryArray,
            profileArray,
            propertyArray,
            documentArray,
            hasMorePage
        }
        );
}

// ~~

async function setInventoryData(
    request,
    reply
    )
{
    let { inventoryId } = request.params;
    let body = getJsonObject( request.body );
    let { inventoryData } = body;

    if ( !inventoryId || !inventoryData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetInventoryPermission = await hasUserPermission( 'set-inventory', profile.roleSlugArray );

    if ( !hasSetInventoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await inventoryService.setInventoryById(
        {
            propertyId: inventoryData.propertyId,
            date: inventoryData.date,
            name: inventoryData.name,
            lessorUserProfileId: inventoryData.lessorUserProfileId,
            tenantUserProfileId: inventoryData.tenantUserProfileId,
            keyCount: inventoryData.keyCount,
            description: inventoryData.description,
            documentIdArray: inventoryData.documentIdArray,
            userId: inventoryData.userId
        },
        inventoryId
        );

    return reply.send( { message: 'inventory-updated-message' } );
}

// ~~

async function deleteInventoryData(
    request,
    reply
    )
{
    let { inventoryId } = request.params;

    if ( !inventoryId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveInventoryPermission = await hasUserPermission( 'remove-inventory', profile.roleSlugArray );

    if ( !hasRemoveInventoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await inventoryService.removeInventoryById( inventoryId );

    return reply.send( { message: 'inventory-deleted-message' } );
}

// ~~

async function addInventoryData(
    request,
    reply
    )
{
}

export
{
    getInventoryManager,
    setInventoryData,
    deleteInventoryData,
    addInventoryData
}

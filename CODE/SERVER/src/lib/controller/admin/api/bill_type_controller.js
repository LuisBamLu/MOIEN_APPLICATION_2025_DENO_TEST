// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { billTypeService } from '../../../service/bill_type_service';
import { AppError } from '../../../utils/app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getBillType(
    request,
    reply
    )
{
    let billTypeArray = await billTypeService.getCachedBillTypeArray();

    return reply.send( { billTypeArray } );
}

// ~~

async function updateBillType(
    request,
    reply
    )
{
    let { billTypeId } = request.params;
    let body = getJsonObject( request.body );
    let billTypeData = body;

    if ( !billTypeId || !billTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetBillTypePermission = await hasUserPermission( 'set-bill-type', profile.roleSlugArray );

    if ( !hasSetBillTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let billTypeExists = await billTypeService.getBillTypeById( billTypeId );

    if ( !billTypeExists )
    {
        throw new AppError( 'property-type-not-found-error', 404 );
    }

    let billType = await billTypeService.setBillTypeById(
        {
            title : billTypeData.title
        },
        billTypeId
        );

    return reply.send( { billType, message: 'bill-type-updated-message' } );
}

// ~~

async function addBillType(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let billTypeData = body;

    if ( !billTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddBillTypePermission = await hasUserPermission( 'add-bill-type', profile.roleSlugArray );

    if ( !hasAddBillTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let billTypeId = getTextSlug( billTypeData.title );
    let billType = await billTypeService.addBillType(
        {
            id : billTypeId,
            title : billTypeData.title
        }
        );

    return reply.send( { billType, message: 'bill-type-added-message' } );
}

// ~~

async function deleteBillType(
    request,
    reply
    )
{
    let { billTypeId } = request.params;

    if ( !billTypeId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveBillTypePermission = await hasUserPermission( 'remove-bill-type', profile.roleSlugArray );

    if ( !hasRemoveBillTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await billTypeService.removeBillTypeById( billTypeId );

    return reply.send( { message: 'bill-type-deleted-message' } );
}

export
{
    getBillType,
    updateBillType,
    addBillType,
    deleteBillType
}

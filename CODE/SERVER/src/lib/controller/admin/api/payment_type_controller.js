// -- IMPORTS

import { getJsonObject, logError } from 'senselogic-gist';
import { AppError } from '../../../utils/app_error';
import { paymentTypeService } from '../../../service/payment_type_service';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getPaymentType(
    request,
    reply
    )
{
    let paymentTypeArray = await paymentTypeService.getCachedPaymentTypeArray();

    return reply.status( 200 ).send( { paymentTypeArray } );
}

// ~~

async function addPaymentType(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let paymentTypeData = body;

        if ( !paymentTypeData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasAddPaymentTypePermission = await hasUserPermission( 'add-payment-type', profile.roleSlugArray );

        if ( !hasAddPaymentTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let paymentTypeId = getTextSlug( paymentTypeData.name );

        let paymentType = await paymentTypeService.addPaymentType(
            {
                id : paymentTypeId,
                name : paymentTypeData.name,
                number : paymentTypeData.number
            }
            );

        return reply.status( 201 ).send( { paymentType, message: 'payment-type-created-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

// ~~

async function setPaymentType(
    request,
    reply
    )
{
    let { paymentTypeId } = request.params;
    let body = getJsonObject( request.body );
    let paymentTypeData = body;

    if ( !paymentTypeId || !paymentTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddPaymentTypePermission = await hasUserPermission( 'add-payment-type', profile.roleSlugArray );

    if ( !hasAddPaymentTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let paymentTypeExists = await paymentTypeService.getPaymentTypeById( paymentTypeId );

    if ( !paymentTypeExists )
    {
        throw new AppError( 'payment-type-not-found-error', 404 );
    }

    let paymentType = await paymentTypeService.setPaymentType(
        {
            number: paymentTypeData.number,
            name: paymentTypeData.name
        },
        paymentTypeId
        );

    return reply.send( { paymentType, message: 'payment-type-updated-message' } );
}

// ~~

async function removePaymentType(
    request,
    reply
    )
{
    try
    {
        let { paymentTypeId } = request.params;

        if ( !paymentTypeId )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasRemovePaymentTypePermission = await hasUserPermission( 'remove-payment-type', profile.roleSlugArray );

        if ( !hasRemovePaymentTypePermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        await paymentTypeService.removePaymentType( paymentTypeId );

        return reply.send( { error: 'payment-type-deleted-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

export
{
    getPaymentType,
    addPaymentType,
    setPaymentType,
    removePaymentType
}

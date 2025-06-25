// -- IMPORTS

import { AppError } from '../../../utils/app_error';
import { hasUserPermission, isNullOrUndefined } from '../../../base';
import { paymentStatusService } from '../../../service/payment_status_service';

// -- FUNCTIONS

async function getPaymentStatus(
    request,
    reply
    )
{
    let paymentStatusArray = await paymentStatusService.getCachedPaymentStatusArray();

    return reply.status( 200 ).send( { paymentStatusArray } );
}

// ~~

async function setPaymentStatus(
    request,
    reply
    )
{
    let { paymentStatusId } = request.params;
    let body = JSON.parse( request.body );
    let { paymentStatusData } = body;

    if ( !paymentStatusId || !paymentStatusData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetPaymentStatusPermission = await hasUserPermission( 'set-payment-status', profile.roleSlugArray );

    if ( !hasSetPaymentStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let paymentStatusArray = await paymentStatusService.setPaymentStatus(
        {
            number: paymentStatusData.number,
            name: paymentStatusData.name,
            color: paymentStatusData.color,
        },
        paymentStatusId
        );

    return reply.status( 200 ).send( { message: 'payment-status-updated-message', paymentStatus: paymentStatusArray[ 0 ] } );
}

// ~~

async function addPaymentStatus(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let paymentStatusArray = await paymentStatusService.addPaymentStatus( body.paymentStatus );

    return reply.status( 200 ).send( { paymentStatus: paymentStatusArray[ 0 ] } );
}

// ~~

async function deletePaymentStatus(
    request,
    reply
    )
{
    let { paymentStatusId } = request.params;

    if ( !paymentStatusId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemovePaymentStatusPermission = await hasUserPermission( 'remove-payment-status', profile.roleSlugArray );

    if ( !hasRemovePaymentStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await paymentStatusService.removePaymentStatus( paymentStatusId );

    return reply.status( 200 ).send( { message: 'payment-status-deleted-message' } );
}

export
{
    getPaymentStatus,
    setPaymentStatus,
    addPaymentStatus,
    deletePaymentStatus
}

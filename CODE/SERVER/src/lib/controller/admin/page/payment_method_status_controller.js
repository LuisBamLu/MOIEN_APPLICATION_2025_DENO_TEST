// -- IMPORTS

import { hasUserPermission, isNullOrUndefined } from '../../../base';
import { paymentMethodStatusService } from '../../../service/payment_method_status_service';

// -- FUNCTIONS

async function getPaymentMethodStatus(
    request,
    reply
    )
{
    let paymentMethodStatusArray = await paymentMethodStatusService.getCachedPaymentMethodStatusArray();

    return reply.status( 200 ).send( { paymentMethodStatusArray } );
}

// ~~

async function setPaymentMethodStatus(
    request,
    reply
    )
{
    let { paymentMethodStatusId } = request.params;
    let body = JSON.parse( request.body );
    let { paymentMethodStatusData } = body;

    if ( !paymentMethodStatusId || !paymentMethodStatusData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetPaymentMethodStatusPermission = await hasUserPermission( 'set-payment-method-status', profile.roleSlugArray );

    if ( !hasSetPaymentMethodStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let paymentMethodStatusArray = await paymentMethodStatusService.setPaymentMethodStatus(
        {
            number: paymentMethodStatusData.number,
            name: paymentMethodStatusData.name,
            color: paymentMethodStatusData.color,
        },
        paymentMethodStatusId
        );

    return reply.status( 200 ).send( { message: 'payment-method-status-updated-message', paymentMethodStatus: paymentMethodStatusArray[ 0 ] } );
}

// ~~

async function addPaymentMethodStatus(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let paymentMethodStatusArray = await paymentMethodStatusService.addPaymentMethodStatus( body.paymentMethodStatus );

    return reply.status( 200 ).send( { paymentMethodStatus: paymentMethodStatusArray[ 0 ] } );
}

// ~~

async function deletePaymentMethodStatus(
    request,
    reply
    )
{
    let { paymentMethodStatusId } = request.params;

    if ( !paymentMethodStatusId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetPaymentMethodStatusPermission = await hasUserPermission( 'set-payment-method-status', profile.roleSlugArray );

    if ( !hasSetPaymentMethodStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await paymentMethodStatusService.removePaymentMethodStatus( paymentMethodStatusId );

    return reply.status( 200 ).send( { message: 'payment-method-status-deleted-message' } );
}

export
{
    getPaymentMethodStatus,
    setPaymentMethodStatus,
    addPaymentMethodStatus,
    deletePaymentMethodStatus
}

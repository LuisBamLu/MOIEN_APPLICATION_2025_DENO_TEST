// -- IMPORTS

import { paymentMethodTypeService } from '../../service/payment_method_type_service';

// -- FUNCTIONS

export async function getPaymentMethodType(
    request,
    reply
    )
{
    let paymentMethodTypeArray = await paymentMethodTypeService.getCachedPaymentMethodTypeArray();

    return reply.status( 200 ).send( { paymentMethodTypeArray } );
}

// ~~

export async function setPaymentMethodType(
    request,
    reply
    )
{
    let paymentMethodTypeId = request.params.id;
    let body = JSON.parse( request.body );
    let paymentMethodTypeArray = await paymentMethodTypeService.setPaymentMethodType( body.paymentMethodType, paymentMethodTypeId );

    return reply.status( 200 ).send( { paymentMethodType: paymentMethodTypeArray[ 0 ] } );
}

// ~~

export async function addPaymentMethodType(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let paymentMethodTypeArray = await paymentMethodTypeService.addPaymentMethodType( body.paymentMethodType );

    return reply.status( 200 ).send( { paymentMethodType: paymentMethodTypeArray[ 0 ] } );
}

// ~~

export async function deletePaymentMethodType(
    request,
    reply
    )
{
    let paymentMethodTypeId = request.params.id;
    await paymentMethodTypeService.removePaymentMethodType( paymentMethodTypeId );

    return reply.status( 200 ).send( { error: 'payment method type deleted' } );
}

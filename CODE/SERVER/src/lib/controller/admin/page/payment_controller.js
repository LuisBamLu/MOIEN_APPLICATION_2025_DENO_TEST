// -- IMPORTS

import { getJsonObject, getMap, getRandomTuid } from 'senselogic-gist';
import { mangopayService } from '../../../service/mangopay_service';
import { paymentService } from '../../../service/payment_service';
import { paymentTypeService } from '../../../service/payment_type_service';
import { paymentStatusService } from '../../../service/payment_status_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { rentalBookingService } from '../../../service/rental_booking_service';
import { currencyService } from '../../../service/currency_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { paymentMethodService } from '../../../service/payment_method_service';
import { AppError } from '../../../app_error';

// -- FUNCTIONS

async function getPaymentData(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page, limit } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { paymentArray, paymentCount } = await paymentService.getPaymentArray( page, limit, filterArray );

    let [ userIdArray, payerUserProfileIdArray, payeeUserProfileIdArray ] =
        [ 'userId', 'payerUserProfileId', 'payeeUserProfileId' ].map( key => getUniqueValues( paymentArray, key ) );

    let
        [
            profileArray,
            paymentTypeArray,
            paymentStatusArray,
            currencyArray,
            paymentMethodArray
        ] = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( [ ...userIdArray, ...payerUserProfileIdArray, ...payeeUserProfileIdArray ] ),
                paymentTypeService.getCachedPaymentTypeArray(),
                paymentStatusService.getCachedPaymentStatusArray(),
                currencyService.getCachedCurrencyArray(),
                paymentMethodService.getCachedPaymentMethodArray()
            ]
            );

    let { hasMorePage } = getHasMorePage( paymentCount, page, limit );

    return reply.send(
        {
            paymentArray,
            profileArray,
            paymentTypeArray,
            paymentStatusArray,
            currencyArray,
            hasMorePage,
            paymentMethodArray
        }
        );
}

// ~~

async function getCurrencyAndPayment(
    reply,
    request
    )
{
    let paymentArray = await paymentService.getPaymentArray();
    let currencyCodeArray = await currencyService.getCachedCurrencyArray();

    return reply.status( 200 ).send( { paymentArray, optionMap: { currencyCodeArray } } );
}

// ~~

async function getPayment(
    request,
    reply
    )
{
    let paymentId = request.params.id;
    let payment = await paymentService.getPaymentById( paymentId );
    let paymentArray = await paymentService.getPaymentArrayByTransactionId( payment.transactionId );
    let payerProfile = await profileService.getProfileByUserId( payment.payerUserProfileId );
    let payeeProfile = await profileService.getProfileByUserId( payment.payeeUserProfileId );
    let paymentTypeArray = await paymentTypeService.getPaymentTypeById( payment.typeId );
    let paymentStatusArray = await paymentStatusService.getPaymentStatusById( payment.statusId );
    let transaction = await rentalBookingService.getRentalBookingById( payment.transactionId );
    let property = null;
    let paymentByTypeIdMap = getMap( paymentArray, 'typeId' );
    let isRefundable = true;

    if ( paymentByTypeIdMap[ 'refund' ] )
    {
        isRefundable = false;
    }

    if ( transaction?.propertyId )
    {
        property = await propertyService.getPropertyById( transaction.propertyId );
    }

    let paymentType = paymentTypeArray[ 0 ];
    let paymentStatus = paymentStatusArray[ 0 ];

    return reply
        .status( 200 )
        .send(
            {
                payment,
                payerProfile,
                payeeProfile,
                paymentType,
                paymentStatus,
                transaction,
                property,
                isRefundable
            }
            );
}

// ~~

async function cancelPayment(
    request,
    reply
    )
{
    let paymentId = request.params.id;
    let payment = await paymentService.getPaymentById( paymentId );
    let paymentArray = await paymentService.getPaymentArrayByTransactionId( payment.transactionId );
    let paymentByTypeIdMap = getMap( paymentArray, 'typeId' );

    if ( !paymentByTypeIdMap[ 'refund' ] )
    {
        for ( let payment of paymentArray )
        {
            let refund = null;

            if ( payment.typeId === 'transfer' )
            {
                let transfer = await mangopayService.getTransferById( payment.mangopayId )

                refund = await mangopayService.addTransferRefund(
                    payment.mangopayId,
                    {
                        AuthorId: transfer.AuthorId,
                        DebitedFunds: { ...transfer.CreditedFunds, Amount: transfer.CreditedFunds.Amount },
                        Fees: { ...transfer.Fees, Amount: transfer.Fees.Amount * -1 }
                    }
                    );
            }
            else if ( payment.typeId === 'payin' )
            {
                let payIn = await mangopayService.getPayInById( payment.mangopayId );

                refund = await mangopayService.addPayInRefund(
                    payment.mangopayId,
                    {
                        AuthorId: payIn.AuthorId,
                        DebitedFunds: { ...payIn.CreditedFunds, Amount: payIn.CreditedFunds.Amount },
                        Fees: { ...payIn.Fees, Amount: payIn.Fees.Amount * -1 }
                    }
                    );
            }

            if ( refund )
            {
                await paymentService
                    .addPayment(
                        {
                            ...payment,
                            id: getRandomTuid(),
                            amount: payment.amount,
                            typeId: 'refund',
                            mangopayId: refund.Id
                        }
                        );
            }
        }

        await rentalBookingService.setRentalBookingById( { status: 'cancelled' } );
    }

    return reply.status( 200 ).send( { message: 'Payment refunded' } );
}

async function setPaymentData(
    request,
    reply
    )
{
    let { paymentId } = request.params;
    let body = getJsonObject( request.body );
    let paymentData = body;

    if ( !paymentId || !paymentData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetPaymentPermission = await hasUserPermission( 'set-payment', profile.roleSlugArray );

    if ( !hasSetPaymentPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await paymentService.setPayment(
        {
            typeId: paymentData.typeId,
            methodId: paymentData.methodId,
            payerUserProfileId: paymentData.payerUserProfileId,
            payeeUserProfileId: paymentData.payeeUserProfileId,
            amount: paymentData.amount,
            currencyCode: paymentData.currencyCode,
            invoiceDate: paymentData.invoiceDate,
            dueDate: paymentData.dueDate,
            transactionId: paymentData.transactionId,
            mangopayId: paymentData.mangopayId,
            statusId: paymentData.statusId,
            userId: paymentData.userId,
        },
        paymentId
        );

    return reply.send( { message: 'payment-updated-message' } );
}

async function removePaymentData(
    request,
    reply
    )
{
    let { paymentId } = request.params;

    if ( !paymentId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemovePaymentPermission = await hasUserPermission( 'remove-payment', profile.roleSlugArray );

    if ( !hasRemovePaymentPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await paymentService.removePaymentById( paymentId );

    return reply.send( { message: 'payment-deleted-message' } );
}

export
{
    getPaymentData,
    getPayment,
    getCurrencyAndPayment,
    cancelPayment,
    setPaymentData,
    removePaymentData
}

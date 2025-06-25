// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { mangopayService } from '../../service/mangopay_service';
import { paymentService } from '../../service/payment_service';
import { payRentalBooking } from '../admin/page/rental_booking_controller';
import { profileService } from '../../service/profile_service';
import { rentalBookingService } from '../../service/rental_booking_service';

// -- FUNCTIONS

export async function confirmBookingPayment(
    request,
    reply
    )
{
    if ( request.query.status === 'SUCCEEDED' || request.query.status === 'confirmed' )
    {
        let body = JSON.stringify(
            {
                type: 'continueRentalBooking',
                data:
                    {
                        propertyUserId: request.query.propertyUserId,
                        price: request.query.price,
                        userId: request.query.userId,
                        mangopayUserId: request.query.mangopayUserId,
                        paymentMethodId: '',
                        rentalBooking:
                            {
                                id: request.query.id,
                                propertyId: request.query.propertyId,
                                guestCount: request.query.guestCount,
                                arrivalDate: request.query.arrivalDate,
                                departureDate: request.query.departureDate,
                                dayCount: request.query.dayCount,
                                cleaningFee: request.query.cleaningFee,
                                sheetsFee: request.query.sheetsFee,
                                towelsFee: request.query.towelsFee,
                                otherFee: request.query.otherFee,
                                donation: request.query.donation,
                                carbonCompensationDonation: request.query.carbonCompensationDonation,
                                totalPrice: request.query.totalPrice,
                                conversionRate: request.query.conversionRate,
                                cancellationPolicyId: request.query.cancellationPolicyId
                            },
                        browserInfo:
                            {
                                JavaEnabled: request.query.JavaEnable,
                                Language: request.query.Language,
                                ColorDepth: request.query.ColorDepth,
                                ScreenHeight: request.query.ScreenHeight,
                                ScreenWidth: request.query.ScreenWidth,
                                TimeZoneOffset: request.query.TimeZoneOffset,
                                UserAgent: request.query.UserAgent,
                                JavascriptEnabled: true,
                                AcceptHeader: request.query.AcceptHeader
                            }
                    }
            }
            );
        request.body = body;

        if ( request.query.MandateId )
        {
            let hostProfile = await profileService.getProfileByUserId( request.query.propertyUserId );
            let hostWalletArray = await mangopayService.getWalletArrayByUserId( hostProfile.mangopayUserId );
            let hostWalletId = hostWalletArray[ 0 ].Id;

            let totalPrice = Number( request.query.totalPrice );
            let donationAmount = Number( request.query.donation ) ?? 0;
            let carbonCompensationDonation = Number( request.query.carbonCompensationDonation ) ?? 0;
            let stayPrice =
                totalPrice
                - carbonCompensationDonation
                - donationAmount
                - Number( request.query.cleaningFee ?? 0 )
                - Number( request.query.sheetsFee ?? 0 )
                - Number( request.query.towelsFee ?? 0 )
                - Number( request.query.otherFee ?? 0 );
            let totalMoienFee = donationAmount + stayPrice * 0.01;

            let directDebitPayIn
                = await mangopayService.addPayIn(
                    {
                        PaymentType: 'DIRECT_DEBIT',
                        ExecutionType: 'DIRECT',
                        AuthorId: request.query.mangopayUserId,
                        DebitedFunds:
                            {
                                Currency: 'EUR',
                                Amount: ( totalPrice - carbonCompensationDonation ) * 100
                            },
                        Fees:
                            {
                                Currency: 'EUR',
                                Amount: totalMoienFee * 100
                            },
                        CreditedWalletId: hostWalletId,
                        MandateId: request.query.MandateId,
                        Tag:
                            'Property rental -'
                            + ` ${ request.query.dayCount } days`
                            + ` ${ request.query.guestCount } guests`
                    }
                    );

            if ( request.query.carbonCompensationDonation > 0 )
            {
                await mangopayService.addPayIn(
                    {
                        PaymentType: 'DIRECT_DEBIT',
                        ExecutionType: 'DIRECT',
                        AuthorId: request.query.mangopayUserId,
                        DebitedFunds:
                            {
                                Currency: 'EUR',
                                Amount: carbonCompensationDonation * 100
                            },
                        Fees: { Currency: 'EUR', Amount: 0 },
                        CreditedWalletId: process.env.MOIEN_MANGOPAY_ECOTREE_WALLET_ID,
                        MandateId: request.query.MandateId,
                        Tag: 'Carbon compensation donation'
                    }
                    );

                paymentService.addPayment(
                    {
                        id: getRandomTuid(),
                        typeId: 'payin',
                        payerUserProfileId: request.query.propertyUserId,
                        userId: request.query.userId,
                        amount: directDebitEcotreeDonation,
                        mangopayId: directDebitPayIn.Id,
                        transactionId: request.query.id,
                        statusId: String( paymentStatus ?? '' ).toLowerCase()
                    }
                    );
            }

            paymentMessage = directDebitPayIn.ResultMessage;
            paymentStatus = directDebitPayIn.Status;
            paymentService.addPayment(
                {
                    id: getRandomTuid(),
                    typeId: 'payin',
                    payerUserProfileId: request.query.propertyUserId,
                    payeeUserProfileId: request.query.propertyUserId,
                    userId: request.query.userId,
                    amount: totalPrice,
                    mangopayId: directDebitPayIn.Id,
                    transactionId: request.query.id,
                    statusId: String( paymentStatus ?? '' ).toLowerCase()
                }
                );

            if ( paymentStatus === 'FAILED' )
            {
                return reply.redirect( '/confirm-booking-payment?status=failed' );
            }
            else
            {
                await rentalBookingService.setRentalBookingById( { status: 'paid' }, request.query.id );
                await paymentService.setPaymentByTransactionId( { statusId: 'succeeded' }, request.query.transactionId );

                return reply.redirect( '/confirm-booking-payment/' + request.query.id + '?status=succeeded' );
            }
        }

        await paymentService.setPaymentByTransactionId( { statusId: 'succeeded' }, request.query.transactionId );
        await payRentalBooking( request, reply );
    }
    else
    {
        await paymentService.setPaymentByTransactionId( { statusId: 'failed' } ,request.query.transactionId );

        return reply.redirect( '/confirm-booking-payment?status=failed' );
    }
}

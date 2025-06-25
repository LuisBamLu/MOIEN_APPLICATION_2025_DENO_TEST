// -- IMPORTS

import { conversationService } from '../../service/conversation_service';
import { mangopayService } from '../../service/mangopay_service';
import { messageService } from '../../service/message_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { userReviewService } from '../../service/user_review_service';
import { visitService } from '../../service/visit_service';

// -- FUNCTIONS

export async function getStaticsPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let [ userReviewArray, visitArray, conversationArray, upcomingRentalBookingArray, pastRentalBookingArray, walletArray ]
        = await Promise.all(
            [
                userReviewService.getUserReviewArrayByRatedUserProfileId( request.profileLogged.userId ),
                visitService.getVisitArrayByUserIdAndStatusArray(
                    request.profileLogged.userId,
                    [ 'pending', 'booked', 'rescheduled-by-host' ]
                    ),
                conversationService.getConversationArrayByTargetUserProfileId( request.profileLogged.userId ),
                rentalBookingService.getUpcomingRentalBookingArrayByPropertyUserIdAndStatusArray(
                    request.profileLogged.userId,
                    [ 'requested', 'confirmed', 'paid' ]
                    ),
                rentalBookingService.getPastRentalBookingArrayByPropertyUserId( request.profileLogged.userId ),
                mangopayService.getWalletArrayByUserId( request.profileLogged.mangopayUserId )
            ]
            );
    let responseRate = 0;

    if ( conversationArray.length )
    {
        let conversationIdArray = [];

        for ( let conversation of conversationArray )
        {
            conversationIdArray.push( conversation.id );
        }

        let messageArray
            = await messageService.getMessageArrayByConversationIdArrayAndSourceUserProfileId(
                conversationIdArray,
                request.profileLogged.userId
                );
        let respondedConversationIdSet = new Set();

        for ( let message of messageArray )
        {
            respondedConversationIdSet.add( message.conversationId );
        }

        responseRate = respondedConversationIdSet.size / conversationIdArray.length;
    }

    let ratingTotal = 0;

    for ( let userReview of userReviewArray )
    {
        ratingTotal += userReview.rating;
    }

    let averageRating = ratingTotal / userReviewArray.length;
    let upcomingRentalBookingCount = upcomingRentalBookingArray.length;
    let pastRentalBookingCount = pastRentalBookingArray.length;
    walletArray = walletArray ?? [];
    let wallet = walletArray[ 0 ] ?? null;
    let transactionArray = []

    if ( wallet !== null )
    {
        transactionArray = await mangopayService.getWalletTransactionArrayByWalletId( wallet.Id, 1, 100 );
    }

    let currentMonthTotalEarning = 0;
    let currentYearTotalEarning = 0;
    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();

    for ( let transaction of transactionArray )
    {
        if ( transaction.CreditedWalletId === wallet.Id )
        {
            if (  transaction.Nature === 'REFUND' )
            {
                continue;
            }

            if ( transaction.ExecutionDate * 1000 > new Date( currentYear, 0, 1, 0, 0 ).getTime() )
            {
                currentYearTotalEarning += transaction.CreditedFunds.Amount;
            }

            if ( transaction.ExecutionDate * 1000 > new Date( currentYear, currentMonth, 1, 0, 0 ).getTime() )
            {
                currentMonthTotalEarning += transaction.CreditedFunds.Amount;
            }
        }
        else if ( transaction.DebitedWalletId === wallet.Id && transaction.Nature === 'REFUND' )
        {
            if ( transaction.ExecutionDate * 1000 > new Date( currentYear, 0, 1, 0, 0 ).getTime() )
            {
                currentYearTotalEarning -= transaction.CreditedFunds.Amount;
            }

            if ( transaction.ExecutionDate * 1000 > new Date( currentYear, currentMonth, 1, 0, 0 ).getTime() )
            {
                currentMonthTotalEarning -= transaction.CreditedFunds.Amount;
            }
        }
    }

    currentMonthTotalEarning = currentMonthTotalEarning / 100;
    currentYearTotalEarning = currentYearTotalEarning / 100;

    return reply
        .status( 200 )
        .send(
            {
                averageRating,
                userReviewCount: userReviewArray.length,
                visitCount: visitArray.length,
                responseRate,
                upcomingRentalBookingCount,
                pastRentalBookingCount,
                currentMonthTotalEarning,
                currentYearTotalEarning
            }
            );
}

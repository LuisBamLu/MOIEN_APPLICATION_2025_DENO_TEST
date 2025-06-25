// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { profileService } from '../../service/profile_service';
import { userReviewService } from '../../service/user_review_service';
import { conversationService } from '../../service/conversation_service';
import { messageService } from '../../service/message_service';

// -- FUNCTIONS

export async function getUserReviewData(
    request,
    reply
    )
{
    let userReviewArray = await userReviewService.getUserReviewArray();
    let userIdSet = new Set();

    for ( let userReview of userReviewArray )
    {
        userIdSet.add( userReview.userId );
        userIdSet.add( userReview.ratedUserProfileId );
    }

    let profileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) );

    return reply.status( 200 ).send( { userReviewArray, profileArray } );
}

// ~~

export async function addUserReview(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let data = request.body;
    let ratedUserProfileId = data.ratedUserProfileId.value;
    let rating = data.rating.value;
    let text = data.text.value;
    let userId = request.profileLogged.userId;
    let rentalBookingId = data.rentalBookingId.value;
    let privateMessage = data.privateMessage.value;
    let propertyId = data.propertyId.value;
    let creationTimestamp = new Date().toISOString();
    let updateTimestamp = new Date().toISOString();
    let userReview =
        {
            id: getRandomTuid(),
            ratedUserProfileId,
            rentalBookingId,
            rating,
            text,
            userId,
            creationTimestamp,
            updateTimestamp
        };

    try
    {
        let hasConversation
            = await conversationService.getConversation( propertyId, 'contact', userId, ratedUserProfileId )
              || await conversationService.getConversation( propertyId, 'contact', ratedUserProfileId, userId );

        let newConversation =
            {
                id: getRandomTuid(),
                propertyId,
                typeId: 'contact',
                sourceUserProfileId: userId,
                targetUserProfileId: ratedUserProfileId,
                creationTimestamp,
                updateTimestamp
            };

        if ( !hasConversation )
        {
            await conversationService.addConversation( newConversation );
        }

        let newMessage =
            {
                id: getRandomTuid(),
                conversationId: hasConversation ? hasConversation.id : newConversation.id,
                sourceUserProfileId: userId,
                targetUserProfileId: ratedUserProfileId,
                text: privateMessage,
                creationTimestamp,
                updateTimestamp
            };

        if ( privateMessage && privateMessage.trim() !== '' )
        {
            await messageService.addMessage( newMessage );
        }

        await userReviewService.addUserReview( userReview )

        return reply.status( 200 ).send( { message: 'Review submitted successfully' } );
    }
    catch ( error )
    {
        console.error( error )

        return reply.status( 500 ).send( { message: 'An error occurred while submitting the review.' } );
    }
}

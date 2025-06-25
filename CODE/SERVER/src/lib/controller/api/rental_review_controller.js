// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { rentalReviewService } from '../../service/rental_review_service';
import { propertyService } from '../../service/property_service';
import { conversationService } from '../../service/conversation_service';
import { messageService } from '../../service/message_service';

// -- FUNCTIONS

export async function getRentalReviewByPropertyId(
    request,
    reply
    )
{
    return (
        {
            rentalReviewArray : await rentalReviewService.getRentalReviewArrayByPropertyId( request.body.propertyId )
        }
        );
}

// ~~

export async function getRentalReview(
    request,
    reply
    )
{
    return (
        {
            rentalReviewArray : await rentalReviewService.getRentalReviewArray()
        }
        );
}

// ~~

export async function addRentalReview(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let data = request.body

    let propertyId = data.propertyId.value
    let rating = data.rating.value
    let rentalBookingId = data.rentalBookingId.value
    let cleanlinessRating = data.cleanlinessRating.value
    let communicationRating = data.communicationRating.value
    let checkInRating = data.checkInRating.value
    let accuracyRating = data.accuracyRating.value
    let locationRating = data.locationRating.value
    let valueRating = data.valueRating.value
    let text = data.text.value
    let privateMessage = data.privateMessage.value
    let userId = data.userId.value
    let hostId = data.hostId.value
    let creationTimestamp = new Date().toISOString()
    let updateTimestamp = new Date().toISOString()

    let updatedCleanliness = data.updatedCleanliness.value
    let updatedCommunication = data.updatedCommunication.value
    let updatedCheckIn = data.updatedCheckIn.value
    let updatedAccuracy = data.updatedAccuracy.value
    let updatedLocation = data.updatedLocation.value
    let updatedValue = data.updatedValue.value
    let updatedRating = data.updatedRating.value

    let updatedPropertyRatings =
        {
            averageCleanlinessRating: updatedCleanliness,
            averageCommunicationRating: updatedCommunication,
            averageCheckInRating: updatedCheckIn,
            averageAccuracyRating: updatedAccuracy,
            averageLocationRating: updatedLocation,
            averageValueRating: updatedValue,
            averageRating: updatedRating
        }

    let rentalReview =
        {
            id: getRandomTuid(),
            propertyId,
            rentalBookingId,
            rating,
            cleanlinessRating,
            communicationRating,
            checkInRating,
            accuracyRating,
            locationRating,
            valueRating,
            text,
            userId,
            creationTimestamp,
            updateTimestamp
        }

    try
    {
        let hasConversation =
            await conversationService.getConversation( propertyId, 'contact', userId, hostId )
            || await conversationService.getConversation( propertyId, 'contact', hostId, userId );

        let newConversation =
            {
                id: getRandomTuid(),
                propertyId,
                typeId: 'contact',
                sourceUserProfileId: userId,
                targetUserProfileId: hostId,
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
                targetUserProfileId: hostId,
                text: privateMessage,
                creationTimestamp,
                updateTimestamp
            };

        if ( privateMessage && privateMessage.trim() !== '' )
        {
            await messageService.addMessage( newMessage );
        }

        await Promise.all(
            [
                rentalReviewService.addRentalReview( rentalReview ),
                propertyService.setPropertyById( updatedPropertyRatings, propertyId ),
            ]
            );

        return reply.status( 200 ).send( { message: 'Review submitted successfully' } );
    }
    catch ( error )
    {
        console.error( error );
        return reply.status( 500 ).send( { message: 'An error occurred while submitting the review.' } );
    }
}

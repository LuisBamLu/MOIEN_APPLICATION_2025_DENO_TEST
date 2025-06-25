// -- IMPORTS

import { getMap, getMapById, getRandomTuid } from 'senselogic-gist';
import { propertyService } from '../../../service/property_service';
import { conversationService } from '../../../service/conversation_service';
import { conversationTypeService } from '../../../service/conversation_type_service';
import { rentalModeService } from '../../../service/rental_mode_service';
import { profileService } from '../../../service/profile_service';
import { messageService } from '../../../service/message_service';

// -- FUNCTIONS

async function getPropertyOfConversationById(
    request,
    reply
    )
{
    let propertyId = request.params.propertyId;
    let property = await propertyService.getPropertyById( propertyId );

    if ( property === null )
    {
        return reply.status( 404 ).send( 'Property not found' );
    }
    else
    {
        return reply.status( 200 ).send( { property } );
    }
}

// ~~

async function getConversationArrayByUserProfileId(
    request,
    reply
    )
{
    let { userProfileId } = request.body;
    let conversationArray = await conversationService.getConversationArrayByUserProfileId( userProfileId, true );

    if ( conversationArray === null )
    {
        return reply.status( 404 ).send( 'Conversations not found' );
    }
    else
    {
        return reply.status( 200 ).send( { conversationArray } );
    }
}

// ~~

async function getConversationById(
    request,
    reply
    )
{
    let { conversationId } = request.body;
    let conversation = await conversationService.getConversationById( conversationId, true );

    if ( conversation === null )
    {
        return reply.status( 404 ).send( 'Conversation not found' );
    }
    else
    {
        return reply.status( 200 ).send( { conversation } );
    }
}

// ~~

async function getConversation(
    request,
    reply
    )
{
    let { propertyId, conversationTypeId, sourceUserProfileId, targetUserProfileId } = request.body;
    let conversation = await conversationService.getConversation( propertyId, conversationTypeId, sourceUserProfileId, targetUserProfileId );

    if ( conversation === null )
    {
        return reply.status( 404 ).send( 'Conversation not found' );
    }
    else
    {
        return reply.status( 200 ).send( { conversation } );
    }
}

// ~~

async function addConversation(
    request,
    reply
    )
{
    let conversationData = request.body;
    let conversation =
    {
        id: getRandomTuid(),
        propertyId : conversationData.propertyId,
        typeId : conversationData.conversationTypeId,
        sourceUserProfileId : conversationData.sourceUserProfileId,
        targetUserProfileId : conversationData.targetUserProfileId,
    }
    let data = await conversationService.addConversation( conversation );

    return reply.status( 200 ).send( { data } );
}

// ~~

async function getAdminConversations(
    request,
    reply
    )
{
    let conversationArray = await conversationService.getConversationArray();
    let rentalModeByIdMap = await rentalModeService.getCachedRentalModeByIdMap();
    let conversationTypeByIdMap = await conversationTypeService.getCachedConversationTypeByIdMap();
    let userIdSet = new Set();
    let propertyIdSet = new Set();

    for ( let conversation of conversationArray )
    {
        userIdSet.add( conversation.targetUserProfileId );
        userIdSet.add( conversation.sourceUserProfileId );
        propertyIdSet.add( conversation.propertyId );
        conversation.type = conversationTypeByIdMap[ conversation.typeId ];
        conversation.rentalMode = rentalModeByIdMap[ conversation.rentalModeId ];
        conversation.lastMessage = await messageService.getMessageLastByConversationId( conversation.id );
    }

    let profileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) );
    let propertyArray = await propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) );
    let profileByUserIdMap = getMap( profileArray, 'userId' );
    let propertyByIdMap = getMapById( propertyArray );

    for ( let conversation of conversationArray )
    {
        conversation.sourceUserProfile = profileByUserIdMap[ conversation.sourceUserProfileId ];
        conversation.targetUserProfile = profileByUserIdMap[ conversation.targetUserProfileId ];
        conversation.property = propertyByIdMap[ conversation.propertyId ];
    }

    return reply.status( 200 ).send( { conversationArray } );
}

export
{
    getPropertyOfConversationById,
    getConversationArrayByUserProfileId,
    getConversationById,
    getConversation,
    addConversation,
    getAdminConversations
}

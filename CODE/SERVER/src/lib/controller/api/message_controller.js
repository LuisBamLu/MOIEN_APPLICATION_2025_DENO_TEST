// -- IMPORTS

import { getJsonObject, getJsonText, getRandomTuid } from 'senselogic-gist';
import { messageService } from '../../service/message_service';
import { conversationService } from '../../service/conversation_service';
import { isDefinedAndNotNull, isNullOrUndefined } from '../../base';
import { notificationCenterService } from '../../service/notification_center_service';
// import { notificationCenterService } from '../../service/notification_center_service';

// -- FUNCTIONS

export async function getMessageArrayByConversationId(
    request,
    reply
    )
{
    let { conversationId } = request.body;
    let messageArray = await messageService.getMessageArrayByConversationId( conversationId );

    if ( messageArray === null )
    {
        return reply.status( 404 ).send( 'Message array not found' );
    }
    else
    {
        return reply.status( 200 ).send( { messageArray } );
    }
}

// ~~

export async function addMessage(
    request,
    reply
    )
{
    let messageData = request.body.messageData;
    let message =
        {
            id: getRandomTuid(),
            propertyId : messageData.propertyId,
            sourceUserProfileId : messageData.profile.userId,
            targetUserProfileId : messageData.propertyUserId,
            text : messageData.text,
            userId : messageData.profile.userId
        };
    let data = await messageService.addMessage( message );

    return reply.status( 200 ).send( { data } );
}

// ~~

export async function handleWebSocketAddMessage(
    data,
    webSocket,
    webSocketServer
    )
{
    let message =
        {
            id: getRandomTuid(),
            conversationId : data.data.conversationId,
            sourceUserProfileId : data.data.sourceUserProfileId,
            targetUserProfileId : data.data.targetUserProfileId,
            text : data.data.text
        };

    let addedMessage = await messageService.addMessage( message );
    let conversation = await conversationService.getConversationById( data.data.conversationId, false );

    // await notificationCenterService.addNotification(
    //     {
    //         id: getRandomTuid(),
    //         isRead: false,
    //         message: 'You have received a new message',
    //         notificationType: 'ads-partner',
    //         userId: data.data.targetUserProfileId
    //     }
    //     );

    delete conversation.sourceUserProfile;
    delete conversation.targetUserProfile;
    delete conversation.type;
    delete conversation.rentalMode;
    delete conversation.lastMessage;

    if ( message.sourceUserProfileId === conversation.sourceUserProfileId )
    {
        conversation.targetNewMessageCount = ( conversation.targetNewMessageCount || 0 ) + 1;
    }
    else if ( message.sourceUserProfileId === conversation.targetUserProfileId )
    {
        conversation.sourceNewMessageCount = ( conversation.sourceNewMessageCount || 0 ) + 1;
    }

    conversation = await conversationService.setConversation( conversation, conversation.id, true );

    let targetWebSocket = notificationCenterService.socketByUserIdMap[ message.targetUserProfileId ];

    if ( isDefinedAndNotNull( targetWebSocket )
         && targetWebSocket.readyState === webSocket.OPEN )
    {
        targetWebSocket.send( getJsonText( { type: 'addMessage', message: addedMessage, conversation: conversation } ) );
    }

    if ( isDefinedAndNotNull( webSocket )
         && webSocket.readyState === webSocket.OPEN )
    {
        webSocket.send( getJsonText( { type: 'addMessage', message: addedMessage, conversation: conversation } ) );
    }
}

// ~~

export async function handleWebSocketMarkMessageAsRead(
    data,
    webSocket,
    webSocketServer
    )
{
    if ( isNullOrUndefined( data.messageId ) && isNullOrUndefined( data.conversationId ) ) return;

    let readedTimestamp = new Date();
    await messageService.markMessageAsRead( data.messageId, readedTimestamp );

    let conversation = await conversationService.getConversationById( data.conversationId );
    let recipientUserId = conversation.sourceUserProfileId === data.targetUserProfileId
        ? conversation.targetUserProfileId
        : conversation.sourceUserProfileId;

    for ( let client of webSocketServer.clients )
    {
        if ( client !== webSocket && client.readyState === webSocket.OPEN )
        {
            client.send(
                JSON.stringify(
                    {
                        type: 'messageMarkedAsRead',
                        messageId: data.messageId,
                        conversationId: data.conversationId,
                        recipientUserId: recipientUserId,
                        readedTimestamp,
                    }
                    )
                );
        }
    }
}

// ~~

export async function handleUpdateNewMessageCount(
    data,
    webSocket,
    webSocketServer
    )
{
    let { conversationId, conversation } = data;

    await conversationService.setConversation( conversation, conversationId );
}

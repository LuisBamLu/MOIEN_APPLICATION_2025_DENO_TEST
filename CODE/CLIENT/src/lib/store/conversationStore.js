// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData } from '../base';
import { getJsonText } from 'senselogic-gist';
import { profileSignedInStore } from './profileStore';
import { webSocketManager } from '../web_socket_manager';

// -- VARIABLES

export let searchTerm = writable( '' );
export let message = writable( '' );
export let selectedConversation = writable( null );
export let selectedFilterTerm = writable( 'all' );
export let conversationArrayStore = writable( [] );
export let messageArrayStore = writable( [] );
export let conversationMessageContainerSectionStore = writable( null );

// -- FUNCTIONS

export function handleAddMessage(
    data
    )
{
    let conversation = get( selectedConversation );

    conversationArrayStore.update(
        ( conversationArray ) => conversationArray.map(
            _conversation => _conversation.id === data.conversation.id ? data.conversation : _conversation
            )
        );

    if ( conversation !== null
         && data.conversation.id === conversation.id )
    {
        messageArrayStore.update(
            ( messageArray ) => messageArray = messageArray.concat( data.message )
            );

        let conversationMessageContainerSection = get( conversationMessageContainerSectionStore );

        if ( conversationMessageContainerSection )
        {
            setTimeout(
                () =>
                {
                    conversationMessageContainerSection.scrollTop = conversationMessageContainerSection.scrollHeight;
                },
                0
                );
        }
    }
}

// ~~

export function handleMessageMarkedAsRead(
    data
    )
{
    let conversation = get( selectedConversation );

    if ( conversation !== null
        && conversation.id === data.conversationId )
    {
        messageArrayStore.update(
            ( messageArray ) => messageArray = messageArray.map(
                message =>
                (
                    message.id === data.messageId
                    ? { ...message, isReaded: true, readedTimestamp : data.readedTimestamp }
                    : message
                )
                )
            );
        conversationArrayStore.update(
            ( conversationArray ) => conversationArray.map(
                _conversation => _conversation.id === data.conversationId
                    ? { ..._conversation, ...data.conversation }
                    : _conversation
                )
            );
    }
}

// ~~

export async function loadConversationArray(
)
{
    let profileSignedIn = get( profileSignedInStore );

    let response = await fetchData( `/api/conversation/get-by-user-id`,
        {
            method: 'POST',
            body: getJsonText(
                {
                    type: 'getConversationArrayByUserProfileId',
                    userProfileId: profileSignedIn.userId,
                }
                ),
            headers: { 'Content-Type': 'application/json' }
        }
        );

        conversationArrayStore.set( response.conversationArray.filter( Boolean ) );
}

// ~~

export function updateConversationArray(
    updatedConversation,
    conversationId
    )
{
    conversationArrayStore.update(
        ( conversationArray ) =>
        {
            let conversationIndex = conversationArray.findIndex(
                ( conversation ) => conversation.id === conversationId
                );

            if ( conversationIndex === -1 ) return conversationArray;

            conversationArray[ conversationIndex ] = get( selectedConversation );

            return conversationArray;
        }
        );
}

// ~~

export function handleUpdateNewMessageCount(
    )
{
    let conversation = get( selectedConversation );
    let profileSignedIn = get( profileSignedInStore );

    if ( conversation === null ) return;

    let updatedConversation = {};
    let isTargetUser = conversation.targetUserProfileId === profileSignedIn.userId;
    let conversationId = conversation.id;

    if ( isTargetUser )
    {
        if ( conversation.targetNewMessageCount === 0 ) return;

        updatedConversation[ 'targetNewMessageCount' ] = 0;
    }
    else
    {
        if ( conversation.sourceNewMessageCount === 0 ) return;

        updatedConversation[ 'sourceNewMessageCount' ] = 0;
    }

    selectedConversation.set( { ...conversation, ...updatedConversation } );
    updateConversationArray( updatedConversation, conversationId );

    let payloadData =
        {
            type: 'updateMessageCount',
            conversation: updatedConversation,
            conversationId
        };

    webSocketManager.send( payloadData );
}

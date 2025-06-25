// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of messages in a conversation.
 *
 * @param { string } conversationId - The unique identifier for the conversation.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { string } [ isRead ] - Weather the message has been read. [ 'true', 'false' ]
 * @param { string } [ beforeTimestamp ] - Restrict the response to messages sent before the set timestamp.
 * @param { string } [ sinceTimestamp ] - Restrict the response to messages sent after the set timestamp.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMessageArray(
    conversationId,
    fields,
    excludeFields,
    isRead,
    beforeTimestamp,
    sinceTimestamp
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( isRead !== undefined ) options.isRead = isRead;
        if ( beforeTimestamp !== undefined ) options.beforeTimestamp = beforeTimestamp;
        if ( sinceTimestamp !== undefined ) options.sinceTimestamp = sinceTimestamp;

        let response =
            await mailchimp.conversations.getConversationMessages(
                conversationId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting messages: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Get information about a specific message in a conversation.
 *
 * @param { string } conversationId - The unique identifier for the conversation.
 * @param { string } messageId - The unique identifier for the message.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMessage(
    conversationId,
    messageId,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( xxx !== undefined ) options.xxx = xxx;

        let response =
            await mailchimp.conversations.getConversationMessage(
                ___,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting message: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

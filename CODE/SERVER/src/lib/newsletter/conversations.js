// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import * as messages from './conversations/messages';

// -- FUNCTIONS

/**
 * Get a list of conversations.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ hasUnreadMessages ] - Filter conversations by whether they have unread messages. [ 'true', 'false' ]
 * @param { string } [ listId ] - The unique identifier for the list.
 * @param { string } [ campaignId ] - The unique identifier for the campaign.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getConversationArray(
    fields,
    excludeFields,
    count,
    offset,
    hasUnreadMessages,
    listId,
    campaignId
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( hasUnreadMessages !== undefined ) options.hasUnreadMessages = hasUnreadMessages;
        if ( listId !== undefined ) options.listId = listId;
        if ( campaignId !== undefined ) options.campaignId = campaignId;

        let response =
            await mailchimp.conversations.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting conversation array: ' + response[ 'detail' ] );
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
 * Get a specific conversation.
 *
 * @param { string } conversationId - The unique identifier for the conversation.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getConversation(
    conversationId,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.conversations.get(
                conversationId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting conversation: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- STATEMENTS

export { messages };

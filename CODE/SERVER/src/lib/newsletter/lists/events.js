// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of events for a specific list member.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { number } [ count ] - The number of events to return.
 * @param { number } [ offset ] - The number of events to skip.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberEventArray(
    listId,
    subscriberHash,
    count,
    offset,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.lists.getListMemberEvents(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list member events: ' + response[ 'detail' ] );
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
 * Add an event for a specific list member.
 *
 * @param { string } listId
 * @param { string } subscriberHash
 * @param { string } name
 * @param { Object } [ properties ]
 * @param { boolean } [ isSyncing ]
 * @param { string } [ occurredAt ]
 *
 * @returns
 */
export async function addEvent(
    listId,
    subscriberHash,
    name,
    properties,
    isSyncing,
    occurredAt
    )
{
    try
    {
        let options = {};

        if ( properties ) options.properties = properties;
        if ( isSyncing ) options.isSyncing = isSyncing;
        if ( occurredAt ) options.occurredAt = occurredAt;

        let response =
            await mailchimp.lists.createListMemberEvent(
                listId,
                subscriberHash,
                name,
                options
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error adding list member event: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

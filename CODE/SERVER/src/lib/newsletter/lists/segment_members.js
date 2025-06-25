// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all members in a segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 * @param { boolean } [ includeCleaned ] - Whether cleaned members should be included in the response.
 * @param { boolean } [ includeTransactional ] - Whether transactional members should be included in the response.
 * @param { boolean } [ includeUnsubscribed ] - Whether unsubscribed members should be included in the response.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getSegmentMemberArray(
    listId,
    segmentId,
    fields,
    excludeFields,
    count,
    offset,
    includeCleaned,
    includeTransactional,
    includeUnsubscribed
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( includeCleaned ) options.includeCleaned = includeCleaned;
        if ( includeTransactional ) options.includeTransactional = includeTransactional;
        if ( includeUnsubscribed ) options.includeUnsubscribed = includeUnsubscribed;

        let response =
            await mailchimp.lists.getSegmentMembersList(
                listId,
                segmentId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting segment members: ' + response[ 'detail' ] );
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
 * Add a list member to a segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string } emailAddress - The email address for the list member.
 *
 * @returns {} - The response from the Mailchimp API.
 */
export async function addSegmentMember(
    listId,
    segmentId,
    emailAddress
    )
{
    try
    {
        let response =
            await mailchimp.lists.createSegmentMember(
                listId,
                segmentId,
                {
                    emailAddress: emailAddress
                }
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding segment member: ' + response[ 'detail' ] );
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
 * Remove a list member from a segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns {} - The response from the Mailchimp API.
 */
export async function removeSegmentMember(
    listId,
    segmentId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.lists.removeSegmentMember(
                listId,
                segmentId,
                subscriberHash
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error removing segment member: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all segments in a list.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 * @param { string } [ type ] - Limit results to a specific type.
 * @param { string } [ sinceCreatedAt ] - Restrict the response to abuse reports created after the set time.
 * @param { string } [ beforeCreatedAt ] - Restrict the response to abuse reports created before the set time.
 * @param { boolean } [ includeCleaned ] - Whether cleaned members should be included in the response.
 * @param { boolean } [ includeTransactional ] - Whether transactional members should be included in the response.
 * @param { boolean } [ includeUnsubscribed ] - Whether unsubscribed members should be included in the response.
 * @param { string } [ sinceUpdatedAt ] - Restrict the response to abuse reports updated after the set time.
 * @param { string } [ beforeUpdatedAt ] - Restrict the response to abuse reports updated before the set time.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListSegmentArray(
    listId,
    fields,
    excludeFields,
    count,
    offset,
    type,
    sinceCreatedAt,
    beforeCreatedAt,
    includeCleaned,
    includeTransactional,
    includeUnsubscribed,
    sinceUpdatedAt,
    beforeUpdatedAt
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( type !== undefined ) options.type = type;
        if ( sinceCreatedAt !== undefined ) options.sinceCreatedAt = sinceCreatedAt;
        if ( beforeCreatedAt !== undefined ) options.beforeCreatedAt = beforeCreatedAt;
        if ( includeCleaned !== undefined ) options.includeCleaned = includeCleaned;
        if ( includeTransactional !== undefined ) options.includeTransactional = includeTransactional;
        if ( includeUnsubscribed !== undefined ) options.includeUnsubscribed = includeUnsubscribed;
        if ( sinceUpdatedAt !== undefined ) options.sinceUpdatedAt = sinceUpdatedAt;
        if ( beforeUpdatedAt !== undefined ) options.beforeUpdatedAt = beforeUpdatedAt;

        let response =
            await mailchimp.lists.listSegments(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list segments: ' + response[ 'detail' ] );
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
 * Add a segment to a list.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } name - Tge name of the segment.
 * @param { string[] } [ staticSegment ] - An array of email addresses for the segment.
 * @param { object } [ options ] - The conditions for the segment.
 * @param { string } [ options.match ] - The conditions for the segment.
 * @param { [] } [ options.conditions ] - The conditions for the segment.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addListSegment(
    listId,
    name,
    staticSegment,
    options
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( staticSegment !== undefined ) body.staticSegment = staticSegment;
        if ( options !== undefined ) body.options = options;

        let response =
            await mailchimp.lists.createSegment(
                listId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error creating segment: ' + response[ 'detail' ] );
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
 * Get information about a specific segment in a list.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { boolean } [ includeCleaned ] - Whether cleaned members should be included in the response.
 * @param { boolean } [ includeTransactional ] - Whether transactional members should be included in the response.
 * @param { boolean } [ includeUnsubscribed ] - Whether unsubscribed members should be included in the response.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListSegment(
    listId,
    segmentId,
    fields,
    excludeFields,
    includeCleaned,
    includeTransactional,
    includeUnsubscribed
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( includeCleaned !== undefined ) options.includeCleaned = includeCleaned;
        if ( includeTransactional !== undefined ) options.includeTransactional = includeTransactional;
        if ( includeUnsubscribed !== undefined ) options.includeUnsubscribed = includeUnsubscribed;

        let response =
            await mailchimp.lists.getSegment(
                listId,
                segmentId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list segment: ' + response[ 'detail' ] );
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
 * Delete a list segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 *
 * @returns {} - The response from the Mailchimp API.
 */
export async function deleteListSegment(
    listId,
    segmentId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteSegment(
                listId,
                segmentId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting segment: ' + response[ 'detail' ] );
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
 * Update a list segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string } name - Tge name of the segment.
 * @param { string[] } [ staticSegment ] - An array of email addresses for the segment.
 * @param { object } [ options ] - The conditions for the segment.
 * @param { string } [ options.match ] - The conditions for the segment.
 * @param { [] } [ options.conditions ] - The conditions for the segment.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateListSegment(
    listId,
    segmentId,
    name,
    staticSegment,
    options
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( staticSegment !== undefined ) body.staticSegment = staticSegment;
        if ( options !== undefined ) body.options = options;

        let response =
            await mailchimp.lists.updateSegment(
                listId,
                segmentId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating segment: ' + response[ 'detail' ] );
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
 * Batch add or remove list members from a segment.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string } segmentId - The unique id for the segment.
 * @param { string[] } [ memberToAddArray ] - An array of email addresses to add to the segment.
 * @param { string[] } [ memberToRemoveArray ] - An array of email addresses to remove from the segment.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function batchListSegmentMember(
    listId,
    segmentId,
    memberToAddArray,
    memberToRemoveArray
    )
{
    try
    {
        let body = {};

        if ( memberToAddArray ) body.memberToAddArray = memberToAddArray;
        if ( memberToRemoveArray ) body.memberToRemoveArray = memberToRemoveArray;

        let response =
            await mailchimp.lists.batchSegmentMembers(
                body,
                listId,
                segmentId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error batch segmenting members: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

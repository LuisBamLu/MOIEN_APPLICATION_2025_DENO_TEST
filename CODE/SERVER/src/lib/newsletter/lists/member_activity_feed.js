// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a member's activity on a specific list.
 *
 * @param { string } listId - The unique ID for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of results to return.
 * @param { number } [ offset ] - The number of results to skip.
 * @param { string[] } [ activityFilters ] - A comma-separated list of activity filters.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberActivityFeed(
    listId,
    subscriberHash,
    fields,
    excludeFields,
    count,
    offset,
    activityFilters
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( activityFilters ) options.activity_filters = activityFilters;

        let response =
            await mailchimp.lists.getListMemberActivityFeed(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting member activity feed: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

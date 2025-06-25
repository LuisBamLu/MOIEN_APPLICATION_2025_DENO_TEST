// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the recent activity for a specific list.
 *
 * @param { string } listId - The ID of the list.
 * @param { number } [ count ] - The number of activities to return.
 * @param { number } [ offset ] - The number of activities to skip before returning the result set.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListActivityArray(
    listId,
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
            await mailchimp.lists.getListRecentActivity(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list activity: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

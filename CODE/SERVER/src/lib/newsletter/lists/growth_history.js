// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a month-by-month summary of a specific list's growth activity.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of activities to return.
 * @param { number } [ offset ] - The number of activities to skip before returning the result set.
 * @param { string } [ sortField ] - The field to sort the results by.
 * @param { string } [ sortDir ] - The direction to sort the results.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListGrowthHistoryData(
    listId,
    fields,
    excludeFields,
    count,
    offset,
    sortField,
    sortDir
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( sortField ) options.sortField = sortField;
        if ( sortDir ) options.sortDir = sortDir;

        let response =
            await mailchimp.lists.getListGrowthHistory(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list growth history: ' + response[ 'detail' ] );
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
 * Get a specific month of a year summary, from a specific list's growth activity.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } month - The month to get the summary for.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListGrowthHistoryByMonth(
    listId,
    month,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.lists.getListGrowthHistoryByMonth(
                listId,
                month,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list growth history by month: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

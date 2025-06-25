// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get all abuse reports for a specific list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListAbuseReportArray(
    listId,
    fields,
    excludeFields,
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;

        let response =
            await mailchimp.lists.getListAbuseReports(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list abuse reports: ' + response[ 'detail' ] );
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
 * Get a specific abuse report.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } reportId - The id for the abuse report.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListAbuseReport(
    listId,
    reportId,
    fields,
    excludeFields,
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;

        let response =
            await mailchimp.lists.getListAbuseReportDetails(
                listId,
                reportId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list abuse report: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

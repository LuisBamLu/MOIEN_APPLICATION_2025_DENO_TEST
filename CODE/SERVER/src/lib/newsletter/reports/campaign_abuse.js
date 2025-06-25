// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the abuse reports for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignAbuseReportArray(
    campaignId,
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
            await mailchimp.reports.getCampaignAbuseReports(
                campaignId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting campaign abuse reports: ' + response[ 'detail' ] );
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
 * Get the abuse report for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } reportId - The id for the abuse report.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignAbuseReport(
    campaignId,
    reportId,
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
            await mailchimp.reports.getCampaignAbuseReport(
                campaignId,
                reportId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting campaign abuse report: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

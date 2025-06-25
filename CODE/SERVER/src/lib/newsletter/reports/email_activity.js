// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the activity (opens, clicks, etc.) for a specific list member in a specific campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ since ] - The date and time since the last activity.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignListMemberActivityArray(
    campaignId,
    fields,
    excludeFields,
    count,
    offset,
    since
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( since !== undefined ) options.since = since;

        let response =
            await mailchimp.reports.getEmailActivityForCampaign(
                campaignId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list member activity for campaign: ' + response[ 'detail' ] );
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
 * Get the activity (opens, clicks, etc.) for a specific list member in a specific campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { string } [ since ] - The date and time since the last activity.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignListMemberActivity(
    campaignId,
    subscriberHash,
    fields,
    excludeFields,
    since
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( since !== undefined ) options.since = since;

        let response =
            await mailchimp.reports.getEmailActivityForSubscriber(
                campaignId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list member activity for campaign: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

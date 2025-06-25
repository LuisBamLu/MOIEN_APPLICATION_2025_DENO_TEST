// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about member who clicked a link in a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } linkId - The id for the link.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignClickSubscriber(
    campaignId,
    linkId,
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
            await mailchimp.reports.getSubscribersInfo(
                campaignId,
                linkId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting campaign click subscriber: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

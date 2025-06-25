// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the eepurl activity for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignEepUrlActivity(
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
            await mailchimp.reports.getEepurlActivityForCampaign(
                campaignId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting eepurl activity for campaign: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

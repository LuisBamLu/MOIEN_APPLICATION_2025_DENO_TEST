// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the content for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignContent(
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
            await mailchimp.campaigns.getContent(
                campaignId,
                options
                );

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// ~~

/**
 * Set the content for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { Object } [ archive ] - The archive information for the campaign.
 * @param { string } [ archive.archiveType ] - The type of archive for the campaign.
 * @param { string } archive.archiveContent - The content of the archive.
 * @param { Object } [ template ] - The template information for the campaign.
 * @param { Object } [ template.sections ] - The sections of the template.
 * @param { number } template.id - The unique id for the template.
 * @param { string } [ plainText ] - The plain-text content for the campaign.
 * @param { string } [ html ] - The HTML content for the campaign.
 * @param { string } [ url ] - The URL for the campaign.
 * @param { Object[] } [ variateContents ] - The content for the variate.
 * @param { Object } [ variateContents.archive ] - The archive information for the variate.
 * @param { string } [ variateContents.archive.archiveContent ] - The content of the archive.
 * @param { string } [ variateContents.archive.archiveType ] - The type of archive for the variate.
 * @param { Object } [ variateContents.template ] - The template information for the variate.
 * @param { number } [ variateContents.template.id ] - The unique id for the template.
 * @param { Object } [ variateContents.template.sections ] - The sections of the template.
 * @param { string } [ variateContents.contentLabel ] - The label for the content.
 * @param { string } [ variateContents.plainText ] - The plain-text content for the variate.
 * @param { string } [ variateContents.html ] - The HTML content for the variate.
 * @param { string } [ variateContents.url ] - The URL for the variate.
 *
 * @returns
 */
export async function setCampaignContent(
    campaignId,
    archive,
    template,
    plainText,
    html,
    url,
    variateContents
    )
{
    try
    {
        let body = {};

        if ( archive !== undefined ) body.archive = archive;
        if ( template !== undefined ) body.template = template;
        if ( plainText !== undefined ) body.plainText = plainText;
        if ( html !== undefined ) body.html = html;
        if ( url !== undefined ) body.url = url;
        if ( variateContents !== undefined ) body.variateContents = variateContents;

        let response =
            await mailchimp.campaigns.setContent(
                campaignId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error setting campaign content: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

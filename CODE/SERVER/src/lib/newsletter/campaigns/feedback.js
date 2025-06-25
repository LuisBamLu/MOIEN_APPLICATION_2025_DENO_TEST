// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the feedback for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignFeedbackArray(
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
            await mailchimp.campaigns.getFeedback(
                campaignId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting campaign feedback: ' + response[ 'detail' ] );
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
 * Add feedback for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } message - The feedback message.
 * @param { number } [ blockId ] - The id for the block.
 * @param { boolean } [ isComplete ] - Whether the feedback is complete.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addCampaignFeedback(
    campaignId,
    message,
    blockId,
    isComplete
    )
{
    try
    {
        let body = {};

        if ( message !== undefined ) body.message = message;
        if ( blockId !== undefined ) body.blockId = blockId;
        if ( isComplete !== undefined ) body.isComplete = isComplete;

        let response =
            await mailchimp.campaigns.addFeedback(
                campaignId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding campaign feedback: ' + response[ 'detail' ] );
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
 * Get the feedback for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } feedbackId - The id for the feedback.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignFeedback(
    campaignId,
    feedbackId,
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
            await mailchimp.campaigns.getFeedbackMessage(
                campaignId,
                feedbackId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting campaign feedback: ' + response[ 'detail' ] );
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
 * Update the feedback for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } feedbackId - The id for the feedback.
 * @param { number } [ blockId ] - The id for the block.
 * @param { string } [ message ] - The feedback message.
 * @param { boolean } [ isComplete ] - Whether the feedback is complete.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateCampaignFeedback(
    campaignId,
    feedbackId,
    blockId,
    message,
    isComplete
    )
{
    try
    {
        let options = {};

        if ( blockId !== undefined ) options.blockId = blockId;
        if ( message !== undefined ) options.message = message;
        if ( isComplete !== undefined ) options.isComplete = isComplete;

        let response =
            await mailchimp.campaigns.yyyyy(
                campaignId,
                feedbackId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating campaign feedback: ' + response[ 'detail' ] );
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
 * Remove the feedback for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } feedbackId - The id for the feedback.
 *
 * @returns {}
 */
export async function deleteCampaignFeedback(
    campaignId,
    feedbackId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.deleteFeedbackMessage(
                campaignId,
                feedbackId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting campaign feedback: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

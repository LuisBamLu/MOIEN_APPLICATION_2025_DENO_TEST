// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import * as content from './campaigns/content';
import * as feedback from './campaigns/feedback';
import * as sendChecklist from './campaigns/send_checklist';

// -- FUNCTIONS

/**
 * Get information about all campaigns in the account.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ type ] - The campaign type. [ 'regular', 'plaintext', 'absplit', 'rss', 'variate' ]
 * @param { string } [ status ] - The campaign status. [ 'save', 'paused', 'schedule', 'sending', 'sent' ]
 * @param { string } [ beforeSendTime ] - Restrict the response to campaigns sent before the set time.
 * @param { string } [ sinceSendTime ] - Restrict the response to campaigns sent after the set time.
 * @param { string } [ beforeCreateTime ] - Restrict the response to campaigns created before the set time.
 * @param { string } [ sinceCreateTime ] - Restrict the response to campaigns created after the set time.
 * @param { string } [ listId ] - Restrict the response to campaigns sent to a specific list.
 * @param { string } [ folderId ] - Restrict the response to campaigns in a specific folder.
 * @param { string } [ memberId ] - Restrict the response to campaigns sent to a specific list member.
 * @param { string } [ sortField ] - The field to sort the response by. [ 'create_time', 'send_time' ]
 * @param { string } [ sortDir ] - The direction to sort the response. [ 'ASC', 'DESC' ]
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignArray(
    listId,
    fields,
    excludeFields,
    count,
    offset,
    type,
    status,
    beforeSendTime,
    sinceSendTime,
    beforeCreateTime,
    sinceCreateTime,
    folderId,
    memberId,
    sortField,
    sortDir
    )
{
    try
    {
        let options = {};

        if ( listId !== undefined ) options.listId = listId;
        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( type !== undefined ) options.type = type;
        if ( status !== undefined ) options.status = status;
        if ( beforeSendTime !== undefined ) options.beforeSendTime = beforeSendTime;
        if ( sinceSendTime !== undefined ) options.sinceSendTime = sinceSendTime;
        if ( beforeCreateTime !== undefined ) options.beforeCreateTime = beforeCreateTime;
        if ( sinceCreateTime !== undefined ) options.sinceCreateTime = sinceCreateTime;
        if ( folderId !== undefined ) options.folderId = folderId;
        if ( memberId !== undefined ) options.memberId = memberId;
        if ( sortField !== undefined ) options.sortField = sortField;
        if ( sortDir !== undefined ) options.sortDir = sortDir;

        let response =
            await mailchimp.campaigns.list(
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
 * Create a new campaign in the Mailchimp account.
 *
 * @param { string } type - The campaign type. [ 'regular', 'plaintext', 'absplit', 'rss', 'variate' ]
 * @param { Object } [ rssOpts ] - The RSS options for the campaign.
 * @param { Object } [ rssOpts.schedule ] - The schedule for the RSS campaign.
 * @param { number } [ rssOpts.schedule.hour ] - The hour to send the campaign.
 * @param { Object } [ rssOpts.schedule.dailySend ] - The daily send time for the campaign.
 * @param { boolean } [ rssOpts.schedule.dailySend.sunday ] - Whether to send the campaign on Sunday.
 * @param { boolean } [ rssOpts.schedule.dailySend.monday ] - Whether to send the campaign on Monday.
 * @param { boolean } [ rssOpts.schedule.dailySend.tuesday ] - Whether to send the campaign on Tuesday.
 * @param { boolean } [ rssOpts.schedule.dailySend.wednesday ] - Whether to send the campaign on Wednesday.
 * @param { boolean } [ rssOpts.schedule.dailySend.thursday ] - Whether to send the campaign on Thursday.
 * @param { boolean } [ rssOpts.schedule.dailySend.friday ] - Whether to send the campaign on Friday.
 * @param { boolean } [ rssOpts.schedule.dailySend.saturday ] - Whether to send the campaign on Saturday.
 * @param { string } [ rssOpts.schedule.weeklySendDay ] - The day of the week to send the campaign.
 * @param { number } [ rssOpts.schedule.monthlySendDate ] - The day of the month to send the campaign.
 * @param { boolean } [ rssOpts.constrainRssImg ] - Whether to add CSS to images in the RSS feed.
 * @param { string } rssOpts.feedUrl - The URL for the RSS feed.
 * @param { string } rssOpts.frequency - The frequency for the RSS campaign. [ 'daily', 'weekly', 'monthly' ]
 * @param { Object } [ recipients ] - List settings for the campaign.
 * @param { Object } [ recipients.segmentOpts ] - The segment options for the campaign.
 * @param { number } [ recipients.segmentOpts.savedSegmentId ] - The unique id for the saved segment.
 * @param { string } [ recipients.segmentOpts.match ] - The match type for the segment. [ 'any', 'all' ]
 * @param { [] } [ recipients.segmentOpts.conditions ] - The conditions for the segment.
 * @param { string } [ recipients.listId ] - The unique id for the list.
 * @param { Object } [ variateSettings ] - The settings for a variate campaign.
 * @param { number } [ variateSettings.waitTime ] - The time to wait before selecting the winner.
 * @param { number } [ variateSettings.testSize ] - The size of the test group for the campaign.
 * @param { string[] } [ variateSettings.subjectLines ] - The subject lines for the campaign.
 * @param { string[] } [ variateSettings.sendTimes ] - The send times for the campaign.
 * @param { string[] } [ variateSettings.fromNames ] - The from names for the campaign.
 * @param { string[] } [ variateSettings.replyToAddresses ] - The reply-to email addresses for the campaign.
 * @param { string } [ variateSettings.winnerCriteria ] - The criteria for selecting the winner. [ 'opens', 'clicks', 'total_revenue', 'total_orders' ]
 * @param { Object } [ settings ] - The settings for the campaign.
 * @param { string } [ settings.subjectLine ] - The subject line for the campaign.
 * @param { string } [ settings.previewText ] - The preview text for the campaign.
 * @param { string } [ settings.title ]
 * @param { string } [ settings.fromName ] - The name for the campaign.
 * @param { string } [ settings.replyTo ] - The reply-to email address for the campaign.
 * @param { boolean } [ settings.useConversation ] - Whether to use the conversation for the campaign.
 * @param { string } [ settings.toName ] - The name for the campaign.
 * @param { string } [ settings.folderId ] - The unique id for the folder.
 * @param { boolean } [ settings.authenticate ] - Whether to authenticate the campaign.
 * @param { boolean } [ settings.autoFooter ] - Whether to automatically add the footer to the campaign.
 * @param { boolean } [ settings.inlineCss ] - Whether to inline the CSS for the campaign.
 * @param { boolean } [ settings.autoTweet ] - Whether to automatically tweet the campaign.
 * @param { string[] } [ settings.autoFbPost ] - The social media posts to automatically post to Facebook.
 * @param { boolean } [ settings.fbComments ] - Whether to enable Facebook comments for the campaign.
 * @param { number } [ settings.templateId ] - The unique id for the template.
 * @param { Object } [ tracking ] - The tracking settings for the campaign.
 * @param { boolean } [ tracking.opens ] - Whether to track opens for the campaign.
 * @param { boolean } [ tracking.htmlClicks ] - Whether to track HTML clicks for the campaign.
 * @param { boolean } [ tracking.textClicks ] - Whether to track text clicks for the campaign.
 * @param { boolean } [ tracking.ecomm360 ] - Whether to track e-commerce data for the campaign.
 * @param { string } [ tracking.googleAnalytics ] - The Google Analytics settings for the campaign.
 * @param { string } [ tracking.clicktale ] - The ClickTale settings for the campaign.
 * @param { Object } [ socialCard ] - The social card settings for the campaign.
 * @param { string } [ socialCard.imageUrl ] - The URL for the social card image.
 * @param { string } [ socialCard.description ] - The description for the social card.
 * @param { string } [ socialCard.title ] - The title for the social card.
 * @param { string } [ contentType ] - The content type for the campaign. [ 'template', 'multichannel' ]
 *
 * @returns
 */
export async function addCampaign(
    type = undefined,
    contentType = undefined,
    recipients = undefined,
    settings = undefined,
    rssOpts = undefined,
    variateSettings = undefined,
    tracking = undefined,
    socialCard = undefined
    )
{
    try
    {
        let body = {};

        if ( type !== undefined ) body.type = type;
        if ( rssOpts !== undefined ) body.rssOpts = rssOpts;
        if ( recipients !== undefined ) body.recipients = recipients;
        if ( variateSettings !== undefined ) body.variateSettings = variateSettings;
        if ( settings !== undefined ) body.settings = settings;
        if ( tracking !== undefined ) body.tracking = tracking;
        if ( socialCard !== undefined ) body.socialCard = socialCard;
        if ( contentType !== undefined ) body.contentType = contentType;

        let response =
            await mailchimp.campaigns.create(
                body
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
 * Get information about a specific campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaign(
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
            await mailchimp.campaigns.get(
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
 * Update a campaign in the Mailchimp account.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { Object } [ recipients ] - List settings for the campaign.
 * @param { Object } [ recipients.segmentOpts ] - The segment options for the campaign.
 * @param { number } [ recipients.segmentOpts.savedSegmentId ] - The unique id for the saved segment.
 * @param { string } [ recipients.segmentOpts.match ] - The match type for the segment. [ 'any', 'all' ]
 * @param { [] } [ recipients.segmentOpts.conditions ] - The conditions for the segment.
 * @param { string } recipients.listId - The unique id for the list.
 * @param { Object } settings - The settings for the campaign.
 * @param { string } [ settings.previewText ] - The preview text for the campaign.
 * @param { string } [ settings.title ]
 * @param { boolean } [ settings.useConversation ] - Whether to use the conversation for the campaign.
 * @param { string } [ settings.toName ] - The name for the campaign.
 * @param { string } [ settings.folderId ] - The unique id for the folder.
 * @param { boolean } [ settings.authenticate ] - Whether to authenticate the campaign.
 * @param { boolean } [ settings.autoFooter ] - Whether to automatically add the footer to the campaign.
 * @param { boolean } [ settings.inlineCss ] - Whether to inline the CSS for the campaign.
 * @param { boolean } [ settings.autoTweet ] - Whether to automatically tweet the campaign.
 * @param { string[] } [ settings.autoFbPost ] - The social media posts to automatically post to Facebook.
 * @param { boolean } [ settings.fbComments ] - Whether to enable Facebook comments for the campaign.
 * @param { number } [ settings.templateId ] - The unique id for the template.
 * @param { string } settings.subjectLine - The subject line for the campaign.
 * @param { string } settings.fromName - The from name for the campaign.
 * @param { string } settings.replyTo - The reply-to email address for the campaign.
 * @param { Object } [ rssOpts ] - The RSS options for the campaign.
 * @param { Object } [ rssOpts.schedule ] - The schedule for the RSS campaign.
 * @param { number } [ rssOpts.schedule.hour ] - The hour to send the campaign.
 * @param { Object } [ rssOpts.schedule.dailySend ] - The daily send time for the campaign.
 * @param { boolean } [ rssOpts.schedule.dailySend.sunday ] - Whether to send the campaign on Sunday.
 * @param { boolean } [ rssOpts.schedule.dailySend.monday ] - Whether to send the campaign on Monday.
 * @param { boolean } [ rssOpts.schedule.dailySend.tuesday ] - Whether to send the campaign on Tuesday.
 * @param { boolean } [ rssOpts.schedule.dailySend.wednesday ] - Whether to send the campaign on Wednesday.
 * @param { boolean } [ rssOpts.schedule.dailySend.thursday ] - Whether to send the campaign on Thursday.
 * @param { boolean } [ rssOpts.schedule.dailySend.friday ] - Whether to send the campaign on Friday.
 * @param { boolean } [ rssOpts.schedule.dailySend.saturday ] - Whether to send the campaign on Saturday.
 * @param { string } [ rssOpts.schedule.weeklySendDay ] - The day of the week to send the campaign.
 * @param { number } [ rssOpts.schedule.monthlySendDate ] - The day of the month to send the campaign.
 * @param { boolean } [ rssOpts.constrainRssImg ] - Whether to add CSS to images in the RSS feed.
 * @param { string } rssOpts.feedUrl - The URL for the RSS feed.
 * @param { string } rssOpts.frequency - The frequency for the RSS campaign. [ 'daily', 'weekly', 'monthly' ]
 * @param { Object } [ variateSettings ] - The settings for a variate campaign.
 * @param { number } [ variateSettings.waitTime ] - The time to wait before selecting the winner.
 * @param { number } [ variateSettings.testSize ] - The size of the test group for the campaign.
 * @param { string[] } [ variateSettings.subjectLines ] - The subject lines for the campaign.
 * @param { string[] } [ variateSettings.sendTimes ] - The send times for the campaign.
 * @param { string[] } [ variateSettings.fromNames ] - The from names for the campaign.
 * @param { string[] } [ variateSettings.replyToAddresses ] - The reply-to email addresses for the campaign.
 * @param { string } [ variateSettings.winnerCriteria ] - The criteria for selecting the winner. [ 'opens', 'clicks', 'total_revenue', 'total_orders' ]
 * @param { Object } [ tracking ] - The tracking settings for the campaign.
 * @param { boolean } [ tracking.opens ] - Whether to track opens for the campaign.
 * @param { boolean } [ tracking.htmlClicks ] - Whether to track HTML clicks for the campaign.
 * @param { boolean } [ tracking.textClicks ] - Whether to track text clicks for the campaign.
 * @param { boolean } [ tracking.ecomm360 ] - Whether to track e-commerce data for the campaign.
 * @param { string } [ tracking.googleAnalytics ] - The Google Analytics settings for the campaign.
 * @param { string } [ tracking.clicktale ] - The ClickTale settings for the campaign.
 * @param { Object } [ socialCard ] - The social card settings for the campaign.
 * @param { string } [ socialCard.imageUrl ] - The URL for the social card image.
 * @param { string } [ socialCard.description ] - The description for the social card.
 * @param { string } [ socialCard.title ] - The title for the social card.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateCampaign(
    campaignId,
    recipients,
    settings,
    rssOpts,
    variateSettings,
    tracking,
    socialCard
    )
{
    try
    {
        let body = {};

        if ( recipients !== undefined ) body.recipients = recipients;
        if ( settings !== undefined ) body.settings = settings;
        if ( rssOpts !== undefined ) body.rssOpts = rssOpts;
        if ( variateSettings !== undefined ) body.variateSettings = variateSettings;
        if ( tracking !== undefined ) body.tracking = tracking;
        if ( socialCard !== undefined ) body.socialCard = socialCard;

        let response =
            await mailchimp.campaigns.update(
                campaignId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating campaign: ' + response[ 'detail' ] );
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
 * Remove a campaign from the Mailchimp account.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function deleteCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.remove(
                campaignId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting campaign: ' + response[ 'detail' ] );
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
 * Cancel a campaign that is in the process of being sent.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function cancelCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.cancelSend(
                campaignId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error canceling campaign: ' + response[ 'detail' ] );
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
 * Send a campaign that is in draft status.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function sendCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.send(
                campaignId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error sending campaign: ' + response[ 'detail' ] );
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
 * Schedule a campaign to be sent at a specific time.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string } scheduleTime - The time to schedule the campaign.
 * @param { Object } [ batchDelivery ] - The batch delivery settings for the campaign.
 * @param { number } [ batchDelivery.batchDelay ] - The delay, in minutes, between batches.
 * @param { number } [ batchDelivery.batchCount ] - The number of batches to send.
 * @param { boolean } [ timewarp ] - Whether to timewarp the campaign.
 *
 * @returns {}
 */
export async function scheduleCampaign(
    campaignId,
    scheduleTime,
    batchDelivery,
    timewarp
    )
{
    try
    {
        let body = {};

        if ( scheduleTime !== undefined ) body.scheduleTime = scheduleTime;
        if ( batchDelivery !== undefined ) body.batchDelivery = batchDelivery;
        if ( timewarp !== undefined ) body.timewarp = timewarp;

        let response =
            await mailchimp.campaigns.schedule(
                campaignId,
                body
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error scheduling campaign: ' + response[ 'detail' ] );
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
 * Unschedule a scheduled campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function unscheduleCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.unschedule(
                campaignId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error unscheduling campaign: ' + response[ 'detail' ] );
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
 * Pause a RSS campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function pauseRssCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.pause(
                campaignId,
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error pausing RSS campaign: ' + response[ 'detail' ] );
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
 * Resume a paused RSS campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns {}
 */
export async function resumeRssCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.resume(
                campaignId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error resuming RSS campaign: ' + response[ 'detail' ] );
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
 * Replicate a campaign in saved or send status.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function replicateCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.replicate(
                campaignId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error replicating campaign: ' + response[ 'detail' ] );
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
 * Send a test email for a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } testEmails - An array of email addresses to send the test email to.
 * @param { string } sendType - The type of test email to send. [ 'html', 'plaintext' ]
 *
 * @returns {}
 */
export async function sendTestEmail(
    campaignId,
    testEmails,
    sendType
    )
{
    try
    {
        let body = {};

        if ( testEmails !== undefined ) body.testEmails = testEmails;
        if ( sendType !== undefined ) body.sendType = sendType;

        let response =
            await mailchimp.campaigns.sendTestEmail(
                campaignId,
                body
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error sending test email: ' + response[ 'detail' ] );
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
 * Create a resend to non-openers of a campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function resendCampaign(
    campaignId
    )
{
    try
    {
        let response =
            await mailchimp.campaigns.createResend(
                campaignId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error resending campaign: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- STATEMENTS

export
{
    content,
    feedback,
    sendChecklist
};

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import * as campaignAbuse from './reports/campaign_abuse';
import * as campaignAdvice from './reports/campaign_advice';
import * as campaignOpenReports from './reports/campaign_open_reports';
import * as clickReportsMembers from './reports/click_reports_members';
import * as clickReports from './reports/click_reports';
import * as domainPerformance from './reports/domain_performance';
import * as eepurlReports from './reports/eepurl_reports';
import * as emailActivity from './reports/email_activity';
import * as location from './reports/location';
import * as sentTo from './reports/sent_to';
import * as subReports from './reports/sub_reports';
import * as unsubscribes from './reports/unsubscribes';

// -- FUNCTIONS

/**
 * Get information about all campaigns in the account.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ type ] - The campaign type. [ 'regular', 'plaintext', 'absplit', 'rss', 'variate' ]
 * @param { string } [ beforeSendTime ] - Restrict the response to campaigns sent before the set time.
 * @param { string } [ sinceSendTime ] - Restrict the response to campaigns sent after the set time.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignReportArray(
    sinceSendTime,
    beforeSendTime,
    fields,
    excludeFields,
    count,
    offset,
    type
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( type !== undefined ) options.type = type;
        if ( beforeSendTime !== undefined ) options.beforeSendTime = beforeSendTime;
        if ( sinceSendTime !== undefined ) options.sinceSendTime = sinceSendTime;

        let response =
            await mailchimp.reports.getAllCampaignReports(
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
 * Get information about a specific campaign.
 *
 * @param { string } campaignId - The unique id for the campaign.
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignReport(
    campaignId,
    fields = undefined,
    excludeFields = undefined
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.reports.getCampaignReport(
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

// -- STATEMENTS

export
{
    campaignAbuse,
    campaignAdvice,
    campaignOpenReports,
    clickReportsMembers,
    clickReports,
    domainPerformance,
    eepurlReports,
    emailActivity,
    location,
    sentTo,
    subReports,
    unsubscribes
};

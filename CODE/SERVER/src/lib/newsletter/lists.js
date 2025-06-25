import mailchimp from '@mailchimp/mailchimp_marketing';
import * as abuseReports from './lists/abuse_reports';
import * as activity from './lists/activity';
import * as clients from './lists/clients';
import * as events from './lists/events';
import * as growthHistory from './lists/growth_history';
import * as interestCategories from './lists/interest_categories';
import * as interests from './lists/interests';
import * as locations from './lists/locations';
import * as memberActivityFeed from './lists/member_activity_feed';
import * as memberActivity from './lists/member_activity';
import * as memberGoals from './lists/member_goals';
import * as memberNotes from './lists/member_notes';
import * as memberTags from './lists/member_tags';
import * as members from './lists/members';
import * as mergeFields from './lists/merge_fields';
import * as segmentMembers from './lists/segment_members';
import * as segments from './lists/segments';
import * as signupForms from './lists/signup_forms';
import * as surveys from './lists/surveys';
import * as tagSearch from './lists/tag_search';
import * as webhooks from './lists/webhooks';

/**
 * Get all lists in the account.
 *
 * @param { string[] } [ fields ] A comma-separated list of fields to return. Reference parameters of sub-objects with dot notation.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude. Reference parameters of sub-objects with dot notation.
 * @param { number } [ count ] The number of records to return. Default value is 10. Maximum value is 1000 (default to 10)
 * @param { number } [ offset ] Used for pagination, this it the number of records from a collection to skip. Default value is 0. (default to 0)
 * @param { string } [ beforeDateCreated ] Restrict response to lists created before the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
 * @param { string } [ sinceDateCreated ] Restrict results to lists created after the set date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
 * @param { string } [ beforeCampaignLastSent ] Restrict results to lists created before the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
 * @param { string } [ sinceCampaignLastSent ] Restrict results to lists created after the last campaign send date. Uses ISO 8601 time format: 2015-10-21T15:41:36+00:00.
 * @param { string } [ email ] Restrict results to lists that include a specific subscriber's email address.
 * @param { string } [ sortField ] Returns files sorted by the specified field.
 * @param { string } [ sortDir ] Determines the order direction for sorted results.
 * @param { boolean } [ hasEcommerceStore ] Restrict results to lists that contain an active, connected, undeleted ecommerce store.
 * @param { boolean } [ includeTotalContacts ] Return the total_contacts field in the stats response, which contains an approximate count of all contacts in any state.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { Object[] } response.lists - An array of objects, each representing a list.
 * @returns { number } response.total_items - The total number of items.
 * @returns { Object } response.constraints - Do particular authorization constraints around this collection limit creation of new instances?
 * @returns { Object[] } response._links - A list of link types and descriptions for the API schema documents.
 */
export async function getListArray(
    fields,
    excludeFields,
    count,
    offset,
    beforeDateCreated,
    sinceDateCreated,
    beforeCampaignLastSent,
    sinceCampaignLastSent,
    email,
    sortField,
    sortDir,
    hasEcommerceStore,
    includeTotalContacts
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( beforeDateCreated ) options.beforeDateCreated = beforeDateCreated;
        if ( sinceDateCreated ) options.sinceDateCreated = sinceDateCreated;
        if ( beforeCampaignLastSent ) options.beforeCampaignLastSent = beforeCampaignLastSent;
        if ( sinceCampaignLastSent ) options.sinceCampaignLastSent = sinceCampaignLastSent;
        if ( email ) options.email = email;
        if ( sortField ) options.sortField = sortField;
        if ( sortDir ) options.sortDir = sortDir;
        if ( hasEcommerceStore ) options.hasEcommerceStore = hasEcommerceStore;
        if ( includeTotalContacts ) options.includeTotalContacts = includeTotalContacts;

        let response =
            await mailchimp.lists.getAllLists(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting lists: ' + response[ 'detail' ] );
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
 * Create a new list.
 *
 * @param { string } name - The name of the list.
 * @param { Object } contact - The contact information for the list.
 * @param { string } contact.company - The company name for the list.
 * @param { string } contact.address1 - The street address for the list.
 * @param { string } contact.city - The city for the list.
 * @param { string } contact.country - The country for the list.
 * @param { string } [ contact.state ] - The state for the list.
 * @param { string } [ contact.address2 ] - The second street address for the list.
 * @param { string } [ contact.zip ] - The postal or zip code for the list.
 * @param { string } [ contact.phone ] - The phone number for the list.
 * @param { string } permiossionReminder - The permission reminder for the list.
 * @param { Object } campaignDefaults - The default values for campaigns created for the list.
 * @param { string } campaignDefaults.fromName - The default from name for campaigns created for the list.
 * @param { string } campaignDefaults.fromEmail - The default from email for campaigns created for the list.
 * @param { string } campaignDefaults.subject - The default subject line for campaigns created for the list.
 * @param { string } campaignDefaults.language - The default language for campaigns created for the list.
 * @param { boolean } emailTypeOptions - The email type options for the list.
 * @param { boolean } [ useArchiveBar ] - Whether to use the Mailchimp archive bar in campaigns.
 * @param { string } [ notifyOnSubscribe ] - The email address to notify when someone subscribes to the list.
 * @param { string } [ notifyOnUnsubscribe ] - The email address to notify when someone unsubscribes from the list.
 * @param { boolean } [ doubleOptin ] - Whether to require a double opt-in process for subscribers.
 * @param { boolean } [ marketingPermissions ] - Whether to enable GDPR fields and marketing permissions for the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addList(
    name,
    contact,
    permiossionReminder,
    campaignDefaults,
    emailTypeOption,
    useArchiveBar,
    notifyOnSubscribe,
    notifyOnUnsubscribe,
    doubleOptin,
    marketingPermissions
    )
{
    try
    {
        let options = {};

        if ( name !== undefined ) options.name = name;
        if ( contact !== undefined ) options.contact = contact;
        if ( permiossionReminder !== undefined ) options.permiossionReminder = permiossionReminder;
        if ( campaignDefaults !== undefined ) options.campaignDefaults = campaignDefaults;
        if ( emailTypeOption !== undefined ) options.emailTypeOption = emailTypeOption;
        if ( useArchiveBar !== undefined ) options.useArchiveBar = useArchiveBar;
        if ( notifyOnSubscribe !== undefined ) options.notifyOnSubscribe = notifyOnSubscribe;
        if ( notifyOnUnsubscribe !== undefined ) options.notifyOnUnsubscribe = notifyOnUnsubscribe;
        if ( doubleOptin !== undefined ) options.doubleOptin = doubleOptin;
        if ( marketingPermissions !== undefined ) options.marketingPermissions = marketingPermissions;

        let response =
            await mailchimp.lists.createList(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error creating list: ' + response[ 'detail' ] );
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
 * Get information for a specific list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { boolean } [ includeTotalContacts ] - Return the total_contacts field in the stats response,
 * which contains an approximate count of all contacts in any state.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getList(
    listId,
    fields,
    excludeFields,
    includeTotalContacts
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( includeTotalContacts !== undefined ) options.includeTotalContacts = includeTotalContacts;

        let response =
            await mailchimp.lists.getList(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list: ' + response[ 'detail' ] );
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
 * Update a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } name - The name of the list.
 * @param { Object } contact - The contact information for the list.
 * @param { string } contact.company - The company name for the list.
 * @param { string } contact.address1 - The street address for the list.
 * @param { string } contact.city - The city for the list.
 * @param { string } contact.country - The country for the list.
 * @param { string } [ contact.state ] - The state for the list.
 * @param { string } [ contact.address2 ] - The second street address for the list.
 * @param { string } [ contact.zip ] - The postal or zip code for the list.
 * @param { string } [ contact.phone ] - The phone number for the list.
 * @param { string } permiossionReminder - The permission reminder for the list.
 * @param { Object } campaignDefaults - The default values for campaigns created for the list.
 * @param { string } campaignDefaults.fromName - The default from name for campaigns created for the list.
 * @param { string } campaignDefaults.fromEmail - The default from email for campaigns created for the list.
 * @param { string } campaignDefaults.subject - The default subject line for campaigns created for the list.
 * @param { string } campaignDefaults.language - The default language for campaigns created for the list.
 * @param { boolean } emailTypeOption - The email type options for the list.
 * @param { boolean } [ useArchiveBar ] - Whether to use the Mailchimp archive bar in campaigns.
 * @param { string } [ notifyOnSubscribe ] - The email address to notify when someone subscribes to the list.
 * @param { string } [ notifyOnUnsubscribe ] - The email address to notify when someone unsubscribes from the list.
 * @param { boolean } [ doubleOptin ] - Whether to require a double opt-in process for subscribers.
 * @param { boolean } [ marketingPermissions ] - Whether to enable GDPR fields and marketing permissions for the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateList(
    listId,
    name,
    contact,
    permiossionReminder,
    campaignDefaults,
    emailTypeOption,
    useArchiveBar,
    notifyOnSubscribe,
    notifyOnUnsubscribe,
    doubleOptin,
    marketingPermissions
    )
{
    try
    {
        let options = {};

        if ( name !== undefined ) options.name = name;
        if ( contact !== undefined ) options.contact = contact;
        if ( permiossionReminder !== undefined ) options.permiossionReminder = permiossionReminder;
        if ( campaignDefaults !== undefined ) options.campaignDefaults = campaignDefaults;
        if ( emailTypeOption !== undefined ) options.emailTypeOption = emailTypeOption;
        if ( useArchiveBar !== undefined ) options.useArchiveBar = useArchiveBar;
        if ( notifyOnSubscribe !== undefined ) options.notifyOnSubscribe = notifyOnSubscribe;
        if ( notifyOnUnsubscribe !== undefined ) options.notifyOnUnsubscribe = notifyOnUnsubscribe;
        if ( doubleOptin !== undefined ) options.doubleOptin = doubleOptin;
        if ( marketingPermissions !== undefined ) options.marketingPermissions = marketingPermissions;

        let response =
            await mailchimp.lists.updateList(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating list: ' + response[ 'detail' ] );
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
 * Delete a list.
 *
 * @param { string } listId - The ID of the list.
 *
 * @returns {} - The response from the Mailchimp API.
 */
export async function deleteList(
    listId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteList(
                listId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting list: ' + response[ 'detail' ] );
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
 * Batch subscribe or unsubscribe list members.
 *
 * @param { string } listId - The ID of the list.
 * @param { boolean } [ skipMergeValidation ] - Whether to skip merge field validation.
 * @param { boolean } [ skipDuplicateCheck ] - Whether to skip duplicate check.
 * @param { Object[] } members - The members to subscribe or unsubscribe.
 * @param { Object } members[].emailAddress - The email address for the member.
 * @param { Object } members[].emailType - Type of email the member prefers.
 * @param { string } members[].status - The status for the member.
 * @param { Object } members[].mergeFields - The merge fields for the member.
 * @param { Object } members[].interests - The interests for the member.
 * @param { string } members[].language - The language for the member.
 * @param { boolean } members[].vip - Whether the member is a VIP.
 * @param { Object } members[].location - The location for the member.
 * @param { number } members[].location.latitude - The latitude for the member.
 * @param { number } members[].location.longitude - The longitude for the member.
 * @param { string } members[].ip_signup - The signup IP address for the member.
 * @param { string } members[].timestampSignup - The signup timestamp for the member.
 * @param { string } members[].ip_opt - The opt-in IP address for the member.
 * @param { string } members[].timestamp_opt - The opt-in timestamp for the member.
 * @param { boolean } [ syncTags ] - Whether to sync tags for the member.
 * @param { boolean } [ updateExisting ] - Whether to update existing members.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function batchSubscription(
    listId,
    skipMergeValidation,
    skipDuplicateCheck,
    members,
    syncTags,
    updateExisting
    )
{
    try
    {
        let body = {};

        if ( members !== undefined ) body.members = members;
        if ( syncTags !== undefined ) body.syncTags = syncTags;
        if ( updateExisting !== undefined ) body.updateExisting = updateExisting;

        let options = {};

        if ( skipMergeValidation !== undefined ) options.skipMergeValidation = skipMergeValidation;
        if ( skipDuplicateCheck !== undefined ) options.skipDuplicateCheck = skipDuplicateCheck;

        let response =
            await mailchimp.lists.batchListMembers(
                listId,
                body,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error subscribing or unsubscribing members: ' + response[ 'detail' ] );
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
    abuseReports,
    activity,
    clients,
    events,
    growthHistory,
    interestCategories,
    interests,
    locations,
    memberActivityFeed,
    memberActivity,
    memberGoals,
    memberNotes,
    memberTags,
    members,
    mergeFields,
    segmentMembers,
    segments,
    signupForms,
    surveys,
    tagSearch,
    webhooks
};

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import { getJsonObject } from 'senselogic-gist';

// -- FUNCTIONS

/**
 * Get information about all members in a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string } [ emailType ] - The email type.
 * @param { string } [ status ] - The status of the subscriber.
 * @param { string } [ sinceTimestampOpt ] - The date and time since the last campaign.
 * @param { string } [ beforeTimestampOpt ] - The date and time before the last campaign.
 * @param { string } [ sinceLastChanged ] - The date and time since the last change.
 * @param { string } [ beforeLastChanged ] - The date and time before the last change.
 * @param { string } [ uniqueEmailId ] - The unique email ID.
 * @param { boolean } [ vipOnly ] - A filter to return only the list's VIP members.
 * @param { string } [ interestCategoryId ] - The interest category ID.
 * @param { string } [ interestIds ] - The interest IDs.
 * @param { string } [ interestMatch ] - Used to filter list members by interests.
 * - Must be accompanied by interest_category_id and interest_ids.
 * @param { string } [ sortField ] - The field to sort by.
 * @param { string } [ sortDir ] - The direction to sort. [ 'ASC' | 'DESC' ]
 * @param { boolean } [ sinceLastCampaign ] - ilter subscribers by those subscribed/unsubscribed/pending/cleaned since last email campaign send.
 * @param { string } [ unsubscribedSince ] - Filter subscribers by those unsubscribed since a specific date.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListMemberArray(
    listId = undefined,
    fields = undefined,
    excludeFields = undefined,
    count = undefined,
    offset = undefined,
    emailType = undefined,
    status = undefined,
    sinceTimestampOpt = undefined,
    beforeTimestampOpt = undefined,
    sinceLastChanged = undefined,
    beforeLastChanged = undefined,
    uniqueEmailId = undefined,
    vipOnly = undefined,
    interestCategoryId = undefined,
    interestIds = undefined,
    interestMatch = undefined,
    sortField = undefined,
    sortDir = undefined,
    sinceLastCampaign = undefined,
    unsubscribedSince = undefined
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( emailType !== undefined ) options.emailType = emailType;
        if ( status !== undefined ) options.status = status;
        if ( sinceTimestampOpt !== undefined ) options.sinceTimestampOpt = sinceTimestampOpt;
        if ( beforeTimestampOpt !== undefined ) options.beforeTimestampOpt = beforeTimestampOpt;
        if ( sinceLastChanged !== undefined ) options.sinceLastChanged = sinceLastChanged;
        if ( beforeLastChanged !== undefined ) options.beforeLastChanged = beforeLastChanged;
        if ( uniqueEmailId !== undefined ) options.uniqueEmailId = uniqueEmailId;
        if ( vipOnly !== undefined ) options.vipOnly = vipOnly;
        if ( interestCategoryId !== undefined ) options.interestCategoryId = interestCategoryId;
        if ( interestIds !== undefined ) options.interestIds = interestIds;
        if ( interestMatch !== undefined ) options.interestMatch = interestMatch;
        if ( sortField !== undefined ) options.sortField = sortField;
        if ( sortDir !== undefined ) options.sortDir = sortDir;
        if ( sinceLastCampaign !== undefined ) options.sinceLastCampaign = sinceLastCampaign;
        if ( unsubscribedSince !== undefined ) options.unsubscribedSince = unsubscribedSince;

        let response =
            await mailchimp.lists.getListMembersInfo(
                listId,
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
 * Add a new member to a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { boolean } [ skipMergeValidation ] - Whether to bypass the merge field validation.
 * @param { string } emailAddress - The email address for the list member.
 * @param { string } status - The status of the subscriber.
 * @param { string } [ emailType ] - The email type.
 * @param { Object } [ mergeFields ] - The merge fields for the subscriber.
 * @param { Object } [ interests ] - The interests for the subscriber.
 * @param { string } [ language ] - The language for the subscriber.
 * @param { boolean } [ vip ] - Whether the subscriber is a VIP.
 * @param { Object } [ location ] - The location for the subscriber.
 * @param { string } [ location.latitude ] - The latitude for the subscriber.
 * @param { string } [ location.longitude ] - The longitude for the subscriber.
 * @param { Object[] } [ marketingPermissions ] - The marketing permissions for the subscriber.
 * @param { string } [ marketingPermissions.marketingPermissionId ] - The ID for the marketing permission.
 * @param { boolean } [ marketingPermissions.enabled ] - Whether the marketing permission is enabled.
 * @param { string } [ ipSignup ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampSignup ] - The date and time the subscriber signed up.
 * @param { string } [ ipOpt ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampOpt ] - The date and time for the last change.
 * @param { string[] } [ tags ] - The tags for the subscriber.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addListMember(
    listId,
    skipMergeValidation,
    emailAddress,
    status,
    emailType,
    mergeFields,
    interests,
    language,
    vip,
    location,
    marketingPermissions,
    ipSignup,
    timestampSignup,
    ipOpt,
    timestampOpt,
    tags
    )
{
    try
    {
        let options = {};

        if ( skipMergeValidation !== undefined ) options.skipMergeValidation = skipMergeValidation;

        let body = {};

        if ( emailAddress !== undefined ) body.email_address = emailAddress;
        if ( status !== undefined ) body.status = status;
        if ( emailType !== undefined ) body.email_type = emailType;
        if ( mergeFields !== undefined ) body.merge_fields = mergeFields;
        if ( interests !== undefined ) body.interests = interests;
        if ( language !== undefined ) body.language = language;
        if ( vip !== undefined ) body.vip = vip;
        if ( location !== undefined
             && location.latitude !== undefined
             && location.longitude !== undefined ) body.location = location;
        if ( marketingPermissions !== undefined ) body.marketing_permissions = marketingPermissions;
        if ( ipSignup !== undefined ) body.ip_signup = ipSignup;
        if ( timestampSignup !== undefined ) body.timestamp_signup = timestampSignup;
        if ( ipOpt !== undefined ) body.ip_opt = ipOpt;
        if ( timestampOpt !== undefined ) body.timestamp_opt = timestampOpt;
        if ( tags !== undefined ) body.tags = tags;

        let response =
            await mailchimp.lists.addListMember(
                listId,
                body,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding list member: ' + response[ 'detail' ] );
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
 * Get information about a specific list member.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListMember(
    listId,
    subscriberHash,
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
            await mailchimp.lists.getListMember(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list member: ' + response[ 'detail' ] );
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
 * Add or update a list member.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { boolean } [ skipMergeValidation ] - Whether to bypass the merge field validation.
 * @param { string } emailAddress - The email address for the list member.
 * @param { string } statusIfNew - The status of the subscriber if a new subscriber.
 * @param { string } [ emailType ] - The email type.
 * @param { string } [ status ] - The status of the subscriber.
 * @param { Object } [ mergeFields ] - The merge fields for the subscriber.
 * @param { Object } [ interests ] - The interests for the subscriber.
 * @param { string } [ language ] - The language for the subscriber.
 * @param { boolean } [ vip ] - Whether the subscriber is a VIP.
 * @param { Object } [ location ] - The location for the subscriber.
 * @param { string } [ location.latitude ] - The latitude for the subscriber.
 * @param { string } [ location.longitude ] - The longitude for the subscriber.
 * @param { Object[] } [ marketingPermissions ] - The marketing permissions for the subscriber.
 * @param { string } [ marketingPermissions.marketingPermissionId ] - The ID for the marketing permission.
 * @param { boolean } [ marketingPermissions.enabled ] - Whether the marketing permission is enabled.
 * @param { string } [ ipSignup ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampSignup ] - The date and time the subscriber signed up.
 * @param { string } [ ipOpt ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampOpt ] - The date and time for the last change.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addUpdateListMember(
    listId,
    subscriberHash,
    skipMergeValidation,
    emailAddress,
    statusIfNew,
    emailType,
    status,
    mergeFields,
    interests,
    language,
    vip,
    location,
    marketingPermissions,
    ipSignup,
    timestampSignup,
    ipOpt,
    timestampOpt
    )
{
    try
    {
        let options = {};

        if ( skipMergeValidation !== undefined ) options.skipMergeValidation = skipMergeValidation;

        let body = {};

        if ( emailAddress !== undefined ) body.email_address = emailAddress;
        if ( statusIfNew !== undefined ) body.status_if_new = statusIfNew;
        if ( emailType !== undefined ) body.email_type = emailType;
        if ( status !== undefined ) body.status = status;
        if ( mergeFields !== undefined ) body.merge_fields = mergeFields;
        if ( interests !== undefined ) body.interests = interests;
        if ( language !== undefined ) body.language = language;
        if ( vip !== undefined ) body.vip = vip;
        if ( location !== undefined
             && location.latitude !== undefined
             && location.longitude !== undefined ) body.location = location;
        if ( marketingPermissions !== undefined ) body.marketing_permissions = marketingPermissions;
        if ( ipSignup !== undefined ) body.ip_signup = ipSignup;
        if ( timestampSignup !== undefined ) body.timestamp_signup = timestampSignup;
        if ( ipOpt !== undefined ) body.ip_opt = ipOpt;
        if ( timestampOpt !== undefined ) body.timestamp_opt = timestampOpt;

        let response =
            await mailchimp.lists.setListMember(
                listId,
                subscriberHash,
                body,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding or updating list member: ' + response[ 'detail' ] );
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
 * Update a list member.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { boolean } [ skipMergeValidation ] - Whether to bypass the merge field validation.
 * @param { string } [ emailAddress ] - The email address for the list member.
 * @param { string } [ emailType ] - The email type.
 * @param { string } [ status ] - The status of the subscriber.
 * @param { Object } [ mergeFields ] - The merge fields for the subscriber.
 * @param { Object } [ interests ] - The interests for the subscriber.
 * @param { string } [ language ] - The language for the subscriber.
 * @param { boolean } [ vip ] - Whether the subscriber is a VIP.
 * @param { Object } [ location ] - The location for the subscriber.
 * @param { string } [ location.latitude ] - The latitude for the subscriber.
 * @param { string } [ location.longitude ] - The longitude for the subscriber.
 * @param { Object[] } [ marketingPermissions ] - The marketing permissions for the subscriber.
 * @param { string } [ marketingPermissions.marketingPermissionId ] - The ID for the marketing permission.
 * @param { boolean } [ marketingPermissions.enabled ] - Whether the marketing permission is enabled.
 * @param { string } [ ipSignup ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampSignup ] - The date and time the subscriber signed up.
 * @param { string } [ ipOpt ] - The IP address the subscriber used to sign up.
 * @param { string } [ timestampOpt ] - The date and time for the last change.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateListMember(
    listId,
    subscriberHash,
    skipMergeValidation,
    emailAddress,
    emailType,
    status,
    mergeFields,
    interests,
    language,
    vip,
    location,
    marketingPermissions,
    ipSignup,
    timestampSignup,
    ipOpt,
    timestampOpt
    )
{
    try
    {
        let options = {};

        if ( skipMergeValidation !== undefined ) options.skipMergeValidation = skipMergeValidation;

        let body = {};

        if ( emailAddress !== undefined ) body.email_address = emailAddress;
        if ( emailType !== undefined ) body.email_type = emailType;
        if ( status !== undefined ) body.status = status;
        if ( mergeFields !== undefined ) body.merge_fields = mergeFields;
        if ( interests !== undefined ) body.interests = interests;
        if ( language !== undefined ) body.language = language;
        if ( vip !== undefined ) body.vip = vip;
        if ( location !== undefined
             && location.latitude !== undefined
             && location.longitude !== undefined ) body.location = location;
        if ( marketingPermissions !== undefined ) body.marketing_permissions = marketingPermissions;
        if ( ipSignup !== undefined ) body.ip_signup = ipSignup;
        if ( timestampSignup !== undefined ) body.timestamp_signup = timestampSignup;
        if ( ipOpt !== undefined ) body.ip_opt = ipOpt;
        if ( timestampOpt !== undefined ) body.timestamp_opt = timestampOpt;

        let response =
            await mailchimp.lists.updateListMember(
                listId,
                subscriberHash,
                body,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating list member: ' + response[ 'detail' ] );
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
 * Archive a list member.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function archiveListMember(
    listId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteListMember(
                listId,
                subscriberHash
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error archiving list member: ' + response[ 'detail' ] );
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
 * Delete a list member.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns {}
 */
export async function deleteListMember(
    listId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteListMember(
                listId,
                subscriberHash
                );

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

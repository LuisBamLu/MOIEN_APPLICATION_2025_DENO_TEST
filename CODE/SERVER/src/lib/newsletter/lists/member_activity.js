// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the recent activity for a specific list member.
 *
 * @param { string } listId - The unique ID for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { string[] } [ action ] - A comma seperated list of actions to return.
 * Possible values: abuse, bounce, click, open, sent, unsub, or ecomm.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getRecentMemberActivity(
    listId,
    subscriberHash,
    fields,
    excludeFields,
    action
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( action ) options.action = action;

        let response =
            await mailchimp.lists.getListMemberActivity(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting recent member activity: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

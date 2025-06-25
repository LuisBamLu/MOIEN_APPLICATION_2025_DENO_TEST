// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the last 50 goal events for a list member.
 *
 * @param { string } listId - The unique id for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberGoalEventArray(
    listId,
    subscriberHash,
    fields,
    excludeFields
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;

        let response =
            await mailchimp.lists.getListMemberGoals(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting member goal events: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

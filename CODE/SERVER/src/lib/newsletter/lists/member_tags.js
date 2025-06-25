// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get the tags of a specific list member.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getMemberTagArray(
    listId,
    subscriberHash,
    fields,
    excludeFields,
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;

        let response =
            await mailchimp.lists.getListMemberTags(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting member tags: ' + response[ 'detail' ] );
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
 * Add or remove tags from a list member.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } subscriberHash - The hash of the list member's email address.
 * @param { object[] } [ tags ] - The tags to apply to the list member.
 * @param { string } [ tags[].name ] - The name of the tag.
 * @param { string } [ tags[].status ] - The status of the tag on the list member.
 * @param { boolean } [ isSyncing ] - Whether the operation is in progress.
 *
 * @returns { Promise } - The response from the Mailchimp API.
 */
export async function updateMemberTags(
    listId,
    subscriberHash,
    tags,
    isSyncing
    )
{
    try
    {
        let options = {};

        if ( tags ) options.tags = tags;
        if ( isSyncing ) options.isSyncing = isSyncing;

        let response =
            await mailchimp.lists.updateListMemberTags(
                listId,
                subscriberHash,
                options
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error updating member tags: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get locations (countries) of the subscribers from a specific list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListLocationArray(
    listId,
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
            await mailchimp.lists.getListLocations(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list locations: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Search for tags in a list by name
 *
 * @param { string } listId  - List ID
 * @param { string } [ name ] - Tag name
 *
 * @returns { Promise<Object> } - Mailchimp response
 */
export async function tagSearch(
    listId,
    name
    )
{
    try
    {
        let options = {};

        if ( name ) options.name = name;

        let response =
            await mailchimp.lists.tagSearch(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error on tag search: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

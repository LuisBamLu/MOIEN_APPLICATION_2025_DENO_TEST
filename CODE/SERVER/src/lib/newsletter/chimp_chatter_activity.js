// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Retrieves the Chimp Chatter for the account.
 *
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of activity feed items to skip.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getChimpChatterActivity(
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;

        let response =
            await mailchimp.activityFeed.getChimpChatter(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error retrivieng Chimp Chatter activity: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

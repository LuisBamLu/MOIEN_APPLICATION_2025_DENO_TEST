import mailchimp from '@mailchimp/mailchimp_marketing';

/**
 * Search for campaigns
 *
 * @param { string } query - The search query
 * @param { string[] } [ fields ] - A comma separated list of fields to return
 * @param { string[] } [ excludeFields ] - A comma separated list of fields to exclude
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { Object[] } response.results - The list of campaigns.
 * @returns { Object } response.results[].campaign - A summary of an individual campaign's settings and content.
 * @returns { string } response.results[].snippet
 * @returns { number } response.total_items - The total number of items.
 * @returns { Object[] } response._links - A list of link types and descriptions for the API schema documents.
 */
export async function searchCampaigns(
    query,
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
            await mailchimp.searchCampaigns.search(
                query,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error searching campaigns: ' + response[ 'detail' ] );
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
 * Search for list members, optionally restricting the search to a specific list.
 *
 * @param { string } query
 * @param { string[] } [ fields ]
 * @param { string[] } [ excludeFields ]
 * @param { string } [ listId ]
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 * @returns { Object } response.exact_matches - The list of exact matches.
 * @returns { Object[] } response.exact_matches[].members - The list of members.
 * @returns { number } response.exact_matches[].total_items - The total number of items.
 * @returns { Object } response.full_search - The list of full search matches.
 * @returns { Object[] } response.full_search[].members - The list of members.
 * @returns { number } response.full_search[].total_items - The total number of items.
 * @returns { Object } response._links - A list of link types and descriptions for the API schema documents.
 */
export async function searchMembers(
    query,
    fields,
    excludeFields,
    listId
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( listId ) options.listId = listId;

        let response =
            await mailchimp.searchMembers.search(
                query,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error searching members: ' + response[ 'detail' ] );
        }
    }
    catch ( error )
    {
        console.error( error );
    }
}

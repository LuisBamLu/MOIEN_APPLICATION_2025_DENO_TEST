// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all interests in a specific category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getInterestArrayByCategory(
    listId,
    interestCategoryId,
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
            await mailchimp.lists.listInterestCategoryInterests(
                listId,
                interestCategoryId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting interest category interests: ' + response[ 'detail' ] );
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
 * Create a new interest in a specific category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string } [ name ] - The name of the interest.
 * @param { number } [ displayOrder ] - The display order for interests.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function createInterest(
    listId,
    interestCategoryId,
    name,
    displayOrder
    )
{
    try
    {
        let options = {};

        if ( name ) options.name = name;
        if ( displayOrder ) options.displayOrder = displayOrder;

        let response =
            await mailchimp.lists.createInterestCategoryInterest(
                listId,
                interestCategoryId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error creating interest category interest: ' + response[ 'detail' ] );
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
 * Get information about a specific interest in a category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string } interestId - The unique identifier for the interest.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getInterest(
    listId,
    interestCategoryId,
    interestId,
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
            await mailchimp.lists.getInterestCategoryInterest(
                listId,
                interestCategoryId,
                interestId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting interest category interest: ' + response[ 'detail' ] );
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
 * Update a specific interest in a category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string } interestId - The unique identifier for the interest.
 * @param { string } [ name ] - The name of the interest.
 * @param { number } [ displayOrder ] - The display order for interests.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateInterest(
    listId,
    interestCategoryId,
    interestId,
    name,
    displayOrder
    )
{
    try
    {
        let options = {};

        if ( name ) options.name = name;
        if ( displayOrder ) options.displayOrder = displayOrder;

        let response =
            await mailchimp.lists.updateInterestCategoryInterest(
                listId,
                interestCategoryId,
                interestId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating interest category interest: ' + response[ 'detail' ] );
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
 * Delete interest or group names in a specific category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string } interestId - The unique identifier for the interest.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function deleteInterest(
    listId,
    interestCategoryId,
    interestId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteInterestCategoryInterest(
                listId,
                interestCategoryId,
                interestId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting interest category interest: ' + response[ 'detail' ] );
        }
        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

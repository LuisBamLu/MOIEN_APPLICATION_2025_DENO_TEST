// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all interest categories for a specific list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 * @param { string } [ type ] - Determines how this category’s interests appear on signup forms.
 *
 * @returns
 */
export async function getListInterestCategoryArray(
    listId,
    fields,
    excludeFields,
    count,
    offset,
    type
    )
{
    try
    {
        let options = {};

        if ( fields ) options.fields = fields;
        if ( excludeFields ) options.excludeFields = excludeFields;
        if ( count ) options.count = count;
        if ( offset ) options.offset = offset;
        if ( type ) options.type = type;

        let response =
            await mailchimp.lists.getListInterestCategories(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting list interest categories: ' + response[ 'detail' ] );
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
 * Create a new interest category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } [ title ] - The text description of this category.
 * @param { string } [ type ] - Determines how this category’s interests appear on signup forms.
 * @param { number } [ displayOrder ] - The order that the categories are displayed in the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addInterestCategory(
    listId,
    title,
    type,
    displayOrder
    )
{
    try
    {
        let options = {};

        if ( title ) options.title = title;
        if ( type ) options.type = type;
        if ( displayOrder ) options.displayOrder = displayOrder;

        let response =
            await mailchimp.lists.createListInterestCategory(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding interest category: ' + response[ 'detail' ] );
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
 * Get information about a specific interest category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getInterestCategory(
    listId,
    interestCategoryId,
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
            await mailchimp.lists.getInterestCategory(
                listId,
                interestCategoryId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting interest category: ' + response[ 'detail' ] );
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
 * Updates an interest category.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 * @param { string } [ title ] - The text description of this category.
 * @param { string } [ type ] - Determines how this category’s interests appear on signup forms.
 * @param { number } [ displayOrder ] - The order that the categories are displayed in the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateInterestCategory(
    listId,
    interestCategoryId,
    title,
    type,
    displayOrder
    )
{
    try
    {
        let options = {};

        if ( title ) options.title = title;
        if ( type ) options.type = type;
        if ( displayOrder ) options.displayOrder = displayOrder;

        let response =
            await mailchimp.lists.updateInterestCategory(
                listId,
                interestCategoryId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating interest category: ' + response[ 'detail' ] );
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
 * Deletes an interest category from a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } interestCategoryId - The unique identifier for the interest category.
 *
 * @returns { Promise } - The response from the Mailchimp API.
 */
export async function deleteInterestCategory(
    listId,
    interestCategoryId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteInterestCategory(
                listId,
                interestCategoryId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting interest category: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

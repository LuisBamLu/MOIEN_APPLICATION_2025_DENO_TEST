// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all merge fields for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of items to return.
 * @param { number } [ offset ] - The number of items to skip before starting to collect the result set.
 * @param { string } [ type ] - The merge field type.
 * @param { boolean } [ required ] - Indicates whether the merge field is required.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListMergeFieldArray(
    listId,
    fields,
    excludeFields,
    count,
    offset,
    type,
    required
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( type !== undefined ) options.type = type;
        if ( required !== undefined ) options.required = required;

        let response =
            await mailchimp.lists.getListMergeFields(
                listId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting merge fields: ' + response[ 'detail' ] );
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
 * Create a new merge field for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } name - The name for the merge field.
 * @param { string } type - The merge field type.
 * @param { string } [ tag ] - The merge tag used for Mailchimp campaigns and adding contact information.
 * @param { boolean } [ required ] - Indicates whether the merge field is required.
 * @param { string } [ defaultValue ] - The default value for the merge field if null.
 * @param { boolean } [ isPublic ] - Indicates whether the merge field is displayed in the signup form.
 * @param { number } [ displayOrder ] - The order that the merge field displays in the list signup form.
 * @param { Object } [ options ] - Extra options for the merge field types.
 * @param { number } [ options.defaultCountry ] - In an address type, the default country code.
 * @param { string } [ options.phoneFormat ] - In a phone type, the format for the phone number.
 * @param { string } [ options.dateFormat ] - In a date type, the format for the date.
 * @param { string[] } [ options.choices ] - In a radio or dropdown type, the choices for the merge field.
 * @param { string[] } [ options.size ] - n a text field, the default length of the text field.
 * @param { string } [ helpText ] - Extra text to help the subscriber fill out the form.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addListMergeField(
    listId,
    name,
    type,
    tag,
    required,
    defaultValue,
    isPublic,
    displayOrder,
    options,
    helpText
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( type !== undefined ) body.type = type;
        if ( tag !== undefined ) body.tag = tag;
        if ( required !== undefined ) body.required = required;
        if ( defaultValue !== undefined ) body.defaultValue = defaultValue;
        if ( isPublic !== undefined ) body.isPublic = isPublic;
        if ( displayOrder !== undefined ) body.displayOrder = displayOrder;
        if ( options !== undefined ) body.options = options;
        if ( helpText !== undefined ) body.helpText = helpText;

        let response =
            await mailchimp.lists.addListMergeField(
                listId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding merge field: ' + response[ 'detail' ] );
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
 * Get information about a specific merge field for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } mergeId - The id for the merge field.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListMergeField(
    listId,
    mergeId,
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
            await mailchimp.lists.getListMergeField(
                listId,
                mergeId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting merge field: ' + response[ 'detail' ] );
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
 * Update information about a specific merge field for a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } mergeId - The id for the merge field.
 * @param { string } name - The name for the merge field.
 * @param { string } [ tag ] - The merge tag used for Mailchimp campaigns and adding contact information.
 * @param { boolean } [ required ] - Indicates whether the merge field is required.
 * @param { string } [ defaultValue ] - The default value for the merge field if null.
 * @param { boolean } [ isPublic ] - Indicates whether the merge field is displayed in the signup form.
 * @param { number } [ displayOrder ] - The order that the merge field displays in the list signup form.
 * @param { Object } [ options ] - Extra options for the merge field types.
 * @param { number } [ options.defaultCountry ] - In an address type, the default country code.
 * @param { string } [ options.phoneFormat ] - In a phone type, the format for the phone number.
 * @param { string } [ options.dateFormat ] - In a date type, the format for the date.
 * @param { string[] } [ options.choices ] - In a radio or dropdown type, the choices for the merge field.
 * @param { string } [ helpText ] - Extra text to help the subscriber fill out the form.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateListMergeField(
    listId,
    mergeId,
    name,
    tag,
    required,
    defaultValue,
    isPublic,
    displayOrder,
    options,
    helpText
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( tag !== undefined ) body.tag = tag;
        if ( required !== undefined ) body.required = required;
        if ( defaultValue !== undefined ) body.defaultValue = defaultValue;
        if ( isPublic !== undefined ) body.isPublic = isPublic;
        if ( displayOrder !== undefined ) body.displayOrder = displayOrder;
        if ( options !== undefined ) body.options = options;
        if ( helpText !== undefined ) body.helpText = helpText;

        let response =
            await mailchimp.lists.updateListMergeField(
                listId,
                mergeId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating merge field: ' + response[ 'detail' ] );
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
 * Delete a merge field from a list.
 *
 * @param { string } listId - The unique identifier for the list.
 * @param { string } mergeId - The id for the merge field.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function deleteListMergeField(
    listId,
    mergeId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteListMergeField(
                listId,
                mergeId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting merge field: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

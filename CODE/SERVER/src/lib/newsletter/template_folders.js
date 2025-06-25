// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get an array of template folders.
 *
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 * @param { number } [ count ] The number of records to return.
 * @param { number } [ offset ] Used for pagination, this it the number of records from a collection to skip
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getTemplateFolderArray(
    fields,
    excludeFields,
    count,
    offset
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;

        let response =
            await mailchimp.templateFolders.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting template folders: ' + response[ 'detail' ] );
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
 * Add a new template folder.
 *
 * @param { string } name - The name of the folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addTemplateFolder(
    name
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.templateFolders.get(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding template folder: ' + response[ 'detail' ] );
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
 * Get a template folder.
 *
 * @param { string } folderId - The unique id for the template folder.
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getTemplateFolder(
    folderId,
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
            await mailchimp.templateFolders.create(
                folderId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting template folder: ' + response[ 'detail' ] );
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
 * Update a template folder.
 *
 * @param { string } folderId - The unique id for the template folder.
 * @param { string } name - The name of the folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateTemplateFolder(
    folderId,
    name
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.templateFolders.update(
                folderId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating template folder: ' + response[ 'detail' ] );
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
 * Delete a template folder.
 *
 * @param { string } folderId - The unique id for the template folder.
 *
 * @returns {}
 */
export async function deleteTemplateFolder(
    folderId
    )
{
    try
    {
        let response =
            await mailchimp.templateFolders.remove(
                folderId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting template folder: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

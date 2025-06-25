// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all file folders in the file manager.
 *
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 * @param { number } [ count ] The number of records to return.
 * @param { number } [ offset ] Used for pagination, this it the number of records from a collection to skip.
 * @param { string } [ createdBy ] The user who created the file.
 * @param { string } [ beforeCreatedAt ] Restrict the response to files created before the set time.
 * @param { string } [ sinceCreatedAt ] Restrict the response to files created after the set time.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getFileFolderArray(
    fields,
    excludeFields,
    count,
    offset,
    createdBy,
    beforeCreatedAt,
    sinceCreatedAt
    )
{
    try
    {
        let options = {};

        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( createdBy !== undefined ) options.createdBy = createdBy;
        if ( beforeCreatedAt !== undefined ) options.beforeCreatedAt = beforeCreatedAt;
        if ( sinceCreatedAt !== undefined ) options.sinceCreatedAt = sinceCreatedAt;

        let response =
            await mailchimp.fileManager.listFolders(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting file folders: ' + response[ 'detail' ] );
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
 * Add a new file folder to the file manager.
 *
 * @param { string } name - The name of the file folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addFileFolder(
    name
    )
{
    try
    {
        let body = {}

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.fileManager.createFolder(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding file folder: ' + response[ 'detail' ] );
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
 * Get information about a specific file folder in the file manager.
 *
 * @param { number } folderId - The ID of the folder to move the file to.
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getFileFolder(
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
            await mailchimp.fileManager.getFolder(
                folderId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting file folder: ' + response[ 'detail' ] );
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
 * Update a file folder in the file manager.
 *
 * @param { number } folderId - The ID of the folder to move the file to.
 * @param { string } name - The name of the file folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function udpateFileFolder(
    folderId,
    name
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.fileManager.updateFolder(
                folderId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating file folder: ' + response[ 'detail' ] );
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
 * Delete a file folder from the file manager.
 *
 * @param { number } folderId - The ID of the folder to move the file to.
 *
 * @returns {}
 */
export async function deleteFileFolder(
    folderId
    )
{
    try
    {
        let response =
            await mailchimp.fileManager.deleteFolder(
                folderId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error deleting file folder: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

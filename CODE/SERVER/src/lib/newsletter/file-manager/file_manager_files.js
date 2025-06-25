// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all files in the file manager.
 *
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 * @param { number } [ count ] The number of records to return.
 * @param { number } [ offset ] Used for pagination, this it the number of records from a collection to skip.
 * @param { string } [ type ] The type of file to return.
 * @param { string } [ createdBy ] The user who created the file.
 * @param { string } [ beforeCreatedAt ] Restrict the response to files created before the set time.
 * @param { string } [ sinceCreatedAt ] Restrict the response to files created after the set time.
 * @param { string } [ sortField ] Returns files sorted by the specified field.
 * @param { string } [ sortDir ] Determines the order direction for sorted results.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getFileArray(
    fields,
    excludeFields,
    count,
    offset,
    type,
    createdBy,
    beforeCreatedAt,
    sinceCreatedAt,
    sortField,
    sortDir
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
        if ( createdBy !== undefined ) options.createdBy = createdBy;
        if ( beforeCreatedAt !== undefined ) options.beforeCreatedAt = beforeCreatedAt;
        if ( sinceCreatedAt !== undefined ) options.sinceCreatedAt = sinceCreatedAt;
        if ( sortField !== undefined ) options.sortField = sortField;
        if ( sortDir !== undefined ) options.sortDir = sortDir;

        let response =
            await mailchimp.fileManager.files(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting files: ' + response[ 'detail' ] );
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
 * Add a new file to the file manager.
 *
 * @param { string } name - The name of the file.
 * @param { string } fileData - The base64 encoded file data.
 * @param { number } [ folderId ] The ID of the folder to move the file to.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addFile(
    name,
    fileData,
    folderId
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;
        if ( fileData !== undefined ) body.fileData = fileData;
        if ( folderId !== undefined ) body.folderId = folderId;

        let response =
            await mailchimp.fileManager.upload(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error uploading file: ' + response[ 'detail' ] );
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
 * Get information about a specific file in the file manager.
 *
 * @param { string } fileId - The unique identifier for the file.
 * @param { string[] } [ fields ] A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getFile(
    fileId,
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
            await mailchimp.fileManager.getFile(
                fileId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting file: ' + response[ 'detail' ] );
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
 * Update a file in the file manager.
 *
 * @param { string } fileId - The unique identifier for the file.
 * @param { number } [ folderId ] The ID of the folder to move the file to.
 * @param { string } [ name ] - The name of the file.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateFile(
    fileId,
    folderId,
    name
    )
{
    try
    {
        let body = {};

        if ( folderId !== undefined ) body.folderId = folderId;
        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.fileManager.updateFile(
                fileId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating file: ' + response[ 'detail' ] );
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
 * Delete a file from the file manager.
 *
 * @param { string } fileId - The unique identifier for the file.
 *
 * @returns {}
 */
export async function deleteFile(
    fileId
    )
{
    try
    {
        let response =
            await mailchimp.fileManager.deleteFile(
                fileId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting file: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all folders used to organize campaigns.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignFolderArray(
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
            await mailchimp.campaignFolders.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get campaign folders: ' + response[ 'detail' ] );
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
 * Add a new campaign folder.
 *
 * @param { string } name - The name of the campaign folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addCampaignFolder(
    name
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.campaignFolders.create(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to add campaign folder: ' + response[ 'detail' ] );
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
 * Get information about a specific campaign folder.
 *
 * @param { string } folderId - The unique identifier for the campaign folder.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getCampaignFolder(
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
            await mailchimp.campaignFolders.get(
                folderId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get campaign folder: ' + response[ 'detail' ] );
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
 * Updates a campaign folder.
 *
 * @param { string } folderId - The unique identifier for the campaign folder.
 * @param { string } name - The name of the campaign folder.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateCampaignFolder(
    folderId,
    name
    )
{
    try
    {
        let body = {};

        if ( name !== undefined ) body.name = name;

        let response =
            await mailchimp.campaignFolders.update(
                folderId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to update campaign folder: ' + response[ 'detail' ] );
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
 * Deletes a campaign folder.
 *
 * @param { string } folderId - The unique identifier for the campaign folder.
 *
 * @returns {}
 */
export async function deleteCampaignFolder(
    folderId
    )
{
    try
    {
        let response =
            await mailchimp.campaignFolders.remove(
                folderId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Failed to delete campaign folder: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

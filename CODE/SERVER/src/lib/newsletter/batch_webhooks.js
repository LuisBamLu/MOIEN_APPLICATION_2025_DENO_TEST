// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of batch webhooks.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getBatchWebhookArray(
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
            await mailchimp.batchWebhooks.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get batch webhooks: ' + response[ 'detail' ] );
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
 * Add a batch webhook.
 *
 * @param { string } url
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addBatchWebhook(
    url
    )
{
    try
    {
        let body = {};

        if ( url !== undefined ) body.url = url;

        let response =
            await mailchimp.batchWebhooks.create(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to add batch webhook: ' + response[ 'detail' ] );
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
 * Get a batch webhook.
 *
 * @param { string } batchWebhookId - The unique identifier for the batch webhook.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getBatchWebhook(
    batchWebhookId,
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
            await mailchimp.batchWebhooks.get(
                batchWebhookId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get batch webhook: ' + response[ 'detail' ] );
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
 * Updates a batch webhook.
 *
 * @param { string } batchWebhookId - The unique identifier for the batch webhook.
 * @param { string } url - A valid URL for the Webhook.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function UpdateBatchWebhook(
    batchWebhookId,
    url
    )
{
    try
    {
        let body = {};

        if ( url !== undefined ) body.url = url;

        let response =
            await mailchimp.batchWebhooks.update(
                batchWebhookId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to update batch webhook: ' + response[ 'detail' ] );
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
 * Removes a batch webhook.
 *
 * @param { string } batchWebhookId - The unique identifier for the batch webhook.
 *
 * @returns {}
 */
export async function removeBatchWebhook(
    batchWebhookId
    )
{
    try
    {
        let response =
            await mailchimp.batchWebhooks.remove(
                batchWebhookId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Failed to remove batch webhook: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

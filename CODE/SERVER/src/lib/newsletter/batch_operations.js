// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of batch operation requests.
 *
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getBatchOperationRequests(
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
            await mailchimp.batches.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get batch operation requests: ' + response[ 'detail' ] );
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
 * Start a batch operation.
 *
 * @param { object[] } operations - An array of objects that describe the operations to perform.
 * @param { string } [ operations.method ] - The HTTP method to use for the operation.
 * @param { string } [ operations.path ] - The relative path to use for the operation.
 * @param { object } [ operations.params ] - Any request parameters to include.
 * @param { string } [ operations.body ] - A string containing the request JSON body.
 * @param { string } [ operations.operationId ] - An optional client-supplied identifier for the operation.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function startBatchOperation(
    operations
    )
{
    try
    {
        let response =
            await mailchimp.batches.start(
                { operations: operations }
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to start batch operation: ' + response[ 'detail' ] );
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
 * Get the status of a batch operation.
 *
 * @param { string } batchId - The unique identifier for the batch operation.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getBatchOperationStatus(
    batchId,
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
            await mailchimp.batches.status(
                batchId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Failed to get batch operation status: ' + response[ 'detail' ] );
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
 * Stops a batch operation from running.
 *
 * @param { string } batchId - The unique identifier for the batch operation.
 *
 * @returns {}
 */
export async function deleteBatchOperationRequest(
    batchId
    )
{
    try
    {
        let response =
            await mailchimp.batches.deleteRequest(
                batchId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Failed to stop batch request: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

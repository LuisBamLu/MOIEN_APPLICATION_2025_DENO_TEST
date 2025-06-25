// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of subscribers who are currently in the queue for a specific automation email.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getAutomationEmailSubscriberQueue(
    workflowId,
    workflowEmailId
    )
{
    try
    {
        let response =
            await mailchimp.automations.getWorkflowEmailSubscriberQueue(
                workflowId,
                workflowEmailId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation email subscriber queue.' + response[ 'detail' ] );
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
 * Add a subscriber to the queue for a specific automation email.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addAutomationEmailSubscriber(
    workflowId,
    workflowEmailId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.automations.addWorkflowEmailSubscriber(
                workflowId,
                workflowEmailId,
                subscriberHash
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding automation email subscriber.' + response[ 'detail' ] );
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
 * Get a subscriber who is in the queue for a specific automation email.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getAutomationEmailSubscriber(
    workflowId,
    workflowEmailId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.automations.getWorkflowEmailSubscriber(
                workflowId,
                workflowEmailId,
                subscriberHash
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation email subscriber.' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

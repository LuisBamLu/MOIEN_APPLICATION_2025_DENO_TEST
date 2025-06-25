// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get a list of subscribers who have been removed from a specific automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getRemovedAutomationSubscriberArray(
    workflowId
    )
{
    try
    {
        let response =
            await mailchimp.automations.listWorkflowEmailSubscribersRemoved(
                workflowId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation removed subscribers.' + response[ 'detail' ] );
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
 * Remove a subscriber from a specific automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } emailAddress - The email address of the subscriber to remove.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function removeAutomationEmailSubscriber(
    workflowId,
    emailAddress
    )
{
    try
    {
        let body = {};

        if ( emailAddress !== undefined ) body.emailAddress = emailAddress;

        let response =
            await mailchimp.automations.removeWorkflowEmailSubscriber(
                workflowId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error removing subscriber from automation.' + response[ 'detail' ] );
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
 * Get information about a specific subscriber who was removed from an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } subscriberHash - The hash of the list member's email address.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getRemovedAutomationSubscriber(
    workflowId,
    subscriberHash
    )
{
    try
    {
        let response =
            await mailchimp.automations.getRemovedWorkflowEmailSubscriber(
                workflowId,
                subscriberHash
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting removed subscriber from automation.' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

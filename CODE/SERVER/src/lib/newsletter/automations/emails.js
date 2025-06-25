// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get information about all emails in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getAutomatedEmailArray(
    workflowId
    )
{
    try
    {
        let response =
            await mailchimp.automations.listAllWorkflowEmails(
                workflowId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation workflow emails.' + response[ 'detail' ] );
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
 * Get information about an automated email in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getAutomatedEmail(
    workflowId,
    workflowEmailId
    )
{
    try
    {
        let response =
            await mailchimp.automations.getWorkflowEmail(
                workflowId,
                workflowEmailId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation email.' + response[ 'detail' ] );
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
 * Removes an individual classic automation workflow email.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 *
 * @returns {}
 */
export async function deleteWorkflowEmail(
    workflowId,
    workflowEmailId
    )
{
    try
    {
        let response =
            await mailchimp.automations.deleteWorkflowEmail(
                workflowId,
                workflowEmailId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting automation email.' + response[ 'detail' ] );
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
 * Updates an automated email in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 * @param { object } [ delay ] - The delay settings for the automation email.
 * @param { number } [ delay.amount ] - The amount of time to delay the email.
 * @param { string } [ delay.type ] - The type of delay. ['now', 'day', 'hour', 'week']
 * @param { string } [ delay.direction ] - Whether to delay the email before or after the trigger.
 * @param { string } [ delay.action ] - The action that triggers the delay of an automation emails.
 * @param { object } [ settings ] - The settings for the automation email.
 * @param { string } [ settings.subjectLine ] - The subject line for the automation email.
 * @param { string } [ settings.previewText ] - The preview text for the automation email.
 * @param { string } [ settings.title ] - The title for the automation email.
 * @param { string } [ settings.fromName ] - The from name for the automation email.
 * @param { string } [ settings.replyTo ] - The reply-to email address for the automation email.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateWorkflowEmail(
    workflowId,
    workflowEmailId,
    delay,
    settings
    )
{
    try
    {
        let body = {};

        if ( delay !== undefined ) body.delay = delay;
        if ( settings !== undefined ) body.settings = settings;

        let response =
            await mailchimp.automations.updateWorkflowEmail(
                workflowId,
                workflowEmailId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating automation email.' + response[ 'detail' ] );
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
 * Pauses an automated email in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 *
 * @returns
 */
export async function pauseAutomatedEmail(
    workflowId,
    workflowEmailId
    )
{
    try
    {
        let response =
            await mailchimp.automations.pauseWorkflowEmail(
                workflowId,
                workflowEmailId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error pausing automation email.' + response[ 'detail' ] );
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
 * Starts an automated email in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string } workflowEmailId - The unique identifier for the automation workflow email.
 *
 * @returns {}
 */
export async function startAutomatedEmail(
    workflowId,
    workflowEmailId
    )
{
    try
    {
        let response =
            await mailchimp.automations.startWorkflowEmail(
                workflowId,
                workflowEmailId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error starting automation email.' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

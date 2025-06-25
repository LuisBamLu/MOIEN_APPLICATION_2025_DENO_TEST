// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';
import * as emails from './automations/emails';
import * as queue from './automations/queue';
import * as removedSubscribers from './automations/removed_subscribers';

// -- FUNCTIONS

/**
 * Get a list of all automation workflows.
 *
 * @param { number } [ count ] - The number of records to return.
 * @param { number } [ offset ] - The number of records from a collection to skip.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 * @param { * } [ beforeCreateTime ] - Restrict the response to automations created before the set time.
 * @param { * } [ sinceCreateTime ] - Restrict the response to automations created after the set time.
 * @param { * } [ beforeStartTime ] - Restrict the response to automations started before the set time.
 * @param { * } [ sinceStartTime ] - Restrict the response to automations started after the set time.
 * @param { * } [ status ]- Restrict the response to automations with the specified status.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getAutomationArray(
    count,
    offset,
    fields,
    excludeFields,
    beforeCreateTime,
    sinceCreateTime,
    beforeStartTime,
    sinceStartTime,
    status
    )
{
    try
    {
        let options = {};

        if ( count !== undefined ) options.count = count;
        if ( offset !== undefined ) options.offset = offset;
        if ( fields !== undefined ) options.fields = fields;
        if ( excludeFields !== undefined ) options.excludeFields = excludeFields;
        if ( beforeCreateTime !== undefined ) options.beforeCreateTime = beforeCreateTime;
        if ( sinceCreateTime !== undefined ) options.sinceCreateTime = sinceCreateTime;
        if ( beforeStartTime !== undefined ) options.beforeStartTime = beforeStartTime;
        if ( sinceStartTime !== undefined ) options.sinceStartTime = sinceStartTime;
        if ( status !== undefined ) options.status = status;

        let response =
            await mailchimp.automations.list(
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation workflows.' + response[ 'detail' ] );
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
 * DOCSTRING
 *
 * @param { object } recipients - The recipients to send the automation workflow to.
 * @param { string } [ recipients.listId ] - The unique identifier for the list.
 * @param { string } [ recipients.sotreId ] - The unique identifier for the store.
 * @param { object } triggerSettings - The settings for the automation workflow trigger.
 * @param { string } triggerSettings.workflowType - The type of automation workflow.
 * @param { object } [ settings ] - The settings for the automation workflow.
 * @param { string } [ settings.fromName ] - The name for the 'From' header.
 * @param { string } [ settings.replyTo ] - The email address for the 'Reply-To' header.
 *
 * @returns
 */
export async function addAutomation(
    recipients,
    triggerSettings,
    settings
    )
{
    try
    {
        let body = {};

        if ( recipients !== undefined ) body.recipients = recipients;
        if ( triggerSettings !== undefined ) body.triggerSettings = triggerSettings;
        if ( settings !== undefined ) body.settings = settings;

        let response =
            await mailchimp.automations.create(
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error adding automation workflow.' + response[ 'detail' ] );
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
 * Get information about an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 * @param { string[] } [ fields ] - A comma-separated list of fields to return.
 * @param { string[] } [ excludeFields ] - A comma-separated list of fields to exclude.
 *
 * @returns { Promise<Object> }
 */
export async function getAutomation(
    workflowId,
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
            await mailchimp.automations.get(
                workflowId,
                options
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting automation workflow.' + response[ 'detail' ] );
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
 * Start all emails in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 *
 * @returns {}
 */
export async function startAutomationEmails(
    workflowId
    )
{
    try
    {
        let response =
            await mailchimp.automations.startAllEmails(
                workflowId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error starting automation emails.' + response[ 'detail' ] );
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
 * Pause all emails in an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 *
 * @returns {}
 */
export async function pauseAutomationEmails(
    workflowId
    )
{
    try
    {
        let response =
            await mailchimp.automations.pauseAllEmails(
                workflowId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error pausing automation emails.' + response[ 'detail' ] );
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
 * Archive an automation workflow.
 *
 * @param { string } workflowId - The unique identifier for the automation workflow.
 *
 * @returns {}
 */
export async function archiveAutomotion(
    workflowId
    )
{
    try
    {
        let response =
            await mailchimp.automations.archive(
                workflowId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error archiving automation workflow.' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

// -- STATEMENTS

export
{
    emails,
    queue,
    removedSubscribers
};

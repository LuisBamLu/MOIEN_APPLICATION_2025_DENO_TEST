// -- IMPORTS

import mailchimp from '@mailchimp/mailchimp_marketing';

// -- FUNCTIONS

/**
 * Get all webhooks from a list.
 *
 * @param { string } listId - The ID of the list.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListWebhookArray(
    listId
    )
{
    try
    {
        let response =
            await mailchimp.lists.getListWebhooks(
                listId
                );

        if ( response.status !== 200 )
        {
            throw new Error(
                '' + response[ 'detail' ]
                );
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
 * Create a webhook for a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } [ url ] - The URL for the webhook.
 * @param { Object } [ events ] - The events for the webhook.
 * @param { boolean } [ events.subscribe ] - Whether the webhook is triggered when a list subscriber is added.
 * @param { boolean } [ events.unsubscribe ] - Whether the webhook is triggered when a list member unsubscribes.
 * @param { boolean } [ events.profile ] - Whether the webhook is triggered when a subscriber's profile is updated.
 * @param { boolean } [ events.cleaned ] - Whether the webhook is triggered when a subscriber's email address is cleaned from the list.
 * @param { boolean } [ events.upemail ] - Whether the webhook is triggered when a subscriber's email address is changed.
 * @param { boolean } [ events.campaign ] - Whether the webhook is triggered when a campaign is sent or cancelled.
 * @param { Object } [ sources ] - The sources for the webhook.
 * @param { boolean } [ sources.user ] - Whether the webhook is triggered by subscriber-initiated actions.
 * @param { boolean } [ sources.admin ] - Whether the webhook is triggered by admin-initiated actions in the web interface.
 * @param { boolean } [ sources.api ] - Whether the webhook is triggered by actions initiated via the API.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function addListWebhook(
    listId,
    url,
    events,
    sources
    )
{
    try
    {
        let body = {};

        if ( url !== undefined ) body.url = url;
        if ( events ) body.events = events;
        if ( sources ) body.sources = sources;

        let response =
            await mailchimp.lists.createListWebhook(
                listId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error creating webhook: ' + response[ 'detail' ] );
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
 * Get a specific webhook for a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } webhookId - The ID of the webhook.
 *
 * @returns  { Promise<Object> } - The response from the Mailchimp API.
 */
export async function getListWebhook(
    listId,
    webhookId
    )
{
    try
    {
        let response =
            await mailchimp.lists.getListWebhook(
                listId,
                webhookId
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error getting webhook: ' + response[ 'detail' ] );
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
 * Delete a webhook from a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } webhookId - The ID of the webhook.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function deleteListWebhook(
    listId,
    webhookId
    )
{
    try
    {
        let response =
            await mailchimp.lists.deleteListWebhook(
                listId,
                webhookId
                );

        if ( response.status !== 204 )
        {
            throw new Error( 'Error deleting webhook: ' + response[ 'detail' ] );
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
 * Update a webhook for a list.
 *
 * @param { string } listId - The ID of the list.
 * @param { string } webhookId - The ID of the webhook.
 * @param { string } [ url ] - The URL for the webhook.
 * @param { Object } [ events ] - The events for the webhook.
 * @param { boolean } [ events.subscribe ] - Whether the webhook is triggered when a list subscriber is added.
 * @param { boolean } [ events.unsubscribe ] - Whether the webhook is triggered when a list member unsubscribes.
 * @param { boolean } [ events.profile ] - Whether the webhook is triggered when a subscriber's profile is updated.
 * @param { boolean } [ events.cleaned ] - Whether the webhook is triggered when a subscriber's email address is cleaned from the list.
 * @param { boolean } [ events.upemail ] - Whether the webhook is triggered when a subscriber's email address is changed.
 * @param { boolean } [ events.campaign ] - Whether the webhook is triggered when a campaign is sent or cancelled.
 * @param { Object } [ sources ] - The sources for the webhook.
 * @param { boolean } [ sources.user ] - Whether the webhook is triggered by subscriber-initiated actions.
 * @param { boolean } [ sources.admin ] - Whether the webhook is triggered by admin-initiated actions in the web interface.
 * @param { boolean } [ sources.api ] - Whether the webhook is triggered by actions initiated via the API.
 *
 * @returns { Promise<Object> } - The response from the Mailchimp API.
 */
export async function updateListWebhook(
    listId,
    webhookId,
    url,
    events,
    sources
    )
{
    try
    {
        let body = {};

        if ( url !== undefined ) body.url = url;
        if ( events ) body.events = events;
        if ( sources ) body.sources = sources;

        let response =
            await mailchimp.lists.updateListWebhook(
                listId,
                webhookId,
                body
                );

        if ( response.status !== 200 )
        {
            throw new Error( 'Error updating webhook: ' + response[ 'detail' ] );
        }

        return response;
    }
    catch ( error )
    {
        console.error( error );
    }
}

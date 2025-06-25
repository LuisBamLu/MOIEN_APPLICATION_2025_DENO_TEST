// -- IMPORTS

import { logError } from "senselogic-gist";
import * as hubspot from "@hubspot/api-client"

// -- TYPES

class HubspotService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client =  null;
    }

    // -- INQUIRIES

    async getContact(
        contactId
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.basicApi
            .getById( contactId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async getList(
        listId
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.lists.listsApi
            .getById( listId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async getListArray(
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.lists.listsApi
            .getAll()
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async getContactByEmail(
        contactEmail
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.searchApi.doSearch(
            {
                filterGroups:
                    [
                        {
                            filters:
                                [
                                    {
                                        propertyName: 'email',
                                        operator: 'EQ',
                                        value: contactEmail
                                    }
                                ]
                        }
                    ],
                properties: [ 'email', 'firstname', 'lastname' ],
                limit: 1
            }
            )
            .then(
                ( response ) =>
                {
                    if ( response.results.length > 0 )
                    {
                        return response.results[ 0 ];
                    }
                    else
                    {
                        return null;
                    }
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }

    // ~~

    async getContactArray(
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts
            .getAll()
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async getContactSubscriptionStatusByEmail(
        contactEmail
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.communicationPreferences.statusApi
            .getEmailStatus( contactEmail )
            .then(
                ( response ) =>
                {
                    return response
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }

    // ~~

    async getSubscriptionTypeArray(
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.communicationPreferences.definitionApi
            .getPage()
            .then(
                ( response ) =>
                {
                    return response.subscriptionDefinitions;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                )
    }

    // -- OPERATIONS

    async getClient(
        )
    {
        if ( this.client === null )
        {
            this.client = new hubspot.Client( { accessToken: process.env.MOIEN_HUBSPOT_PRIVATE_APP_TOKEN } );
        }

        return this.client;
    }

    // ~~

    async addContact(
        contact
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.basicApi
            .create( { properties: contact } )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async setContact(
        contactId,
        contact
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.basicApi
            .update( contactId, { properties: contact } )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async setContactByEmail(
        contactEmail,
        contact
        )
    {
        let currenctContact = await this.getContactByEmail( contactEmail );
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.basicApi
            .update(
                currenctContact.id,
                {
                    properties:  contact
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }

    // ~~

    async removeContact(
        contactId
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.contacts.basicApi
            .archive( contactId )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );
                    return null;
                }
                );
    }

    // ~~

    async addContactToList(
        listId,
        contactId
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.crm.lists.membershipsApi
            .add(
                listId,
                [ contactId ]
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }

    async subscribeContact(
        subscriptionId,
        contactEmail
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.communicationPreferences.statusApi
            .subscribe(
                {
                    subscriptionId: subscriptionId,
                    emailAddress: contactEmail
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }

    // ~~

    async unsubscribeContact(
        subscriptionId,
        contactEmail
        )
    {
        let hubspotClient = await this.getClient();

        return await hubspotClient.communicationPreferences.statusApi
            .unsubscribe(
                {
                    emailAddress: contactEmail,
                    subscriptionId: subscriptionId
                }
                )
            .then(
                ( response ) =>
                {
                    return response;
                }
                )
            .catch(
                ( error ) =>
                {
                    logError( error );

                    return null;
                }
                );
    }
}

// -- VARIABLES

export let hubspotService = new HubspotService();

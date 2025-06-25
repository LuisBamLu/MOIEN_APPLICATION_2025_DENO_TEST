// -- IMPORTS

import { get, writable } from 'svelte/store';
import { fetchData, handleCreateObject, handleDeleteObject, handleEditObject } from '$lib/base';
import { getJsonText } from 'senselogic-gist';

// -- VARIABLES

export let ticketArrayStore = writable( [] );
export let selectedTicketStore = writable( {} );
export let errorMessage = writable( null );
export let isTicketLoading = writable( true );
export let ticketStatusArrayStore = writable( [] );
export let ticketTypeArrayStore = writable( [] );
let url = '/api/admin/ticket';

// -- FUNCTIONS

export async function loadTicketArray(
    page = 1,
    limit = 15
    )
{
    isTicketLoading.set( true );

    try
    {
        let response = await fetchData(
            '/api/admin/page/ticket',
            { method: 'POST', credentials: 'include', body: getJsonText( { page, limit } ) }
        );

        ticketArrayStore.set(
            response.ticketArray
            );
        ticketStatusArrayStore.set(
            response.ticketStatusArray
            );
        ticketTypeArrayStore.set(
            response.ticketTypeArray
            );
    }
    catch( error )
    {
        errorMessage.set( error.message );
    }

    isTicketLoading.set( false );
}

// ~~

export async function handleCreateTicket(
    finallyFunction = () => {}
    )
{
    try
    {
        let response = await handleCreateObject(
            url,
            'ticket',
            selectedTicketStore,
            errorMessage
            );

        ticketArrayStore.update(
            ticketArray =>
            [
                ...ticketArray,
                response.ticket
            ]
            );
    }
    finally
    {
        finallyFunction();
    }
}

// ~~

export async function handleEditTicket(
    finallyFunction = () => {}
    )
{
    try
    {
        let response = await handleEditObject(
            url,
            'ticket',
            selectedTicketStore,
            errorMessage
            );

        ticketArrayStore.update(
            ticketArray =>
            ticketArray.map(
                ticket => ticket.id === response.ticket.id ? response.ticket : ticket
                )
            );
    }
    finally
    {
        finallyFunction();
    }
}

// ~~

export async function handleDeleteTicket(
    finallyFunction = () => {}
    )
{
    try
    {
        await handleDeleteObject(
            url,
            selectedTicketStore,
            errorMessage
            );

        ticketArrayStore.update(
            ticketArray =>
            ticketArray.filter(
                ticket =>
                ticket.id !== get( selectedTicketStore ).id
                )
            );
    }
    finally
    {
        finallyFunction();
    }
}

// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../app_error';
import { ticketStatusService } from '../../../service/ticket_status_service';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getTicketStatus(
    request,
    reply
    )
{
    return (
        {
            ticketStatusArray: await ticketStatusService.getTicketStatusArray()
        }
        );
}

// ~~

async function getTicketStatusById(
    request,
    reply
    )
{
    let { ticketStatusId } = request.params;

    return (
        {
            ticketStatusArray: await ticketStatusService.getTicketStatusById( ticketStatusId )
        }
        );
}

// ~~

async function setTicketStatusById(
    request,
    reply
    )
{
    let { ticketStatusId } = request.params;
    let body = getJsonObject( request.body );
    let ticketStatus = body;

    if ( !ticketStatusId || !ticketStatus )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetTicketStatusPermission = await hasUserPermission( 'set-ticket-status', profile.roleSlugArray );

    if ( !hasSetTicketStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await ticketStatusService.setTicketStatusById(
        {
            order: ticketStatus.order,
            name: ticketStatus.name
        },
        ticketStatusId
        );

    return reply.send( { message: 'ticket-status-updated-message' } );
}

// ~~

async function removeTicketStatusById(
    request,
    reply
    )
{
    let { ticketStatusId } = request.params;

    if ( !ticketStatusId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveTicketStatusPermission = await hasUserPermission( 'remove-ticket-status', profile.roleSlugArray );

    if ( !hasRemoveTicketStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await ticketStatusService.removeTicketStatusById(
        ticketStatusId
        );

    return reply.send( { message: 'ticket-status-deleted-message' } );
}

// ~~

async function addTicketStatus(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let ticketStatus = body;

    if ( !ticketStatus )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddTicketStatusPermission = await hasUserPermission( 'add-ticket-status', profile.roleSlugArray );

    if ( !hasAddTicketStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let ticketStatusId = getTextSlug( ticketStatus.name );
    await ticketStatusService.addTicketStatus(
        {
            id: ticketStatusId,
            order: ticketStatus.order,
            name: ticketStatus.name
        }
        );

    return reply.send( { message: 'ticket-status-created-message' } );
}

export
{
    getTicketStatus,
    getTicketStatusById,
    setTicketStatusById,
    removeTicketStatusById,
    addTicketStatus
}

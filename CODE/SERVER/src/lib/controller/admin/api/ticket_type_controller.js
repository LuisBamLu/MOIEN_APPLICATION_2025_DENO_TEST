// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../../app_error';
import { ticketTypeService } from '../../../service/ticket_type_service';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getTicketType(
    request,
    reply
    )
{
    return (
        {
            ticketTypeArray: await ticketTypeService.getTicketTypeArray()
        }
        );
}

// ~~

async function getTicketTypeById(
    request,
    reply
    )
{
    let { ticketTypeId } = request.params;

    return (
        {
            ticketTypeArray: await ticketTypeService.getTicketTypeById( ticketTypeId )
        }
        );
}

// ~~

async function setTicketTypeById(
    request,
    reply
    )
{
    let { ticketTypeId } = request.params;
    let body = getJsonObject( request.body );
    let ticketType = body;

    if ( !ticketTypeId || !ticketType )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetTicketTypePermission = await hasUserPermission( 'set-ticket-type', profile.roleSlugArray );

    if ( !hasSetTicketTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await ticketTypeService.setTicketTypeById(
        {
            order: ticketType.order,
            name: ticketType.name
        },
        ticketTypeId
        );

    return reply.send( { message: 'ticket-type-updated-message' } );
}

// ~~

async function removeTicketTypeById(
    request,
    reply
    )
{
    let { ticketTypeId } = request.params;

    if ( !ticketTypeId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveTicketTypePermission = await hasUserPermission( 'remove-ticket-type', profile.roleSlugArray );

    if ( !hasRemoveTicketTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await ticketTypeService.removeTicketTypeById(
        ticketTypeId
        );

    return reply.send( { message: 'ticket-type-deleted-message' } );
}

// ~~

async function addTicketType(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let ticketType = body;

    if ( !ticketType )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddTicketTypePermission = await hasUserPermission( 'add-ticket-type', profile.roleSlugArray );

    if ( !hasAddTicketTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let ticketTypeId = getTextSlug( ticketType.name );
    await ticketTypeService.addTicketType(
        {
            id: ticketTypeId,
            order: ticketType.order,
            name: ticketType.name
        }
        );

    return reply.send( { message: 'ticket-type-created-message' } );
}

export
{
    getTicketType,
    getTicketTypeById,
    setTicketTypeById,
    removeTicketTypeById,
    addTicketType
}

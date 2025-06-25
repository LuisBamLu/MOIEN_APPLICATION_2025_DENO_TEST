// -- IMPORTS

import { ticketService } from '../../../service/ticket_service';
import { ticketStatusService } from '../../../service/ticket_status_service';
import { profileService } from '../../../service/profile_service';
import { getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { getCurrentLocalDateTime, getJsonObject, getRandomTuid } from 'senselogic-gist';
import { AppError } from '../../../utils/app_error';
import { ticketTypeService } from '../../../service/ticket_type_service';

// -- FUNCTIONS

async function getTicket(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let [ { ticketArray, totalCount }, ticketStatusArray, ticketTypeArray ] = await Promise.all(
        [
            ticketService.getTicketArray(
                page,
                limit,
                filterArray
                ),
            ticketStatusService.getTicketStatusArray(),
            ticketTypeService.getCachedTicketTypeArray()
        ]
        );

    let totalPageCount = Math.ceil( totalCount / limit );
    let hasMorePage = page < totalPageCount;

    let [ reporterUserIdArray, assigneeUserIdArray ] =
        [ 'reporterUserId', 'assigneeUserId' ]
        .map( ( key ) => getUniqueValues( ticketArray, key ) );

    let profileArray = await profileService.getProfileArrayByUserIdArray(
        Array.from( new Set( [ ...reporterUserIdArray, assigneeUserIdArray ] ) )
        );

    for ( let ticket of ticketArray )
    {
        let reporterProfile = profileArray.find( profile => profile.userId === ticket.reporterUserId );
        let assigneeProfile = profileArray.find( profile => profile.userId === ticket.assigneeUserId );

        ticket.reporter = reporterProfile;
        ticket.assignee = assigneeProfile;
    }

    return (
        {
            ticketArray,
            ticketStatusArray,
            profileArray,
            ticketTypeArray,
            hasMorePage
        }
        );
}

// ~~

async function getAssignees(
    request,
    reply
    )
{
    let assigneeArray = await profileService.getAssignees();
    let assigneeRoleArray = [ 'administrator', 'backoffice-senior', 'backoffice' ];
    assigneeArray = assigneeArray.filter( assignee => assignee.roleSlugArray.some( roleSlug => assigneeRoleArray.includes( roleSlug ) ) );

    return { assigneeArray };
}

// ~~

async function addTicket(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddTicketPermission = await hasUserPermission( 'add-ticket', profile.roleSlugArray );

    if ( !hasAddTicketPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let body = getJsonObject( request.body );
    let ticket = body.ticket;
    await ticketService.addTicket(
        {
            id: getRandomTuid(),
            key: ticket.key,
            reporterUserId: profile.userId,
            statusId: ticket.statusId,
            typeId: ticket.typeId,
            text: ticket.text,
            title: ticket.title,
            assigneeUserId: ticket.assigneeUserId
        }
        );

    return reply.send( { message: 'ticket-added-message' } );
}

// ~~

async function getTicketById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasListTicketPermission = await hasUserPermission( 'list-ticket', profile.roleSlugArray );

    if ( !hasListTicketPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { ticketId } = request.params;
    let ticket = await ticketService.getTicketById( ticketId );

    if ( ticket === null || ticket === undefined )
    {
        throw new AppError( 'ticket-not-found-error-message', 404 );
    }

    return { ticket };
}

// ~~

async function setTicketById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetTicketPermission = await hasUserPermission( 'set-ticket', profile.roleSlugArray );

    if ( !hasSetTicketPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let { ticketId } = request.params;
    let body = getJsonObject( request.body );
    let ticket = body.ticket;
    console.log( ticket.assigneeUserId );
    await ticketService.setTicketById(
        {
            typeId: ticket.typeId,
            statusId: ticket.statusId,
            text: ticket.text,
            title: ticket.title,
            assigneeUserId: ticket.assigneeUserId,
            solvedTimestamp: ticket.statusId === 'resolved'
                ? getCurrentLocalDateTime()
                : null
        },
        ticketId
        );

    return reply.send( { message: 'ticked-updated-message' } );
}

export
{
    getTicket,
    getAssignees,
    addTicket,
    getTicketById,
    setTicketById
}

// -- IMPORTS

import { connectionService } from '../../service/connection_service';
import { getBackoffSecondCount, getCurrentTimestamp, getTimestampFromDateTime, hasUserPermission, isNullOrUndefined } from '../../base';
import { AppError } from '../../utils/app_error';
import { getJsonObject, getRandomTuid, logError } from 'senselogic-gist';

// -- FUNCTIONS

export function getBackoffSecondCountByConnection(
    connection
    )
{
    let backoffSecondCount =
            getBackoffSecondCount( connection.attemptCount, 3, 8 ) -
            ( getCurrentTimestamp() - getTimestampFromDateTime( connection.dateTime ) );

    return backoffSecondCount;
}

// ~~

export async function setConnectionData(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { connectionId } = request.params;
    let connectionData = body;

    if ( !connectionId || !connectionData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetConnectionPermission = await hasUserPermission( 'set-connection', profile.roleSlugArray );

    if ( !hasSetConnectionPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await connectionService.setConnectionById(
        connectionId,
        {
            browserAddress : connectionData.browserAddress,
            attemptCount : connectionData.attemptCount,
            isFailed : connectionData.isFailed
        }
        );

    return reply.send( { message: 'connection-updated-message' } );
}

// ~~

export async function removeConnectionData(
    request,
    reply
    )
{
    let { connectionId } = request.params;

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveConnectionPermission = await hasUserPermission( 'remove-connection', profile.roleSlugArray );

    if ( !hasRemoveConnectionPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await connectionService.deleteConnectionById( connectionId );

    return reply.send( { message: 'connection-deleted-message' } );
}

// ~~

export async function addConnectionData(
    request,
    reply
    )
{
    try
    {
        let body = getJsonObject( request.body );
        let connectionData = body;

        if ( !connectionData )
        {
            throw new AppError( 'bad-request' );
        }

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let hasAddConnectionPermission = await hasUserPermission( 'add-connection', profile.roleSlugArray );

        if ( !hasAddConnectionPermission )
        {
            throw new AppError( 'unauthorized-error-message', 403 );
        }

        let connectionId = getRandomTuid();

        let connection = await connectionService.addConnection(
            {
                id : connectionId,
                browserAddress : connectionData.browserAddress,
                attemptCount : connectionData.attemptCount,
                isFailed : connectionData.isFailed
            }
            );

        return reply.code( 201 ).send( { connection, message: 'connection-added-message' } );
    }
    catch ( error )
    {
        logError( error );
        throw new AppError( error.message );
    }
}

// ~~

export async function getConnectionByBrowserAddress(
    request,
    reply
    )
{
    let connection = await connectionService.getConnectionByBrowserAddress( request.ip );

    if ( connection.isFailed )
    {
        connection.backoffSecondCount =
            getBackoffSecondCount( connection.attemptCount, 60 ) -
            ( getCurrentTimestamp() - getTimestampFromDateTime( connection.dateTime ) );
    }
    else
    {
        connection.backoffSecondCount = 0;
    }

    return reply.status( 200 ).send( { connection } )
}

export async function addConnection(
    request,
    reply
    )
{
    let connection = await connectionService.setConnection( request.body.connection );

    return reply.status( 201 ).send( { connection } );
}

export async function deleteConnectionByBrowserAddress(
    request,
    reply
    )
{
    let { error } = await connectionService.deleteConnection( request.ip );

    if ( error !== null )
    {
        return reply.status( 500 ).send( 'connection-delete-failed' );
    }

    return reply.status( 204 ).send( null );
}

export async function getConnectionArray(
    request,
    reply
    )
{
    let profileLogged = request.profileLogged;

    if ( profileLogged === null || profileLogged === undefined )
    {
        throw new AppError( 'unauthenticated-message-error', 401 );
    }

    let isAuthorized = await hasUserPermission( 'list-connection', profileLogged.roleSlugArray );

    if ( !isAuthorized )
    {
        throw new AppError( 'unauthorized-message-error', 403 );
    }

    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let connectionArray = await connectionService.getConnectionArray( filterArray );

    return (
        {
            connectionArray
        }
        );
}

export async function getConnection(
    request,
    reply
    )
{
    let connection = await connectionService.getCachedConnectionByBrowserAddress( request.ip );
    connection.backoffSecondCount = getBackoffSecondCountByConnection( connection );

    return reply.status( 200 ).send( { connection } );
}

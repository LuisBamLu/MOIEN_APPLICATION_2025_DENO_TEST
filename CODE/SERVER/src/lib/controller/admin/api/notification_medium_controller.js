// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { notificationMediumService } from '../../../service/notification_medium_service';
import { AppError } from '../../../utils/app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getNotificationMedium(
    request,
    reply
    )
{
    let notificationMediumArray = await notificationMediumService.getCachedNotificationMediumArray();

    return reply.send( { notificationMediumArray } );
}

// ~~

async function updateNotificationMedium(
    request,
    reply
    )
{
    let { notificationMediumId } = request.params;
    let body = getJsonObject( request.body );
    let notificationMediumData = body;

    if ( !notificationMediumId || !notificationMediumData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetNotificationMediumPermission = await hasUserPermission( 'set-notification-medium', profile.roleSlugArray );

    if ( !hasSetNotificationMediumPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationMediumExists = await notificationMediumService.getNotificationMediumById( notificationMediumId );

    if ( !notificationMediumExists )
    {
        throw new AppError( 'property-medium-not-found-error', 404 );
    }

    let notificationMedium = await notificationMediumService.setNotificationMediumById(
        {
            name : notificationMediumData.name,
            number : notificationMediumData.number
        },
        notificationMediumId
        );

    return reply.send( { notificationMedium, message: 'notification-medium-updated-message' } );
}

// ~~

async function addNotificationMedium(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let notificationMediumData = body;

    if ( !notificationMediumData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddNotificationMediumPermission = await hasUserPermission( 'add-notification-medium', profile.roleSlugArray );

    if ( !hasAddNotificationMediumPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationMediumId = getTextSlug( notificationMediumData.name );
    let notificationMedium = await notificationMediumService.addNotificationMedium(
        {
            id : notificationMediumId,
            name : notificationMediumData.name,
            number : notificationMediumData.number
        },
        );

    return reply.send( { notificationMedium, message: 'notification-medium-added-message' } );
}

// ~~

async function deleteNotificationMedium(
    request,
    reply
    )
{
    let { notificationMediumId } = request.params;

    if ( !notificationMediumId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveNotificationMediumPermission = await hasUserPermission( 'remove-notification-medium', profile.roleSlugArray );

    if ( !hasRemoveNotificationMediumPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await notificationMediumService.removeNotificationMediumById( notificationMediumId );

    return reply.send( { message: 'notification-medium-deleted-message' } );
}

export
{
    getNotificationMedium,
    updateNotificationMedium,
    addNotificationMedium,
    deleteNotificationMedium
}

// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { notificationTypeService } from '../../../service/notification_type_service';
import { AppError } from '../../../app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getNotificationType(
    request,
    reply
    )
{
    let notificationTypeArray = await notificationTypeService.getCachedNotificationTypeArray();

    return reply.send( { notificationTypeArray } );
}

// ~~

async function setNotificationType(
    request,
    reply
    )
{
    let { notificationTypeId } = request.params;
    let body = getJsonObject( request.body );
    let notificationTypeData = body;

    if ( !notificationTypeId || !notificationTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetNotificationTypePermission = await hasUserPermission( 'set-notification-type', profile.roleSlugArray );

    if ( !hasSetNotificationTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationTypeExists = await notificationTypeService.getNotificationTypeById( notificationTypeId );

    if ( !notificationTypeExists )
    {
        throw new AppError( 'property-type-not-found-error', 404 );
    }

    let notificationType = await notificationTypeService.setNotificationTypeById(
        {
            name : notificationTypeData.name,
            number : notificationTypeData.number
        },
        notificationTypeId
        );

    return reply.send( { notificationType, message: 'notification-type-updated-message' } );
}

// ~~

async function addNotificationType(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let notificationTypeData = body;

    if ( !notificationTypeData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddNotificationTypePermission = await hasUserPermission( 'add-notification-type', profile.roleSlugArray );

    if ( !hasAddNotificationTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationTypeId = getTextSlug( notificationTypeData.name );

    let notificationType = await notificationTypeService.addNotificationType(
        {
            id : notificationTypeId,
            name : notificationTypeData.name,
            number : notificationTypeData.number
        },
        );

    return reply.send( { notificationType, message: 'notification-type-added-message' } );
}

// ~~

async function deleteNotificationType(
    request,
    reply
    )
{
    let { notificationTypeId } = request.params;

    if ( !notificationTypeId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveNotificationTypePermission = await hasUserPermission( 'remove-notification-type', profile.roleSlugArray );

    if ( !hasRemoveNotificationTypePermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await notificationTypeService.removeNotificationTypeById( notificationTypeId );

    return reply.send( { message: 'notification-type-deleted-message' } );
}

export
{
    getNotificationType,
    setNotificationType,
    addNotificationType,
    deleteNotificationType
}

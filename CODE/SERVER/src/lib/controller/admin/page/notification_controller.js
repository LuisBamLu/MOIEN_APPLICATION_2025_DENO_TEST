// -- IMPORTS

import { getJsonObject, getMap, getRandomTuid } from 'senselogic-gist';
import { logError } from 'senselogic-gist';
import { notificationMediumService } from '../../../service/notification_medium_service';
import { notificationPermissionService } from '../../../service/notification_permission_service';
import { notificationService } from '../../../service/notification_service';
import { notificationTypeService } from '../../../service/notification_type_service';
import { notificationCenterService } from '../../../service/notification_center_service';
import { deviceTokenService } from '../../../service/device_token_service';
import { profileService } from '../../../service/profile_service';
import { notificationEventService } from '../../../service/notification_event_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../../base';
import { AppError } from '../../../utils/app_error';

// -- FUNCTIONS

async function getPublicKey(
    request,
    reply
    )
{
    let publicKey = 'BGeAd508MPU3ozxiwQdjow8evVvgy8eGCtQI34YMEXVAyYGcIBuDyV4FoZhQs9a_G1Y8TphYr7zGEjtDtcBz1Ec';

    return (
        {
            publicKey
        }
        );
}

// ~~

async function registerToken(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let body = JSON.parse( request.body );
        let { deviceToken, deviceType } = body;
        let userId = request.profileLogged.userId;

        let deviceTokenAlreadyExists =
            await deviceTokenService.getDeviceTokenByUserIdAndDeviceType( userId, deviceType );

        let deviceTokenId = deviceTokenAlreadyExists
            ? deviceTokenAlreadyExists.id
            : getRandomTuid();

        let newDeviceToken =
            {
                id : deviceTokenId,
                userId,
                deviceToken,
                deviceType,
            };

        await deviceTokenService.addDevice( newDeviceToken );

        return reply.code( 201 ).send( { message: 'device-token-registered' } );
    }
    catch ( error )
    {
        logError( error );

        return reply.code( 404 ).send( { error: error.message } );
    }
}

// ~~

async function updateNotificationPermission(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let body = JSON.parse( request.body );
        let profile = request.profileLogged;

        let permission = await notificationPermissionService.setNotificationPermission(
            body.permission
            );

        return reply.send( { message: 'Notification settings updated' } );
    }
    catch ( error )
    {
        logError( error );

        return reply.code( 400 ).send( { error: error.message } );
    }
}

// ~~

async function getNotificationPermissionData(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { page = 1, limit = 15 } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;
    let { notificationPermissionArray, notificationPermissionCount } = await notificationPermissionService.getNotificationPermissionArray(
        page,
        limit,
        filterArray
        );

    let { hasMorePage } = getHasMorePage( notificationPermissionCount, page, limit );

    let [ userIdArray ] =
        [ 'userId' ].map( key => getUniqueValues( notificationPermissionArray, key ) );

    let [ profileArray, notificationTypeArray, notificationMediumArray ] =
        await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( userIdArray ),
                notificationTypeService.getCachedNotificationTypeArray(),
                notificationMediumService.getCachedNotificationMediumArray()
            ]
        )

    return reply.send(
        {
            notificationPermissionArray,
            notificationTypeArray,
            notificationMediumArray,
            profileArray,
            hasMorePage
        }
        );
}

// ~~

async function getNotificationTypeData(
    request,
    reply
    )
{
    return reply.status( 200 ).send( await notificationTypeService.getCachedNotificationTypeArray() );
}

// ~~

async function getNotificationMediumData(
    request,
    reply
    )
{
    return reply.status( 200 ).send( await notificationMediumService.getCachedNotificationMediumArray() );
}

// ~~

async function getNotificationPreferenceByUserId(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let userId = request.profileLogged.userId;

        let notificationTypePromise = notificationTypeService.getCachedNotificationTypeArray();
        let notificationMediumPromise = notificationMediumService.getCachedNotificationMediumArray();
        let notificationPermissionPromise = notificationPermissionService.getNotificationPermissionArrayByUserId( userId );

        let [ notificationTypeArray, notificationMediumArray, notificationPermissionArray ] =
            await Promise.all( [ notificationTypePromise, notificationMediumPromise, notificationPermissionPromise ] );

        let preferenceArray = notificationTypeArray.map(
        ( notificationType ) =>
        {
            let permissionArray = notificationPermissionArray.filter(
                ( permission ) => permission.notificationType === notificationType.id
                );

            return (
                {
                    id : notificationType.id,
                    name : notificationType.name,
                    notificationMediumArray : notificationMediumArray.map(
                        ( notificationMedium ) =>
                        {
                            let permission = permissionArray.find(
                                ( _permission ) => _permission.notificationMedium === notificationMedium.id
                                );

                            return (
                                {
                                    notificationMedium,
                                    permission : permission ?? {
                                        id : getRandomTuid(),
                                        notificationType : notificationType.id,
                                        notificationMedium : notificationMedium.id,
                                        isGranted : false,
                                        userId
                                    }
                                }
                                );
                        }
                        )
                }
                );
        }
        );

    return reply.send(
        {
            preferenceArray
        }
        );
    }
    catch ( error )
    {
        logError( error );

        return reply.code( 400 ).send( { error: error.message } );
    }
}

// ~~

async function notifyAllByNotificationType(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let body = request.body;
        let { payload } = body;

        // let newNotification =
        //     {
        //         id: getRandomTuid(),
        //         userId: payload.userId,
        //         notificationType: payload.notificationType,
        //         message: payload.message,
        //         isRead: false
        //     };

        // let notification = await notificationCenterService.addNotification( newNotification );

        return reply.send(
            {
                message: 'Notifications sent'
            }
            );
    }
    catch ( error )
    {
        logError( error );

        return reply.code( 400 ).send( { error: error.message } );
    }
}

// ~~

async function getNotificationCenter(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let userId = request.profileLogged.userId;

        return reply.send(
            {
                notificationArray : await notificationCenterService.getNotificationArrayByUserId( userId )
            }
            );
    }
    catch ( error )
    {
        throw new Error( error );
    }
}

// ~~

async function setReadNotificationRead(
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

    let userId = profile.userId;
    let notificationId = request.params.id;

    if ( notificationId === 'all' )
    {
        await notificationCenterService.setReadNotificationByUserId( userId );
    }
    else
    {
        await notificationCenterService.setReadNotificationByIdAndUserId(
            notificationId,
            userId
            );
    }

    return reply.send( { message: 'message-read-text' } );
}

// ~~

async function setDismissNotification(
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

    let userId = profile.userId;
    let notificationId = request.params.id;

    if ( notificationId === 'all' )
    {
        await notificationCenterService.deleteNotificationByUserId( userId );
    }
    else
    {
        await notificationCenterService.deleteNotificationByIdAndUserId(
            notificationId,
            userId
            );
    }

    return reply.send( { message: 'message-deleted-text' } );
}

// ~~

async function getNotificationArray(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let page = 1;
        let perPage = 50;
        let origin = request.params.origin;

        let [ notificationArray, mediumArray, typeArray ] = await Promise.all(
            [
                notificationEventService.getScheduledEventArray( page, perPage, origin ),
                notificationMediumService.getNotificationMediumArray(),
                notificationTypeService.getNotificationTypeArray(),
            ]
            );

        let response =
            {
                notificationArray : notificationArray,
                mediumArray: mediumArray,
                typeArray: typeArray
            };

        return reply.send( response );
    }
    catch ( error )
    {
        throw new Error( error );
    }
}

// ~~

async function addNotification(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let body = JSON.parse( request.body );
        let notification = body.notification;

        let notificationPermissionArray =
            await notificationPermissionService
                .getGrantedPermissionArrayByNotificationMediumAndType(
                    notification.notificationMediumArray,
                    notification.notificationType
                    );
        let profileArray = await profileService.getProfileArrayByUserIdArray(
            notificationPermissionArray.map( ( { userId } ) => userId )
            );
        let profileCount = profileArray.length;

        for ( let index = 0; index < profileCount; index++ )
        {
            let profile = profileArray[ index ];

            await notificationService.scheduleNotification( notification, { profile } );
        }

        return reply.send(
            {
                message: 'notification-scheduled',
            }
            );
    }
    catch( error )
    {
        throw new Error( error );
    }
}

// ~~

async function setNotificationPermissionData(
    request,
    reply
    )
{
    let { notificationPermissionId } = request.params;
    let body = JSON.parse( request.body );
    let { notificationPermissionData } = body;

    if ( !notificationPermissionId || !notificationPermissionData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetNotificationPermission = await hasUserPermission( 'set-notification-permission', profile.roleSlugArray );

    if ( !hasSetNotificationPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationPermission = await notificationPermissionService.setNotificationPermissionByAdmin(
        {
            notificationMedium: notificationPermissionData.notificationMedium,
            notificationType: notificationPermissionData.notificationType,
            isGranted: notificationPermissionData.isGranted,
            userId: notificationPermissionData.userId
        },
        notificationPermissionId
        );

    return reply.send(
        {
            message: 'notification-permission-updated-message',
            notificationPermission,
        }
        );
}

// ~~

async function deleteNotificationPermissionData(
    request,
    reply
    )
{
    let { notificationPermissionId } = request.params;

    if ( !notificationPermissionId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveNotificationPermission = await hasUserPermission( 'remove-notification-permission', profile.roleSlugArray );

    if ( !hasRemoveNotificationPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let notificationPermission = await notificationPermissionService.removeNotificationPermission( notificationPermissionId );

    return reply.send(
        {
            message: 'notification-permission-deleted-message',
            notificationPermission,
        }
        );
}

export
{
    addNotification,
    getNotificationArray,
    setDismissNotification,
    setReadNotificationRead,
    getNotificationCenter,
    notifyAllByNotificationType,
    getPublicKey,
    registerToken,
    updateNotificationPermission,
    getNotificationPermissionData,
    getNotificationMediumData,
    getNotificationTypeData,
    getNotificationPreferenceByUserId,
    setNotificationPermissionData,
    deleteNotificationPermissionData
}

// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { NotificationFactory } from '../notification/notification_factory';
import { notificationPermissionService } from './notification_permission_service';
import { notificationEventService } from './notification_event_service';
import { emailTemplateService } from './email_template_service';
import { pushTemplateService } from './push_template_service';
import { deviceTokenService } from './device_token_service';
import { notificationTypeService } from './notification_type_service';
import { notificationMediumService } from './notification_medium_service';
import { isNullOrUndefined } from '../base';

// -- TYPES

class NotificationService
{
// -- CONSTRUCTORS

    constructor(
        )
    {
        this.notificationStrategyMap = {};
        this.registerStrategy( 'email' );
        this.registerStrategy( 'push' );
    }

    // -- INQUIRIES

    async getNotificationArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    registerStrategy(
        notificationMedium
        )
    {
        this.notificationStrategyMap[ notificationMedium ] =
            NotificationFactory.createStrategy( notificationMedium );
    }

    // ~~

    async sendTemplateNotification(
        templateId,
        variableMap
    )
    {
        try
        {
            let profile = variableMap.profile;
            let requirePermissionGranted = variableMap?.requirePermissionGranted ?? true;

            if ( isNullOrUndefined( profile ) )
            {
                return;
            }

            let emailTemplate = await emailTemplateService.getEmailTemplateById( templateId );
            let pushTemplate;
            let notificationMediumArray = [];

            if ( requirePermissionGranted )
            {
                notificationMediumArray =
                    await notificationPermissionService
                        .getNotificationMediumArrayByNotificationTypeAndUserId( emailTemplate.notificationType, profile.userId );
            }
            else
            {
                notificationMediumArray = [ { notificationMedium: 'email' } ];
            }

            let notificationMediumCount = notificationMediumArray.length;

            if ( notificationMediumCount === 0 )
            {
                return;
            }

            for ( let index = 0; index < notificationMediumCount; index += 1 )
            {
                const { notificationMedium } = notificationMediumArray[ index ];

                if ( !notificationMedium )
                {
                    continue;
                }

                let isPushNotification = notificationMedium === 'push';

                if ( isPushNotification )
                {
                    pushTemplate = await pushTemplateService.getPushTemplateById( templateId );

                    if ( !pushTemplate )
                    {
                        continue;
                    }
                }

                let strategy = this.notificationStrategyMap[ notificationMedium ];

                if ( !strategy )
                {
                    throw new Error( 'Strategy not found for NOTIFICATION_MEDIUM ' + notificationMedium );
                }

                let template = isPushNotification
                    ? pushTemplate
                    : emailTemplate;

                await strategy.send(
                    template,
                    variableMap,
                    );
            }
        }
        catch ( error )
        {
            logError( error );
        }
    }

    // ~~

    async scheduleTemplateNotification(
        templateId,
        variableMap
    )
    {
        let profile = variableMap.profile;

        if ( !profile )
        {
            return;
        }

        let template = await emailTemplateService.getEmailTemplateById( templateId );

        let notificationMediumArray =
            await notificationPermissionService
                .getNotificationMediumArrayByNotificationTypeAndUserId( template.notificationType, profile.userId );

        let notificationMediumCount = notificationMediumArray.length;

        if ( notificationMediumCount === 0 )
        {
            return;
        }

        for ( let index = 0; index < notificationMediumCount; index += 1 )
        {
            const { notificationMedium } = notificationMediumArray[ index ];

            if ( !notificationMedium )
            {
                return;
            }

            if ( notificationMedium === 'push' )
            {
                template = await pushTemplateService.getPushTemplateById( templateId );

                if (!template )
                {
                    return;
                }
            }

            let strategy = this.notificationStrategyMap[ notificationMedium ];

            if ( !strategy )
            {
                throw new Error( 'Strategy not found for NOTIFICATION_MEDIUM ' + notificationMedium );
            }

            let event = await notificationEventService.addNotificationEvent(
                {
                    variableMap,
                    eventName : templateId + '-' + notificationMedium,
                    receiverEmailArray : [],
                    templateId,
                }
                );

            let response = await strategy.schedule(
                template,
                variableMap,
                variableMap.sendAtTimestamp,
                event.id
                );

            return response;
        }
    }

    // ~~

    async scheduleNotification(
        notification,
        variableMap
        )
    {
        let profile = variableMap.profile;

        if ( !profile )
        {
            return;
        }

        let notificationMediumArray = notification.notificationMediumArray;
        let notificationMediumCount = notificationMediumArray.length;
        let template =
            {
                subject : notification.title,
                content : notification.message,
                recipient : '{{profile.email}}',
            };

        if ( notificationMediumCount === 0 )
        {
            return;
        }

        let activeNotificationMediumArray = await notificationPermissionService
            .getNotificationMediumArrayByNotificationTypeAndUserId(
                notification.notificationType,
                profile.userId
                );
        let activeNotificationMediumSet =
            new Set( activeNotificationMediumArray.map( medium => medium.notificationMedium ) );

        for ( let index = 0; index < notificationMediumCount; index += 1 )
        {
            const notificationMedium = notificationMediumArray[ index ];

            if ( !notificationMedium || !activeNotificationMediumSet.has( notificationMedium ) )
            {
                continue;
            }

            let strategy = this.notificationStrategyMap[ notificationMedium ];

            if ( !strategy )
            {
                throw new Error( 'Strategy not found for NOTIFICATION_MEDIUM ' + notificationMedium );
            }

            if ( notificationMedium === 'push' )
            {
                let device = await deviceTokenService.getDeviceTokenByUserId( profile.userId );

                if ( !device ) continue;

                template =
                    {
                        ...template,
                        notification :
                            {
                                title : notification.title,
                                body : notification.message
                            }
                    };
                variableMap =
                    {
                        ...variableMap,
                        device
                    };
            }

            notificationEventService.addNotificationEvent(
                {
                    variableMap :
                        {
                            ...variableMap,
                            notificationMedium,
                            sendAtTimestamp : notification.date,
                            notification :
                                {
                                    ...notification,
                                    ...template
                                }
                        },
                    eventName : notification.title,
                    templateId : 'empty-template',
                    origin : 'administrator'
                }
                )
                .then(
                    ( event ) =>
                    {
                        strategy.schedule(
                            template,
                            variableMap,
                            notification.date,
                            event.id
                            );
                    }
                    );
        }
    }

    // ~~

    async setDefaultNotificationPermissionByUserId(
        userId
        )
    {
        try
        {
            let [
                    notificationTypeArray,
                    notificationMediumArray,
                ] = await Promise.all(
                        [
                            notificationTypeService.getCachedNotificationTypeArray(),
                            notificationMediumService.getNotificationMediumArray(),
                        ]
                        );

            let permissionPromiseArray = [];
            let notificationTypeCount = notificationTypeArray.length;
            let notificationMediumCount = notificationMediumArray.length;

            for ( let notificationTypeIndex = 0; notificationTypeIndex < notificationTypeCount; notificationTypeIndex++ )
            {
                for ( let notificationMediumIndex = 0; notificationMediumIndex < notificationMediumCount; notificationMediumIndex++ )
                {
                    let notificationType = notificationTypeArray[ notificationTypeIndex ].id;
                    let notificationMedium = notificationMediumArray[ notificationMediumIndex ].id;

                    permissionPromiseArray.push(
                        notificationPermissionService.addNotificationPermission(
                            {
                                id : getRandomTuid(),
                                notificationType,
                                notificationMedium,
                                userId,
                                isGranted: notificationMedium !== 'push',
                            }
                            )
                        );
                }
            }

            await Promise.all( permissionPromiseArray );
        }
        catch ( error )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let notificationService
    = new NotificationService();

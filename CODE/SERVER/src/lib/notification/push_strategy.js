// -- IMPORTS

import { NotificationStrategy } from './notification_strategy';
import { firebaseService } from '../service/firebase_service';
import { notificationEventService } from '../service/notification_event_service';
import schedule from 'node-schedule';

// -- TYPES

export class PushStrategy extends NotificationStrategy
{
    // -- OPERATIONS

    async send(
        template,
        variableMap
        )
    {
        try
        {
            let token = variableMap.device?.deviceToken;

            if ( !token )
            {
                return (
                    {
                        success : false,
                    }
                    );
            }

            let title = this.fillTemplate( template.notification.title, variableMap );
            let body = this.fillTemplate( template.notification.body, variableMap );

            let message =
                {
                    notification :
                        {
                            title,
                            body,
                        },
                    token
                };

            let response =
                await firebaseService
                    .send( message );

            return (
                {
                    success : true,
                    response
                }
                );
        }
        catch ( error )
        {
            console.error( error );

            return (
                {
                    success : false,
                    error
                }
                );
        }
    }

    // ~~

    async schedule(
        template,
        variableMap,
        sendAtTimestamp = new Date( Date.now().getTime() + 1 * 60 * 1000 ),
        eventId
        )
    {
        let jobDate = new Date( sendAtTimestamp );

        schedule.scheduleJob(
            eventId,
            jobDate,
            async () =>
            {
                let { success } = await this.send( template, variableMap );

                await notificationEventService.setNotificationEventStatus(
                    success ? 'done' : 'failed',
                    eventId
                    );
            }
            );
    }
}

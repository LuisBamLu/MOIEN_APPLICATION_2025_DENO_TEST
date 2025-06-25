// -- IMPORTS

import { NotificationStrategy } from './notification_strategy';
import { transporter } from '../mailer';
import schedule from 'node-schedule';
import { notificationEventService } from '../service/notification_event_service';

// -- TYPES

export class EmailStrategy extends NotificationStrategy
{
    // -- OPERATIONS

    async send(
        template,
        variableMap
        )
    {
        try
        {
            let enableInlineCss = true;
            let subject = this.fillTemplate( template.subject, variableMap );
            let html = this.fillTemplate( template.content, variableMap, enableInlineCss );
            let recipient = this.fillTemplate( template.recipient, variableMap );

            let message =
                {
                    to : recipient,
                    from : 'noreply@moien.com',
                    subject,
                    html,
                };

            let response =
                await transporter
                    .sendMail( message );

            return (
                {
                    success : true,
                    response
                }
                );
        }
        catch ( error )
        {
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

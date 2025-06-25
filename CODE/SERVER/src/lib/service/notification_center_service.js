// -- IMPORTS

import { getJsonText, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class NotificationCenterService
{
    // -- CONSTRUCTORS

    constructor(
    )
    {
        this.socketByUserIdMap = {};
    }

    // -- INQUIRIES

    async getNotificationArrayByUserId(
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .select()
                .eq( 'userId', userId )
                .order( 'creationTimestamp', { ascending: false } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addNotification(
        notification
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .insert( notification )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        let client = this.socketByUserIdMap[ notification.userId ];

        if ( client )
        {
            client.send( getJsonText( { type: 'addNotification', notification: data } ) );
        }

        return data;
    }

    // ~~

    async setReadNotificationByIdAndUserId(
        notificationId,
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .update( { isRead: true } )
                .eq( 'userId', userId )
                .eq( 'id', notificationId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async deleteNotificationByIdAndUserId(
        notificationId,
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .delete()
                .match( { id: notificationId, userId } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setReadNotificationByUserId(
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .update( { isRead: true } )
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async deleteNotificationByUserId(
        userId
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_CENTER' )
                .delete()
                .match( { userId } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let notificationCenterService
    = new NotificationCenterService();

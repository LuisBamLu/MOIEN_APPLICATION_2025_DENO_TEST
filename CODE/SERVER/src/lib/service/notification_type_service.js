// -- IMPORTS

import { databaseService } from './database_service';

// -- TYPES

class NotificationTypeService
{
// -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedNotificationTypeArray = null;
        this.cachedNotificationTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getNotificationTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNotificationTypeById(
        notificationTypeId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_TYPE' )
            .select()
            .eq( 'id', notificationTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async setNotificationTypeById(
        notificationType,
        notificationTypeId
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_TYPE' )
            .update( notificationType )
            .eq( 'id', notificationTypeId )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async addNotificationType(
        notificationType
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_TYPE' )
            .insert( notificationType )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeNotificationTypeById(
        notificationTypeId
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_TYPE' )
            .delete()
            .match( { id : notificationTypeId } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedNotificationTypeArray = null;
    }

    // ~~

    async getCachedNotificationTypeArray(
        )
    {
        if ( this.cachedNotificationTypeArray === null
             || Date.now() > this.cachedNotificationTypeTimestamp + 300000 )
        {
            this.cachedNotificationTypeArray = await this.getNotificationTypeArray();
            this.cachedNotificationTypeTimestamp = Date.now()
        }

        return this.cachedNotificationTypeArray;
    }
}

// -- VARIABLES

export let notificationTypeService
    = new NotificationTypeService();

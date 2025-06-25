// -- IMPORTS

import { databaseService } from './database_service';

// -- TYPES

class NotificationMediumService
{
// -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedNotificationMediumArray = null;
        this.cachedNotificationMediumTimestamp = 0;
    }

    // -- INQUIRIES

    async getNotificationMediumArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_MEDIUM' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNotificationMediumById(
        notificationMediumId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_MEDIUM' )
            .select()
            .eq( 'id', notificationMediumId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async setNotificationMediumById(
        notificationMedium,
        notificationMediumId
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_MEDIUM' )
            .update( notificationMedium )
            .eq( 'id', notificationMediumId )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async addNotificationMedium(
        notificationMedium
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_MEDIUM' )
            .insert( notificationMedium )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeNotificationMediumById(
        notificationMediumId
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_MEDIUM' )
            .delete()
            .match( { id : notificationMediumId } );

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
        this.cachedNotificationMediumArray = null;
    }

    // ~~

    async getCachedNotificationMediumArray(
        )
    {
        if ( this.cachedNotificationMediumArray === null
             || Date.now() > this.cachedNotificationMediumTimestamp + 300000 )
        {
            this.cachedNotificationMediumArray = await this.getNotificationMediumArray();
            this.cachedNotificationMediumTimestamp = Date.now()
        }

        return this.cachedNotificationMediumArray;
    }
}

// -- VARIABLES

export let notificationMediumService
    = new NotificationMediumService();

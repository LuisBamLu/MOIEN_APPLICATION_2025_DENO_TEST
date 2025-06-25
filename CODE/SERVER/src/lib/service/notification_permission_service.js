// -- IMPORTS

import { applyFilterToQuery, getPaginationIndexMap } from '../base';
import { databaseService } from './database_service';
import { logError } from 'senselogic-gist';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'notificationType',
        'notificationMedium',
        'isGranted',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class NotificationPermissionService
{
// -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedNotificationPermissionArray = null;
        this.cachedNotificationPermissionTimestamp = 0;
    }

    // -- INQUIRIES

    async getNotificationPermissionArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'NOTIFICATION_PERMISSION' )
            .select();
        let { count } = await databaseService.getClient()
            .from( 'NOTIFICATION_PERMISSION' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                notificationPermissionArray: data,
                notificationPermissionCount: count
            }
            );
    }

    // ~~

    async getNotificationPermissionArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_PERMISSION' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getNotificationMediumArrayByNotificationTypeAndUserId(
        notificationType,
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_PERMISSION' )
                .select( 'notificationMedium' )
                .eq( 'userId', userId )
                .eq( 'notificationType', notificationType )
                .eq( 'isGranted', true );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getGrantedPermissionArrayByNotificationMediumAndType(
        notificationMediumArray,
        notificationType
        )
    {
        let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_PERMISSION' )
                .select()
                .in( 'notificationMedium', notificationMediumArray )
                .eq( 'notificationType', notificationType )
                .eq( 'isGranted', true );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedNotificationPermissionArray = null;
    }

    // ~~

    async getCachedNotificationPermissionArray(
        )
    {
        if ( this.cachedNotificationPermissionArray === null
             || Date.now() > this.cachedNotificationPermissionTimestamp + 300000 )
        {
            this.cachedNotificationPermissionArray = await this.getNotificationPermissionArray();
            this.cachedNotificationPermissionTimestamp = Date.now()
        }

        return this.cachedNotificationPermissionArray;
    }

    // ~~

    async removeNotificationPermission(
        notificationPermissionId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_PERMISSION' )
            .delete()
            .eq( 'id', notificationPermissionId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

       // ~~

       async addNotificationPermission(
        notificationPermission
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_PERMISSION' )
                .insert( notificationPermission );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setNotificationPermission(
        notificationPermission
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_PERMISSION' )
                .upsert( notificationPermission )
                .eq( 'id', notificationPermission.id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setNotificationPermissionByAdmin(
        notificationPermission,
        notificationPermissionId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'NOTIFICATION_PERMISSION' )
            .update( notificationPermission )
            .eq( 'id', notificationPermissionId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let notificationPermissionService
    = new NotificationPermissionService();

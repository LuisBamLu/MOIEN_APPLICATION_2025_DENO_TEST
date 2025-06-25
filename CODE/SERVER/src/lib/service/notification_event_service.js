// -- IMPORTS

import { getRandomTuid, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import schedule from 'node-schedule';

// -- TYPES

class NotificationEventService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedNotificationEventArray = null;
    }

    // -- INQUIRIES

      async getScheduledEventArray(
        page = 1,
        limit = 10,
        origin = 'administrator'
        )
    {
        let skip = ( page - 1 ) * limit;

       let query =
            databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .select();

        if ( origin )
        {
            query.eq( 'origin', origin );
        }

        let { data, error } =
            await query
                .order( 'sendAtTimestamp', { ascending : false } )
                .range( skip, skip + limit - 1 );

        let { count : scheduledEventCount } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .select( '*', { count : 'exact' } );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                eventArray : data,
                pagination :
                    {
                        page,
                        pageCount : Math.ceil( scheduledEventCount / limit ),
                        total : scheduledEventCount,
                    }
            }
            );
    }

    // ~~

    async getScheduledEventArrayByUserId(
        userId = null,
        page = 1,
        limit = 10
        )
    {
        let skip = ( page - 1 ) * limit;

       let { data, error } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .select()
                .eq( 'userId', userId )
                .order( 'sendAtTimestamp', { ascending : false } )
                .range( skip, skip + limit - 1 );

        let { count : scheduledEventCount } =
            await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .select( '*', { count : 'exact' } )
                .eq( 'userId', userId )

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                eventArray : data,
                pagination :
                    {
                        page,
                        pageCount : Math.ceil( scheduledEventCount / limit ),
                        total : scheduledEventCount,
                    }
            }
            );
    }

    // -- OPERATIONS

    async addNotificationEvent(
        notificationEvent
        )
    {
        let {
                variableMap,
                eventName,
                templateId,
                origin,
            } = notificationEvent;

        let event =
            {
                id : getRandomTuid(),
                notificationMedium : variableMap.notificationMedium,
                variableMap,
                templateId,
                eventName,
                eventStatus : 'pending',
                sendAtTimestamp : new Date( variableMap.sendAtTimestamp ),
                origin,
            };

        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .insert( event )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async cancelScheduledEvent(
        jobId,
        userId
        )
    {
        let job = schedule.scheduledJobs[ jobId ];

        if ( !job  )
        {
            return null;
        }

        job.cancel();

        delete schedule.scheduledJobs[ jobId ];

        let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .delete()
                .match( { id: jobId, userId } );

        if ( error !== null )
        {
            logError( error );
        }

        let jobArray = Object.keys( schedule.scheduledJobs )
            .map(
                ( key ) =>
                (
                    {
                        id : key,
                        name : schedule.scheduledJobs[ key ].name,
                        nextInvocation : schedule.scheduledJobs[ key ].nextInvocation(),
                    }
                )
                );

        return jobArray;
    }

    // ~~

    async setNotificationEventStatus(
        eventStatus,
        eventId
        )
    {
       let { data, error }
            = await databaseService.getClient()
                .from( 'NOTIFICATION_EVENT' )
                .update( { eventStatus } )
                .match( { id: eventId } )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let notificationEventService
    = new NotificationEventService();

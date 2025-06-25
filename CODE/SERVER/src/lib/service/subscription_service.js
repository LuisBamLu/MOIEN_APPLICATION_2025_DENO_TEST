// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class SubscriptionService
{
    // -- INQUIRIES

    async getSubscriptionById(
        subscriptionId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select()
                .eq( 'id', subscriptionId );

            if ( error !== null )
            {
                logError( error );
            }

            return data;
    }

    // ~~

    async getSubscriptionArray(
        subscriptionIdArray = [],
        subscriptionPage = 1,
        subscriptionLimit = 10
        )
    {
        let query
            = databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select();
        let countQuery
            = databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .select( 'id', { count: 'exact', head: true } );

        if ( subscriptionIdArray.length > 0 )
        {
            query = query.in( 'id', subscriptionIdArray );
            countQuery = countQuery.in( 'id', subscriptionIdArray );
        }

        let { count } = await countQuery;
        let countSubscriptionArray = count;

        let startIndex = ( subscriptionPage - 1 ) * subscriptionLimit;
        let endIndex = startIndex + subscriptionLimit - 1;
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;
        let subscriptionArray = data;

        if ( error !== null )
        {
            logError( error );
        }

        return { subscriptionArray, countSubscriptionArray };
    }

    // -- OPERATIONS

    async setSubscription(
        subscription
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'SUBSCRIPTION' )
                .update( subscription )
                .eq( 'id', subscription.id );

        if ( error !== null )
        {
            logError( error );
        }

        return subscription;
    }
}

export let subscriptionService
    = new SubscriptionService();

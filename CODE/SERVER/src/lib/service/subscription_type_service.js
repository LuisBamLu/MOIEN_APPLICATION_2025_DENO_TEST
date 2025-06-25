// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class SubscriptionTypeService
{
    // -- INQUIRIES

    async getSubscriptionTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SUBSCRIPTION_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionTypeArrayByIdArray(
        idArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SUBSCRIPTION_TYPE' )
                .select()
                .in( 'id', idArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getSubscriptionTypeById(
        subscriptionTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SUBSCRIPTION_TYPE' )
                .select()
                .eq( 'id', subscriptionTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }
}

// -- VARIABLES

export let subscriptionTypeService
    = new SubscriptionTypeService();

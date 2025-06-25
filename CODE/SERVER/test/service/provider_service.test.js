// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class ProviderService
{
    // -- INQUIRIES

    async getProviderArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROVIDER' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getProviderById(
        providerId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROVIDER' )
                .select()
                .eq( 'id', providerId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let providerService
    = new ProviderService();

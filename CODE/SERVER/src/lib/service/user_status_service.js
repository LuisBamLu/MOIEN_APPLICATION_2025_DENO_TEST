// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class UserStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedUserStatusArray = null;
        this.cachedUserStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getUserStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUserStatusById(
        userStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'USER_STATUS' )
                .select()
                .eq( 'id', userStatusId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedUserStatusArray = null;
    }

    // ~~

    async getCachedUserStatusArray(
        )
    {
        if ( this.cachedUserStatusArray === null
             || Date.now() > this.cachedUserStatusTimestamp + 300000 )
        {
            this.cachedUserStatusArray = await this.getUserStatusArray();
            this.cachedUserStatusTimestamp = Date.now()
        }

        return this.cachedUserStatusArray;
    }
}

// -- VARIABLES

export let userStatusService
    = new UserStatusService();

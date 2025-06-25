// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class UserGenderService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedUserGenderArray = null;
        this.cachedUserGenderTimestamp = 0;
    }

    // -- INQUIRIES

    async getUserGenderArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'GENDER' )
                .select( 'id, name' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUserGenderById(
        userGenderId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'GENDER' )
                .select()
                .eq( 'id', userGenderId );

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
        this.cachedUserGenderArray = null;
    }

    // ~~

    async getCachedUserGenderArray(
        )
    {
        if ( this.cachedUserGenderArray === null
             || Date.now() > this.cachedUserGenderArray + 300000 )
        {
            this.cachedUserGenderArray = await this.getUserGenderArray();
            this.cachedUserGenderTimestamp = Date.now();
        }

        return this.cachedUserGenderArray;
    }
}

// -- VARIABLES

export let userGenderService
    = new UserGenderService();

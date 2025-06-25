// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class ValidationStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedValidationStatusArray = null;
        this.cachedValidationStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getValidationStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VALIDATION_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getValidationStatusById(
        validationStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VALIDATION_STATUS' )
                .select()
                .eq( 'id', validationStatusId );

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
        this.cachedValidationStatusArray = null;
    }

    // ~~

    async getCachedValidationStatusArray(
        )
    {
        if ( this.cachedValidationStatusArray === null
             || Date.now() > this.cachedValidationStatusTimestamp + 300000 )
        {
            this.cachedValidationStatusArray = await this.getValidationStatusArray();
            this.cachedValidationStatusTimestamp = Date.now()
        }

        return this.cachedValidationStatusArray;
    }
}

// -- VARIABLES

export let validationStatusService
    = new ValidationStatusService();

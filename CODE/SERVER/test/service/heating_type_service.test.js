// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class HeatingTypeService
{
    // -- CONSTRUCTORS

    constructor (
        )
    {
        this.cachedHeatingTypeArray = null;
        this.cachedHeatingTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getHeatingTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'HEATING_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedHeatingTypeArray(
        )
    {
        if ( this.cachedHeatingTypeArray === null
             || Date.now() > this.cachedHeatingTypeTimestamp + 300000 )
        {
            this.cachedHeatingTypeArray = await this.getHeatingTypeArray();
            this.cachedHeatingTypeTimestamp = Date.now()
        }

        return this.cachedHeatingTypeArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedHeatingTypeArray = null;
    }
}

export let heatingTypeService
    = new HeatingTypeService();

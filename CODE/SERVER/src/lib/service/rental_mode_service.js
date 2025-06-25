// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalModeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedRentalModeArray = null;
        this.cachedRentalModeByIdMap = null;
        this.cachedRentalModeTimestamp = 0;
    }

    // -- INQUIRIES

    async getRentalModeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_MODE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalModeById(
        rentalModeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_MODE' )
                .select()
                .eq( 'id', rentalModeId );

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
        this.cachedRentalModeArray = null;
        this.cachedRentalModeByIdMap = null;
    }

    // ~~

    async getCachedRentalModeArray(
        )
    {
        if ( this.cachedRentalModeArray === null
             || Date.now() > this.cachedRentalModeTimestamp + 300000 )
        {
            this.cachedRentalModeArray = await this.getRentalModeArray();
            this.cachedRentalModeTimestamp = Date.now();
            this.cachedRentalModeByIdMap = null;
        }

        return this.cachedRentalModeArray;
    }

    // ~~

    async getCachedRentalModeByIdMap(
        )
    {
        if ( this.cachedRentalModeByIdMap === null )
        {
            this.cachedRentalModeByIdMap = getMapById( await this.getCachedRentalModeArray() );
        }

        return this.cachedRentalModeByIdMap;
    }

    // ~~

    async addRentalMode(
        rentalMode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_MODE' )
                .insert( rentalMode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalModeById(
        rentalMode,
        rentalModeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_MODE' )
                .update( rentalMode )
                .eq( 'id', rentalModeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalModeById(
        rentalModeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_MODE' )
                .delete()
                .eq( 'id', rentalModeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalModeService
    = new RentalModeService();

// -- IMPORTS

import { logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedRentalTypeArray = null;
        this.cachedRentalTypeByIdMap = null;
        this.cachedRentalTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getRentalTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_TYPE' )
                .select( 'id, name' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalTypeById(
        rentalTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_TYPE' )
                .select()
                .eq( 'id', rentalTypeId );

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
        this.cachedRentalTypeArray = null;
    }

    // ~~

    async getCachedRentalTypeArray(
        )
    {
        if ( this.cachedRentalTypeArray === null
             || Date.now() > this.cachedRentalTypeTimestamp + 300000 )
        {
            this.cachedRentalTypeArray = await this.getRentalTypeArray();
            this.cachedRentalTypeTimestamp = Date.now();
            this.cachedRentalTypeByIdMap = null;
        }

        return this.cachedRentalTypeArray;
    }

    // ~~

    async getCachedRentalTypeByIdMap(
        )
    {
        if ( this.cachedRentalTypeByIdMap === null )
        {
            await this.getCachedRentalTypeArray();
            this.cachedRentalTypeByIdMap = getMapById( this.cachedRentalTypeArray )
        }
    }

    // ~~

    async addRentalType(
        rentalType
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_TYPE' )
                .insert( rentalType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalTypeById(
        rentalType,
        rentalTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_TYPE' )
                .update( rentalType )
                .eq( 'id', rentalTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalTypeById(
        rentalTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_TYPE' )
                .delete()
                .eq( 'id', rentalTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalTypeService
    = new RentalTypeService();

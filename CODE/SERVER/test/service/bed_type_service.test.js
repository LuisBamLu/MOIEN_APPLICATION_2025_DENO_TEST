// -- IMPORTS

import { getMapById, logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class BedTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedBedTypeArray = null;
        this.cachedBedTypeByIdMap = null;
        this.cachedBedTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getBedTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBedTypeById(
        bedTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED_TYPE' )
                .select()
                .eq( 'id', bedTypeId );

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

    async getCachedBedTypeArray(
        )
    {
        if ( this.cachedBedTypeArray === null
             || Date.now() > this.cachedBedTypeTimestamp + 300000 )
        {
            this.cachedBedTypeArray = await this.getBedTypeArray();
            this.cachedBedTypeByIdMap = null;
            this.cachedBedTypeTimestamp = Date.now();
        }

        return this.cachedBedTypeArray;
    }

    // ~~

    async getCachedBedTypeByIdMap(
        )
    {
        if ( this.cachedBedTypeByIdMap === null )
        {
            this.cachedBedTypeByIdMap = getMapById( await this.getCachedBedTypeArray() );
        }

        return this.cachedBedTypeByIdMap;
    }

    async addBedType(
        bedType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED_TYPE' )
                .insert( bedType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setBedTypeById(
        bedType,
        bedTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED_TYPE' )
                .update( bedType )
                .eq( 'id', bedTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBedTypeById(
        bedTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED_TYPE' )
                .delete()
                .eq( 'id', bedTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let bedTypeService
    = new BedTypeService();

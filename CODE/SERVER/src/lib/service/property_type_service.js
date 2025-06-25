// -- IMPORTS

import { logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PropertyTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPropertyTypeArray = null;
        this.cachedPropertyTypeMap = null;
        this.cachedPropertyTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getPropertyTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_TYPE' )
                .select()
                .order( 'number', { ascending: true } );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPropertyTypeById(
        propertyTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_TYPE' )
                .select()
                .eq( 'id', propertyTypeId );

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
        this.cachedPropertyTypeArray = null;
    }

    // ~~

    async getCachedPropertyTypeArray(
        )
    {
        if ( this.cachedPropertyTypeArray === null
             || Date.now() > this.cachedPropertyTypeTimestamp + 300000 )
        {
            this.cachedPropertyTypeArray = await this.getPropertyTypeArray();
            this.cachedPropertyTypeTimestamp = Date.now();
            this.cachedPropertyTypeMap = null;
        }

        return this.cachedPropertyTypeArray;
    }

    // ~~

    async getCachedPropertyTypeMap(
        )
    {
        if ( this.cachedPropertyTypeMap === null )
        {
            this.cachedPropertyTypeMap = getMapById( await this.getCachedPropertyTypeArray() );
        }

        return this.cachedPropertyTypeMap;
    }

    // ~~

    async addPropertyType(
        propertyType
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_TYPE' )
                .insert( propertyType )
                .select();

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

    // ~~

    async setPropertyTypeById(
        propertyType,
        propertyTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_TYPE' )
                .update( propertyType )
                .eq( 'id', propertyTypeId )
                .select();

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

    // ~~

    async removePropertyTypeById(
        propertyTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_TYPE' )
                .delete()
                .eq( 'id', propertyTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let propertyTypeService
    = new PropertyTypeService();

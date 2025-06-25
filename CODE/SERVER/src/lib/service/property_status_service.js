// -- IMPORTS

import { logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PropertyStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPropertyStatusArray = null;
        this.cachedPropertyStatusMap = null;
        this.cachedPropertyStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getPropertyStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPropertyStatusById(
        propertyStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_STATUS' )
                .select()
                .eq( 'id', propertyStatusId );

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
        this.cachedPropertyStatusArray = null;
    }

    // ~~

    async getCachedPropertyStatusArray(
        )
    {
        if ( this.cachedPropertyStatusArray === null
             || Date.now() > this.cachedPropertyStatusTimestamp + 300000 )
        {
            this.cachedPropertyStatusArray = await this.getPropertyStatusArray();
            this.cachedPropertyStatusTimestamp = Date.now();
            this.cachedPropertyStatusMap = null;
        }

        return this.cachedPropertyStatusArray;
    }

    // ~~

    async getCachedPropertyStatusMap(
        )
    {
        if ( this.cachedPropertyStatusMap === null )
        {
            this.cachedPropertyStatusMap = getMapById( await this.getCachedPropertyStatusArray() );
        }

        return this.cachedPropertyStatusMap;
    }

    // ~~

    async addPropertyStatus(
        propertyStatus
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_STATUS' )
                .insert( propertyStatus )
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

    async setPropertyStatusById(
        propertyStatus,
        propertyStatusId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_STATUS' )
                .update( propertyStatus )
                .eq( 'id', propertyStatusId )
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

    async removePropertyStatusById(
        propertyStatusId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'PROPERTY_STATUS' )
                .delete()
                .eq( 'id', propertyStatusId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let propertyStatusService
    = new PropertyStatusService();

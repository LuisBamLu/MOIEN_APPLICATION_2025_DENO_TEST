// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class ServiceManagerService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedServiceTypeArray = null;
        this.cachedServiceTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getServiceArray(
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'SERVICE' )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getServiceTypeArray(
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'SERVICE_TYPE' )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getServiceById(
        serviceId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'SERVICE' )
            .eq( 'id', serviceId )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async setServiceById(
        service,
        serviceId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'SERVICE' )
            .update( service )
            .eq( 'id', serviceId )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeServiceById(
        serviceTypeId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'SERVICE' )
            .delete( 'id', serviceTypeId);

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedServiceTypeArray(
        )
    {
        if ( this.cachedServiceTypeArray === null
             || Date.now() > this.cachedServiceTypeTimestamp + 300000 )
        {
            this.cachedServiceTypeArray = await this.getServiceTypeArray();
            this.cachedServiceTypeTimestamp = Date.now()
        }

        return this.cachedServiceTypeArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedServiceTypeArray = null;
    }
}

// -- VARIABLES

export let serviceManagerService
    = new ServiceManagerService();

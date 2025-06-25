// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class LeaseStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedLeaseStatusArray = null;
        this.cachedLeaseStatusByIdMap = null;
        this.cachedLeaseStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getLeaseStatusArray(
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLeaseStatusById(
        leaseStatusId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_STATUS' )
                .select()
                .eq( 'id', leaseStatusId );

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
        this.cachedLeaseStatusArray = null;
        this.cachedLeaseStatusByIdMap = null;
    }

    // ~~

    async getCachedLeaseStatusArray(
        )
    {
        if ( this.cachedLeaseStatusArray === null
             || Date.now() > this.cachedLeaseStatusTimestamp + 300000 )
        {
            this.cachedLeaseStatusArray = await this.getLeaseStatusArray();
            this.cachedLeaseStatusTimestamp = Date.now();
            this.cachedLeaseStatusByIdMap = null;
        }

        return this.cachedLeaseStatusArray;
    }

    // ~~

    async getCachedLeaseStatusByIdMap(
        )
    {
        if ( this.cachedLeaseStatusByIdMap === null )
        {
            let leaseStatusArray = await this.getCachedLeaseStatusArray();
            this.cachedLeaseStatusByIdMap = getMapById( leaseStatusArray );
        }

        return this.cachedLeaseStatusByIdMap;
    }

    // ~~

    async addLeaseStatus(
        leaseStatus
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_STATUS' )
                .insert( leaseStatus )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

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

    async setLeaseStatusById(
        leaseStatus,
        leaseStatusId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_STATUS' )
                .update( leaseStatus )
                .eq( 'id', leaseStatusId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

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

    async deleteLeaseStatusById(
        leaseStatusId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'LEASE_STATUS' )
                .delete()
                .eq( 'id', leaseStatusId );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

// -- VARIABLES

export let leaseStatusService
    = new LeaseStatusService();

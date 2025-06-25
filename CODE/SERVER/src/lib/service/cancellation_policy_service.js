// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class CancellationPolicyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedCancellationPolicyArray = null;
        this.cachedCancellationPolicyTimestamp = 0;
    }

    // -- INQUIRIES

    async getCancellationPolicyArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .select()
                .order( 'number', 'asc' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedCancellationPolicyArray(
        )
    {
        if ( this.cachedCancellationPolicyArray === null
             || Date.now() > this.cachedCancellationPolicyTimestamp + 300000 )
        {
            this.cachedCancellationPolicyArray = await this.getCancellationPolicyArray();
            this.cachedCancellationPolicyTimestamp = Date.now();
        }

        return this.cachedCancellationPolicyArray;
    }

    // ~~

    async getCancellationPolicyById(
        cancellationPolicyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .select()
                .eq( 'id', cancellationPolicyId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setCancellationPolicyById(
        cancellationPolicy,
        cancellationPolicyId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .update( cancellationPolicy )
                .eq( 'id', cancellationPolicyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedCancellationPolicyArray = null;
    }

    // -- OPERATIONS

    async setCancellationPolicy(
        cancellationPolicy,
        cancellationPolicyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .update( cancellationPolicy )
                .eq( 'id', cancellationPolicyId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removeCancellationPolicy(
        cancellationPolicyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .delete()
                .eq( 'id', cancellationPolicyId );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async addCancellationPolicy(
        cancellationPolicy
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CANCELLATION_POLICY' )
                .insert( cancellationPolicy )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

// -- VARIABLES

export let cancellationPolicyService
    = new CancellationPolicyService();

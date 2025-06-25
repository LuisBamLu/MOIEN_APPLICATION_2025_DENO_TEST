// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class EmploymentStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedEmploymentStatusArray = null;
        this.cachedEmploymentStatusByIdMap = null;
        this.cachedEmploymentStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getEmploymentStatusArray(
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'EMPLOYMENT_STATUS' )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getEmploymentStatusById(
        employmentStatusId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'EMPLOYMENT_STATUS' )
                .select()
                .eq( 'id', employmentStatusId );

        if ( error )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async getCachedEmploymentStatusArray(
        )
    {
        if ( this.cachedEmploymentStatusArray === null
            || Date.now() > this.cachedEmploymentStatusTimestamp + 300000 )
        {
            this.cachedEmploymentStatusArray = this.getEmploymentStatusArray();
            this.cachedEmploymentStatusByIdMap = null;
            this.cachedEmploymentStatusTimestamp = Date.now()
        }

        return this.cachedEmploymentStatusArray;
    }

    // ~~

    async getCachedEmploymentStatusByIdMap(
        )
    {
        if ( this.cachedEmploymentStatusByIdMap === null )
        {
            let employmentStatusArray = await this.getCachedEmploymentStatusArray();
            this.cachedEmploymentStatusByIdMap = getMapById( employmentStatusArray );
        }

        return this.cachedEmploymentStatusByIdMap;
    }

    // -- OPERATIONS

    async addEmploymentStatus(
        employmentStatus
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'EMPLOYMENT_STATUS' )
                .insert( employmentStatus )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async setEmploymentStatusById(
        employmentStatus,
        employmentStatusId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'EMPLOYMENT_STATUS' )
                .update(  employmentStatus )
                .eq( 'id', employmentStatusId )
                .select();

        if ( error !== null )
        {
            logError( null );
        }

        return data[ 0 ];
    }
}

export let employmentStatusService = new EmploymentStatusService();

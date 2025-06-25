// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class VisitStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedVisitStatusArray = null;
        this.cachedVisitStatusByIdMap = null;
        this.cachedVisitStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getVisitStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VISIT_STATUS' )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitStatusById(
        visitStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VISIT_STATUS' )
                .select()
                .eq( 'id', visitStatusId );

        if ( error )
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

    async getCachedVisitStatusArray(
        )
    {
        if ( this.cachedVisitStatusArray === null
             || Date.now() > this.cachedVisitStatusTimestamp + 300000 )
        {
            this.cachedVisitStatusArray = this.getVisitStatusArray();
            this.cachedVisitStatusByIdMap = null;
            this.cachedVisitStatusTimestamp = Date.now();
        }

        return this.cachedVisitStatusArray;
    }

    // ~~

    async getCachedVisitStatusByIdMap(
        )
    {
        if ( this.cachedVisitStatusByIdMap === null )
        {
            let visitStatusArray = await this.getCachedVisitStatusArray();
            this.cachedVisitStatusByIdMap = getMapById( visitStatusArray );
        }

        return this.cachedVisitStatusByIdMap;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedVisitStatusArray = null;
    }

    // ~~

    async setVisitStatusById(
        visitStatus,
        visitStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VISIT_STATUS' )
                .update( visitStatus )
                .eq( 'id', visitStatusId )
                .select();

        this.clearCache();

        if ( error )
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

    async addVisitStatus(
        visitStatus,
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'VISIT_STATUS' )
                .insert( visitStatus )
                .select();

        this.clearCache();

        if ( error )
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

    async removeVisitStatusById(
        visitStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from ( 'VISIT_STATUS' )
                .delete()
                .eq( 'id', visitStatusId );

        this.clearCache();

        if ( error )
        {
            logError( error );
        }

        return data;
    }
}

export let visitStatusService = new VisitStatusService();

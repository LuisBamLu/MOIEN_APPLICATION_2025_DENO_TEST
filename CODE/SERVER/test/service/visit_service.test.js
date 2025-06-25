// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'date',
        'time',
        'duration',
        'status',
        'visitorUserId',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class VisitService
{
    // -- INQUIRIES

    async getVisitArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = supabaseService.getClient()
            .from( 'VISIT' )
            .select();
        let countQuery = supabaseService.getClient()
            .from( 'VISIT' )
            .select( 'id', { count: 'exact', head: true } );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );

        query = query.range( startIndex, endIndex );
        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error )
        {
            logError( error );
        }

        return (
            {
                visitArray : data,
                visitCount : count
            }
            );
    }

    // ~~

    async getVisitArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByUserIdAndDateRange(
        userId,
        dateRange
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId )
                .gte( 'date', dateRange[ 0 ] )
                .lte( 'date', dateRange[ 1 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalVistArrayByVisitorUserId(
        visitorUserId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'visitorUserId', visitorUserId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByStatus(
        status
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'status', status );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByUserIdAndStatus(
        userId,
        status
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId )
                .eq( 'status', status );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getAvailableRentalArrayVisitByUserIdAndCurrentDate(
        userId
        )
    {
        let currentDateISOString = new Date().toISOString().split( 'T' )[ 0 ];

        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId )
                .eq( 'status', 'available' )
                .gte( 'date', currentDateISOString )
                .order( 'date' )
                .order( 'time' );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByUserIdAndStatusArray(
        userId,
        statusArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByVisitorUserIdAndStatus(
        visitorUserId,
        status
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'visitorUserId', visitorUserId )
                .eq( 'status', status );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitByVisitorUserIdAndPropertyId(
        visitorUserId,
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'visitorUserId', visitorUserId )
                .eq( 'propertyId', propertyId );

        if ( error )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async getVisitArrayByUserIdAndVisitorUserId(
        userId,
        visitorUserId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'userId', userId )
                .eq( 'visitorUserId', visitorUserId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitById(
        visitId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .eq( 'id', visitId );

        if ( error )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // -- OPERATIONS

    async addVisit(
        visit
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .insert( visit )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setVisit(
        visit,
        visitId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .update( visit )
                .eq( 'id', visitId )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async removeVisit(
        visitId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .delete()
                .eq( 'id', visitId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async batchRemoveVisitByIdArray(
        idArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'VISIT' )
                .delete()
                .in( 'id', idArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getVisitArrayByDateNowAndDayLater(
        now,
        dayLater
        )
    {
        let { data, error } =
            await supabaseService.getClient()
                .from( 'VISIT' )
                .select()
                .gte( 'date', now )
                .lte( 'date', dayLater );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let visitService
    = new VisitService();

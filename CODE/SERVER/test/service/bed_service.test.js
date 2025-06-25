// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';
import { applyFilterToQuery } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'spaceId',
        'typeId',
        'personCount',
        'count',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class BedService
{
    // -- INQUIRIES

    async getBedArray(
        bedIdArray = [],
        bedPage = 1,
        bedLimit = 10,
        filterArray = []
        )
    {
        let query
            = databaseService.getClient()
                .from( 'BED' )
                .select();
        let countQuery
            = databaseService.getClient()
                .from( 'BED' )
                .select( 'id', { count: 'exact', head: true } );

        if ( bedIdArray.length > 0 )
        {
            query = query.in( 'id', bedIdArray );
            countQuery = countQuery.in( 'id', bedIdArray );
        }

        let { count } = await countQuery;
        let countBedArray = count;

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let startIndex = ( bedPage - 1 ) * bedLimit;
        let endIndex = startIndex + bedLimit - 1;
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;
        let bedArray = data;

        if ( error !== null )
        {
            logError( error );
        }

        return { bedArray, countBedArray };
    }

    async getAllBedArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBedById(
        bedId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .select()
                .eq( 'id', bedId );

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

    async getBedCountByPropertyId(
        propertyId
        )
    {
        let { count, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .select( 'id', { count: 'exact', head: true } )
                .eq( 'propertyId', propertyId );

        if ( error )
        {
            logError( error);

            return 0;
        }
        else
        {
            return count || 0;
        }
    }

    // ~~

    async getBedArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBedArrayBySpaceId(
        spaceId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .select()
                .eq( 'spaceId', spaceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addBed(
        bed
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .insert( bed );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setBedById(
        bed,
        bedId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .update( bed )
                .eq( 'id', bedId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBedById(
        bedId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BED' )
                .delete()
                .eq( 'id', bedId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBedByPropertyId(
        propertyId
        )
    {
        let { data, error }
        = await databaseService.getClient()
            .from( 'BED' )
            .delete()
            .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error };
    }

    // ~~

    async removeBedBySpaceId(
        spaceId
        )
    {
        let { data, error }
        = await databaseService.getClient()
            .from( 'BED' )
            .delete()
            .eq( 'spaceId', spaceId );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error };
    }
}

// -- VARIABLES

export let bedService
    = new BedService();

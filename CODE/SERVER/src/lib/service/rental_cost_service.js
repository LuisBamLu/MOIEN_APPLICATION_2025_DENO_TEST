// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'typeId',
        'frequencyId',
        'name',
        'amount',
        'currencyCode',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class RentalCostService
{
    // -- INQUIRIES

    async getRentalCostArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'RENTAL_COST' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'RENTAL_COST' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );
        countQuery = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );

        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                rentalCostArray: data,
                totalCount: count
            }
            );
    }

    // ~~

    async getRentalCostById(
        rentalCostId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST' )
                .select()
                .eq( 'id', rentalCostId );

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

    async getRentalCostArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalCost(
        rentalCost
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST' )
                .insert( rentalCost )
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

    async setRentalCostById(
        rentalCost,
        rentalCostId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST' )
                .update( rentalCost )
                .eq( 'id', rentalCostId )
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

    async removeRentalCostById(
        rentalCostId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST' )
                .delete()
                .eq( 'id', rentalCostId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalCostService
    = new RentalCostService();

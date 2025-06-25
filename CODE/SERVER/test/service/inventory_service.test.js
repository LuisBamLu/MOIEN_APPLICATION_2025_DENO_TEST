// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'date',
        'name',
        'lessorUserProfileId',
        'tenantUserProfileId',
        'keyCount',
        'description',
        'documentIdArray',
        'userId'
    ];

// -- CLASSES

class InventoryService
{
    // -- INQUIRIES

    async getInventoryArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'INVENTORY' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'INVENTORY' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                inventoryArray: data,
                totalCount: count
            }
            );
    }

    // ~~

    async getInventoryById(
        inventoryId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'INVENTORY' )
                .select()
                .eq( 'id', inventoryId );

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

    async setInventoryById(
        inventoryData,
        inventoryId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'INVENTORY' )
            .update( inventoryData )
            .eq( 'id', inventoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeInventoryById(
        inventoryId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'INVENTORY' )
            .delete()
            .eq( 'id', inventoryId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let inventoryService =
    new InventoryService();

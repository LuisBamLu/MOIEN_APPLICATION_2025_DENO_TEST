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
        'name',
        'description',
        'floorNumber',
        'area',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class SpaceService
{
    // -- INQUIRIES

    async getSpaceArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'SPACE' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'SPACE' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );

        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all(
            [
                query,
                countQuery
            ]
            );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                spaceArray : data,
                spaceCount : count
            }
            );
    }

    // ~~

    async getSpaceArrayByIdArray(
        spaceIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .in( 'id', spaceIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data
    }
    // ~~

    async getSpaceById(
        spaceId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .eq( 'id', spaceId );

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

    async getSpaceTypeCountByPropertyId(
        propertyId,
        typeId
        )
    {
        let { count, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .select( 'id', { count: 'exact', head: true } )
                .eq( 'propertyId', propertyId )
                .eq( 'typeId', typeId );

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

    async getSpaceArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getTotalAreaByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .select( 'area' )
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );

            return 0;
        }
        else
        {
            let totalArea = data.reduce( ( sum, space ) => sum + space.area, 0 );

            return totalArea;
        }
    }

    // -- OPERATIONS

    async addSpace(
        space
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .insert( space );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setSpaceById(
        space,
        spaceId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .update( space )
                .eq( 'id', spaceId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSpaceById(
        spaceId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .delete()
                .eq( 'id', spaceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeSpaceByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'SPACE' )
                .delete()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error }
    }
}

// -- VARIABLES

export let spaceService
    = new SpaceService();

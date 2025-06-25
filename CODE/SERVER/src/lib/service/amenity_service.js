// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class AmenityService
{
    // -- INQUIRIES

    async getAmenityArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'AMENITY' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getAmenityById(
        amenityId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'AMENITY' )
                .select()
                .eq( 'id', amenityId );

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

    async addAmenity(
        amenity
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'AMENITY' )
                .insert( amenity );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setAmenityById(
        amenity,
        amenityId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'AMENITY' )
                .update( amenity )
                .eq( 'id', amenityId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeAmenityById(
        amenityId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'AMENITY' )
                .delete()
                .eq( 'id', amenityId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let amenityService
    = new AmenityService();

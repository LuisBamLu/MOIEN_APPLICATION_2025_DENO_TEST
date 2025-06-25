// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- CLASSES

class ImageService
{
    // -- INQUIRIES

    async getImageArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getImageArrayByPropertyId(
        imageId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .select()
                .eq( 'propertyId', imageId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getImageById(
        imageId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .select()
                .eq( 'id', imageId );

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

    async addImage(
        image
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .insert( image );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setImageById(
        image,
        imageId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .update( image )
                .eq( 'id', imageId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeImageById(
        imageId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'IMAGE' )
                .delete()
                .eq( 'id', imageId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let imageService
    = new ImageService();

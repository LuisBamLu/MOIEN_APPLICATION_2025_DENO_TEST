// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalAnnouncementPlatformService
{
    // -- INQUIRIES

    async getRentalAnnouncementPlatformArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalAnnouncementPlatformById(
        rentalAnnouncementPlatformId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .select()
                .eq( 'id', rentalAnnouncementPlatformId );

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

    async getRentalAnnouncementPlatformArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalAnnouncementPlatform(
        rentalAnnouncementPlatform
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .insert( rentalAnnouncementPlatform );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalAnnouncementPlatformById(
        rentalAnnouncementPlatform,
        rentalAnnouncementPlatformId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .update( rentalAnnouncementPlatform )
                .eq( 'id', rentalAnnouncementPlatformId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalAnnouncementPlatformById(
        rentalAnnouncementPlatformId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_PLATFORM' )
                .delete()
                .eq( 'id', rentalAnnouncementPlatformId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalAnnouncementPlatformService
    = new RentalAnnouncementPlatformService();

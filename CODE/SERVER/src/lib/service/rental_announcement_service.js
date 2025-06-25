// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalAnnouncementService
{
    // -- INQUIRIES

    async getRentalAnnouncementArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalAnnouncementById(
        rentalAnnouncementId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .select()
                .eq( 'id', rentalAnnouncementId );

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

    async getRentalAnnouncementArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalAnnouncement(
        rentalAnnouncement
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .insert( rentalAnnouncement );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalAnnouncementById(
        rentalAnnouncement,
        rentalAnnouncementId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .update( rentalAnnouncement )
                .eq( 'id', rentalAnnouncementId )
                .select();

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

    async removeRentalAnnouncementById(
        rentalAnnouncementId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT' )
                .delete()
                .eq( 'id', rentalAnnouncementId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalAnnouncementService
    = new RentalAnnouncementService();

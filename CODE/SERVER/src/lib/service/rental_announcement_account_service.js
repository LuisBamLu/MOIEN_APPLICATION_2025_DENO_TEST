// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalAnnouncementAccountService
{
    // -- INQUIRIES

    async getRentalAnnouncementAccountArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalAnnouncementAccountById(
        rentalAnnouncementAccountId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .select()
                .eq( 'id', rentalAnnouncementAccountId );

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

    async getRentalAnnouncementAccountArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalAnnouncementAccount(
        rentalAnnouncementAccount
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .insert( rentalAnnouncementAccount );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalAnnouncementAccountById(
        rentalAnnouncementAccount,
        rentalAnnouncementAccountId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .update( rentalAnnouncementAccount )
                .eq( 'id', rentalAnnouncementAccountId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalAnnouncementAccountById(
        rentalAnnouncementAccountId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_ANNOUNCEMENT_ACCOUNT' )
                .delete()
                .eq( 'id', rentalAnnouncementAccountId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalAnnouncementAccountService
    = new RentalAnnouncementAccountService();

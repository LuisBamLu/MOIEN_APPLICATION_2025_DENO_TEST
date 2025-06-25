// -- IMPORTS

import { databaseService } from './database_service';

// -- TYPES

class RentalBookingStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedRentalBookingStatusArray = null;
        this.cachedRentalBookingStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getRentalBookingStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING_STATUS' )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingStatusById(
        rentalBookingStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING_STATUS' )
                .select()
                .eq( 'id', rentalBookingStatusId );

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

    // -- OPERATIONS

    async getCachedRentalBookingStatusArray(
        )
    {
        if ( this.cachedRentalBookingStatusArray === null
             || Date.now() > this.cachedRentalBookingStatusTimestamp + 300000 )
        {
            this.cachedRentalBookingStatusArray = this.getRentalBookingStatusArray();
            this.cachedRentalBookingStatusTimestamp = Date.now();
        }

        return this.cachedRentalBookingStatusArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedRentalBookingStatusArray = null;
    }

    // ~~

    async setRentalBookingStatusById(
        rentalBookingStatus,
        rentalBookingStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING_STATUS' )
                .update( rentalBookingStatus )
                .eq( 'id', rentalBookingStatusId )
                .select();

        this.clearCache();

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

    async addRentalBookingStatus(
        rentalBookingStatus,
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING_STATUS' )
                .insert( rentalBookingStatus )
                .select();

        this.clearCache();

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

    async removeRentalBookingStatusById(
        rentalBookingStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from ( 'RENTAL_BOOKING_STATUS' )
                .delete()
                .eq( 'id', rentalBookingStatusId );

        this.clearCache();

        if ( error )
        {
            logError( error );
        }

        return data;
    }
}

export let rentalBookingStatusService = new RentalBookingStatusService();

// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';
import { applyFilterToQuery } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'propertyId',
        'guestCount',
        'arrivalDate',
        'arrivalTime',
        'departureDate',
        'departureTime',
        'dayCount',
        'cleaningFee',
        'sheetsFee',
        'towelsFee',
        'otherFee',
        'donation',
        'carbonCompensationDonation',
        'totalPrice',
        'cancellationPolicyId',
        'isNonRefundable',
        'status',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class RentalBookingService
{
    // -- INQUIRIES

    async getRentalBookingArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'RENTAL_BOOKING' )
            .select();
        let { count } = await databaseService.getClient()
            .from( 'RENTAL_BOOKING' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let startIndex = ( page - 1 ) * limit;
        let endIndex = startIndex + limit - 1;

        query = query.range( startIndex, endIndex );

        let { data, error } = await query;

        if ( error )
        {
            logError( error );
        }

        return (
            {
                rentalBookingArray: data,
                rentalBookingCount: count
            }
            );
    }

    // ~~

    async getRentalBookingById(
        rentalBookingId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'id', rentalBookingId );

        if ( error !== null )
        {
            logError( error )
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null
        }
    }

    // ~~

    async getRentalBookingArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByUserIdAndStatusArray(
        userId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId )
                .in( 'status', statusArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUpcomingRentalBookingArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId )
                .gte( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUpcomingRentalBookingArrayByUserIdAndStatusArray(
        userId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId )
                .gte( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPastRentalBookingArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId )
                .lt( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPastRentalBookingArrayByUserIdAndStatusArray(
        userId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'userId', userId )
                .lt( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByPropertyUserId(
        propertyUserId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByUserIdAndPropertyUserId(
        userId,
        propertyUserId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'userId', userId )
                .eq( 'PROPERTY.userId', propertyUserId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByPropertyUserIdAndStatusArray(
        propertyUserId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUpcomingRentalBookingArrayByPropertyUserId(
        propertyUserId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId )
                .gte( 'departureDate', new Date().toISOString().split( 'T' )[ 0 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getUpcomingRentalBookingArrayByPropertyUserIdAndStatusArray(
        propertyUserId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId )
                .gte( 'departureDate', new Date().toISOString().split( 'T' )[ 0 ] )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPastRentalBookingArrayByPropertyUserId(
        propertyUserId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId )
                .lt( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPastRentalBookingArrayByPropertyUserIdAndStatusArray(
        propertyUserId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select( `*, PROPERTY!inner ( userId )` )
                .eq( 'PROPERTY.userId', propertyUserId )
                .lt( 'arrivalDate', new Date().toISOString().split( 'T' )[ 0 ] )
                .in( 'status', statusArray );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingArrayByPropertyIdAndStatusArray(
        propertyId,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .eq( 'propertyId', propertyId )
                .in( 'status', statusArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalBookingByDateRangeAndStatusArray(
        dateRange,
        statusArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .select()
                .in( 'status', statusArray )
                .not( 'arrivalDate', 'gt', dateRange[ 1 ] )
                .not( 'departureDate', 'lt', dateRange[ 0 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalBooking(
        rentalBooking
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .insert( rentalBooking )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalBookingById(
        rentalBooking,
        rentalBookingId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_BOOKING' )
                .update( rentalBooking )
                .eq( 'id', rentalBookingId )
                .select();

        if ( error !== null )
        {
            logError( null );
        }

        return data[ 0 ];
    }

    // ~~

    async removeBookingByPropertyId(
        propertyId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'RENTAL_BOOKING' )
            .delete()
            .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBookingById(
        rentalBookingId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'RENTAL_BOOKING' )
            .delete()
            .eq( 'id', rentalBookingId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let rentalBookingService = new RentalBookingService();

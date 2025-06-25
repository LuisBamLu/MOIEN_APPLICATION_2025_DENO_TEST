// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service.test';

// -- TYPES

export class RentalDayService
{
    // -- INQUIRIES

    async getRentalDayArray(
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select();

        if ( error !== null )
        {
            logError( null );
        }

        return data;
    }

    // ~~

    async getUnavailableRentalDayArrayByDateRange(
        dateRange
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select()
                .eq( 'isAvailableForShortTerm', false )
                .gte( 'date', dateRange[ 0 ] )
                .lte( 'date', dateRange[ 1 ] );

        if ( error )
        {
           logError( error );
        }

        return data;
    }

    // ~~

    async getRentalDayArrayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalDayArrayAfterDateByPropertyId(
        dateISOString,
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select()
                .eq( 'propertyId', propertyId )
                .gte( 'date', dateISOString );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalDayBeforeDateByPropertyId(
        dateISOString,
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select()
                .eq( 'propertyId', propertyId )
                .lte( 'date', dateISOString );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalDayArrayByPropertyIdAndDateRange(
        propertyId,
        dateRange
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .select()
                .eq( 'propertyId', propertyId )
                .gte( 'date', dateRange[ 0 ] )
                .lte( 'date', dateRange[ 1 ] );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addRentalDayArray(
        rentalDayArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .insert( rentalDayArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async upsertRentalDayArray(
        rentalDayArray
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .upsert( rentalDayArray )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data
    }

    // ~~

   async removeRentalDay(
        rentalDayId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .delete()
                .eq( 'id', rentalDayId );

        if ( error !== null )
        {
            logError( rentalDayId );
        }

        return data;
    }

    // ~~

    async removeRentalDayByPropertyId(
        propertyId
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .delete()
                .eq( 'propertyId', propertyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalDayByPropertyIdAndDateRange(
        propertyId,
        dateRange
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .from( 'RENTAL_DAY' )
                .delete()
                .eq( 'propertyId', propertyId )
                .gte( 'date', dateRange[ 0 ] )
                lte( 'date', dateRange[ 1 ] );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalDayService = new RentalDayService();

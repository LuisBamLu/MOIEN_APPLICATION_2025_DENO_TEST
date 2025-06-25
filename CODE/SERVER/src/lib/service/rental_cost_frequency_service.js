// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalCostFrequencyService
{
    // -- INQUIRIES

    async getRentalCostFrequencyArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_FREQUENCY' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalCostFrequencyById(
        rentalCostFrequencyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_FREQUENCY' )
                .select()
                .eq( 'id', rentalCostFrequencyId );

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

    async addRentalCostFrequency(
        rentalCostFrequency
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_FREQUENCY' )
                .insert( rentalCostFrequency );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalCostFrequencyById(
        rentalCostFrequency,
        rentalCostFrequencyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_FREQUENCY' )
                .update( rentalCostFrequency )
                .eq( 'id', rentalCostFrequencyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalCostFrequencyById(
        rentalCostFrequencyId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_FREQUENCY' )
                .delete()
                .eq( 'id', rentalCostFrequencyId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalCostFrequencyService
    = new RentalCostFrequencyService();

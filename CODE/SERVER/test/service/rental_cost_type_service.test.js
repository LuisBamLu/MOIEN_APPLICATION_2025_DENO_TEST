// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class RentalCostTypeService
{
    // -- INQUIRIES

    async getRentalCostTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getRentalCostTypeById(
        rentalCostTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_TYPE' )
                .select()
                .eq( 'id', rentalCostTypeId );

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

    async addRentalCostType(
        rentalCostType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_TYPE' )
                .insert( rentalCostType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setRentalCostTypeById(
        rentalCostType,
        rentalCostTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_TYPE' )
                .update( rentalCostType )
                .eq( 'id', rentalCostTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeRentalCostTypeById(
        rentalCostTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'RENTAL_COST_TYPE' )
                .delete()
                .eq( 'id', rentalCostTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let rentalCostTypeService
    = new RentalCostTypeService();

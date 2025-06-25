// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class BillService
{
    // -- INQUIRIES

    async getBillArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBillArrayByIdArray(
        idArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL' )
                .select()
                .in( 'id', idArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBillLineArrayByBillIdArray(
        billIdArray
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_LINE' )
                .select()
                .in( 'billId', billIdArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addBill(
        bill
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'BILL' )
                .insert( bill );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async addBillLine(
        billLine
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'BILL_LINE' )
                .insert( billLine );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async setBill(
        bill
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'BILL' )
                .update( bill )
                .eq( 'id', bill.id );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async setBillLine(
        billLine
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'BILL_LINE' )
                .update( billLine )
                .eq( 'id', billLine.id );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let billService
    = new BillService();

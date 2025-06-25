// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class BillTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedBillTypeArray = null;
        this.cachedBillTypeTimestamp = 0;
    }
    // -- INQUIRIES

    async getBillTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBillTypeById(
        billTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_TYPE' )
                .select()
                .eq( 'id', billTypeId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async setBillTypeById(
        billType,
        billTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_TYPE' )
                .update( billType )
                .eq( 'id', billTypeId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async addBillType(
        billType
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_TYPE' )
                .insert( billType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeBillTypeById(
        billTypeId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'BILL_TYPE' )
                .delete()
                .match( { id : billTypeId });

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCachedBillTypeArray(
        )
    {
        if ( this.cachedBillTypeArray === null
             || Date.now() > this.cachedBillTypeTimestamp + 300000 )

        {
            this.cachedBillTypeArray = await this.getBillTypeArray();
            this.cachedBillTypeTimestamp = Date.now()
        }

        return this.cachedBillTypeArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedBillTypeArray = null;
    }
}

// -- VARIABLES

export let billTypeService
    = new BillTypeService();

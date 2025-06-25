// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PaymentTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPaymentTypeArray = null;
        this.cachedPaymentTypeByIdMap = null;
        this.cachedPaymentTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getPaymentTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentTypeById(
        paymentTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_TYPE' )
                .select()
                .eq( 'id', paymentTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedPaymentTypeArray = null;
        this.cachedPaymentTypeByIdMap = null;
    }

    // ~~

    async getCachedPaymentTypeArray(
        )
    {
        if ( this.cachedPaymentTypeArray === null
             || Date.now() > this.cachedPaymentTypeTimestamp + 300000 )
        {
            this.cachedPaymentTypeArray = await this.getPaymentTypeArray();
            this.cachedPaymentTypeByIdMap = null;
            this.cachedPaymentTypeTimestamp = Date.now();
        }

        return this.cachedPaymentTypeArray;
    }

    // ~~

    async getCachedPaymentTypeByIdMap(
        )
    {
        if ( this.cachedPaymentTypeByIdMap )
        {
            this.cachedPaymentTypeByIdMap = getMapById( this.getCachedPaymentTypeArray() );
        }

        return this.cachedPaymentTypeByIdMap;
    }

    // ~~

    async addPaymentType(
        paymentType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_TYPE' )
                .insert( paymentType )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setPaymentType(
        paymentType,
        paymentTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_TYPE' )
                .update( paymentType )
                .eq( 'id', paymentTypeId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removePaymentType(
        paymentTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_TYPE' )
                .delete()
                .eq( 'id', paymentTypeId )

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let paymentTypeService = new PaymentTypeService();

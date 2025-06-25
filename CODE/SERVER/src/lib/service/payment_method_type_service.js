// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PaymentMethodTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPaymentMethodTypeArray = null;
        this.cachedPaymentMethodTypeByIdMap = null;
        this.cachedPaymentMethodTypeTimestamp = 0;
    }

    // -- INQUIRIES

    async getPaymentMethodTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentMethodTypeById(
        paymentMethodTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_TYPE' )
                .select()
                .eq( 'id', paymentMethodTypeId );

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
        this.cachedPaymentMethodTypeArray = null;
        this.cachedPaymentMethodTypeByIdMap = null;
    }

    // ~~

    async getCachedPaymentMethodTypeArray(
        )
    {
        if ( this.cachedPaymentMethodTypeArray === null
             || Date.now() > this.cachedPaymentMethodTypeTimestamp + 300000 )
        {
            this.cachedPaymentMethodTypeArray = await this.getPaymentMethodTypeArray();
            this.cachedPaymentMethodTypeTimestamp = Date.now()
        }

        return this.cachedPaymentMethodTypeArray;
    }

    // ~~

    async getCachedPaymentMethodTypeByIdMap(
        )
    {
        if ( this.cachedPaymentMethodTypeByIdMap )
        {
            this.cachedPaymentMethodTypeByIdMap = getMapById( this.getCachedPaymentMethodTypeArray() );
        }

        return this.cachedPaymentMethodTypeByIdMap;
    }

    // ~~

    async addPaymentMethodType(
        paymentMethodType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_TYPE' )
                .insert( paymentMethodType )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setPaymentMethodType(
        paymentMethodType,
        paymentMethodTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_TYPE' )
                .update( paymentMethodType )
                .eq( 'id', paymentMethodTypeId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removePaymentMethodType(
        paymentMethodTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_TYPE' )
                .delete()
                .eq( 'id', paymentMethodTypeId )

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let paymentMethodTypeService = new PaymentMethodTypeService();

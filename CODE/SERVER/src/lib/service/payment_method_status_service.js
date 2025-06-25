// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PaymentMethodStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPaymentMethodStatusArray = null;
        this.cachedPaymentMethodStatusByIdMap = null;
        this.cachedPaymentMethodStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getPaymentMethodStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentMethodStatusById(
        paymentMethodStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_STATUS' )
                .select()
                .eq( 'id', paymentMethodStatusId );

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
        this.cachedPaymentMethodStatusArray = null;
        this.cachedPaymentMethodStatusByIdMap = null;
    }

    // ~~

    async getCachedPaymentMethodStatusArray(
        )
    {
        if ( this.cachedPaymentMethodStatusArray === null
             || Date.now() > this.cachedPaymentMethodStatusTimestamp + 300000 )
        {
            this.cachedPaymentMethodStatusArray = await this.getPaymentMethodStatusArray();
            this.cachedPaymentMethodStatusByIdMap = null;
            this.cachedPaymentMethodStatusTimestamp = Date.now();
        }

        return this.cachedPaymentMethodStatusArray;
    }

    // ~~

    async getCachedPaymentMethodStatusByIdMap(
        )
    {
        if ( this.cachedPaymentMethodStatusByIdMap )
        {
            this.cachedPaymentMethodStatusByIdMap = getMapById( this.getCachedPaymentMethodStatusArray() );
        }

        return this.cachedPaymentMethodStatusByIdMap;
    }

    // ~~

    async addPaymentMethodStatus(
        paymentMethodStatus
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_STATUS' )
                .insert( paymentMethodStatus )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setPaymentMethodStatus(
        paymentMethodStatus,
        paymentMethodStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_STATUS' )
                .update( paymentMethodStatus )
                .eq( 'id', paymentMethodStatusId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removePaymentMethodStatus(
        paymentMethodStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD_STATUS' )
                .delete()
                .eq( 'id', paymentMethodStatusId )

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let paymentMethodStatusService = new PaymentMethodStatusService();

// -- IMPORTS

import { getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PaymentStatusService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPaymentStatusArray = null;
        this.cachedPaymentStatusByIdMap = null;
        this.cachedPaymentStatusTimestamp = 0;
    }

    // -- INQUIRIES

    async getPaymentStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentStatusById(
        paymentStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_STATUS' )
                .select()
                .eq( 'id', paymentStatusId );

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
        this.cachedPaymentStatusArray = null;
        this.cachedPaymentStatusByIdMap = null;
    }

    // ~~

    async getCachedPaymentStatusArray(
        )
    {
        if ( this.cachedPaymentStatusArray === null
             || Date.now() > this.cachedPaymentStatusTimestamp + 300000 )
        {
            this.cachedPaymentStatusArray = await this.getPaymentStatusArray();
            this.cachedPaymentStatusByIdMap = null;
            this.cachedPaymentStatusTimestamp = Date.now();
        }

        return this.cachedPaymentStatusArray;
    }

    // ~~

    async getCachedPaymentStatusByIdMap(
        )
    {
        if ( this.cachedPaymentStatusByIdMap )
        {
            this.cachedPaymentStatusByIdMap = getMapById( this.getCachedPaymentStatusArray() );
        }

        return this.cachedPaymentStatusByIdMap;
    }

    // ~~

    async addPaymentStatus(
        paymentStatus
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_STATUS' )
                .insert( paymentStatus )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setPaymentStatus(
        paymentStatus,
        paymentStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_STATUS' )
                .update( paymentStatus )
                .eq( 'id', paymentStatusId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async removePaymentStatus(
        paymentStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_STATUS' )
                .delete()
                .eq( 'id', paymentStatusId )

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let paymentStatusService = new PaymentStatusService();

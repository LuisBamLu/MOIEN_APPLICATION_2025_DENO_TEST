// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class PaymentMethodService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedPaymentMethodArray = null;
    }

    //  -- INQUIRIES

    async getPaymentMethodArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentMethodById(
        id
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select()
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return data;
        }
    }

    // ~~

    async getPaymentMethodByMangopayId(
        mangopayId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select()
                .eq( 'mangopayId', mangopayId );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return data;
        }
    }

    // ~~

    async getPaymentMethodArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select()
                .eq( 'userId', userId );

            if ( error !== null )
            {
                logError( null );
            }

            return data;
    }

    // ~~

    async getPaymentMethodArrayByUserIdAndTypeId(
        userId,
        typeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select()
                .eq( 'userId', userId )
                .eq( 'typeId', typeId );

            if ( error !== null )
            {
                logError( null );
            }

            return data;
    }

    // ~~

    async getPaymentMethodArrayByUserIdAndStatusId(
        userId,
        statusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .select()
                .eq( 'userId', userId )
                .eq( 'statusId', statusId );

            if ( error !== null )
            {
                logError( null );
            }

            return data;
    }

    // -- OPERATIONS

    async addPaymentMethod(
        paymentMethod
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .insert( paymentMethod )
                .select();

        if ( error )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return data;
        }
    }

    // ~~

    async setPaymentMethod(
        paymentMethod,
        id
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .update( paymentMethod )
                .eq( 'id', id )
                .select();

        if ( error )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return data;
        }
    }

    // ~~

    async setPaymentMethodByMangopayId(
        paymentMethod,
        mangopayId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT_METHOD' )
                .update( paymentMethod )
                .eq( 'mangopayId', mangopayId )
                .select();

        if ( error )
        {
            logError( error );
        }

        if ( data.length > 0 )
        {
            return data[ 0 ];
        }
        else
        {
            return data;
        }
    }

    // ~~

    async getCachedPaymentMethodArray(
        )
    {
        if ( this.cachedPaymentMethodArray === null )
        {
            this.cachedPaymentMethodArray = await this.getPaymentMethodArray();
        }

        return this.cachedPaymentMethodArray;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedPaymentMethodArray = null;
    }
}

export let paymentMethodService = new PaymentMethodService();

//  -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'typeId',
        'methodId',
        'payerUserProfileId',
        'payeeUserProfileId',
        'amount',
        'currencyCode',
        'invoiceDate',
        'dueDate',
        'transactionId',
        'mangopayId',
        'statusId',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class PaymentService
{
    // -- INQUIRIES

    async getPaymentArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'PAYMENT' )
            .select();
        let countQuery = databaseService.getClient()
            .from( 'PAYMENT' )
            .select( 'id', { count: 'exact' } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] =
            await Promise.all(
                [
                    query,
                    countQuery
                ]
                );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                paymentArray: data,
                paymentCount: count
            }
            );
    }

    // ~~

    async getPaymentArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
           logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentArrayByPayerUserProfilerId(
        payerUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .select()
                .eq( 'payerUserProfileId', payerUserProfileId );

        if ( error !== null )
        {
           logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentArrayByPayeeUserProfilerId(
        payeeUserProfileId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .select()
                .eq( 'payeeUserProfileId', payeeUserProfileId );

        if ( error !== null )
        {
           logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentArrayByTransactionId(
        transactionId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .select()
                .eq( 'transactionId', transactionId );

        if ( error !== null )
        {
           logError( error );
        }

        return data;
    }

    // ~~

    async getPaymentById(
        id
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
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

    async getPaymentByMangopayId(
        mangopayId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
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

    // -- OPERATIONS

    async addPayment(
        payment
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .insert( payment )
                .select();

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

    //  ~~

    async setPayment(
        payment,
        paymentId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .update( payment )
                .eq( 'id', paymentId )
                .select();

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

    //  ~~

    async setPaymentByTransactionId(
        payment,
        transactionId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .update( payment )
                .eq( 'transactionId', transactionId )
                .select();

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

    //  ~~

    async setPaymentByMangopayId(
        payment,
        mangopayId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'PAYMENT' )
                .update( payment )
                .eq( 'mangopayId', mangopayId )
                .select();

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

    async removePaymentById(
        paymentId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'PAYMENT' )
            .delete()
            .eq( 'id', paymentId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

export let paymentService = new PaymentService();

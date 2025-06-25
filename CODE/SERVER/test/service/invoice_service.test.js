// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'title',
        'currencyCode',
        'billIdArray',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class InvoiceService
{
    // -- INQUIRIES

    async getInvoiceArray(
        page = 1,
        limit = 10,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'INVOICE' )
            .select();
        let { count } = await databaseService.getClient()
            .from( 'INVOICE' )
            .select( 'id', { count: 'exact', head: true } );

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( page, limit );
        query = query.range( startIndex, endIndex );

        let { data, error } = await query;

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                invoiceArray : data,
                invoiceCount : count
            }
            );
    }

    // ~~

    async getInvoiceById(
        id
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'INVOICE' )
                .select()
                .eq( 'id', id );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getInvoiceArrayByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'INVOICE' )
                .select()
                .eq( 'userId', userId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addInvoice(
        invoice
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'INVOICE' )
                .insert( invoice );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async setInvoice(
        invoice,
        invoiceId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'INVOICE' )
                .update( invoice )
                .eq( 'id', invoiceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeInvoice(
        invoiceId
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'INVOICE' )
            .delete()
            .eq( 'id', invoiceId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let invoiceService
    = new InvoiceService();

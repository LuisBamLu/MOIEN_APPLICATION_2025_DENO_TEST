// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class TicketService
{
    // -- INQUIRIES

    async getTicketArray(
        page = 1,
        limit = 15,
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'TICKET' )
            .select()
            .order( 'statusId', { ascending: false } );
        let countQuery = databaseService.getClient()
            .from( 'TICKET' )
            .select( 'id', { count: 'exact', head: true } );

        let startIndex = ( page - 1 ) * limit;
        let endIndex = startIndex + limit - 1;

        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                ticketArray: data,
                totalCount: count
            }
            );
    }

    // ~~

    async getTicketById(
        ticketId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .select()
                .eq( 'id', ticketId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async getTicketByKey(
        rentalBookingId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .select()
                .eq( 'key', rentalBookingId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // ~~

    async getTicketArrayByTitleOrText(
        searchTerm
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .select( '*, ticketStatus:TICKET_STATUS( name )' )
                .or( `title.like.%${ searchTerm }%,text.like.%${ searchTerm }%` );

        if ( error !== null )
        {
            logError( error );

            return [];
        }

        return data;
    }

    // -- OPERATIONS

    async setTicketById(
        ticket,
        ticketId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .update( ticket )
                .eq( 'id', ticketId );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async addTicket(
        ticket
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .insert( ticket );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async removeTicketById(
        ticketId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET' )
                .delete()
                .eq( 'id', ticketId );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let ticketService
    = new TicketService();

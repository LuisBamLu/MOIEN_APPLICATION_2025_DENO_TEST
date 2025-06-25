// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class TicketStatusService
{
    // -- INQUIRIES

    async getTicketStatusArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET_STATUS' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getTicketStatusById(
        ticketStatusId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET_STATUS' )
                .select()
                .eq( 'id', ticketStatusId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // -- OPERATIONS

    async setTicketStatusById(
        ticketStatus,
        ticketStatusId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_STATUS' )
                .update( ticketStatus )
                .eq( 'id', ticketStatusId );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async addTicketStatus(
        ticketStatus
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_STATUS' )
                .insert( ticketStatus );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async removeTicketStatusById(
        ticketStatusId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_STATUS' )
                .delete()
                .eq( 'id', ticketStatusId );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let ticketStatusService
    = new TicketStatusService();

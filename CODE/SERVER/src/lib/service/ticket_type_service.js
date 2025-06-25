// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class TicketTypeService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedTicketTypeArray = null;
        this.cachedTicketTimestamp = 0;
    }

    // -- INQUIRIES

    async getTicketTypeArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET_TYPE' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getTicketTypeById(
        ticketTypeId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TICKET_TYPE' )
                .select()
                .eq( 'id', ticketTypeId );

        if ( error !== null )
        {
            logError( error );
        }

        return data[ 0 ];
    }

    // -- OPERATIONS

    clearCache(
    )
    {
        this.cachedTicketTypeArray = null;
        this.cachedTicketTimestamp = 0;
    }

    // ~~

    async getCachedTicketTypeArray(
        )
    {
        if ( this.cachedTicketTypeArray === null
            || Date.now() > this.cachedTicketTimestamp + 300_000 )
        {
            this.cachedTicketTypeArray = await this.getTicketTypeArray();
            this.cachedTicketTimestamp = Date.now();
        }

        return this.cachedTicketTypeArray;
    }

    // ~~

    async setTicketTypeById(
        ticketType,
        ticketTypeId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_TYPE' )
                .update( ticketType )
                .eq( 'id', ticketTypeId );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async addTicketType(
        ticketType
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_TYPE' )
                .insert( ticketType );

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async removeTicketTypeById(
        ticketTypeId
        )
    {
        let { error }
            = await databaseService.getClient()
                .from( 'TICKET_TYPE' )
                .delete()
                .eq( 'id', ticketTypeId );

        if ( error !== null )
        {
            logError( error );
        }
    }
}

// -- VARIABLES

export let ticketTypeService
    = new TicketTypeService();

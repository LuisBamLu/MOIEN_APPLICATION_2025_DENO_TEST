// -- IMPORTS

import { logError, getRandomTuid, getCurrentLocalDateTime } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery } from '../base';

// -- CONSTANTS

const filterableColumnArray =
    [
        'id',
        'browserAddress',
        'attemptCount',
        'isFailed',
        'dateTime'
    ];

// -- TYPES

class ConnectionService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedConnectionByBrowserAddress = null;
        this.cachedConnectionArray = null;
        this.cachedConnectionTimestamp = 0;
    }

    // -- INQUIRIES

    async getConnectionArray(
        filterArray = []
        )
    {
        let query = databaseService.getClient()
            .from( 'CONNECTION' )
            .select();
        let { data, error } = await applyFilterToQuery( query, filterArray, filterableColumnArray );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getConnectionByBrowserAddress(
        browserAddress
        )
    {
        let { data }
            = await databaseService.getClient()
                .from( 'CONNECTION' )
                .select()
                .eq( 'browserAddress', browserAddress )
                .single();

        if ( data !== null )
        {
            return data;
        }
        else
        {
            return (
                {
                    id : getRandomTuid(),
                    browserAddress,
                    dateTime : getCurrentLocalDateTime(),
                    isFailed : false,
                    attemptCount : 0,
                    backoffSecondCount : 0,
                }
                );
        }
    }

    // ~~

    async getCachedConnectionByBrowserAddress(
        browserAddress
        )
    {
        if ( this.cachedConnectionByBrowserAddress === null
             || Date.now() > this.cachedConnectionTimestamp + 300000 )
        {
            this.cachedConnectionByBrowserAddress =
                await this.getConnectionByBrowserAddress( browserAddress );

            this.cachedConnectionTimestamp = Date.now();
        }

        return this.cachedConnectionByBrowserAddress;
    }

    // -- OPERATIONS

    async addConnection(
        connection
        )
    {
        this.clearCache();

        let { data, error } = await databaseService.getClient()
            .from( 'CONNECTION' )
            .insert( connection )
            .select()
            .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setConnection(
        connection
        )
    {
        let { attemptCount, browserAddress, dateTime, id, isFailed } = connection;

        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONNECTION' )
                .upsert(
                    {
                        attemptCount,
                        browserAddress,
                        dateTime,
                        id,
                        isFailed
                    }
                    )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setConnectionById(
        connectionId,
        connection
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONNECTION' )
                .update( connection )
                .eq( 'id', connectionId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async deleteConnection(
        browserAddress
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONNECTION' )
                .delete()
                .match( { browserAddress } );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                data,
                error
            }
            );
    }

    // ~~

    async deleteConnectionById(
        connectionId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CONNECTION' )
                .delete()
                .match( { id: connectionId } );

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                data,
                error
            }
            );
    }

    // ~~

    clearCache(
        )
    {
        this.cachedConnectionByBrowserAddress = null;
        this.cachedConnectionArray = null;
    }
}

// -- VARIABLES

export let connectionService
    = new ConnectionService();

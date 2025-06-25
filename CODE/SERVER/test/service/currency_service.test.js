// -- IMPORTS

import { getMapByCode, logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class CurrencyService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedCurrencyArray = null;
        this.cachedCurrencyByCodeMap = null;
        this.cachedCurrencyByIdMap = null;
        this.cachedCurrencyTimestamp = 0
    }

    // -- INQUIRIES

    async getCurrencyArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY' )
                .select( 'code, pluralName, singularName, symbol' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCurrencyByCode(
        currencyCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY' )
                .select()
                .eq( 'code', currencyCode )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data;
        }
        else
        {
            return null;
        }
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedCurrencyArray = null;
        this.cachedCurrencyByCodeMap = null;
        this.cachedCurrencyByIdMap = null;
    }

    // ~~

    async getCachedCurrencyArray(
        )
    {
        if ( this.cachedCurrencyArray === null
             || Date.now() > this.cachedCurrencyTimestamp + 300000 )
        {
            this.cachedCurrencyArray = await this.getCurrencyArray();
            this.cachedCurrencyTimestamp = Date.now();
            this.cachedCurrencyByCodeMap = null;
            this.cachedCurrencyByIdMap = null;
        }

        return this.cachedCurrencyArray;
    }

    // ~~

    async getCachedCurrencyByCodeMap(
        )
    {
        if ( this.cachedCurrencyByCodeMap === null )
        {
            this.cachedCurrencyByCodeMap = getMapByCode( await this.getCachedCurrencyArray() );
        }

        return this.cachedCurrencyByCodeMap;
    }

    // ~~

    async getCachedCurrencyByIdMap(
        )
    {
        if ( this.cachedCurrencyByIdMap === null )
        {
            this.cachedCurrencyByIdMap = getMapById( await this.getCachedCurrencyArray() )
        }

        return this.cachedCurrencyByIdMap;
    }
}

// -- VARIABLES

export let currencyService
    = new CurrencyService();

// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { mangopayService } from './mangopay_service';

// -- TYPES

class CurrencyConversionService
{
    // -- CONSTRUCTOR

    constructor(
        )
    {
        this.cachedCurrencyConversionArray = null;
        // conversionCode = 'sourceCurrencyCode, targetCurrencyCode'
        this.cachedCurrencyConversionByConversionCodeMap = {};
    }

    // -- INQUIRIES

    async getCurrencyConversionById(
        currencyConversionId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select()
                .eq( 'id', currencyConversionId );

        if ( error )
        {
            logError( error );
        }

        if ( data.length )
        {
            return data[ 0 ];
        }
        else
        {
            return null
        }
    }

    // ~~

    async getCurrencyConversionArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select();

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCurrencyConversionArrayBySourceCurrencyCode(
        sourceCurrencyCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select()
                .eq( 'sourceCurrencyCode', sourceCurrencyCode );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCurrencyConversionArrayByTargetCurrencyCode(
        targetCurrencyCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select()
                .eq( 'targetCurrencyCode', targetCurrencyCode );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getCurrencyConversionArrayBySourceCurrencyCodeAndTargetCurrencyCode(
        sourceCurrencyCode,
        targetCurrencyCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select()
                .eq( 'sourceCurrencyCode', sourceCurrencyCode )
                .eq( 'targetCurrencyCode', targetCurrencyCode );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLatestCurrencyConversionBySourceCurrencyCodeAndTargetCurrencyCode(
        sourceCurrencyCode,
        targetCurrencyCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .select()
                .eq( 'sourceCurrencyCode', sourceCurrencyCode )
                .eq( 'targetCurrencyCode', targetCurrencyCode )
                .order( 'creationTimestamp', { ascending: false } );

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
            return null;
        }
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedCurrencyConversionArray = null;
    }

    // ~~

    async getCachedCurrencyConversionArray(
        )
    {
        if ( this.cachedCurrencyConversionArray
             || this.cachedCurrencyConversionTimestamp < new Date().getTime() + 86400000 )
        {
            this.cachedCurrencyConversionArray = await this.getCachedCurrencyConversionArray();
            this.updateTimestamp = new Date().getTime();
        }

        return this.cachedCurrencyConversionArray;
    }

    // ~~

    async getCachedCurrencyConversionByConversionCode(
        conversionCode
        )
    {
        if ( this.cachedCurrencyConversionByConversionCodeMap[ conversionCode ] === undefined
             || Date.now() - this.cachedCurrencyConversionByConversionCodeMap[ conversionCode ].timestamp > 60 * 60 * 1000 )
        {
            let [ sourceCurrencyCode, targetCurrencyCode ] = conversionCode.split( ', ' );

            if ( sourceCurrencyCode === targetCurrencyCode )
            {
                return 1;
            }

            let conversionRate = await mangopayService.getConversionRate( sourceCurrencyCode, targetCurrencyCode );

            if ( conversionRate )
            {
                this.cachedCurrencyConversionByConversionCodeMap[ conversionCode ] =
                    {
                        id: conversionRate.id,
                        rate: conversionRate.MarketRate,
                        timestamp: Date.now()
                    };
            }
            else
            {
                let currencyConversion
                    = await this.getLatestCurrencyConversionBySourceCurrencyCodeAndTargetCurrencyCode(
                        sourceCurrencyCode,
                        targetCurrencyCode
                        );

                this.cachedCurrencyConversionByConversionCodeMap[ conversionCode ] =
                    {
                        id: currencyConversion.id,
                        rate: currencyConversion.rate,
                        timestamp:
                            Date.now()
                            - ( 45 * 60 * 1000 )
                    };
            }
        }

        return this.cachedCurrencyConversionByConversionCodeMap[ conversionCode ];
    }

    // ~~

    async addCurrencyConversion(
        currencyConversion
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .insert( currencyConversion );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setCurrencyConversionById(
        currencyConversion,
        currencyConversionId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .update( currencyConversion )
                .eq( 'id', currencyConversionId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setCurrencyConversionArrayBySourceCurrencyCodeAndTargetCurrencyCode(
        currencyConversion,
        sourceCurrencyCode,
        targetCurrencyCode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .update( currencyConversion )
                .eq( 'sourceCurrencyCode', sourceCurrencyCode )
                .eq( 'targetCurrencyCode', targetCurrencyCode );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeCurrencyConversionById(
        currencyConversionId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'CURRENCY_CONVERSION' )
                .delete()
                .eq( 'id', currencyConversionId );

        if ( error )
        {
            logError( error );
        }

        return data;
    }
}

// ~~

export let currencyConversionService
    = new CurrencyConversionService();

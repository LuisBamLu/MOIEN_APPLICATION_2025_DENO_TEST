// -- IMPORTS

import { getMapByCode, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class LanguageService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedLanguageArray = null;
        this.cachedLanguageByCodeMap = null;
        this.cachedLanguageTimestamp = 0;
    }

    // -- INQUIRIES

    async getLanguageArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'LANGUAGE' )
                .select( 'code, iconImagePath, isAvailable, isTranslatable, name, tag' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getLanguageByCode(
        languageCode
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'LANGUAGE' )
                .select()
                .eq( 'code', languageCode );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
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
        this.cachedLanguageArray = null;
        this.cachedLanguageByCodeMap = null;
    }

    // ~~

    async getCachedLanguageArray(
        )
    {
        if ( this.cachedLanguageArray === null
             || Date.now() > this.cachedLanguageTimestamp + 300000 )
        {
            this.cachedLanguageArray = await this.getLanguageArray();
            this.cachedLanguageByCodeMap = null;
            this.cachedLanguageTimestamp = Date.now()
        }

        return this.cachedLanguageArray;
    }

    // ~~

    async getCachedLanguageByCodeMap(
        )
    {
        if ( this.cachedLanguageByCodeMap === null )
        {
            this.cachedLanguageByCodeMap = getMapByCode( await this.getCachedLanguageArray() );
        }

        return this.cachedLanguageByCodeMap;
    }

    // ~~

    async addLanguage(
        language
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'LANGUAGE' )
                .insert( language );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setLanguageByCode(
        language,
        languageCode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'LANGUAGE' )
                .update( language )
                .eq( 'code', languageCode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeLanguageByCode(
        languageCode
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'LANGUAGE' )
                .delete()
                .eq( 'code', languageCode );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let languageService
    = new LanguageService();

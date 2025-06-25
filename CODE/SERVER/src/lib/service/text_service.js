// -- IMPORTS

import { getMapByCode, logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class TextService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedTextArray = null;
        this.cachedTextArrayOptimized = null;
        this.cachedTextBySlugMap = null;
        this.cachedTextTimestamp = 0;
        this.cachedTextOptimizedTimestamp = 0;
    }

    // -- INQUIRIES

    async getTextArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .select( 'id, text, slug' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getTextArrayOptimized(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .select( 'slug, text' );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getTextBySlug(
        textSlug
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .select()
                .eq( 'code', textSlug );

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
        this.cachedTextArray = null;
        this.cachedTextArrayOptimized = null;
        this.cachedTextBySlugMap = null;
    }

    // ~~

    async getCachedTextArray(
        )
    {
        if ( this.cachedTextArray === null
             || Date.now() > this.cachedTextTimestamp + 300_000 )
        {
            this.cachedTextArray = await this.getTextArray();
            this.cachedTextTimestamp = Date.now();
            this.cachedTextBySlugMap = null;
        }

        return this.cachedTextArray;
    }

    // ~~

    async getCachedTextArrayOptimized(
        )
    {
        if ( this.cachedTextArrayOptimized === null
             || Date.now() > this.cachedTextOptimizedTimestamp + 300_000)
        {
            this.cachedTextArrayOptimized = await this.getTextArrayOptimized();
            this.cachedTextOptimizedTimestamp = Date.now();
            this.cachedTextBySlugMap = null;
        }

        return this.cachedTextArrayOptimized;
    }

    // ~~

    async getCachedTextBySlugMap(
        )
    {
        if ( this.cachedTextBySlugMap === null )
        {
            this.cachedTextBySlugMap = getMapByCode( await this.getCachedTextArray() );
        }

        return this.cachedTextBySlugMap;
    }

    // ~~

    async addText(
        text
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .insert( text );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async setTextBySlug(
        text,
        textSlug
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .update( text )
                .eq( 'slug', textSlug )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeTextBySlug(
        textSlug
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'TEXT' )
                .delete()
                .eq( 'code', textSlug );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let textService
    = new TextService();

// -- IMPORTS

import { getMapById, isArray, logError } from 'senselogic-gist';
import { databaseService } from './database_service';
import { applyFilterToQuery, getPaginationIndexMap } from '../base';

// -- CONSTANTS

const filterableColumnNameArray =
    [
        'id',
        'typeId',
        'categoryIdArray',
        'slug',
        'date',
        'number',
        'title',
        'teaser',
        'text',
        'blockIdArray',
        'userId',
        'creationTimestamp',
        'updateTimestamp'
    ];

// -- TYPES

class ArticleService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.cachedArticleArray = null;
        this.cachedArticleByIdMap = null;
        this.cachedArticleTimestamp = 0;
    }

    // -- INQUIRIES

    async getArticleArray(
        articleIdArray = [],
        articlePage = 1,
        articleLimit = 10,
        filterArray = []
        )
    {
        let query
            = databaseService.getClient()
                .from( 'ARTICLE' )
                .select()
                .order( 'number', { ascending: false } );
        let countQuery
            = databaseService.getClient()
                .from( 'ARTICLE' )
                .select( 'id', { count: 'exact', head: true } )

        if ( articleIdArray.length > 0 )
        {
            query = query.in( 'id', articleIdArray );
            countQuery = countQuery.in( 'id', articleIdArray );
        }

        query = applyFilterToQuery( query, filterArray, filterableColumnNameArray );

        let { startIndex, endIndex } = getPaginationIndexMap( articlePage, articleLimit );
        query = query.range( startIndex, endIndex );

        let [ { data, error }, { count } ] = await Promise.all( [ query, countQuery ] );

        let filteredArticles = []

        if ( isArray( data ) )
        {
            for ( let article of data )
            {
                if( !( isArray( article.categoryIdArray )
                     && article.categoryIdArray.length === 1
                     && article.categoryIdArray[ 0 ] === 'info-page') )
                {
                    filteredArticles.push( article );
                }
            }
        }

        if ( error !== null )
        {
            logError( error );
        }

        return (
            {
                articleArray: filteredArticles,
                countArticleArray: count
            }
            );
    }

    // ~~

    async getArticleArrayByCategoryIdArray(
        categoryIdArray = []
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .select();

        data = data.filter(
            article =>
            {
                return categoryIdArray.some(
                    categoryId =>
                    {
                        return article.categoryIdArray.includes( categoryId )
                    }
                    )
            }
        );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleById(
        articleId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .select()
                .eq( 'id', articleId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleSlugById(
        articleId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .select( 'slug' )
                .eq( 'id', articleId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleByIdAndSlug(
        articleId,
        articleSlug
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .select()
                .eq( 'id', articleId )
                .eq( 'slug', articleSlug )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getArticleBySlug(
        articleSlug
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .select()
                .eq( 'slug', articleSlug )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    clearCache(
        )
    {
        this.cachedArticleArray = null;
        this.cachedArticleByIdMap = null;
    }

    // ~~

    async getCachedArticleArray(
        )
    {
        if ( this.cachedArticleArray === null
             || Date.now() > this.cachedArticleTimestamp + 300000 )
        {
            this.cachedArticleArray = await this.getArticleArray();
            this.cachedArticleByIdMap = null;
            this.cachedArticleTimestamp = Date.now();
        }

        return this.cachedArticleArray;
    }

    // ~~

    async getCachedArticleByIdMap(
        )
    {
        if ( this.cachedArticleByIdMap === null )
        {
            this.cachedArticleByIdMap = getMapById( await this.getCachedArticleArray() );
        }

        return this.cachedArticleByIdMap;
    }

    // ~~

    async addArticle(
        article
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .insert( article )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setArticleById(
        article,
        articleId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .update( article )
                .eq( 'id', articleId )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeArticleById(
        articleId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .delete()
                .eq( 'id', articleId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async updateBlockIdArray(
        articleId,
        blockIdArray
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'ARTICLE' )
                .update( { blockIdArray } )
                .eq( 'id', articleId );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let articleService
    = new ArticleService();

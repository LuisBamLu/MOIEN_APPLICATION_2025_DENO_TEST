// -- IMPORTS

import { getJsonObject, getRandomTuid } from 'senselogic-gist';
import { articleService } from '../../service/article_service';
import { getHasMorePage, getUniqueValues, hasUserPermission, isNullOrUndefined } from '../../base';
import { profileService } from '../../service/profile_service';
import { articleTypeService } from '../../service/article_type_service';
import { articleCategoryService } from '../../service/article_category_service';
import { AppError } from '../../utils/app_error';

// -- FUNCTIONS

export async function getArticleById(
    request,
    reply
    )
{
    return reply.send(
        {
            article : await articleService.getArticleById( request.params.id )
        }
        );
}

// ~~

export async function getArticleArray(
    request,
    reply
    )
{
    let response =
    {
        articleArray: [],
        hasMoreArticlePage: false
    };
    let body = request.body;

    let { articleIdArray, articlePage, articleLimit } = body;
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    if ( articleIdArray && articleIdArray.length > 0 )
    {
        let [ { articleArray, countArticleArray }, articleTypeArray, articleCategoryArray ] = await Promise.all(
            [
                await articleService.getArticleArray(
                    [],
                    articlePage,
                    articleLimit,
                    filterArray
                    ),
                await articleTypeService.getArticleTypeArray(),
                await articleCategoryService.getArticleCategoryArray()
            ]
            );
        let [ profileIdArray ] =
            [ 'userId' ].map( key => getUniqueValues( articleArray, key ) );
        let profileArray = await profileService.getProfileArrayByUserIdArray( profileIdArray );

        response.articleArray = articleArray;
        response.profileArray = profileArray;
        response.articleTypeArray = articleTypeArray;
        response.articleCategoryArray = articleCategoryArray;
    }
    else
    {
        let [ { articleArray, countArticleArray }, articleTypeArray, articleCategoryArray ] = await Promise.all(
            [
                await articleService.getArticleArray(
                    [],
                    articlePage,
                    articleLimit,
                    filterArray
                ),
                await articleTypeService.getArticleTypeArray(),
                await articleCategoryService.getArticleCategoryArray()
            ]
            );

        let [ profileIdArray ] = [ 'userId' ].map( key => getUniqueValues( articleArray, key ) );
        let profileArray = await profileService.getProfileArrayByUserIdArray( profileIdArray );

        response.articleArray = articleArray;
        response.profileArray = profileArray;
        response.articleTypeArray = articleTypeArray;
        response.articleCategoryArray = articleCategoryArray;

        if ( articleArray && articleArray.length <= 0 )
        {
            ( { articleArray, countArticleArray } = await articleService.getArticleArray(
                    [],
                    articlePage,
                    articleLimit,
                    filterArray
                )
                );
        }

        response.articleArray = articleArray;

        let { hasMorePage } = getHasMorePage( countArticleArray, articlePage, articleLimit );
        response.hasMoreArticlePage = hasMorePage;
    }

    return reply.send( response );
}

// ~~

export async function addArticle(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let articleData = body;

    if ( !articleData )
    {
        throw new AppError( 'bad-request' );
    }

    if ( !( 'imagePath' in articleData )
            || articleData.imagePath === ''
            || articleData.imagePath === null )
    {
        throw new AppError( 'image-is-required-message' )
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddBlogPermission = await hasUserPermission( 'add-blog', profile.roleSlugArray );

    if ( !hasAddBlogPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let articleId = getRandomTuid();

    let article =
        {
            blockIdArray: articleData.blockIdArray,
            categoryIdArray: articleData.categoryIdArray,
            date: articleData.date,
            id: articleId,
            number: articleData.number,
            slug: articleData.slug,
            teaser: articleData.teaser,
            text: articleData.text,
            title: articleData.title,
            typeId: articleData.typeId,
            userId: profile.userId,
            imagePath: articleData.imagePath
        };

    return reply.code( 201 ).send(
        {
            article : await articleService.addArticle( article )
        }
        );
}

// ~~

export async function setArticleById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let articleId = request.params.id;
    let body = getJsonObject( request.body );
    let articleData = body;

    if ( !articleData || !articleId )
    {
        throw new AppError( 'bad-request' );
    }

    if ( !( 'imagePath' in articleData ) )
    {
        throw new AppError( 'image-is-required-message' );
    }

    let article =
        {
            blockIdArray : articleData.blockIdArray,
            categoryIdArray : articleData.categoryIdArray,
            date : articleData.date,
            number : articleData.number,
            slug : articleData.slug,
            teaser : articleData.teaser,
            text : articleData.text,
            title : articleData.title,
            typeId : articleData.typeId,
            userId : articleData.userId,
            imagePath : articleData.imagePath
        };

    return reply.send(
        {
            article: await articleService.setArticleById( article, articleId )
        }
        );
}

// ~~

export async function sortBlockIdByArticleId(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let articleId = request.params.id;
    let blockIdArray = getJsonObject( request.body.blockIdArray.value );

    return reply.send(
        {
            article: await articleService.updateBlockIdArray( articleId, blockIdArray )
        }
        );
}

// ~~

export async function deleteArticleById(
    request,
    reply
    )
{
    try
    {
        return reply.send(
            {
                article: await articleService.removeArticleById( request.params.id )
            }
            );
    }
    catch
    {
        return reply.code( 400 ).send( { error: 'article-not-deleted' } );
    }
}

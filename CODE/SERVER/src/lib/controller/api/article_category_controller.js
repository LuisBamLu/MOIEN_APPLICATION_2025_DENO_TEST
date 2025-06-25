// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { AppError } from '../../utils/app_error';
import { getTextSlug, hasUserPermission, isNullOrUndefined } from '../../base';
import { articleCategoryService } from '../../service/article_category_service';

// -- FUNCTIONS

export async function addArticleCategory(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let body = getJsonObject( request.body );
    let categoryData = body;

    if ( !categoryData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasAddCategoryPermission = await hasUserPermission( 'add-category', profile.roleSlugArray );

    if ( !hasAddCategoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let categoryId = getTextSlug( categoryData.name );
    let category = await articleCategoryService.addArticleCategory(
        {
            id: categoryId,
            name: categoryData.name,
        }
        );

    return reply.code( 201 ).send(
        {
            category,
            message: 'category-created-message'
        }
        );
}

// ~~

export async function setArticleCategoryById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { categoryId } = request.params;
    let body = getJsonObject( request.body );
    let categoryData = body;

    if ( !categoryData || !categoryId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetCategoryPermission = await hasUserPermission( 'set-category', profile.roleSlugArray );

    if ( !hasSetCategoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let category = await articleCategoryService.setArticleCategoryById(
        {
            name: categoryData.name,
            number: categoryData.number
        },
        categoryId
        );

    return reply.send(
        {
            category,
            message: 'category-updated-message'
        }
        );
}

// ~~

export async function getArticleCategoryArray(
    request,
    reply
    )
{
    let searchQuery = request.query;
    let filterArray = searchQuery.filter;

    return reply.send(
        {
            categoryArray : await articleCategoryService.getArticleCategoryArray(
                filterArray
                )
        }
        );
}

// ~~

export async function deleteArticleCategory(
    request,
    reply
    )
{
    let { categoryId } = request.params;

    if ( !categoryId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveCategoryPermission = await hasUserPermission(
       'remove-category',
        profile.roleSlugArray
        );

    if ( !hasRemoveCategoryPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await articleCategoryService.removeArticleCategoryById( categoryId );

    return reply.send( { message: 'category-deleted-message' } );
}

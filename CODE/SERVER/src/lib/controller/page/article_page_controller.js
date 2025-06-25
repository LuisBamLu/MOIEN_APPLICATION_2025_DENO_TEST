// -- IMPORTS

import { articleService } from '../../service/article_service';
import { profileService } from '../../service/profile_service';
import { userRoleService } from '../../service/user_role_service';
import { articleCategoryService } from '../../service/article_category_service';
import { blockService } from '../../service/block_service';
import { AppError } from '../../app_error';

// -- FUNCTIONS

export async function getArticleData( request, reply )
{
    let articleId = request.params.articleId;
    let article = await articleService.getArticleById( articleId );

    if ( article )
    {
        if ( article === null )
        {
            return reply.status( 404 ).send( 'Article not found' );
        }

        let profile = await profileService.getProfileByUserId( article.userId );
        let profileRole = await userRoleService.getUserRoleById( profile.roleId );
        let categoryArray = await articleCategoryService.getArticleCategoryArrayByCategoryIdArray( article.categoryIdArray );
        let blockArray = await blockService.getBlockArrayByArticleId( articleId );
        let relatedArticleArray = await articleService.getArticleArrayByCategoryIdArray( categoryArray.map( category => category.id ) );

        return reply
            .status( 200 )
            .send(
                {
                    article,
                    profile,
                    profileRole,
                    categoryArray,
                    blockArray,
                    relatedArticleArray
                }
            );
    }
    else
    {
        return reply.status( 404 ).send( 'Article not found' );
    }
}

// ~~

export async function getArticleDataByIdAndSlug(
    request,
    reply
    )
{
    let { articleId, articleSlug } = request.params;
    let article = await articleService.getArticleByIdAndSlug( articleId, articleSlug );

    if ( article === null )
    {
        throw new AppError( 'article-not-found-message', 404 );
    }

    let profile = await profileService.getProfileByUserId( article.userId );
    let profileRole = await userRoleService.getUserRoleById( profile.roleId );
    let categoryArray = await articleCategoryService.getArticleCategoryArrayByCategoryIdArray( article.categoryIdArray );
    let blockArray = await blockService.getBlockArrayByArticleId( articleId );
    let relatedArticleArray = await articleService.getArticleArrayByCategoryIdArray( categoryArray.map( category => category.id ) );

    return reply
        .status( 200 )
        .send(
            {
                article,
                profile,
                profileRole,
                categoryArray,
                blockArray,
                relatedArticleArray
            }
        );
}

// ~~

export async function getArticleSlugById(
    request,
    reply
    )
{
    let { articleId } = request.params;
    let article = await articleService.getArticleSlugById( articleId );

    if ( article === null )
    {
        throw new AppError( 'article-not-found-message', 404 );
    }

    return reply
        .status( 200 )
        .send(
            {
                article
            }
            );
}

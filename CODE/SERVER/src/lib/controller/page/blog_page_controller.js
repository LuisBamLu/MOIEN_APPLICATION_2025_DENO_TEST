// -- IMPORTS

import { articleService } from '../../service/article_service';
import { articleCategoryService } from '../../service/article_category_service';

// -- FUNCTIONS

export async function getBlogPageData(
    request,
    reply
    )
{
    let articles =
        {
            articleArray: [],
            hasMoreArticlePage: false,
            totalCount: 0
        };

    let { articleIdArray, articlePage, articleLimit } = request.body;

    if ( articleIdArray && articleIdArray.length > 0 )
    {
        let { articleArray, countArticleArray } = await articleService.getArticleArray(
            articleIdArray,
            articlePage,
            articleLimit
            );

        articles.articleArray = articleArray;
        articles.totalCount = countArticleArray;
    }
    else
    {
        let { articleArray, countArticleArray } = await articleService.getArticleArray(
            [],
            articlePage,
            articleLimit
            );

        if ( articleArray && articleArray.length <= 0 )
        {
            (
                { articleArray, countArticleArray } = await articleService.getArticleArray(
                    [],
                    articlePage,
                    articleLimit
                    )
            );
        }

        articles.articleArray = articleArray;
        articles.totalCount = countArticleArray;

        let pageCount = Math.ceil( countArticleArray / articleLimit );

        articles.hasMoreArticlePage = articlePage < pageCount;
    }

    let categories =
        {
            categoryArray: []
        };

    let categoryArray = await articleCategoryService.getArticleCategoryArray();

    categories.categoryArray = categoryArray;

    let response =
        {
            articles,
            categories
        };

    return reply.send( response );
}

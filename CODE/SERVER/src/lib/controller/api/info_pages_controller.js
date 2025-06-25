// IMPORTS

import { articleService } from "../../service/article_service";

// FUNCTIONS

export async function getInfoPage(
    request,
    reply
    )
{
    return (
        {
            infoPage : await articleService.getArticleBySlug( request.body.slug )
        }
        );
}

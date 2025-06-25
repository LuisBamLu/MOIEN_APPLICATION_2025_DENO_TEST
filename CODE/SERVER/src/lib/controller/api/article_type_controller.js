// -- IMPORTS

import { articleTypeService } from '../../service/article_type_service';

// -- FUNCTIONS

export async function getArticleTypeArrayById(
    request,
    reply
    )
{
    return reply.send(
        {
            articleTypeArray : await articleTypeService.getArticleTypeById( request.body.articleTypeId )
        }
        );
}

// ~~

export async function getArticleTypeArray(
    request,
    reply
    )
{
    return reply.send(
        {
            articleTypeArray : await articleTypeService.getArticleTypeArray()
        }
        );
}

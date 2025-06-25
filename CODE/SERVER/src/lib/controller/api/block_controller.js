// -- IMPORTS

import { getJsonObject, getRandomTuid } from 'senselogic-gist';
import { blockService } from '../../service/block_service';

// -- FUNCTIONS

export async function getBlockByArticleId(
    request,
    reply
    )
{
    return reply.send(
        {
            blockArray : await blockService.getBlockArrayByArticleId( request.params.id )
        }
        );
}

// ~~

export async function getBlockArray(
    request,
    reply
    )
{
    return reply.send(
        {
            blockArray : await blockService.getBlockArray()
        }
        );
}

// ~~

export async function getBlockById(
    request,
    reply
    )
{
    return reply.send(
        {
            block : await blockService.getBlockById( request.params.id )
        }
        );
}

// ~~

export async function getBlockArrayByUserId(
    request,
    reply
    )
{
    return reply.send(
        {
            blockArray : await blockService.getBlockArrayByUserId( request.params.id )
        }
        );
}

// ~~

export async function addBlock(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let blockData = getJsonObject( request.body.block.value );

    let block =
        {
            id: getRandomTuid(),
            typeId: blockData.typeId,
            userId: request.profileLogged.userId,
            articleId: blockData.articleId,
            teaser: blockData.teaser,
            text: blockData.text,
            title: blockData.title,
            imagePath: blockData.imagePath
        };

    return reply.send(
        {
            block : await blockService.addBlock( block )
        }
        );
}

// ~~

export async function setBlockById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let blockData = getJsonObject( request.body.block.value );

    let block =
        {
            typeId: blockData.typeId,
            title: blockData.title,
            teaser: blockData.teaser,
            text: blockData.text,
            imagePath: blockData.imagePath,
        };

    return reply.send(
        {
            block: await blockService.setBlockById( block, request.params.id )
        }
        );
}

// ~~

export async function deleteBlockById(
    request,
    reply
    )
{
    try
    {
        return reply.send(
            {
                block: await blockService.removeBlockById( request.params.id )
            }
            );
    }
    catch
    {
        return reply.code( 400 ).send( { error: 'block-not-deleted' } );
    }
}

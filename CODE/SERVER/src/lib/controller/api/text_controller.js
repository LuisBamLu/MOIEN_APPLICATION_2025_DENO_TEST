// -- IMPORTS

import { textService } from '../../service/text_service';

// -- FUNCTIONS

export async function setTextBySlug(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );

    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.code( 401 ).send( { error: 'You must be logged in to update a text' } );
    }

    return reply.send(
        {
            text : await textService.setTextBySlug( body.text, body.slug )
        }
        );
}

// ~~

export async function getText(
    request,
    reply
    )
{
    return reply.send(
        {
            textArray : await textService.getTextArray()
        }
        );
}

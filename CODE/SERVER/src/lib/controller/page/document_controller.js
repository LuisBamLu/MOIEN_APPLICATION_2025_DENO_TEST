// -- IMPORTS

import { isNullOrUndefined } from '../../base';
import { documentService } from '../../service/document_service';

// -- FUNCTIONS

export async function getUserDocumentArray(
    request,
    reply
)
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profile = request.profileLogged

    if ( isNullOrUndefined( profile ) )
    {
        return reply.send( [] );
    }

    let userId = profile.userId;
    let userDocumentArray = await documentService.getDocumentArrayByUserId( userId );

    if ( userDocumentArray )
    {
        return reply.status( 200 ).send( userDocumentArray );
    }
    else
    {
        return reply.status( 404 ).send( 'No documents found' );
    }
}

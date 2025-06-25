// -- IMPORTS

import { documentService } from '../../service/document_service';
import { documentStatusService } from '../../service/document_status_service';
import { documentTypeService } from '../../service/document_type_service';

// -- FUNCTIONS

export async function getDocumentData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let [ documentArray, documentStatusMap, documentTypeArray, documentTypeMap ]
        = await Promise.all(
            [
                documentService.getDocumentArrayByUserId( request.profileLogged.userId ),
                documentStatusService.getCachedDocumentStatusMap(),
                documentTypeService.getCachedDocumentTypeArray(),
                documentTypeService.getCachedDocumentTypeMap()
            ]
            );

    return reply
        .status( 200 )
        .send(
            {
                documentArray: documentArray ?? [],
                documentStatusMap,
                documentTypeArray,
                documentTypeMap
            }
            );
}

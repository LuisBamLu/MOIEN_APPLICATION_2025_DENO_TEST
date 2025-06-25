// -- IMPORTS

import { documentStatusService } from '../../service/document_status_service';

// -- FUNCTIONS

export async function getDocumentStatus(
    request,
    reply
    )
{
    return (
        {
            documentStatusMap : await documentStatusService.getCachedDocumentStatusMap()
        }
    )
}

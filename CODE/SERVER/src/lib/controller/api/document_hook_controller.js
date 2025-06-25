// -- IMPORTS

import { documentService } from '../../service/document_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function verifyDocumentation( request, reply )
{
    let eventType = request.query.EventType;
    let mangopayDocumentId = request.query.RessourceId;
    let documentData = {};

    if ( eventType === 'KYC_SUCCEEDED' )
    {
        documentData = { validationStatusId: 'accepted' };
    }
    else
    {
        documentData = { validationStatusId: 'declined' };
    }

    let document = await documentService.getDocumentByMangopayDocumentId( mangopayDocumentId );

    setTimeout(
        async () =>
        {
            document = await documentService.setDocumentByMangopayDocumentId( documentData, mangopayDocumentId );
        },
        document ? 0 : 8000
        );

    if ( document && document?.typeId === 'id-card' && eventType === 'KYC_SUCCEEDED' )
    {
        await profileService.setProfileByUserId( { governmentIdIdValidationStatusId: 'accepted' }, document.userId );
    }

    return reply.status( 200 ).send();
}

// -- IMPORTS

import { documentService } from '../../service/document_service';
import { documentTypeService } from '../../service/document_type_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';
import { profileService } from '../../service/profile_service';

// -- FUNCTIONS

export async function getLeaseContractSupportingDocumentsData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let leaseContract = await leaseContractService.getLeaseContractById( request.params.id );
    let [ documentArray, signatoryArray, documentTypeByIdMap, tenantProfile ]
        = await Promise.all(
            [
                documentService.getDocumentArrayByIdArrayAndUserId(
                    leaseContract.documentIdArray,
                    leaseContract.tenantUserProfileId
                    ),
                leaseSignatoryService.getLeaseSignatoryArrayByContractId( request.params.id ),
                documentTypeService.getCachedDocumentTypeMap(),
                profileService.getProfileByUserId( leaseContract.tenantUserProfileId )
            ]
            );

    return reply.status( 200 ).send( { leaseContract, documentArray, signatoryArray, documentTypeByIdMap, tenantProfile } );
}

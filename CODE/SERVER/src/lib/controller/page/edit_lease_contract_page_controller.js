// -- IMPORTS

import { documentService } from '../../service/document_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';

// -- FUNCTIONS

export async function getEditLeaseContractPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { id } = request.params;

    if ( !request.profileLogged )
    {
        reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let leaseContract = await leaseContractService.getLeaseContractById( id );
    let type = '';

    if ( leaseContract.lessorUserProfileId === request.profileLogged.userId )
    {
        type = 'lessor';
    }
    else if ( leaseContract.tenantUserProfileId === request.profileLogged.userId )
    {
        type = 'tenant';
    }
    else
    {
        reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let documentArray = await documentService.getDocumentArrayByIdArray( leaseContract.documentIdArray ?? [] );
    let hasCompanyExtract = false;

    for ( let document of documentArray )
    {
        if ( document.typeId === 'company-extract' )
        {
            hasCompanyExtract = true;

            break;
        }
    }

    let [ lessorSignatoryArray, tenantSignatoryArray ]
        = await Promise.all(
            [
                leaseSignatoryService.getLeaseSignatoryArrayByUserIdAndContractId(
                    leaseContract.lessorUserProfileId,
                    id
                    ),
                leaseSignatoryService.getLeaseSignatoryArrayByUserIdAndContractId(
                    leaseContract.userId,
                    id
                    )
            ]
            );

    if ( !leaseContract )
    {
        return reply.status( 404 ).send( { error: 'edit-lease-contract-page-lease-contract-not-found-error' } );
    }

    return reply
        .status( 200 )
        .send(
            {
                leaseContract: leaseContract,
                lessorSignatoryArray: lessorSignatoryArray,
                tenantSignatoryArray: tenantSignatoryArray,
                documentArray: documentArray,
                hasCompanyExtract: hasCompanyExtract,
                type: type
            }
            );
}

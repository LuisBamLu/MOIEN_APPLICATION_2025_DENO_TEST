// -- IMPORTS

import { employmentStatusService } from '../../service/employment_status_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { visitService } from '../../service/visit_service';

// -- FUNCTIONS

export async function getVisitRequestPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( !request.profileLogged )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let visit = await visitService.getVisitById( request.params.id );

    if ( visit.userId !== request.profileLogged.userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let visitorProfile = await profileService.getProfileByUserId( visit.visitorUserId );
    let [ leaseContractArray, employmentStatusByIdMap ]
        = await Promise.all(
            [
                leaseContractService.getLeaseContractArrayByUserId( visitorProfile.userId ),
                employmentStatusService.getCachedEmploymentStatusByIdMap()
            ]
            );

    let leaseContract = leaseContractArray[ 0 ];

    for ( let _leaseContract of leaseContractArray )
    {
        if ( _leaseContract.propertyId === visit.propertyId )
        {
           leaseContract = _leaseContract;
        }
    }

    let leaseSignatory;
    let completeRentalFile = false;

    if ( leaseContract )
    {
        let leaseSignatoryArray = await leaseSignatoryService.getLeaseSignatoryArrayByContractId( leaseContract.id );
        leaseSignatory = leaseSignatoryArray[ 0 ];
    }

    if ( leaseContract && leaseSignatory )
    {
        completeRentalFile = true;
    }

    let property = await propertyService.getPropertyById( visit.propertyId );

    return reply
        .status( 200 )
        .send(
            {
                visit,
                visitorProfile,
                property,
                leaseContract,
                leaseSignatory,
                employmentStatusByIdMap,
                completeRentalFile
            }
            );
}

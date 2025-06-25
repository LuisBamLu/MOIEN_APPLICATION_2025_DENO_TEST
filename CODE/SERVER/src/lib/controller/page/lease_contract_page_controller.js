// -- IMPORTS

import { leaseContractService } from '../../service/lease_contract_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';

// -- FUNCTIONS

export async function getLeaseContractData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let leaseContract = await leaseContractService.getLeaseContractById( request.params.id );
    let tenantProfile = await profileService.getProfileByUserId( leaseContract.tenantUserProfileId );
    let property = await propertyService.getPropertyById( leaseContract.propertyId );

    return reply.status( 200 ).send( { leaseContract, tenantProfile, property } );
}

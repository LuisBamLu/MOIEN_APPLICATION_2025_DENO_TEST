// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { leaseContractService } from '../../service/lease_contract_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';

// -- FUNCTIONS

export async function getOngoingContracts(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let leaseContractArray
        = await leaseContractService.getLeaseContractArrayByLessorUserProfileId( request.profileLogged.userId );

    let tenantUserIdSet = new Set();
    let propertyIdSet = new Set();

    for ( let leaseContract of leaseContractArray )
    {
        tenantUserIdSet.add( leaseContract.tenantUserProfileId );
        propertyIdSet.add( leaseContract.propertyId );
    }

    let [ profileArray, propertyArray ]
        = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( Array.from( tenantUserIdSet ) ),
                propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) )
            ]
            )
    let profileByUserIdMap = getMap( profileArray, 'userId' );
    let propertyByIdMap = getMap( propertyArray, 'id' );

    return reply.status( 200 ).send( { leaseContractArray, profileByUserIdMap, propertyByIdMap } );
}

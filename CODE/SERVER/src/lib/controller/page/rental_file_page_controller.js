// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { currencyService } from '../../service/currency_service';
import { employmentStatusService } from '../../service/employment_status_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';

// -- FUNCTIONS

export async function getRentalFilePageData( request, reply )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let [ currencyArray, employmentStatusArray, leaseContractArray ]
        = await Promise.all(
            [
                currencyService.getCachedCurrencyArray(),
                employmentStatusService.getCachedEmploymentStatusArray(),
                leaseContractService.getLeaseContractArrayByUserId( request.profileLogged.userId )
            ]
            );
    let leaseContract;

    if ( leaseContractArray.length === 0 )
    {
        leaseContract
            = await leaseContractService
                .addLeaseContract(
                    {
                        id: getRandomTuid(),
                        status: 'incomplete',
                        userId: request.profileLogged.userId,
                        hasPet: false
                    }
                    );
    }
    else
    {
        leaseContract = leaseContractArray[ 0 ];
    }

    let signatoryArray
        = await leaseSignatoryService
            .getLeaseSignatoryArrayByUserIdAndContractId(
                request.profileLogged.userId,
                leaseContract.id
                );

    return reply.status( 200 ).send( { currencyArray, employmentStatusArray, leaseContract, signatoryArray } );
}

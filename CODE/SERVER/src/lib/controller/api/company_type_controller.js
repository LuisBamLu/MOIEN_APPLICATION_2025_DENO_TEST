// -- IMPORTS

import { companyTypeService } from '../../service/company_type_service';

// -- FUNCTIONS

export async function getCompanyType(
    request,
    reply
    )
{
    let companyTypeArray = await companyTypeService.getCachedCompanyTypeArray();

    return reply.status( 200 ).send( { companyTypeArray } );
}

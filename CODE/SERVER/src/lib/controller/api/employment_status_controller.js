// -- IMPORTS

import { employmentStatusService } from '../../service/employment_status_service'

// -- FUNCTIONS

export async function getEmploymentStatusArray(
    request,
    reply
    )
{
    let employmentStatusArray = await employmentStatusService.getCachedEmploymentStatusArray();
    let employmentStatusByIdMap = await employmentStatusService.getCachedEmploymentStatusByIdMap();

    return reply.status( 200 ).send( { employmentStatusArray, employmentStatusByIdMap } );
}

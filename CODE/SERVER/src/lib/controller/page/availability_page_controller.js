// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { visitService } from '../../service/visit_service';

// -- FUNCTIONS

export async function getVisitArrayByUserId(
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

    let body = getJsonObject( request.body );
    let dateRange = body.dateRange;
    let visitArray = await visitService.getVisitArrayByUserIdAndDateRange( request.profileLogged.userId, dateRange );

    return reply.status( 200 ).send( { visitArray: visitArray } );
}

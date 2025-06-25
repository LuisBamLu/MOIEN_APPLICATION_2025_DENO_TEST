// -- IMPORTS

import { propertyService } from '../../service/property_service';

// -- FUNCTIONS

export async function getPropertyManagementById(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let property = await propertyService.getPropertyById( request.params.id );

    if ( property.userId !== request.profileLogged?.userId )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    return reply.status( 200 ).send( { property } );
}

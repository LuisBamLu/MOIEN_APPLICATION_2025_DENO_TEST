// -- IMPORTS

import { propertyService } from '../../service/property_service';

// -- FUNCTIONS

export async function getPropertyData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let propertyData = await propertyService.getPropertyArray( false, 'online', { userId: request.profileLogged.userId } );

    if ( propertyData.propertyArray.length > 4 )
    {
        propertyData.propertyArray = propertyData.propertyArray.slice( 0, 4 );
    }

    return reply.status( 200 ).send( { propertyData } );
}

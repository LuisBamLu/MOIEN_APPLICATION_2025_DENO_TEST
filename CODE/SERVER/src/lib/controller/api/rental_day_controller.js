// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { propertyService } from '../../service/property_service';
import { rentalDayService } from '../../service/rental_day_service';

// -- FUNCTIONS

export async function addRentalDay(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let propertyId = request.params.propertyId;
    let property = await propertyService.getPropertyById( propertyId );

    if ( !request.profileLogged
         || ( request.profileLogged.userId !== property.userId
              && request.profileLogged.userId !== property.managerUserId ) )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let body = JSON.parse( request.body );
    let rentalDayArray = body.rentalDayArray;

    for ( let rentalDay of rentalDayArray )
    {
        if ( !rentalDay.id )
        {
            rentalDay.id = getRandomTuid();
        }
    }

    rentalDayArray = await rentalDayService.upsertRentalDayArray( rentalDayArray );

    return reply.status( 200 ).send( { rentalDayArray } );
}

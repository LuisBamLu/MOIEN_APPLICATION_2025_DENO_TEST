// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { propertyService } from '../../service/property_service';
import { rentalDayService } from '../../service/rental_day_service';
import { rentalBookingService } from '../../service/rental_booking_service';

// -- FUNCTIONS

export async function getBookingCalendarPageData(
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

    let [ rentalBookingArray, rentalDayArray ]
        = await Promise.all(
            [
                rentalBookingService.getRentalBookingArrayByPropertyIdAndStatusArray(
                    propertyId,
                    [ 'requested', 'confirmed', 'paid' ]
                    ),
                rentalDayService.getRentalDayArrayByPropertyId( property.id )
            ]
            );
    let rentalDayByDateMap = getMap( rentalDayArray, 'date' );

    return reply.status( 200 ).send( { rentalDayArray, rentalDayByDateMap, rentalBookingArray } );
}

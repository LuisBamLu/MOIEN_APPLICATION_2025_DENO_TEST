// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { propertyService } from '../../service/property_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { rentalDayService } from '../../service/rental_day_service';

// -- FUNCTIONS

export async function rentalBookingPageData(
    request,
    reply
    )
{
    let rentalBookingId = request.params.id;
    let rentalBooking = await rentalBookingService.getRentalBookingById( rentalBookingId );

    if ( !rentalBooking )
    {
        return reply.status( 404 ).send();
    }

    let [ rentalDayArray, property ]
        = await Promise.all(
            [
                rentalDayService.getRentalDayArrayByPropertyIdAndDateRange(
                    rentalBooking.propertyId,
                    [ rentalBooking.arrivalDate, rentalBooking.departureDate ]
                    ),
                propertyService.getPropertyById( rentalBooking.propertyId )
            ]
            );
    let rentalDayByDateMap = getMap( rentalDayArray, 'date' );

    return reply.status( 200 ).send( { rentalBooking, property, rentalDayByDateMap } );
}

// -- IMPORTS

import { getMap, getMapById } from 'senselogic-gist';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { rentalDayService } from '../../service/rental_day_service';

// -- FUNCTIONS

export async function getCurrentStays(
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

    let rentalBookingArray
        = await rentalBookingService.getUpcomingRentalBookingArrayByPropertyUserIdAndStatusArray(
            request.profileLogged.userId,
            [ 'requested', 'confirmed', 'paid' ]
            );
    let userIdSet = new Set();
    let propertyIdSet = new Set();
    let rentalBookingArrayByPropertyIdMap = {};
    let rentalDayArrayByRentalBookingIdMap = {};
    let rentalDayPromiseArray = [];

    for ( let rentalBooking of rentalBookingArray )
    {
        userIdSet.add( rentalBooking.userId );
        propertyIdSet.add( rentalBooking.propertyId );

        if ( !rentalBookingArrayByPropertyIdMap[ rentalBooking.propertyId ] )
        {
            rentalBookingArrayByPropertyIdMap[ rentalBooking.propertyId ] = [];
        }

        rentalBookingArrayByPropertyIdMap[ rentalBooking.propertyId ].push( rentalBooking );
        rentalDayPromiseArray.push(
            rentalDayService.getRentalDayArrayByPropertyIdAndDateRange(
                rentalBooking.propertyId,
                [ rentalBooking.arrivalDate, rentalBooking.departureDate ]
                )
            );
    }

    let rentalDayPromiseResultArray = await Promise.all( rentalDayPromiseArray );

    for ( let rentalBookingIndex = 0; rentalBookingIndex < rentalBookingArray.length; rentalBookingIndex++ )
    {
        let rentalBooking = rentalBookingArray[ rentalBookingIndex ];
        let rentalDayArray = rentalDayPromiseResultArray[ rentalBookingIndex ];
        rentalDayArrayByRentalBookingIdMap[ rentalBooking.id ] = rentalDayArray;
    }

    let [ propertyArray, profileArray ]
        = await Promise.all(
            [
                propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) ),
                profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) )
            ]
            );
    let profileByUserIdMap = getMap( profileArray, 'userId' );
    let propertyByIdMap = getMapById( propertyArray );
    let rentalBookingByIdMap = getMap( rentalBookingArray );

    return reply
        .status( 200 )
        .send(
            {
                rentalBookingArray,
                rentalBookingArrayByPropertyIdMap,
                profileByUserIdMap,
                propertyArray,
                propertyByIdMap,
                rentalBookingByIdMap,
                rentalDayArrayByRentalBookingIdMap
            }
            );
}

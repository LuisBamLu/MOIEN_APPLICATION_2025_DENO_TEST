// -- IMPORTS

import { getMap, getMapById } from 'senselogic-gist';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { visitService } from '../../service/visit_service';

// -- FUNCTIONS

export async function getEventsPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    try
    {
        let [ propertyCount, hostVisitArray, visitorVisitArray, tenantRentalBookingArray, hostRentalBookingArray ]
            = await Promise.all(
                [
                    propertyService.getPropertyCountByUserId( request.profileLogged.userId ),
                    visitService.getVisitArrayByUserIdAndStatusArray(
                        request.profileLogged.userId,
                        [ 'pending', 'booked', 'rescheduled-by-host' ]
                        ),
                    visitService.getRentalVistArrayByVisitorUserId( request.profileLogged.userId ),
                    rentalBookingService.getRentalBookingArrayByUserIdAndStatusArray(
                        request.profileLogged.userId,
                        [ 'requested', 'confirmed', 'paid' ]
                        ),
                    rentalBookingService.getRentalBookingArrayByPropertyUserIdAndStatusArray(
                        request.profileLogged.userId,
                        [ 'requested', 'confirmed', 'paid' ]
                        )
                ]
                );

        let visitorUserIdSet = new Set();
        let propertyIdSet = new Set();

        for ( let visit of [ ...hostVisitArray, ...visitorVisitArray ] )
        {
            visitorUserIdSet.add( visit.visitorUserId );
            propertyIdSet.add( visit.propertyId );
        }

        if ( hostRentalBookingArray )
        {
            for ( let rentalBooking of [ ...tenantRentalBookingArray, ...hostRentalBookingArray ] )
            {
                visitorUserIdSet.add( rentalBooking.userId );
                propertyIdSet.add( rentalBooking.propertyId );
            }
        }

        let [ visitorProfileArray, propertyArray ]
            = await Promise.all(
                [
                    profileService.getProfileArrayByUserIdArray( Array.from( visitorUserIdSet ) ),
                    propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) )
                ]
                );

        let propertyByIdMap = getMapById( propertyArray );
        let visitorProfileByUserIdMap = getMap( visitorProfileArray, 'userId' );

        return reply
            .status( 200 )
            .send(
                {
                    propertyCount,
                    rentalBookingCount: tenantRentalBookingArray.length,
                    hostVisitArray,
                    visitorVisitArray,
                    tenantRentalBookingArray,
                    hostRentalBookingArray,
                    visitorProfileByUserIdMap,
                    propertyByIdMap
                }
                );
    }
    catch( error )
    {
        console.error( error );

        return reply.status( 500 ).send( error );
    }
}

// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { rentalReviewService } from '../../service/rental_review_service';
import { userReviewService } from '../../service/user_review_service';

// -- VARIABLES

let placeholderProfile =
    {
        id: null,
        userId: null,
        imagePath: '',
        firstName: '[deleted user]',
        lastName: ''
    };
let placeholderProperty =
    {
        id: null,
        userId: null,
        title: '[deleted property]',
        imagePathArray: new Array( 6 ).fill( '' ),
        cityName: 'Unknown'
    };

// -- FUNCTIONS

export async function getPropertyArrayByRentalBooking(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged.userId;
    let propertyArrayByRentalBooking = [];
    let rentalBookingArray = await rentalBookingService.getRentalBookingArrayByUserId( userId );

    if ( rentalBookingArray )
    {
        let propertyIdSet = new Set();
        let userIdSet = new Set();

        for ( let rentalBooking of rentalBookingArray )
        {
            propertyIdSet.add( rentalBooking.propertyId );
        }

        let [ propertyArray, rentalReviewArray ]
            = await Promise.all(
                [
                    propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) ),
                    rentalReviewService.getRentalReviewArrayByPropertyIdArray( Array.from( propertyIdSet ) )
                ]
                );

        let propertyByIdMap = {};

        for ( let property of propertyArray )
        {
            propertyByIdMap[ property.id ] = property;
            userIdSet.add( property.userId );
        }

        let rentalReviewArrayByPropertyIdMap = {};

        for ( let rentalReview of rentalReviewArray )
        {
            if ( rentalReviewArrayByPropertyIdMap[ rentalReview.propertyId ] === undefined )
            {
                rentalReviewArrayByPropertyIdMap[ rentalReview.propertyId ] = [];
            }

            rentalReviewArrayByPropertyIdMap[ rentalReview.propertyId ].push( rentalReview );
        }

        let [ profileArray, userReviewArray ]
            = await Promise.all(
                [
                    profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) ),
                    userReviewService.getUserReviewArrayByRatedUserIdArray( Array.from( userIdSet ) )
                ]
                );

        let profileByUserIdMap = getMap( profileArray, 'userId' );
        let userReviewArrayByUserIdMap = {};

        for ( let userReview of userReviewArray )
        {
            if ( userReviewArrayByUserIdMap[ userReview.ratedUserProfileId ] === undefined )
            {
                userReviewArrayByUserIdMap[ userReview.ratedUserProfileId ] = [];
            }

            userReviewArrayByUserIdMap[ userReview.ratedUserProfileId ].push( userReview );
        }

        for ( let rentalBooking of rentalBookingArray )
        {
            let property = propertyByIdMap[ rentalBooking.propertyId ];

            if ( !property )
            {
                property = placeholderProperty;
            }

            let profile = profileByUserIdMap[ property?.userId ];

            if ( !profile )
            {
                profile = placeholderProfile;
            }

            property.reviewArray = rentalReviewArrayByPropertyIdMap[ rentalBooking.propertyId ] ?? [];
            profile.reviewArray = userReviewArrayByUserIdMap[ profile.userId ] ?? [];

            rentalBooking.property = property;
            rentalBooking.profile = profile;

            propertyArrayByRentalBooking.push( { rentalBooking } );
        }
    }

    return reply.send( { propertyArrayByRentalBooking } );
}

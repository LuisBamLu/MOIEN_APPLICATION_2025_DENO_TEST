// -- IMPORTS

import { getMap, getMapById } from 'senselogic-gist';
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
    }
let placeholderProperty =
    {
        id: null,
        userId: null,
        title: '[deleted property]',
        imagePathArray: new Array( 6 ).fill( '' ),
        cityName: 'Unknown'
    };

// -- FUNCTIONS

export async function getUserRentals(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged?.userId;
    let rentalBookingArray = await rentalBookingService.getRentalBookingArrayByPropertyUserId( userId );
    let propertyIdSet = new Set();
    let userIdSet = new Set();

    for ( let rentalBooking of rentalBookingArray )
    {
        propertyIdSet.add( rentalBooking.propertyId );
        userIdSet.add( rentalBooking.userId );
    }

    let [ propertyArray, rentalReviewArray ]
        = await Promise.all(
            [
                propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) ),
                rentalReviewService.getRentalReviewArrayByPropertyIdArray( Array.from( propertyIdSet ) )
            ]
            );

    let propertyByIdMap = getMapById( propertyArray );
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
    let userReviewArrayByRatedUserIdMap = {};

    for ( let userReview of userReviewArray )
    {
        if ( userReviewArrayByRatedUserIdMap[ userReview.ratedUserProfileId ] === undefined )
        {
            userReviewArrayByRatedUserIdMap[ userReview.ratedUserProfileId ] = [];
        }

        userReviewArrayByRatedUserIdMap[ userReview.ratedUserProfileId ].push( userReview );
    }

    for ( let rentalBooking of rentalBookingArray )
    {
        let property = propertyByIdMap[ rentalBooking.propertyId ];
        let profile = profileByUserIdMap[ rentalBooking.userId ];

        if ( !property )
        {
            property = placeholderProperty;
        }

        if ( !profile )
        {
            profile = placeholderProfile;
        }

        property.reviewArray = rentalReviewArrayByPropertyIdMap[ property.id ] ?? [];
        profile.reviewArray = userReviewArrayByRatedUserIdMap[ profile?.userId ] ?? [];

        delete rentalBooking.PROPERTY;

        rentalBooking.property = property;
        rentalBooking.profile = profile;
    }

    return reply.send( { userRentalsArray: rentalBookingArray } );
}

// -- IMPORTS

import { getJsonText, getMap } from 'senselogic-gist';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { rentalReviewService } from '../../service/rental_review_service';
import { visitService } from '../../service/visit_service';
import { documentService } from '../../service/document_service';
import { documentTypeService } from '../../service/document_type_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';
import { questionService } from '../../service/question_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { rentalDayService } from '../../service/rental_day_service';
import { AppError } from '../../utils/app_error';
import { userReviewService } from '../../service/user_review_service';

// -- FUNCTIONS

export async function getPropertyPageData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let propertyId = request.params.propertyId;
    let property = await propertyService.getPropertyById( propertyId );
    let visit = null;
    let profileDocumentByTypeIdMap = {};
    let hasCompleteRentalFile = false;
    let meetsRequiredMonthlyIncome = false;
    let propertyLeaseContract = null;
    let documentArray = [];
    let rentalBookingArray = [];
    let rentalDayByDateMap = {};

    if ( property )
    {
        if ( request.profileLogged )
        {
            documentArray
                = await documentService.getDocumentArrayByUserIdAndValidationStatusId(
                    request.profileLogged.userId,
                    'accepted'
                    );
        }

        for ( let document of documentArray )
        {
            profileDocumentByTypeIdMap[ document.typeId ] = document;
        }

        if ( property.isAvailableForLongTerm && request.profileLogged?.userId )
        {
            let [ _visit, leaseContractArray ]
                = await Promise.all(
                    [
                        visitService.getVisitByVisitorUserIdAndPropertyId( request.profileLogged.userId, propertyId ),
                        leaseContractService.getLeaseContractArrayByUserId( request.profileLogged.userId )
                    ]
                    );
            visit = _visit;

            if ( leaseContractArray.length )
            {
                let leaseContract = leaseContractArray[ 0 ];

                if ( leaseContract.adultCount )
                {
                    let leaseSignatoryArray
                        = await leaseSignatoryService.getLeaseSignatoryArrayByContractId( leaseContract.id );

                    for ( let leaseSignatory of leaseSignatoryArray )
                    {
                        if ( leaseSignatory.monthlyIncome && leaseSignatory.employmentStatus )
                        {
                            hasCompleteRentalFile = true;
                        }

                        if ( leaseSignatory.monthlyIncome > property.requiredLongTermMonthlyIncome )
                        {
                            meetsRequiredMonthlyIncome = true;
                        }
                    }
                }

                for ( let leaseContract of leaseContractArray )
                {
                    if ( leaseContract.propertyId === propertyId )
                    {
                        propertyLeaseContract = leaseContract;
                    }
                }
            }
        }

        if ( property.isAvailableForShortTerm )
        {
            let [ _rentalBookingArray, rentalDayArray ]
                = await Promise.all(
                    [
                        rentalBookingService.getRentalBookingArrayByPropertyIdAndStatusArray( propertyId, [ 'confirmed', 'paid' ] ),
                        rentalDayService.getRentalDayArrayAfterDateByPropertyId(
                            new Date().toISOString().slice( 0, 10 ),
                            propertyId
                            )
                    ]
                    );

            rentalBookingArray = _rentalBookingArray ?? [];
            rentalDayByDateMap = getMap( rentalDayArray, 'date' );
        }

        let propertyUserId = property.userId;
        let propertyReviewUserIdSet = new Set();
        let [ profile, profileReviews, profilePropertyCount, propertyRentalReviewArray, documentTypeMap, questionArray ]
            = await Promise.all(
                [
                    profileService.getProfileByUserId( propertyUserId ),
                    userReviewService.getUserReviewArrayByRatedUserProfileId( propertyUserId ),
                    propertyService.getPropertyCountByUserId( propertyUserId ),
                    rentalReviewService.getRentalReviewArrayByPropertyId( propertyId ),
                    documentTypeService.getCachedDocumentTypeMap(),
                    questionService.getQuestionArrayByPropertyId( propertyId )
                ]
                );

        profile.profileReviews = profileReviews;

        for ( let rentalReview of propertyRentalReviewArray )
        {
            propertyReviewUserIdSet.add( rentalReview.userId );
        }

        let rentalReviewProfileArray = await profileService.getProfileArrayByUserIdArray( Array.from( propertyReviewUserIdSet ) );
        let rentalReviewProfileByUserIdMap = {};

        if ( rentalReviewProfileArray )
        {
            rentalReviewProfileByUserIdMap = getMap( rentalReviewProfileArray, 'userId' );
        }

        for ( let rentalReview of propertyRentalReviewArray )
        {
            let rentalReviewProfile = rentalReviewProfileByUserIdMap[ rentalReview.userId ]
            rentalReview.profileFirstName = rentalReviewProfile.firstName;
            rentalReview.profileLastName = rentalReviewProfile.lastName;
            rentalReview.profileImagePath = rentalReviewProfile.imagePath;
        }

        return reply
            .status( 200 )
            .send(
                {
                    property,
                    profile,
                    profilePropertyCount,
                    propertyRentalReviewArray,
                    rentalReviewProfileArray,
                    visit,
                    documentTypeMap,
                    profileDocumentByTypeIdMap,
                    hasCompleteRentalFile,
                    meetsRequiredMonthlyIncome,
                    questionArray,
                    propertyLeaseContract,
                    rentalBookingArray,
                    rentalDayByDateMap
                }
                );
    }
    else
    {
        throw new AppError( 'property-not-found-error-message', 404 );
    }
}

export function handleWebSocketPointsOfInterest(
    data,
    webSocket,
    webSocketServer
    )
{
    let { propertyParameters, locationParameters, bookingParameters, featureParameters, propertyPage, propertyIdArray, propertyLimit, filterArray } = data;
    propertyService.getPropertyArray(
        true,
        null,
        propertyParameters,
        locationParameters,
        bookingParameters,
        featureParameters,
        propertyIdArray ?? [],
        propertyPage,
        propertyLimit,
        filterArray
        )
        .then(
            ( { propertyArray } ) =>
            {
                if ( propertyArray && propertyArray.length <= 0 )
                {
                    delete propertyParameters.cityId;
                    propertyService.getPropertyArray(
                        true,
                        'online',
                        propertyParameters,
                        locationParameters,
                        bookingParameters,
                        featureParameters,
                        propertyIdArray ?? [],
                        propertyPage,
                        propertyLimit
                        )
                        .then(
                            ( { propertyArray } ) =>
                            {
                                webSocket.send(
                                    getJsonText(
                                        {
                                            type: 'pointsOfInterest',
                                            propertyArray
                                        }
                                        )
                                    );
                            }
                            );
                }
                else
                {
                    webSocket.send(
                        getJsonText(
                            {
                                type: 'pointsOfInterest',
                                propertyArray
                            }
                            )
                        );
                }
            }
            );
}

// -- IMPORTS

import { getMap } from 'senselogic-gist';
import { getUniqueValues, hasAnyUserRole } from '../../base';
import { documentService } from '../../service/document_service';
import { leaseContractService } from '../../service/lease_contract_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { rentalBookingService } from '../../service/rental_booking_service';
import { userReviewService } from '../../service/user_review_service';
import { visitService } from '../../service/visit_service';
import { leaseSignatoryService } from '../../service/lease_signatory_service';
import { currencyConversionService } from '../../service/currency_conversion_service';
import { userGenderService } from '../../service/user_gender_service';

// -- FUNCTIONS

export async function getProfilePage(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let profileId = request.params.id;
    let propertyArray = [];
    let documentArray = [];
    let currencyConversionByConversionCodeMap = {};
    let isTenant = false;
    let hasCompleteRentalFile = false;
    let profile = await profileService.getProfileById( profileId );
    let isOwnProfile = request.profileLogged?.userId === profile.userId;
    let leaseContractArray = await leaseContractService.getLeaseContractArrayByUserId( profile.userId );
    let rentalFile;

    if ( leaseContractArray.length )
    {
        let leaseContract = leaseContractArray[ 0 ];

        if ( leaseContract.adultCount )
        {
            let leaseSignatoryArray = await leaseSignatoryService.getLeaseSignatoryArrayByContractId( leaseContract.id );

            for ( let leaseSignatory of leaseSignatoryArray )
            {
                if ( leaseSignatory.monthlyIncome && leaseSignatory.employmentStatus )
                {
                    hasCompleteRentalFile = true;
                    rentalFile = leaseContract;
                    rentalFile.signatory = leaseSignatory
                    break;
                }
            }
        }
    }

    if ( hasAnyUserRole( [ 'host', 'administrator' ], profile.roleSlugArray ) )
    {
        propertyArray = await propertyService.getPropertyArrayByUserId( profile.userId );

        if ( request.profileLogged !== null )
        {
            let currencyCodeArray = getUniqueValues( propertyArray, 'currencyCode' );
            let conversionCodeArray = [];
            let promiseArray = [];

            for ( let currencyCode of currencyCodeArray )
            {
                let targetCurrencyCode = request.profileLogged?.currencyCode ?? 'EUR'

                let conversionCode =
                    currencyCode
                    + ', '
                    + targetCurrencyCode;

                conversionCodeArray.push( conversionCode );

                promiseArray.push(
                    currencyConversionService
                        .getCachedCurrencyConversionByConversionCode(
                            conversionCode
                            )
                    );
            }

            let currencyConversionRateArray = await Promise.all( promiseArray );

            for ( let currencyConversionIndex = 0;
                  currencyConversionIndex < conversionCodeArray.length;
                  ++currencyConversionIndex )
            {
                let conversionCode = conversionCodeArray[ currencyConversionIndex ];
                let currencyConversionRate = currencyConversionRateArray[ currencyConversionIndex ];

                currencyConversionByConversionCodeMap[ conversionCode ] = currencyConversionRate;
            }
        }
    }

    let userReviewArray = await userReviewService.getUserReviewArrayByRatedUserProfileId( profile.userId );
    let userReviewUserIdSet = new Set();

    for ( let userReview of userReviewArray )
    {
        userReviewUserIdSet.add( userReview.userId );
    }

    let userReviewProfileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userReviewUserIdSet ) );
    let userReviewProfileByUserIdMap = getMap( userReviewProfileArray, 'userId' );

    if ( request.profileLogged !== null
         && hasAnyUserRole( [ 'host', 'administrator' ], request.profileLogged?.roleSlugArray ?? [] )
         && !isOwnProfile )
    {
        let [ rentalBookingArray, visitArray, leaseContractArray, userGender ]
            = await Promise.all(
                [
                    rentalBookingService.getRentalBookingArrayByUserIdAndPropertyUserId(
                        profile.userId,
                        request.profileLogged?.userId
                        ),
                    visitService.getVisitArrayByUserIdAndVisitorUserId(
                        request.profileLogged?.userId,
                        profile.userId
                        ),
                    leaseContractService.getLeaseContractArrayByLessorUserProfileIdAndTenantUserProfileId(
                        request.profileLogged?.userId,
                        profile.userId
                        ),
                    userGenderService.getUserGenderById(
                        profile.genderId
                        )
                ]
                );

        profile.gender = userGender;
        isTenant = ( rentalBookingArray.length > 0 || visitArray.length > 0 || leaseContractArray > 0 );
    }

    if ( isTenant || isOwnProfile )
    {
        documentArray = await documentService.getDocumentArrayByUserId( profile.userId );
    }

    return reply
        .status( 200 )
        .send(
            {
                profile,
                propertyArray,
                documentArray,
                userReviewArray,
                userReviewProfileByUserIdMap,
                hasCompleteRentalFile,
                rentalFile,
                isTenant,
                isOwnProfile,
                currencyConversionByConversionCodeMap
            }
            );
}

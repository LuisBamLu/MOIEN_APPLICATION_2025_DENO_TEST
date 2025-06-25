// -- IMPORTS

import { documentService } from '../../../service/document_service';
import { ticketService } from '../../../service/ticket_service';
import { ticketStatusService } from '../../../service/ticket_status_service';
import { validationStatusService } from '../../../service/validation_status_service';
import { paymentService } from '../../../service/payment_service';
import { rentalReviewService } from '../../../service/rental_review_service';
import { userReviewService } from '../../../service/user_review_service';
import { visitService } from '../../../service/visit_service';
import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { leaseContractService } from '../../../service/lease_contract_service';
import { isArray } from 'senselogic-gist';

// -- FUNCTIONS

async function crudVisit(
    crudFunction,
    reply
    )
{
    try
    {
        let result = await crudFunction;

        return reply.status( 200 ).send( result );
    }
    catch ( error )
    {
        return reply.status( 500 ).send( `Error: ${ error }` );
    }
}

// ~~

function getSize(
    array
    )
{
    return array ? array.length : 0;
}

// ~~

function getReducedArray(
    array,
    property
    )
{
    let reducedArray = array.reduce(
        ( accumulator, item ) => accumulator + item[ property ], 0
        );

    return reducedArray;
}

// ~~

function getAverageOfArray(
    array,
    property
    )
{
    if ( !isArray( array ) || array.length === 0 ) return 0;

    let averageArray = getReducedArray( array, property );
    averageArray /= array.length;
    averageArray = Math.round( averageArray * 10 ) / 10;

    return averageArray;
}

// ~~

function getDocumentData(
    documentArray,
    validationStatusArray
    )
{
    let statusIdArray = [];
    let documentsByStatus = [];
    let documentLabelArray = [];
    let documentCount = documentArray.length;

    for ( let validationStatus of validationStatusArray )
    {
        documentLabelArray.push( validationStatus.name );
        statusIdArray.push( validationStatus.id );
        documentsByStatus.push(
            getSize(
                documentArray.filter(
                    document => document.validationStatusId === validationStatus.id
                    )
                )
            );

        if ( validationStatus.id === 'pending' && Number( documentsByStatus.slice( -1 ) ) > 0 )
        {
            documentTagLabel = 'validate-label';
            documentTagColor = 'red';
        }
    }

    let documentDataArray =
    [
        { data: documentsByStatus[ 0 ], backgroundColor: '#40DCB6', hoverBackgroundColor: '#A6F4C5' },
        { data: documentsByStatus[ 1 ], backgroundColor: '#3392FF', hoverBackgroundColor: '#ADD3FF' },
        { data: documentsByStatus[ 2 ], backgroundColor: '#00584A', hoverBackgroundColor: '#007D69' },
        { data: documentsByStatus[ 3 ], backgroundColor: '#02367B', hoverBackgroundColor: '#125FB8' },
    ].filter( item => item.data > 0 );

    return (
        {
            documentLabelArray,
            documentCount,
            documentDataArray
        }
        );
}

// ~~

function getTicketData(
    ticketArray,
    ticketStatusArray
    )
{
    return (
        {
            ticketArray,
            ticketCount: ticketArray.length,
            ticketStatusArray: ticketStatusArray.map(
                ticketStatus =>
                {
                    return (
                        {
                            id: ticketStatus.id,
                            name: ticketStatus.name,
                            count: getSize(
                                ticketArray.filter(
                                    ticket => ticket.statusId === ticketStatus.id
                                    )
                                )
                        }
                        );
                }
                )
        }
        );
}

// ~~

function getProfileData(
    profileArray
    )
{
    return (
        {
            profileArray,
            profileCount: getSize( profileArray )
        }
        );
}

// ~~

async function getIncomeData(
    paymentArray = [],
    toCurrency = 'EUR'
    )
{
    let paymentStatusMap =
    {
        'succeeded': 0,
        'failed': 1,
        'created': 2
    };

    let paymentTypeAndStatus =
    {
        payin: [ 0, 0, 0 ],
        transfer: [ 0, 0, 0 ],
        refund: [ 0, 0, 0 ],
        conversion: [ 0, 0, 0 ]
    }

    for ( let payment of paymentArray )
    {
        payment.currencyCode = payment.currencyCode || 'EUR'
        paymentTypeAndStatus[ payment.typeId ][ paymentStatusMap[ payment.statusId ] ] += 1;
    }

    for ( let status of Object.keys( paymentStatusMap ) )
    {
        paymentStatusMap[ status ] =
            paymentArray.filter( payment => payment.statusId === status ).length;
    }

    let succeededPaymentArray = [];

    for ( let payment of paymentArray )
    {
        if ( payment.statusId === 'succeeded' )
        {
            succeededPaymentArray.push( payment );
        }
    }

    let paymentAmountArray = [];

    for ( let payment of succeededPaymentArray )
    {
        paymentAmountArray.push( payment.amount );
    }

    let convertedPaymentArray = [];

    for ( let paymentIndex = 0; paymentIndex < succeededPaymentArray.length; paymentIndex++ )
    {
        let payment = succeededPaymentArray[ paymentIndex ];
        payment.amount = paymentAmountArray[ paymentIndex ];

        convertedPaymentArray.push( payment );
    }

    let totalIncome = getReducedArray( convertedPaymentArray, 'amount' );

    let paymentDataArray = [];

    for ( let payment of paymentArray )
    {
        let existingPayment = paymentDataArray.find(
            p => p.typeId === payment.typeId && p.statusId === payment.statusId
            );

        if ( existingPayment )
        {
            existingPayment.amount += 1;
        }
        else
        {
            paymentDataArray.push(
                {
                    typeId: payment.typeId,
                    methodId: payment.methodId,
                    amount: 1,
                    statusId: payment.statusId
                }
                );
        }
    }

    let today = new Date();
    let twelveMonthsAgo = new Date();
    twelveMonthsAgo.setFullYear( today.getFullYear() - 1 );

    let previousDuePayments =
        paymentArray.filter(
            payment =>
            {
                return ( new Date( payment.dueDate ) < today && payment.statusId !== 'failed' );
            }
            );

    let failedPayments =
        paymentArray.filter(
            payment => payment.statusId === 'failed'
            );

    let previousDuePaymentsLast12Months =
        previousDuePayments.filter(
            payment => new Date( payment.dueDate ) >= twelveMonthsAgo
            );

    let failedPaymentsLast12Months =
        failedPayments.filter(
            payment => new Date( payment.dueDate ) >= twelveMonthsAgo
            );

    let paymentAnomalieArray =
    {
        previousDuePaymentsLast12Months,
        failedPaymentsLast12Months
    };

    let result =
    {
        paymentTypeAndStatus,
        paymentDataArray,
        paymentStatusMap,
        paymentAnomalieArray,
        total: totalIncome
    };

    return result;
}

// ~~

function getReviewData(
    rentalReviewArray,
    userReviewArray = null
    )
{
    let generalRentReviewRating = getAverageOfArray( rentalReviewArray, 'rating' );

    if ( userReviewArray )
    {
        let generalUserReviewRating = getAverageOfArray( userReviewArray, 'rating' );

        return (
            {
                rentalReviewArray,
                userReviewArray,
                generalRentReviewRating: generalRentReviewRating,
                generalUserReviewRating: generalUserReviewRating
            }
            );
    }

    return (
        {
            rentalReviewArray,
            rentalReviewCount: generalRentReviewRating
        }
        );
}

// ~~

async function getUserReviewValue(
    request,
    reply
    )
{
    let userId = request.body.userId;

    let reviewArray = await userReviewService.getUserReviewArrayByRatedUserProfileId( userId );

    return reply.send( reviewArray );
}

async function getAgencyData(
    agency,
    id
    )
{
    let agencyProfile =
        await profileService.getProfileById(
            id
            );

    let agencyPropertyArray =
        await propertyService.getPropertyArrayByProfile(
            agencyProfile
            );

    let agencyLeaseContractArray =
        await leaseContractService.getLeaseContractArrayByLessorUserProfileId(
            agencyProfile.userId
            );

    let agencyTenantProfileIdArray =
        agencyLeaseContractArray.map(
            leaseContract => leaseContract.tenantUserProfileId
            );

    let [
        ticketArray,
        ticketStatusArray,
        tenantProfileArray,
        paymentArray,
        rentalReviewArray
    ] =
        await Promise.all(
            [
                ticketService.getTicketArrayByAgency( agency ),
                ticketStatusService.getTicketStatusArray(),
                profileService.getProfileArrayByUserIdArray( agencyTenantProfileIdArray ),
                paymentService.getPaymentArrayByPayeeUserProfilerId( id ),
                rentalReviewService.getRentalReviewArrayByAgency( agency )
            ]
            );

    let result =
    {
        agencyData: { agencyPropertyArray, agencyLeaseContractArray },
        ticketData: getTicketData( ticketArray, ticketStatusArray ),
        profileData: getProfileData( tenantProfileArray ),
        paymentData: await getIncomeData( paymentArray ),
        reviewData: getReviewData( rentalReviewArray )
    };

    return result;
}

// ~~

async function getAdministratorData()
{
    let
    [
        documentArray,
        validationStatusArray,
        profileArray,
        payment,
        rentalReview,
        userReview
    ] = await Promise.all(
        [
            documentService.getAllDocumentArray(),
            validationStatusService.getCachedValidationStatusArray(),
            profileService.getProfileArray(),
            paymentService.getPaymentArray(),
            rentalReviewService.getRentalReviewArray(),
            userReviewService.getUserReviewArray()
        ]
        );

    let paymentData = await getIncomeData( payment.paymentArray );

    return (
        {
            documentData: getDocumentData( documentArray, validationStatusArray ),
            profileData: getProfileData( profileArray ),
            paymentData: paymentData,
            reviewData: getReviewData( rentalReview.rentalReviewArray, userReview.userReviewArray )
        }
        );
}

// ~~

async function getDashboardData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let { agency = null, id = null } = request.body || {};

    let result = agency && id
        ? await getAgencyData( agency, id )
        : await getAdministratorData();

    return ( result );
}

// ~~

async function addVisit(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let visit = request.body.visit;

    if ( visit === undefined )
    {
        return reply.status( 400 ).send( 'Invalid visit' );
    }

    await crudVisit( visitService.addVisit( visit ), reply );
}

async function setVisit(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let visit = request.body.visit;
    let visitId = visit;

    if ( visit === undefined )
    {
        return reply.status( 400 ).send( 'Invalid visit' );
    }

    await crudVisit( visitService.setVisit( visit, visitId ), reply );
}

async function removeVisit(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let visitId = request.body.visitId;

    if ( visitId === undefined )
    {
        return reply.status( 400 ).send( 'Invalid visit ID' );
    }

    await crudVisit( visitService.removeVisit( visitId ), reply );
}

export
{
    addVisit,
    setVisit,
    removeVisit,
    getDashboardData,
    getUserReviewValue
}

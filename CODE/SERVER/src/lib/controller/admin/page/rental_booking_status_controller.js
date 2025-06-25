// -- IMPORTS

import { AppError } from '../../../utils/app_error';
import { hasUserPermission, isNullOrUndefined } from '../../../base';
import { rentalBookingStatusService } from '../../../service/rental_booking_status_service';

// -- FUNCTIONS

async function getRentalBookingStatus(
    request,
    reply
    )
{
    let rentalBookingStatusArray = await rentalBookingStatusService.getCachedRentalBookingStatusArray();

    return reply.status( 200 ).send( { rentalBookingStatusArray } );
}

// ~~

async function addRentalBookingStatus(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let rentalBookingStatus = await rentalBookingStatusService.addRentalBookingStatus( body.rentalBookingStatus );

    return reply.status( 200 ).send( { rentalBookingStatus } );
}

// ~~

async function setRentalBookingStatus(
    request,
    reply
    )
{
    let { rentalBookingStatusId } = request.params;
    let body = JSON.parse( request.body );
    let { rentalBookingStatusData } = body;

    if ( !rentalBookingStatusId || !rentalBookingStatusData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetRentalBookingStatusPermission = await hasUserPermission( 'set-rental-booking-status', profile.roleSlugArray );

    if ( !hasSetRentalBookingStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    let rentalBookingStatus = await rentalBookingStatusService.setRentalBookingStatusById(
        {
            number: rentalBookingStatusData.number,
            name: rentalBookingStatusData.name
        },
        rentalBookingStatusId
        );

    return reply.status( 200 ).send( { message: 'rental-booking-status-updated-message', rentalBookingStatus } );
}

// ~~

async function deleteRentalBookingStatus(
    request,
    reply
    )
{
    let { rentalBookingStatusId } = request.params;

    if ( !rentalBookingStatusId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveRentalBookingStatusPermission = await hasUserPermission( 'remove-rental-booking-status', profile.roleSlugArray );

    if ( !hasRemoveRentalBookingStatusPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await rentalBookingStatusService.removeRentalBookingStatusById( rentalBookingStatusId );

    return reply.status( 200 ).send( { message: 'rental-booking-status-deleted-message' } );
}

export
{
    getRentalBookingStatus,
    addRentalBookingStatus,
    setRentalBookingStatus,
    deleteRentalBookingStatus
}

// -- IMPORTS

import { profileService } from '../../../service/profile_service';
import { propertyService } from '../../../service/property_service';
import { rentalAnnouncementService } from '../../../service/rental_announcement_service';

// -- FUNCTIONS

async function getRentalAnnouncement(
    request,
    reply
    )
{
    let rentalAnnouncementArray = await rentalAnnouncementService.getRentalAnnouncementArray();

    let userIdSet = new Set();
    let propertyIdSet = new Set();

    for ( let rentalAnnouncement of rentalAnnouncementArray )
    {
        userIdSet.add( rentalAnnouncement.userId );
        propertyIdSet.add( rentalAnnouncement.propertyId );
    }

    let profileArray = await profileService.getProfileArrayByUserIdArray( Array.from( userIdSet ) );
    let propertyArray = await propertyService.getPropertyArrayByIdArray( Array.from( propertyIdSet ) );

    return reply.status( 200 ).send( { rentalAnnouncementArray, profileArray, propertyArray } );
}

// ~~

async function setRentalAnnouncement(
    request,
    reply
    )
{
    let rentalAnnouncementId = request.params.id;
    let body = JSON.parse( request.body );
    let rentalAnnouncement = await rentalAnnouncementService.setRentalAnnouncementById( body.rentalAnnouncement, rentalAnnouncementId );

    return reply.status( 200 ).send( { rentalAnnouncement } );
}

// ~~

async function addRentalAnnouncement(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let rentalAnnouncement = await rentalAnnouncementService.addRentalAnnouncement( body.rentalAnnouncement );

    return reply.status( 200 ).send( { rentalAnnouncement } );
}

// ~~

async function deleteRentalAnnouncement(
    request,
    reply
    )
{
    let rentalAnnouncementId = request.params.id;
    await rentalAnnouncementService.removeRentalAnnouncementById( rentalAnnouncementId );

    return reply.status( 200 ).send( { message: 'Rental announcement deleted' } );
}

export
{
    getRentalAnnouncement,
    setRentalAnnouncement,
    addRentalAnnouncement,
    deleteRentalAnnouncement
}

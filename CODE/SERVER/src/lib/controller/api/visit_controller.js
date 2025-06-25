//  -- IMPORTS

import { getLocalizedText, getMap, getRandomTuid, getTimeZoneFromLocation } from 'senselogic-gist';
import { visitService } from '../../service/visit_service';
import { notificationCenterService } from '../../service/notification_center_service';
import { profileService } from '../../service/profile_service';
import { propertyService } from '../../service/property_service';
import { notificationService } from '../../service/notification_service';

// -- FUNCTIONS

export async function getAvailableVisitArrayByUserId(
    request,
    reply
    )
{
    let body = JSON.parse( request.body );
    let availableVisitArray = await visitService.getAvailableRentalArrayVisitByUserIdAndCurrentDate( body.userId );

    return reply.status( 200 ).send( { availableVisitArray: availableVisitArray } );
}

// ~~

export async function setVisit(
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

    let body = JSON.parse( request.body );
    let visit = await visitService.getVisitById( body.visitId );

    if ( body.visit.status === 'pending' && visit.status !== 'available' )
    {
        return reply.status( 500 ).send( { error: 'time-slot-already-booked-error-message' } );
    }

    let notificationType;

    if ( body.visit.status === 'booked' )
    {
        notificationType = 'visit-confirmation';
    }
    else
    {
        notificationType ='visit-request';
    }

    if ( body.previousVisitId !== undefined )
    {
        // resets previous rental visit to default in case of a reschedule
        await visitService.setVisit( { status: 'available', visitorUserId: null, propertyId: null }, body.previousVisitId );

        if ( body.visitId === body.previousVisitId )
        {
            notificationType = 'visit-cancellation';
        }
        else if ( body.visit.status === 'rescheduled-by-host' )
        {
            notificationType = 'host-visit-reschedule';
        }
        else
        {
            notificationType = 'guest-visit-reschedule'
        }
    }

    let propertyId = body.visit.propertyId ?? visit.propertyId;
    let visitorUserId = body.visit.visitorUserId ?? visit.visitorUserId;
    let [ profileArray, property ]
        = await Promise.all(
            [
                profileService.getProfileArrayByUserIdArray( [ visitorUserId, visit.userId ] ),
                propertyService.getPropertyById( propertyId )
            ]
            );

    if ( body.visitId !== body.previousVisitId )
    {
        visit = await visitService.setVisit( body.visit, body.visitId );
    }

    let profileByUserIdMap = getMap( profileArray, 'userId' );
    let hostProfile = profileByUserIdMap[ visit.userId ];
    let guestProfile = profileByUserIdMap[ visitorUserId ];
    let propertyTimeZone = getTimeZoneFromLocation( property.latitude, property.longitude, property.countryCode );
    let visitDate = new Date( visit.date + 'T' + visit.time + 'Z' );
    notificationService.sendTemplateNotification(
        notificationType + '-host',
        {
            profile: hostProfile,
            guestName: guestProfile.firstName + ' ' + guestProfile.lastName,
            propertyName: getLocalizedText( property.title, hostProfile.languageTag ?? 'en' ),
            visitDate:
                visitDate.toLocaleDateString(
                    hostProfile.languageTag ?? 'en',
                    {
                        timeZone: propertyTimeZone,
                        dateStyle: 'medium'
                    }
                    ),
            visitTime:
                    visitDate.toLocaleTimeString(
                        hostProfile.languageTag ?? 'en',
                        {
                            timeZone: propertyTimeZone,
                            timeStyle: 'short'
                        }
                        ),
            visitRequestLink: request.headers.origin + '/dashboard/visit-request/' + visit.id
        }
        );
    notificationService.sendTemplateNotification(
        notificationType + '-guest',
        {
            profile: guestProfile,
            guestName: guestProfile.firstName + ' ' + guestProfile.lastName,
            propertyName: getLocalizedText( property.title, guestProfile.languageTag ?? 'en' ),
            visitDate:
                visitDate.toLocaleDateString(
                    guestProfile.languageTag ?? 'en',
                    {
                        timeZone: propertyTimeZone,
                        dateStyle: 'medium'
                    }
                    ),
            visitTime:
                visitDate.toLocaleTimeString(
                    guestProfile.languageTag ?? 'en',
                    {
                        timeZone: propertyTimeZone,
                        timeStyle: 'short'
                    }
                    ),
            propertyLink: request.headers.origin + '/property/' + propertyId
        }
        );

    return reply.status( 200 ).send( { visit } );
}

// ~~

export async function addVisit(
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

    let body = JSON.parse( request.body );
    let currentDateMilisecondCount = Date.now();
    let newAvailableDateTimeSet = new Set( body.availableDateTimeArray );
    let currentAvailableVisitArray
        = await visitService.getVisitArrayByUserIdAndStatus( request.profileLogged.userId, 'available' );
    let deletedVisitIdArray = [];

    for ( let visit of currentAvailableVisitArray )
    {
        let [ hour, minute ] = visit.time.split( ':' );
        let dateTimeISOString
            = new Date(
                new Date( visit.date )
                    .setUTCHours(
                        Number( hour ),
                        Number( minute ),
                        0,
                        0
                        )
                )
                .toISOString();

        if ( new Date( dateTimeISOString ).getTime() < currentDateMilisecondCount )
        {
            deletedVisitIdArray.push( visit.id );
        }

        if ( !newAvailableDateTimeSet.has( dateTimeISOString ) )
        {
            deletedVisitIdArray.push( visit.id );
        }
        else
        {
            // deletes pre-existing values from the array of rental visits to insert
            newAvailableDateTimeSet.delete( dateTimeISOString )
        }
    }

    let lastDeletedIndex = 0;

    while ( lastDeletedIndex < deletedVisitIdArray.length )
    {
        let increment = 100;

        if ( lastDeletedIndex + increment > deletedVisitIdArray.length )
        {
            increment = deletedVisitIdArray.length - lastDeletedIndex;
        }

        await visitService.batchRemoveVisitByIdArray(
            deletedVisitIdArray.slice( lastDeletedIndex, lastDeletedIndex + increment )
            );

        lastDeletedIndex = lastDeletedIndex + increment;
    }

    let newVisitArray = [];

    for ( let availableDateTime of Array.from( newAvailableDateTimeSet ) )
    {
        newVisitArray.push(
            {
                id: getRandomTuid(),
                userId: request.profileLogged.userId,
                date: availableDateTime.split( 'T' )[ 0 ],
                time: availableDateTime.split( 'T' )[ 1 ],
                status: 'available'
            }
            );
    }

    newVisitArray = await visitService.addVisit( newVisitArray );

    return reply.status( 200 ).send( { newVisitArray } );
}

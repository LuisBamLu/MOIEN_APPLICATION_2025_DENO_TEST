// -- IMPORTS

import { getRandomTuid } from 'senselogic-gist';
import { createBedDataArray, createSpaceDataArray } from '../../propertyUtils';
import { propertyService } from '../../service/property_service';
import { bedService } from '../../service/bed_service';
import { spaceService } from '../../service/space_service';
import { featureService } from '../../service/feature_service';
import { rentalAnnouncementService } from '../../service/rental_announcement_service';

// -- FUNCTIONS

export async function upsertAd(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let userId = request.profileLogged.userId;
    let directory = `user/${ userId }/`;
    let body = JSON.parse( request.body );
    let type;

    if ( body.type )
    {
        type = body.type;
    }

    let propertyId;
    let property = body.property;
    let propertyFeatureByTypeIdMap = body.propertyFeatureByTypeIdMap;
    let roomMap = body.roomMap;

    if ( type === 'edit' )
    {
        let _property = await propertyService.getPropertyById( property.id );

        if ( _property.userId !== userId && _property.managerUserId !== userId )
        {
            return reply.status( 403 ).send( { error: 'unauthorized-error-message' } );
        }

        propertyId = _property.id;
    }
    else
    {
        propertyId = getRandomTuid();
        property.userId = userId;
        property.id = propertyId;
    }

    let featureArray = [];

    for ( let feature of Object.values( propertyFeatureByTypeIdMap ) )
    {
        if ( !feature.id )
        {
            feature.id = getRandomTuid();
        }

        if ( !feature.propertyId )
        {
            feature.propertyId = propertyId;
        }

        if ( !feature.userId )
        {
            feature.userId = userId;
        }

        if ( feature.typeId !== 'check-in-time' )
        {
            feature.value = String( feature.value );
        }

        featureArray.push( feature );
    }

    let spaceArray = await createSpaceDataArray( roomMap, propertyFeatureByTypeIdMap, propertyId, userId );
    let bedArray = createBedDataArray( spaceArray );

    if ( type === 'edit' )
    {
        delete property.featureByIdMap;
        delete property.featureArray;

        property =
            {
                ...property,
                imagePath: property.imagePathArray[ 0 ],
            };

        await propertyService.setPropertyById( property, propertyId )
    }
    else
    {
        property =
            {
                ...property,
                date: new Date().toISOString().split( 'T' )[ 0 ],
                id: propertyId,
                imagePath: property.imagePathArray[ 0 ],
                currencyCode: 'EUR'
            };

        await propertyService.addProperty( property );
    }

    await featureService.upsertFeatureArray( featureArray );

    if ( type === 'edit' )
    {
        let { _, error } = await spaceService.removeSpaceByPropertyId( propertyId );

        if ( error !== null )
        {
            return reply.status( 500 ).send( { error: 'property-warning-space-update-failed' } )
        }
    }

    await spaceService.addSpace( spaceArray );

    if ( type === 'edit' )
    {
        let { _, error } = await bedService.removeBedByPropertyId( propertyId );

        if ( error !== null )
        {
            return reply.status( 500 ).send( { error:'property-warning-bed-update-failed' } );
        }
    }

    await bedService.addBed( bedArray );
    let rentalAnnouncementArray = await rentalAnnouncementService.getRentalAnnouncementArrayByPropertyId( property.id );

    if ( rentalAnnouncementArray.length > 0 )
    {
        for ( let rentalAnnouncement of rentalAnnouncementArray )
        {
            if ( rentalAnnouncement.userId === request.profileLogged.userId )
            {
                await rentalAnnouncementService.setRentalAnnouncementById(
                    {
                        title: property.title,
                        description: property.description,
                    }
                    );

                break;
            }
        }
    }
    else
    {
        await rentalAnnouncementService.addRentalAnnouncement(
            {
                id: getRandomTuid(),
                propertyId: property.id,
                title: property.title,
                description: property.description,
                userId: request.profileLogged.userId,
                creationTimestamp: new Date().toISOString(),
                updateTimestamp: new Date().toISOString()
            }
            );
    }

    return reply.status( 200 ).send( propertyId )
}

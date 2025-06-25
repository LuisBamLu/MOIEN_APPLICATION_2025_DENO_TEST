// -- IMPORTS

import { bedService } from '../../service/bed_service';
import { bedTypeService } from '../../service/bed_type_service';
import { documentTypeService } from '../../service/document_type_service';
import { energyDiagnosisService } from '../../service/energy_diagnosis_service';
import { heatingTypeService } from '../../service/heating_type_service';
import { propertyService } from '../../service/property_service';
import { spaceService } from '../../service/space_service';
import { spaceTypeService } from '../../service/space_type_service';

// -- FUNCTIONS

export async function getNewAdData(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let [ heatingTypeArray, energyDiagnosisArray, spaceTypeMap, bedTypeArray, documentTypeArray ]
        = await Promise.all(
            [
                heatingTypeService.getCachedHeatingTypeArray(),
                energyDiagnosisService.getCachedEnergyDiagnosisArray(),
                spaceTypeService.getCachedSpaceTypeByIdMap(),
                bedTypeService.getCachedBedTypeArray(),
                documentTypeService.getCachedDocumentTypeArray()
            ]
            );

    return reply
        .status( 200 )
        .send(
            {
                heatingTypeArray,
                energyDiagnosisArray,
                spaceTypeMap,
                bedTypeArray,
                documentTypeArray
            }
            );
}

export async function getAdByPropertyId(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    let [ heatingTypeArray, energyDiagnosisArray, spaceTypeMap, bedTypeArray, documentTypeArray, property ]
        = await Promise.all(
            [
                heatingTypeService.getCachedHeatingTypeArray(),
                energyDiagnosisService.getCachedEnergyDiagnosisArray(),
                spaceTypeService.getCachedSpaceTypeByIdMap(),
                bedTypeService.getCachedBedTypeArray(),
                documentTypeService.getCachedDocumentTypeArray(),
                propertyService.getPropertyById( request.params.propertyId )
            ]
            );

    if ( request.profileLogged.userId !== property?.userId
         && request.profileLogged.userId !== property?.managerUserId )
    {
        return reply.send( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let [ bedArray, spaceArray ]
        = await Promise.all(
            [
                bedService.getBedArrayByPropertyId( property.id ),
                spaceService.getSpaceArrayByPropertyId( property.id )
            ]
            );

    return reply
        .status( 200 )
        .send(
            {
                heatingTypeArray,
                energyDiagnosisArray,
                spaceTypeMap,
                bedTypeArray,
                property,
                bedArray,
                spaceArray,
                documentTypeArray
            }
            );
}

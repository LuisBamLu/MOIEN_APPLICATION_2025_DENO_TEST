// -- IMPORTS

import { getJsonObject } from 'senselogic-gist';
import { energyDiagnosisService } from '../../../service/energy_diagnosis_service';
import { hasUserPermission, isNullOrUndefined } from '../../../base';

// -- FUNCTIONS

async function getEnergyDiagnosis(
    request,
    reply
    )
{
    return (
        {
            energyDiagnosisArray : await energyDiagnosisService.getCachedEnergyDiagnosisArray()
        }
        );
}

// ~~

async function setEnergyDiagnosis(
    request,
    reply
    )
{
    let { energyDiagnosisId } = request.params;
    let body = getJsonObject( request.body );
    let diagnosisData = body;

    if ( !energyDiagnosisId || !diagnosisData )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasSetDiagnosisPermission = await hasUserPermission( 'set-diagnosis', profile.roleSlugArray );

    if ( !hasSetDiagnosisPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await energyDiagnosisService.setEnergyDiagnosis(
        {
            name : diagnosisData.name,
            number : diagnosisData.number,
            maximumValue : diagnosisData.maximumValue,
            minimumValue : diagnosisData.minimumValue
        },
        energyDiagnosisId
        );

    return reply.send( { message: 'energy-diagnosis-updated-message' } );
}

// ~~

async function addEnergyDiagnosis(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let energyDiagnosisArray = await energyDiagnosisService.addEnergyDiagnosis( body.energyDiagnosis );

    return reply.status( 200 ).send( { energyDiagnosis: energyDiagnosisArray[ 0 ] } );
}

// ~~

async function removeEnergyDiagnosis(
    request,
    reply
    )
{
    let { energyDiagnosisId } = request.params;

    if ( !energyDiagnosisId )
    {
        throw new AppError( 'bad-request' );
    }

    let profile = request.profileLogged;

    if ( isNullOrUndefined( profile ) )
    {
        throw new AppError( 'unauthenticated-error-message', 401 );
    }

    let hasRemoveDiagnosisPermission = await hasUserPermission( 'remove-diagnosis', profile.roleSlugArray );

    if ( !hasRemoveDiagnosisPermission )
    {
        throw new AppError( 'unauthorized-error-message', 403 );
    }

    await energyDiagnosisService.removeEnergyDiagnosis( energyDiagnosisId );

    return reply.send( { message: 'energy-diagnosis-deleted-message' } );
}

export
{
    getEnergyDiagnosis,
    setEnergyDiagnosis,
    addEnergyDiagnosis,
    removeEnergyDiagnosis
}

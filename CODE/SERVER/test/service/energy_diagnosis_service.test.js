// -- IMPORTS

import { logError, getMapById } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class EnergyDiagnosisService
{
    // -- CONSTRUCTORS

    constructor (
        )
    {
        this.cachedEnergyDiagnosisArray = null;
        this.cachedEnergyDiagnosisByIdMap = null;
        this.cachedEnergyDiagnosisTimestamp = 0
    }

    // -- INQUIRIES

    async getEnergyDiagnosisArray(
        )
    {
        let { data, error } = await databaseService.getClient()
            .from( 'ENERGY_DIAGNOSIS' )
            .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async getCachedEnergyDiagnosisArray(
        )
    {
        if ( this.cachedEnergyDiagnosisArray === null
             || Date.now() > this.cachedEnergyDiagnosisTimestamp + 300000 )
        {
            this.cachedEnergyDiagnosisArray = await this.getEnergyDiagnosisArray();
            this.cachedEnergyDiagnosisByIdMap = null;
            this.cachedEnergyDiagnosisTimestamp = Date.now()
        }

        return this.cachedEnergyDiagnosisArray;
    }

    // ~~

    async getCachedEnergyDiagnosisByIdMap(
        )
    {
        if ( this.cachedEnergyDiagnosisByIdMap === null )
        {
            await this.getCachedEnergyDiagnosisArray();
            this.cachedEnergyDiagnosisByIdMap = getMapById( this.cachedEnergyDiagnosisArray );
        }

        return this.cachedEnergyDiagnosisByIdMap;
    }

    // ~~

    clearCache(
        )
    {
        this.cachedEnergyDiagnosisArray = null;
        this.cachecEnergyDiagnosisMap = null;
    }

    // ~~

    async addEnergyDiagnosis(
        energyDiagnosis
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ENERGY_DIAGNOSIS' )
                .insert( energyDiagnosis )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }

    // ~~

    async setEnergyDiagnosis(
        energyDiagnosis,
        energyDiagnosisId
        )
    {
        this.clearCache();

        let { data, error }
            = await databaseService.getClient()
                .from( 'ENERGY_DIAGNOSIS' )
                .update( energyDiagnosis )
                .eq( 'id', energyDiagnosisId )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeEnergyDiagnosis(
        energyDiagnosisId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'ENERGY_DIAGNOSIS' )
                .delete()
                .eq( 'id', energyDiagnosisId );

        if ( error !== null )
        {
            logError( error );
        }

        this.clearCache();

        return data;
    }
}

export let energyDiagnosisService
    = new EnergyDiagnosisService();

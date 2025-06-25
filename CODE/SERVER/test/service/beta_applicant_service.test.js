// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service.test';

// -- TYPES

class BetaApplicantService
{
    // -- INQUIRIES

    async getBetaApplicantArray(
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BETA_APPLICANT' )
                .select();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getBetaApplicantByEmail(
        email
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BETA_APPLICANT' )
                .select()
                .eq( 'email', email );

        if ( error !== null )
        {
            logError( error );
        }

        if ( data !== null )
        {
            return data[ 0 ];
        }
        else
        {
            return null;
        }
    }

    // -- OPERATIONS

    async addBetaApplicant(
        betaApplicant
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'BETA_APPLICANT' )
                .insert( betaApplicant )
                .select()
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data
    }
}

// -- VARIABLES

export let betaApplicantService
    = new BetaApplicantService();

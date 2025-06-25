// -- IMPORTS

import { getLogicalFilePath, getRandomTuid, logError } from 'senselogic-gist';
import { handleUploadFiles } from '../utils/fileUtils';
import { propertyService } from './property_service.test';
import { featureService } from './feature_service';
import * as fileSystem from 'fs';
// import * as responseData from '../../../../../DOCUMENT/PROGETIS/api_result_2.json';
import sharp from 'sharp';

// -- TYPES

class ProgetisRentalAnnouncementPlatformService
{
    async getToken(
        agencyUuid
        )
    {
        let response =
            await fetch(
                'https://middleware-production.easy2pilot-v8.com/api/' + agencyUuid + '/token',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
                    body: JSON.stringify( { login: 'CrossFunding', password: 'Pj587TdCx' } )
                }
                );

        if ( response.ok )
        {
            let data = await response.json();

            return data.token;
        }
        else
        {
            console.error( 'Error fetching token' );
            console.log( response );

            return null;
        }
    }

    // ~~

    async getProperties(
        agencyUuid
        )
    {
        let token = await this.getToken( agencyUuid );
        let response =
            await fetch(
                'https://middleware-production.easy2pilot-v8.com/api/' + agencyUuid + '/annonces',
                {
                    method: 'GET',
                    headers: { 'Authorization': 'Bearer ' + token }
                }
                );

        let data = await response.json();
        // let data = responseData.Response.data;

        if ( response.ok )
        {
            let data = await response.json();

            return data.token;
        }
        else
        {
            console.error( 'Error fetching properties' );
            console.log( response );

            return null;
        }
    }

    // ~~

    // async updateAgencyProperties(
    //     agencyUuid,
    //     userId
    //     )
    // {
    //     try
    //     {
    //         // let token = await this.getToken( agencyUuid );
    //         let token = true;

    //         if ( token )
    //         {
    //             // let properties = await this.getProperties( agencyUuid, token );
                // let properties = responseData.Response.data;

    //             return null;
    //         }
    //         else
    //         {
    //             return null;
    //         }
    //     }
    //     catch ( error )
    //     {
    //         console.error( 'Error updating properties:', error );
    //     }
}

// -- VARIABLES

export let progetisService
    = new ProgetisRentalAnnouncementPlatformService();

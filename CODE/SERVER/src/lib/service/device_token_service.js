// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class DeviceTokenService
{
    // -- INQUIRIES

    async getDeviceTokenByUserId(
        userId
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DEVICE_TOKEN' )
                .select()
                .eq( 'userId', userId )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async getDeviceTokenByUserIdAndDeviceType(
        userId,
        deviceType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DEVICE_TOKEN' )
                .select()
                .eq( 'userId', userId )
                .eq( 'deviceType', deviceType )
                .single();

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // -- OPERATIONS

    async addDevice(
        device
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DEVICE_TOKEN' )
                .upsert( device );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async removeDeviceByType(
        userId,
        deviceType
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .from( 'DEVICE_TOKEN' )
                .delete()
                .eq( 'userId', userId )
                .eq( 'deviceType', deviceType );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let deviceTokenService
    = new DeviceTokenService();

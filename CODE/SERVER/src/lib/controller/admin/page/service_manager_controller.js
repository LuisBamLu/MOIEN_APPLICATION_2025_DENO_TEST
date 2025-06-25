// -- IMPORTS

import { AppError } from '../../../app_error';
import { getUniqueValues } from '../../../base';
import { serviceManagerService } from '../../../service/service_manager_service';
import { profileService } from '../../../service/profile_service';
import { logError } from 'senselogic-gist';

// -- FUNCTIONS

async function getServiceManager(
    request,
    reply
    )
{
   try
   {
        let [
                serviceArray,
                serviceTypeArray,
            ] = await Promise.all(
                [
                    serviceManagerService.getServiceArray(),
                    serviceManagerService.getCachedServiceTypeArray()
                ]
                );
        let [ userIdArray ] = getUniqueValues( serviceArray, 'userId' );
        let profileArray = await profileService.getProfileArrayByUserIdArray( userIdArray );

        return reply.send(
            {
                serviceArray,
                serviceTypeArray,
                profileArray
            }
            );
   }
   catch( error )
   {
        logError( error );

        throw new AppError( 'bad-request' );
   }
}

export
{
    getServiceManager
}

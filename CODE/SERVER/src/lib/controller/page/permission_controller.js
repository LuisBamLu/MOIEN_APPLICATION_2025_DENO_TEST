// -- IMPORTS

import { AppError } from '../../app_error';
import { isNullOrUndefined } from '../../base';
import { userRoleService } from '../../service/user_role_service';

// -- FUNCTIONS

export async function getPermission(
    request,
    reply
    )
{
    try
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        let profile = request.profileLogged;

        if ( isNullOrUndefined( profile ) )
        {
            throw new AppError( 'unauthenticated-error-message', 401 );
        }

        let permissionSlugArray = await userRoleService.getPermissionSlugArrayFromRoleSlugArray( profile.roleSlugArray );

        return (
            {
                permissionSlugArray
            }
            );
    }
    catch ( error )
    {
        throw new AppError( error.message );
    }
}

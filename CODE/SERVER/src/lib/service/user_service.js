// -- IMPORTS

import { logError } from 'senselogic-gist';
import { databaseService } from './database_service';

// -- TYPES

class UserService
{
    // -- OPERATIONS

    async setUserEmail(
        email,
        redirectTo
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .auth
                .updateUser(
                    {
                        email: email,
                        data:
                            {
                                redirectTo: redirectTo
                            }
                    }
                    );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async confirmUserEmailChange(
        tokenHash,
        type
        )
    {
        let { data, error }
            = await databaseService.getClient()
                .auth
                .verifyOtp(
                    {
                        token_hash: tokenHash,
                        type: type
                    }
                    );

        if ( error )
        {
            logError( error );
        }

        return data;
    }
}

// -- VARIABLES

export let userService
    = new UserService();

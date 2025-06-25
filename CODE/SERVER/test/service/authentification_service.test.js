// -- IMPORTS

import { logError } from 'senselogic-gist';
import { supabaseService } from './supabase_service';

// -- TYPES

class AuthentificationService
{
    // -- OPERATIONS

    async signInUser(
        email,
        URL
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .signInWithOtp(
                    {
                        email: email,
                        options:
                            {
                                data:
                                    {
                                        redirectTo: URL
                                    }
                            }
                    }
                    );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error };
    }

    // ~~

    async signUpUser(
        email,
        password,
        redirectTo
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .signUp(
                    {
                        email: email,
                        password: password,
                        options:
                            {
                                data:
                                    {
                                        redirectTo: redirectTo
                                    }
                            }
                    }
                    );

        if ( error !== null )
        {
            logError( error );
        }

        return { data, error } ;
    }

    // ~~

    async verifyUserSignUp(
        token_hash
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .verifyOtp(
                    {
                        token_hash,
                        type: 'signup'
                    }
                    );

         if ( error )
         {
            logError( error );
         }

         return data;
    }

    // ~~

    async verifyUserSignInToken(
        email,
        token
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .verifyOtp(
                    {
                        token,
                        email,
                        type: 'email'
                    }
                    );

        if ( error )
        {
            logError( error );

            return { data, error }
        }

        return { data, error };
    }

    // ~~

    async signOutUser(
        )
    {
        let { error }
            = await supabaseService.getClient()
                .auth
                .signOut();

        if ( error !== null )
        {
            logError( error );
        }
    }

    // ~~

    async requestUserEmailChange(
        email
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .updateUser( { email } );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async confirmEmailChange(
        token_hash,
        type
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .verifyOtp(
                    {
                        token_hash: token_hash,
                        type: type
                    }
                    );

        if ( error )
        {
            logError( error );
        }

        return data;
    }

    // ~~

    async signInWithPassword(
        email,
        password
        )
    {
        let { data, error }
            = await supabaseService.getClient()
                .auth
                .signInWithPassword(
                    {
                        email,
                        password
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

export let authentificationService
    = new AuthentificationService();

// -- IMPORTS

import { createServerClient, parseCookieHeader, serializeCookieHeader } from '@supabase/ssr';
import { logError } from 'senselogic-gist';

// -- STATEMENTS

class SupabaseService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.client = null;
    }

    // -- OPERATIONS

    initalizeDatabaseClient(
        request,
        reply
        )
    {
        const serviceIntance = this;
        this.client = createServerClient(
            process.env.MOIEN_DATABASE_URL,
            process.env.MOIEN_DATABASE_KEY,
            {
                cookies:
                {
                    getAll()
                    {
                        let parseData = parseCookieHeader( request.headers.cookie ?? '' );

                        return parseCookieHeader( request.headers.cookie ?? '' );
                    },
                    setAll( cookiesToSet )
                    {
                        cookiesToSet.forEach(
                            ( { name, value, options } ) =>
                            {
                                let serializedCookie = serializeCookieHeader( name, value, options );

                                serviceIntance.serializedCookie = serializedCookie;
                                serviceIntance.authTokenCodeVerifier = value;
                                return reply.setCookie( name, value, options );
                            }
                            );
                    }
                },
                auth:
                {
                    flowType: 'pkce'
                }
            }
            );
    }

    // ~~

    getSerializedCookie(
        )
    {
        return this.serializedCookie;
    }

    // ~~

    getAuthToken(
        )
    {
        return this.authTokenCodeVerifier;
    }

    // ~~

    getClient(
        request,
        reply
        )
    {
        return this.client;
    }

    // ~~

    async uploadFile(
        localFile,
        storageFilePath,
        isGlobal = false,
        storageFileIsOverwritten = false
        )
    {
        let { data, error } =
            await this.getClient()
                .storage
                .from( isGlobal ? 'global' : 'upload' )
                .upload(
                    storageFilePath,
                    localFile,
                    {
                        cacheControl: '3600',
                        upsert: storageFileIsOverwritten
                    }
                    );

        if ( error !== null )
        {
            logError( error );
        }

        return data;
    }

    async deleteFile(
        filesArray,
        isGlobal = false
        )
    {
        const { data, error } = await supabaseService.getClient()
            .storage
            .from( isGlobal ? 'global' : 'upload' )
            .remove( filesArray );

        if ( error )
        {
            throw error;
        }

        return data;
    }
}

// -- VARIABLES

export let supabaseService
    = new SupabaseService();

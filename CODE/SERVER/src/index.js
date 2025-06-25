// -- IMPORTS

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import Fastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifyStatic from '@fastify/static';
import fastifyCookie from '@fastify/cookie';
import fastifyFormBody from '@fastify/formbody';
import fastifyMultipart from '@fastify/multipart';
import { WebSocketServer } from 'ws';
import { supabaseService } from './lib/service/supabase_service';
import { profileService } from './lib/service/profile_service';
import { mangopayService } from './lib/service/mangopay_service';
import { notificationCenterService } from './lib/service/notification_center_service';
import { AppError } from './lib/utils/app_error';
import { handleUpdateNewMessageCount, handleWebSocketAddMessage, handleWebSocketMarkMessageAsRead } from './lib/controller/api/message_controller';
import { adminPageRoutes } from './lib/routes/admin/page';
import { adminApiRoutes, adminAuthRoutes } from './lib/routes/admin/api';
import { pageRoutes } from './lib/routes/page';
import { apiRoutes, authRoutes, progretisRoutes } from './lib/routes/api';
import { getJsonObject } from 'senselogic-gist';
import { generateSitemap } from './lib/base';
import mailchimp from '@mailchimp/mailchimp_marketing';
import { handleWebSocketPointsOfInterest } from './lib/controller/page/property_page_controller';

// -- FUNCTIONS

async function getUserFromAuthToken(
    authToken
    )
{
    try
    {
        let [ , base64Token ] = authToken.split( '-' );
        let decodedTokenAsString = atob( base64Token );
        let decodedToken = getJsonObject( decodedTokenAsString );
        let { access_token: accessToken, user } = decodedToken;

        return user;
    }
    catch ( error )
    {
        // logError( error );

        let { data: { user } } = await supabaseService.getClient().auth.getUser();

        return user || null;
    }
}

// ~~

async function getProfileForUserId(
    userId,
    )
{
    return await profileService.getCachedProfileByUserId( userId );
}

// -- STATEMENTS

let fastify = Fastify( { logger: true } );

dotenv.config();

mailchimp.setConfig(
    {
        apiKey: process.env.MAILCHIMP_API_KEY,
        server: process.env.MAILCHIMP_API_SERVER
    }
    );

fastify.register(
    fastifyCors,
    {
        origin: '*'
    }
    );

fastify.register(
    fastifyStatic,
    {
        root : path.join( __dirname, 'public' ),
        prefix : '/',
        decorateReply: false
    }
    );

fastify.register(
    fastifyStatic,
    {
        root : path.join( __dirname, 'public/admin' ),
        prefix : '/admin/'
    }
    );

fastify.register(
    fastifyFormBody
    );

fastify.register(
    fastifyMultipart,
    {
        attachFieldsToBody: true,
        limits:
            {
                parts: 100000,
                fileSize: 10485760
            }
    }
    );

fastify.register(
    import( '@fastify/compress' ),
    {
        global: true,
        threshold: 1024,
        encodings: ['gzip', 'deflate']
    }
    );

fastify.register(
    fastifyCookie
    );

fastify.register(
    adminPageRoutes
    );

fastify.register(
    adminApiRoutes
    );

fastify.register(
    adminAuthRoutes
    );

fastify.register(
    authRoutes
    );

fastify.register(
    pageRoutes
    );

fastify.register(
    apiRoutes
    );

fastify.register(
    progretisRoutes
    );

fastify.addHook(
    'onRequest',
    async ( request, reply ) =>
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        supabaseService.initalizeDatabaseClient( request, reply );

        if ( Object.keys( request.cookies ).length )
        {
            let { data: { session } } = await supabaseService.getClient().auth.getSession();

            let userData = session?.user;

            if ( userData === undefined )
            {
                let { data: { user } } = await supabaseService.getClient().auth.getUser();

                userData = user;
            }

            generateSitemap();

            request.profileLogged = userData ? await getProfileForUserId( userData.id ) : null;
        }
        else
        {
            request.profileLogged = null;
        }
    }
    );

fastify.addHook(
    'onListen',
    async () =>
    {
        if ( process.env.NODE_ENV === 'production' )
        {
            await mangopayService.addHook(
                {
                    EventType: 'KYC_SUCCEEDED',
                    Url: 'https://www.moien.com/api/update-document-validation'
                }
                );

            await mangopayService.addHook(
                {
                    EventType: 'KYC_FAILED',
                    Url: 'https://www.moien.com/api/update-document-validation'
                }
                );

            await mangopayService.addHook(
                {
                    EventType: 'KYC_OUTDATED',
                    Url: 'https://www.moien.com/api/update-document-validation'
                }
                );
        }
    }
    );

fastify.post(
    '/api/get-session',
    async ( request, reply ) =>
    {
        reply.header( 'Access-Control-Allow-Credentials', true );
        reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

        if ( request.profileLogged !== null )
        {
            return reply.send( request.profileLogged );
        }

        return reply.send( null );
    }
    );

fastify.setNotFoundHandler(
    async ( request, reply ) =>
    {
        if ( request.url === '/admin'
             || request.url.startsWith( '/admin/' ) )
        {
            htmlFileName = 'public/admin/index.html';
        }
        else
        {
            htmlFileName = 'public/index.html';
        }

        let htmlFilePath = path.join( __dirname, htmlFileName );
        let htmlFileContent = fs.readFileSync( htmlFilePath, 'utf8' );
        reply.type( 'text/html' ).send( htmlFileContent );
    }
    );

fastify.setErrorHandler(
    ( error, _, reply ) =>
    {
        console.error( error );

        if ( error instanceof AppError )
        {
            return reply.code( error.statusCode ).send( { message : error.message } );
        }

        return reply.code( 500 ).send(
            {
                status : 'error',
                message : 'Internal server error - ' + error.message,
            }
            );
    }
    );

export let webSocketServer = new WebSocketServer( { noServer: true } );

fastify.server.on(
    'upgrade',
    ( request, socket, head ) =>
    {
        webSocketServer.handleUpgrade(
            request,
            socket,
            head,
            ( ws ) =>
            {
                webSocketServer.emit( 'connection', ws, request );
            }
            );
    }
    );

webSocketServer.on(
    'connection',
    function connection(
        ws,
        request
        )
    {
        let urlParam = new URLSearchParams( request.url.split( '?' )[ 1 ] );
        let userId = urlParam.get( 'userId' );
        notificationCenterService.socketByUserIdMap[ userId ] = ws;
        ws.isAlive = true;
        ws.userId = userId;

        ws.on(
            'pong',
            () =>
            {
                ws.isAlive = true;
            }
            );

        ws.on(
            'message',
            function incoming(
                message
                )
            {
                const data = getJsonObject( message );
                userId = data.userId;
                ws.userId = userId;

                switch ( data.type )
                {
                    case 'addMessage':
                        return handleWebSocketAddMessage( data, ws, webSocketServer );

                    case 'markMessageAsRead':
                        return handleWebSocketMarkMessageAsRead( data, ws, webSocketServer );

                    case 'getPointsOfInterest':
                        return handleWebSocketPointsOfInterest( data, ws, webSocketServer );

                    case 'updateMessageCount':
                        return handleUpdateNewMessageCount( data, ws, webSocketServer );
                }
            }
            );

        ws.on( 'error', console.error );

        ws.on(
            'close',
            function close(
                )
            {
                clearInterval( interval );
            }
            );
    }
    );

let interval = setInterval(
    function ping(
        )
    {
        for ( let webSocket of webSocketServer.clients )
        {
            if ( !webSocket.isAlive ) return webSocket.terminate();

            webSocket.isAlive = false;
            webSocket.ping();
        }
    },
    30000
    );

let start =
    async () =>
    {
        try
        {
            await fastify.listen( { port: 8000, host: '0.0.0.0' } );
        }
        catch ( error )
        {
            fastify.log.error( error );

            process.exit( 1 );
        }
    };

fastify.ready(
    async err =>
    {
        if ( err )
        {
            throw err;
        }
        else
        {
            start();
        }
    }
    );

// -- IMPORTS

import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { fetchData, hostUrl, platform } from '$lib/base';
import { deviceTokenStore } from '$store/deviceTokenStore';
import { getJsonText } from 'senselogic-gist';

// -- TYPES

export class MessagingService
{
    // -- CONSTRUCTORS

    constructor(
        )
    {
        this.profileSignedInStore = null;
    }

    // -- OPERATIONS

    initPush(
        profileSignedInStore
        )
    {
        this.profileSignedInStore = profileSignedInStore;

        if ( platform === 'android' || platform === 'ios' )
        {
            this.registerPush();
        }
        else if ( platform === 'web' )
        {
            this.requestNotificationPermission();

            if ( window && 'serviceWorker' in navigator && profileSignedInStore )
            {
                navigator.serviceWorker
                    .register('/firebase_messaging_sw.js')
                    .then(
                        ( registration ) =>
                        registration
                        )
                    .catch(
                        ( error ) =>
                        {
                            console.error( error );
                        }
                        );

                navigator.serviceWorker.ready
                    .then(
                        ( registration ) =>
                        {
                            let messageChannel = new MessageChannel();

                            messageChannel.port1.onmessage =
                                ( event ) =>
                                {
                                    if ( event.data.token )
                                    {
                                        this.checkAndSendToken( event.data.token );
                                    }
                                    else
                                    {
                                        console.error( event.data.error );
                                    }
                                };

                            registration.active.postMessage(
                                {
                                    type : 'getToken',
                                    url : hostUrl + '/api/notification/public-key'
                                },
                                [ messageChannel.port2 ]
                                );
                        }
                        );
            }
        }
    }

    // ~~

    async checkAndSendToken(
        deviceToken
        )
    {
        deviceTokenStore.subscribe(
            async ( storedDeviceToken ) =>
            {
                if ( storedDeviceToken !== deviceToken )
                {
                    await this.sendTokenToServer( deviceToken );
                    deviceTokenStore.set( deviceToken );
                }
            }
            );
    }

    // ~~

    async sendTokenToServer(
        deviceToken
        )
    {
        await fetchData(
            '/api/notification/token',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { deviceToken, deviceType : platform } ),
            }
            );
    }

    // ~~

    async sendUnregisterTokenToServer(
        deviceToken,
        deviceType
        )
    {
        deviceTokenStore.set( null );
        await fetchData(
            '/api/notification/token/remove',
            {
                method: 'POST',
                credentials: 'include',
                body: getJsonText( { deviceToken, deviceType } ),
            }
            );
    }

    // ~~

    registerPush(
        )
    {
        PushNotifications.requestPermissions()
            .then(
                ( permission ) =>
                {
                    if ( permission.receive === 'granted' )
                    {
                        PushNotifications.register();
                    }
                }
                );

        PushNotifications.addListener(
            'registration',
            async ( token ) =>
            {
                await this.checkAndSendToken(
                    token.value
                    );
            }
            );

        PushNotifications.addListener(
            'registrationError',
            async ( error ) =>
            {
                console.error( error )
                await this.sendUnregisterTokenToServer( platform );
            }
            );

        PushNotifications.addListener(
            'pushNotificationReceived',
            ( notification ) =>
            {
            }
            );

        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            ( notification ) =>
            {
            }
            );
    }

    // ~~

    async requestNotificationPermission(
        )
    {
        if ( !( 'Notification' in window ) )
        {
            console.warn( 'This browser does not support desktop notification' );
        }
        else if ( Notification.permission !== 'granted' )
        {
            await Notification.requestPermission();
        }
    }
}

// -- VARIABLES

export let messagingService
    = new MessagingService();

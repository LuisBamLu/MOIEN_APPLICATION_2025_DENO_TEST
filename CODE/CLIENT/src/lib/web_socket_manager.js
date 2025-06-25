// -- IMPORTS

import { getJsonObject, getJsonText, logError } from 'senselogic-gist';
import { get } from 'svelte/store';
import { profileSignedInStore } from '$store/profileStore';
import { notificationCenterStore } from '$store/notificationCenterStore';
import { propertyArrayStore } from '$store/propertyArray';
import { navigate } from 'svelte-routing';
import { handleAddMessage, handleMessageMarkedAsRead } from '$store/conversationStore';
import { webSocketUrl } from '$lib/base';

// -- CONSTANTS

const registerUserTypeName = 'registerUser';
const addNotificationTypeName = 'addNotification';
const pointsOfInterestTypeName = 'pointsOfInterest';
const addMessageTypeName = 'addMessage';
const messageMarkedAsReadTypeName = 'messageMarkedAsRead';

// -- TYPES

export class WebSocketManager
{
    // -- CONSTRUCTORS
    constructor(
        webSocketUrl
        )
    {
        this.webSocketUrl = webSocketUrl;
        this.webSocket = null;
        this.reconnectTimeout = null;
    }

    // -- OPERATIONS

    setupWebSocket(
        )
    {
        try
        {
            if ( this.reconnectTimeout )
            {
                clearTimeout( this.reconnectTimeout );
            }

            let profileSignedIn = get( profileSignedInStore );

            if ( profileSignedIn === null || profileSignedIn === undefined )
            {
                this.scheduleReconnect( 3000 );

                return;
            }

            this.webSocket = new WebSocket( this.webSocketUrl + '?userId=' + profileSignedIn.userId );
            this.webSocket.onopen = this.handleOpen.bind( this );
            this.webSocket.onmessage = this.handleMessage.bind( this );
            this.webSocket.onerror = this.handleError.bind( this );
            this.webSocket.onclose = this.handleClose.bind( this );
        }
        catch ( error )
        {
            logError( error );
            this.scheduleReconnect( 3000 );
        }
    }

    // ~~

    handleOpen(
        )
    {
        let profileSignedIn = get( profileSignedInStore );

        if ( profileSignedIn
             && this.isConnected() )
        {
        }
        else
        {
            this.scheduleReconnect( 5000 );
        }
    }

    // ~~

    handleMessage(
        event
        )
    {
        let data = getJsonObject( event.data );

        switch ( data.type )
        {
            case addNotificationTypeName:
                return notificationCenterStore.add( data.notification );
            case pointsOfInterestTypeName:
                return propertyArrayStore.set( data.propertyArray );
            case addMessageTypeName:
                return handleAddMessage( data );
            case messageMarkedAsReadTypeName:
                return handleMessageMarkedAsRead( data );
        }
    }

    // ~~

    isConnected(
        )
    {
        return this.webSocket.readyState === WebSocket.OPEN;
    }

    // ~~

    handleError(
        error
        )
    {
        logError( error );
        this.closeWebSocket( 3000 );
    }

    // ~~

    closeWebSocket(
        delay
        )
    {
        if ( this.webSocket )
        {
            this.webSocket.onclose =
                () =>
                {
                    this.scheduleReconnect( delay );
                };
            this.webSocket.close();
        }
        else
        {
            clearTimeout( this.reconnectTimeout );
        }
    }

    // ~~

    handleClose(
        )
    {
        this.scheduleReconnect( 3000 );
    }

    // ~~

    scheduleReconnect(
        delay
        )
    {
        this.reconnectTimeout = setTimeout(
            () => this.setupWebSocket(),
            delay
            );
    }

    // ~~

    send(
        payload
        )
    {
        if ( !this.isConnected() ) return;

        this.webSocket.send(
            getJsonText( payload )
            );
    }
}

// -- VARIABLES

export let webSocketManager =
    new WebSocketManager( webSocketUrl );

importScripts( 'https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js' );
importScripts( 'https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js' );

firebase.initializeApp(
    {
        apiKey : 'AIzaSyDHTGmByqzOJFbYoLi6lwMi8VtjXzkXNnc',
        authDomain : 'dtmoney-d3a60.firebaseapp.com',
        projectId : 'dtmoney-d3a60',
        messagingSenderId : '145411018314',
        appId : '1:145411018314:web:318cb1bab26b23da3320b3',
    }
    );

let messaging = firebase.messaging();

self.addEventListener(
    'message',
    async ( event ) =>
    {
        if ( event.data && event.data.type === 'getToken' )
        {
            try
            {    
                let data = await fetch(
                    event.data.url,
                    {
                        method : 'POST',
                        body : JSON.stringify( {} ),
                    }
                );
                let response = await data.json();

                let token = await messaging.getToken( { vapidKey : response.publicKey } );
                event.ports[ 0 ].postMessage( { type: 'token', token } );
            }
            catch ( error )
            {
                event.ports[ 0 ].postMessage( { type: 'error', error: error.message } );
            }
        }
    }
    );


let showNotification = function(
    title,
    notification
    )
    {
        return self.notification.showNotification(
            title,
            {
                ...notification,
                data :
                    {
                        link : notification.click_action,
                    }
            }
            );
    };

self.addEventListener(
    'notificationclick',
    ( event ) =>
    {
        event.notification.close();

        if ( event.notification
            && event.notification.data
            && event.notification.data.link
            )
        {
            let notificationPage = event.notification.data.link;

            event.waitUntil(
                clients.openWindow( notificationPage )
                );
        }
    }
    );

messaging.onBackgroundMessage(
    messaging,
    ( payload ) =>
    {
        const notificationTitle = payload.title;
        const notificationOptions = {
            body: payload.message
        };

        self.registration.showNotification(
            notificationTitle,
            notificationOptions
            );
    }
    );
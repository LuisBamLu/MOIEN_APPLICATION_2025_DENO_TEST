// -- VARIABLES

let
    TrackingId = 'G-FJBRVRX6QJ',
    TrackingIsEnabled = false,
    TrackingScript = null

// -- FUNCTIONS

export function gtag(
    )
{
    window.dataLayer.push( arguments );
}

// ~~

export function trackRoute(
    )
{
    if ( TrackingIsEnabled )
    {
        gtag(
            'config',
            TrackingId,
            {
                'page_title' : window.location.pathname,
                'page_path' : window.location.pathname,
                'page_location' : window.location.href
            }
            );
    }
}

// ~~

export function enableTracking(
    tracking_id = TrackingId
    )
{
    if ( !TrackingIsEnabled )
    {
        TrackingIsEnabled = true;
        TrackingId = tracking_id;

        window.dataLayer = window.dataLayer || [];

        TrackingScript = document.createElement( 'script' );
        TrackingScript.async = true;
        TrackingScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + tracking_id;

        document.head.insertBefore( TrackingScript, document.head.firstChild );

        gtag( 'js', new Date() );
        gtag( 'config', tracking_id );

        trackRoute();
    }
}

// ~~

export function disableTracking(
    tracking_id = TrackingId
    )
{
    if ( TrackingIsEnabled
         && TrackingId === tracking_id )
    {
        document.head.removeChild( TrackingScript );

        window.dataLayer = [];

        TrackingIsEnabled = false;
        TrackingId = '';
        TrackingScript = null;
    }
}

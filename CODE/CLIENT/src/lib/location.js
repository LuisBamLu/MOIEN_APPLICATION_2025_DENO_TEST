// -- FUNCTIONS

export function getLocation(
    )
{
    return new Promise(
        ( resolve, reject ) =>
        {
            if ( navigator.geolocation )
            {
                navigator.geolocation.getCurrentPosition(
                    position => resolve( showPosition( position ) ),
                    error => reject( handleError( error ) )
                    );
            }
            else
            {
                reject( new Error( 'Geolocation is not supported by this browser' ) );
            }
        }
        );
}

// ~~

function showPosition(
    position
    )
{
    return new Promise(
        ( resolve, reject ) =>
        {
            let latitude = position.coords.latitude;
            let longitude = position.coords.longitude;
            let url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;

            fetch( url )
                .then( response => response.json())
                .then(
                    data =>
                    {
                        if ( data
                            && data.address
                            && data.address.country_code )
                        {
                            resolve(
                                {
                                    latitude: latitude,
                                    longitude: longitude,
                                    countryCode: data.address.country_code
                                }
                                );
                        }
                        else
                        {
                            reject( new Error( 'Country code is not available' ) );
                        }
                    }
                    )
                .catch(
                    error => reject( new Error( 'Error getting country code: ' + error ) )
                    );
        }
        );
}

// ~~

function handleError(
    error
    )
{
    switch ( error.code )
    {
        case error.PERMISSION_DENIED:
        {
            return new Error( 'User denied the request for Geolocation' );
        }
        case error.POSITION_UNAVAILABLE:
        {
            return new Error( 'Location information is unavailable' );
        }
        case error.TIMEOUT:
        {
            return new Error( 'The request to get user location timed out' );
        }
        case error.UNKNOWN_ERROR:
        {
            return new Error( 'An unknown error occurred' );
        }
        default:
        {
            return new Error( 'An unhandled error occurred' );
        }
    }
}

// ~~

export async function getLocationBrowser(
    )
{
    return (
        new Promise(
            ( resolve, reject ) =>
            {
                getLocation()
                    .then(
                        location =>
                        {
                            resolve(
                                {
                                    countryCode: location.countryCode.toLowerCase(),
                                    latitude: location.latitude,
                                    longitude: location.longitude
                                }
                                );
                        }
                        )
                    .catch(
                        error =>
                        {
                            console.error( 'Error getting location:', error );
                            reject( error );
                        }
                        );
            }
            )
        );
}

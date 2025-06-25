// -- FUNCTIONS

export async function processParameters(
    url
    )
{
    let propertyParameters = {};
    let locationParameters = {};
    let bookingParameters = {};
    let featureParameters = {};

    function addParameter(
        params,
        key,
        value,
        transformFunc = ( v ) => v
        )
    {
        if ( value )
        {
            params[ key ] = transformFunc( value );
        }
    }

    // -- Property paramaters

    addParameter( propertyParameters, 'cityId', url.get( 'cityId' ) );
    addParameter( propertyParameters, 'countryCode', url.get( 'countryCode' ), v => v.toUpperCase() );
    addParameter( propertyParameters, 'typeId', url.get( 'typeId' ) );
    addParameter( propertyParameters, 'rentalTypeId', url.get( 'rentalTypeId' ) );
    addParameter( propertyParameters, 'profileId', url.get( 'profileId' ) );
    addParameter( propertyParameters, 'isAvailableForShortTerm', url.get( 'isAvailableForShortTerm' ) );
    addParameter( propertyParameters, 'isAvailableForLongTerm', url.get( 'isAvailableForLongTerm' ) );

    // -- Location paramaters

    addParameter( locationParameters, 'rangeDistance', url.get( 'rangeDistance' ) );
    addParameter( locationParameters, 'currentCoordinates', url.get( 'currentCoordinates' ) );

    // -- Booking paramaters

    addParameter( bookingParameters, 'arrivalDate', url.get( 'arrivalDate' ) );
    addParameter( bookingParameters, 'departureDate', url.get( 'departureDate' ) );
    addParameter( bookingParameters, 'minimumDailyBudget', url.get( 'minimumDailyBudget' ), parseInt );
    addParameter( bookingParameters, 'maximumDailyBudget', url.get( 'maximumDailyBudget' ), parseInt );
    addParameter( bookingParameters, 'minimumMonthlyBudget', url.get( 'minimumMonthlyBudget' ), parseInt );
    addParameter( bookingParameters, 'maximumMonthlyBudget', url.get( 'maximumMonthlyBudget' ), parseInt );
    addParameter( bookingParameters, 'adultCount', url.get( 'adultCount' ), parseInt );
    addParameter( bookingParameters, 'childrenCount', url.get( 'childrenCount' ), parseInt );
    addParameter( bookingParameters, 'infantCount', url.get( 'infantCount' ), parseInt );
    addParameter( bookingParameters, 'petCount', url.get( 'petCount' ), parseInt );

    // -- Feature paramaters

    for ( let [ key, value ] of url )
    {
        if ( key.startsWith( 'feature-' ) )
        {
            featureParameters[ key.substring( 'feature-'.length ) ] = value || true;
        }
    }

    return { propertyParameters, locationParameters, bookingParameters, featureParameters };
}

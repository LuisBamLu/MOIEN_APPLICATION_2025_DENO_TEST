export async function validateAddressData(
    addressData
)
{
    let errors = []

    let addressInfo = addressData.addressInfo;
    let cityName = addressData.cityName;
    let countryName = addressData.countryName;
    let postalCode = addressData.postalCode;

    if ( !addressInfo
         || typeof addressInfo !== 'string'
         || addressInfo.length > 100 )
    {
        errors.push( 'address-info-not-valid' )
    }

    if ( !cityName
         || typeof cityName !== 'string'
         || cityName.length > 100 )
    {
        errors.push( 'city-name-not-valid' )
    }

    if ( !countryName
         || typeof countryName !== 'string'
         || countryName.length > 100 )
    {
        errors.push( 'country-name-not-valid' )
    }

    if ( !postalCode
         || typeof postalCode !== 'string'
         || postalCode.length > 20 )
    {
        errors.push( 'postal-code-not-valid' )
    }

    let result = await fetch(
        'https://nominatim.openstreetmap.org/search'
        + `?street=${ addressInfo }`
        + `&city=${ cityName }`
        + `&country=${ countryName }`
        + `&postalcode=${ postalCode }`
        + `&polygon_geojson=1&format=jsonv2`
    );

    let data = await  result.json()

    if ( !data || data.length === 0 )
    {
        errors.push( 'address-not-valid' )
    }

    return errors
}

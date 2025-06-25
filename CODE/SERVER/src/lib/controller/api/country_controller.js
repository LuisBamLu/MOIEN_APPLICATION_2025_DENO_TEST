// -- IMPORTS

import { countryService } from '../../service/country_service';

// -- FUNCTIONS

export async function getCountryByCode(
    request,
    reply
    )
{
    return (
        {
            country : await countryService.getCountryByCode( request.body.countryCode )
        }
        );
}

// ~~

export async function getAllCountries(
    request,
    reply
    )
{
    return (
        {
            countryArray : await countryService.getCachedCountryArray()
        }
        );
}

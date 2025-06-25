// -- IMPORTS

import { getJsonObject } from "senselogic-gist";
import { cityService } from "../../service/city_service";
import { countryService } from "../../service/country_service";

// -- FUNCTIONS

export async function getLocationByName(
    request,
    reply
    )
{
    let searchTerm = request.body.searchTerm;
    let cityArray = await cityService.getCityArrayBySearchName( searchTerm );

    if ( cityArray.length > 0 )
    {
        return reply.send( { cityArray } );
    }

    let countryArray = await countryService.getCountryArrayBySearchName( searchTerm );
    let countryCodeArray = [];

    for ( let country of countryArray )
    {
        countryCodeArray.push( country.code );
    }

    cityArray = await cityService.getCityArrayByCountryCodeArray( countryCodeArray );

    return reply.send( { cityArray } );
}

// -- IMPORTS

import { cityService } from '../../service/city_service';
import { countryService } from '../../service/country_service';
import { featureTypeService } from '../../service/feature_type_service';
import { languageService } from '../../service/language_service';
import { propertyTypeService } from '../../service/property_type_service';
import { rentalTypeService } from '../../service/rental_type_service';
import { textService } from '../../service/text_service';
import { currencyService } from '../../service/currency_service';
import { userGenderService } from '../../service/user_gender_service';
import { getMapById } from 'senselogic-gist';

// -- FUNCTIONS

export async function getHomePageData(
    request,
    reply
    )
{
    let
    [
        textArray,
        countryArray,
        languageArray,
        cityArray,
        propertyTypeArray,
        rentalTypeArray,
        featureTypeByCategoryAndSubCategoryArray,
        currencyArray,
        genderArray
    ]
        = await Promise.all(
            [
                textService.getCachedTextArray(),
                countryService.getCachedCountryArray(),
                languageService.getCachedLanguageArray(),
                cityService.getCachedCityArray(),
                propertyTypeService.getCachedPropertyTypeArray(),
                rentalTypeService.getCachedRentalTypeArray(),
                featureTypeService.getFeatureByCategoryAndSubCategoryMap(),
                currencyService.getCachedCurrencyArray(),
                userGenderService.getCachedUserGenderArray()
            ]
            );
    let languageTagArray = languageArray.map( language => language.code );
    let genderByIdMap = getMapById( genderArray );

    let response =
        {
            textArray,
            countryArray,
            languageArray,
            languageTagArray,
            cityArray,
            propertyTypeArray,
            rentalTypeArray,
            featureTypeByCategoryAndSubCategoryArray,
            currencyArray,
            genderArray,
            genderByIdMap
        };

    return reply.send( response );
}

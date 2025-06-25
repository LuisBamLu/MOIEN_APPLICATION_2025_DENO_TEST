// -- IMPORTS

import { getLogicalFilePath, getRandomTuid, logError } from "senselogic-gist";
import { progetisService } from "../../service/progetis_rental_announcement_platform_service";
import { handleUploadFiles } from "../../fileUtils";
import { countryService } from "../../service/country_service";
import { cityService } from "../../service/city_service";
import { propertyService } from "../../service/property_service";
import { featureService } from "../../service/feature_service";

// -- FUNCTIONS

export async function migrateProperties(
    request,
    reply
    )
{
    reply.header( 'Access-Control-Allow-Credentials', true );
    reply.header( 'Access-Control-Allow-Origin', request.headers.origin );

    if ( request.profileLogged === null )
    {
        return reply.status( 401 ).send( { error: 'unauthorized-error-message' } );
    }

    let agencyUuid = request.params.agencyUuid;
    let properties = await progetisService.getProperties( agencyUuid, request.profileLogged.userId );
    let property = {}
    let featureByTypeIdMap = {}
    let propertyArray = [];
    let propertyTypeIdByPropertyNatureMap =
        {
            'Appartement': 'appartment',
            'Bureau': 'building',
        };
    let featureArray = [];
    let map =
        {
            'comfort:ascenseur': ( value ) => featureByTypeIdMap[ 'has-elevator' ] = value,
            'comfort:installation_handicapes': ( value ) => featureByTypeIdMap[ 'is-adapted-for-reduced-mobility' ] = value,
            'equipements:lave_linge': ( value ) => featureByTypeIdMap[ 'has-washing-machine' ] = value,
            'equipements:seche_linge': ( value ) => featureByTypeIdMap[ 'has-dryer' ] = value,
            'equipements:micro_ondes': ( value ) => featureByTypeIdMap[ 'has-microwave' ] = value,
            'equipements:lecteur_dvd': ( value ) => featureByTypeIdMap[ 'has-dvd-player' ] = value,
            'equipements:wifi': ( value ) => featureByTypeIdMap[ 'has-wifi' ] = value,
            'equipements:four': ( value ) => featureByTypeIdMap[ 'has-oven' ] = value,
            'equipements:vaisselle': ( value ) => featureByTypeIdMap[ 'has-dishes' ] = value,
            'equipements:refrigerateur': ( value ) => featureByTypeIdMap[ 'has-fridge' ] = value,
            'equipements:congelateur': ( value ) => featureByTypeIdMap[ 'has-freezer' ] = value,
            'equipements:linge_de_maison': ( value ) => featureByTypeIdMap[ 'has-sheets' ] = value,
            'exterieur:surface_terrasse': ( value ) => featureByTypeIdMap[ 'terrace-area' ] = Number( value ),
            'exterieur:surface_balcon': ( value ) => featureByTypeIdMap[ 'balcony-area' ] = Number( value ),
            'exterieur:surface_jardin': ( value ) => featureByTypeIdMap[ 'garden-area' ] = Number( value ),
            'exterieur:jardin': ( value ) => featureByTypeIdMap[ 'jardin' ] = value,
            'exterieur:veranda': ( value ) => featureByTypeIdMap[ 'has-terrace' ] = value,
            'info:titre': ( value ) => property.title = value,
            'info:court_terme': ( value ) => property.isAvailableForShortTerm = value,
            'info:surface': ( value ) => featureByTypeIdMap[ 'property-area' ] = Number( value ),
            'info:surface_plancher': ( value ) => featureByTypeIdMap[ 'room-area' ] = Number( value ),
            'info:nature': ( value ) => property.typeId = propertyTypeIdByPropertyNatureMap[ value ],
            'info:nombre_pieces': ( value ) => featureByTypeIdMap[ 'room-count' ] = Number( value ),
            'unfo:nb_couchages': ( value ) => featureByTypeIdMap[ 'bed-count' ] = Number( value ),
            'localisation:addresse_num': ( value ) => property.houseNumber = value,
            'localisation:address': ( value ) => property.addressLine1 = value,
            'localisation:pays': async ( value ) => await handlePropertyCountry( value ),
            'localisation:ville': async ( value ) => await handlePropertyCity( value ),
            'localisation:lat': ( value ) => { if ( value !== '' ) property.latitude = value },
            'localisation:lng': ( value ) => { if ( value !== '' ) property.longitude = value },
            'localisation:nombre_etage': ( value ) => featureByTypeIdMap[ 'floor-count' ] = Number( value ),
            'parking:garages': ( value ) => featureByTypeIdMap[ 'closed-garage-space-count' ] = Number( value ),
            'parking:parking_ouvert': ( value ) => featureByTypeIdMap[ 'open-garage-space-count' ] = Number( value ),
            'pieces:cuisine': ( value ) => featureByTypeIdMap[ 'has-kitchen' ] = value,
            'pieces:cuisine_equipee': ( value ) => featureByTypeIdMap[ 'has-cooking-tools' ] = value,
            'pieces:salles_de_bain': ( value ) => featureByTypeIdMap[ 'bathroom-count' ] = Number( value ),
            'pieces:cave': ( value ) => featureByTypeIdMap[ 'has-cellar' ] = value,
            'photos:*': async ( value ) => await handlePropertyImage( value ),
            'prix:budget': ( value ) => property.longTermMonthlyPrice = Number( value ),
            'prix:charges_mensuelles': ( value ) => featureByTypeIdMap[ 'long-term-monthly-charges' ] = Number( value ),
            'chauffage:climatisation': ( value ) => { if ( value ) property.heatingTypeId = 'reversible-air-conditioning' },
            'chauffage:radiateurs': ( value ) => { if ( value ) property.heatingTypeId = 'electrical' },
            'chauffage:chauffage_gaz': ( value ) => { if ( value ) property.heatingTypeId = 'gas' },
            'chauffage:chauffage_elect': ( value ) => { if ( value ) property.heatingTypeId = 'electrical' },
            'chauffage:chauffage_col': ( value ) => { if ( value ) property.heatingTypeId = 'collective-heating' },
            'chauffage:description_energie': ( value ) => property.energyDiagnosisId = value,
            'description:description_fr': ( value ) => handleDescription( value, 'fr' ),
            'description:description_en': ( value ) => handleDescription( value, 'en' ),
            'description:description_lu': ( value ) => handleDescription( value, 'lu' ),
            'description:description_de': ( value ) => handleDescription( value, 'de' ),
            'description:description_pt': ( value ) => handleDescription( value, 'pt' ),
            'description:description_nl': ( value ) => handleDescription( value, 'nl' ),
            'interieur:meuble': ( value ) => featureByTypeIdMap[ 'is-furnished' ] = value,
            'interieur:animaux_acceptes': ( value ) => featureByTypeIdMap[ 'allows-pets' ] = value,
            'interieur:renove': ( value ) => featureByTypeIdMap[ 'is-renovated' ] = value,
            'interieur:piscine': ( value ) => featureByTypeIdMap[ 'has-swimming-pool' ] = value,
            'securite:alarme': ( value ) => featureByTypeIdMap[ 'has-alarm' ] = value
        };

    async function handlePropertyCountry(
        value
        )
    {
        let countryArray = await countryService.getCountryArrayBySearchName( value );

        if ( countryArray && countryArray.length > 0 )
        {
            let country = countryArray[ 0 ]

            property.countryCode = country.code;
        }

        property.countryName = value;
    }

    // ~~

    async function handlePropertyCity(
        value
        )
    {
        let cityArray = await cityService.getCityArrayBySearchName( value );

        if ( cityArray && cityArray.length > 0 )
        {
            let city = cityArray[ 0 ];

            property.cityId = city.id;

            if ( !property.countryCode )
            {
                property.countryCode = city.countryCode;
            }

            if ( !property.latitude )
            {
                property.latitude = city.latitude;
            }

            if ( !property.longitude )
            {
                property.longitude = city.longitude
            }

            property.showsPreciseLocation = false;
        }
        else
        {
            try
            {
                let response = await fetch( `https://nominatim.openstreetmap.org/search?q=${ value }&polygon_geojson=1&format=jsonv2` );
                let cityArray = await response.json();

                if ( cityArray && cityArray.length > 0 )
                {
                    let city = cityArray[ 0 ];

                    property.latitude = Number( city.lat );
                    property.longitude = Number( city.lon );

                    property.showsPreciseLocation = false;
                }
            }
            catch ( error )
            {
                logError( error );
            }
        }

        property.cityName = value;
    }

    // ~~

    async function handlePropertyImage(
        image
        )
    {
        if ( property.imagePathArray === undefined )
        {
            property.imagePathArray = [];
        }

        let imagePath = getLogicalFilePath( image.url )
        let imageBuffer = null;
        let mimeType = null;

        try
        {
            let response = await fetch( imagePath );
            let imageBufferArray = await response.arrayBuffer();
            imageBuffer = Buffer.from( imageBufferArray );
            mimeType = response.headers.get( 'content-type' ) || 'application/octet-stream';
        }
        catch ( error )
        {
            logError( error );
        }

        if ( imageBuffer !== null )
        {
            let fileDirectory = 'user/' + request.profileLogged.userId;
            let file =
                {
                    fieldname: 'file',
                    filename: image.name,
                    mimetype: mimeType,
                    encoding: '7bit',
                    fields: {},
                    toBuffer: () => imageBuffer
                };
            let filePathArray
                = await handleUploadFiles(
                    [ file ],
                    fileDirectory,
                    []
                    );

            property.imagePathArray.push( filePathArray[ 0 ] );
        }
    }

    function handleDescription(
        text,
        languageTag
        )
    {
        if ( property.description === undefined )
        {
            property.description = '';
        }

        if ( text && text.length > 0 )
        {
            if ( languageTag === 'en' )
            {
                property.description = text + property.description;
            }
            else
            {
                property.description += '¨' + languageTag + ':' + text;
            }
        }
    }

    for ( let _property of properties )
    {
        for ( let [ categoryKey, categoryValue ] of Object.entries( _property ) )
        {
            for ( let [ featureKey, featureValue ] of Object.entries( categoryValue ) )
            {
                let mapKey = categoryKey + ':' + featureKey;
                let mapKeyWildcard = categoryKey + ':' + '*'

                if ( Object.hasOwn( map, mapKey ) )
                {
                    await map[ mapKey ]( featureValue );
                }
                else if ( Object.hasOwn( map, mapKeyWildcard ) )
                {
                    await map[ mapKeyWildcard ]( featureValue );
                }
            }
        }

        property.userId = request.profileLogged.userId;
        property.managerUserId = request.profileLogged.userId;
        property.id = getRandomTuid();
        property.isAvailableForLongTerm = true;
        property.imagePath = property.imagePathArray[ 0 ] ?? '';
        propertyArray.push( property );

        for ( let [ featureTypeId, featureValue ] of Object.entries( featureByTypeIdMap ) )
        {
            featureArray.push(
                {
                    id: getRandomTuid(),
                    propertyId: property.id,
                    typeId: featureTypeId,
                    value: featureValue
                }
                );
        }

        property = {};
        featureByTypeIdMap = {};
    }

    let _propertyArray = await propertyService.upsertPropertyArray( propertyArray );
    await featureService.upsertFeatureArray( featureArray );

    return reply.send( { propertyArray: _propertyArray } );
}

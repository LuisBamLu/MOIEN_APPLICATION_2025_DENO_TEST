<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug, getMapByCode } from 'senselogic-gist';
    import CityInput from './CityInput.svelte';
    import CountryInput from './CountryInput.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Input from '$component/element/Input.svelte';
    import LabelledSwitch from '$component/element/LabelledSwitch.svelte';
    import { countryArrayStore } from '$store/countryArrayStore';

    // -- VARIABLES

    /** @type {{property: any}} */
    let { property = $bindable() } = $props();
    let countryByCodeMap = getMapByCode( $countryArrayStore );
    let selectedCity;
    let showsPreciseLocation = $state(property.showsPreciseLocation);
    let timer;

    // -- FUNCTIONS

    function handleCountryChange(
        country
        )
    {
        if ( selectedCity.countryCode !== country.code )
        {
            property.cityId = null;
            property.cityName = null;
        }
    }

    // ~~

    function handleCityChange(
        city
        )
    {
        selectedCity = city;

        if ( city.countryCode !== property.countryCode )
        {
            property.countryCode = city.countryCode;
            property.countryName = countryByCodeMap[ city.countryCode ].name;
        }

        if ( !property.showsPreciseLocation )
        {
            property.latitude = city.latitude;
            property.longitude = city.longitude;
        }
    }

    // ~~

    async function getCoordinatesFromAddress(
        )
    {
        property.showsPreciseLocation = showsPreciseLocation;

        if ( property.countryName
            && property.cityName
            && property.streetName
            && property.buildingNumber
            && property.showsPreciseLocation )
        {
            clearTimeout( timer );
            timer = setTimeout(
                async () =>
                {
                    let response = await fetch(
                        `https://nominatim.openstreetmap.org/search?street=${ property.streetName }, ${ property.buildingNumber }&city=${ getLocalizedText( property.cityName, $languageTagStore ) }&country=${ getLocalizedText( property.countryName, $languageTagStore )  }&polygon_geojson=1&format=jsonv2`
                        );
                    let data = await response.json();

                    if ( data.length )
                    {
                        property.latitude = data[ 0 ].lat;
                        property.longitude = data[ 0 ].lon;
                    }
                },
                3000
                );
        }
    }

    // -- STATEMENTS

    run(() => {
        showsPreciseLocation;
        getCoordinatesFromAddress();
    });
</script>

<div class="display-flex flex-direction-column gap-100 margin-top-100" >
    <CountryInput
        bind:countryCode={ property.countryCode }
        bind:countryName={ property.countryName }
        on:change={ ( e ) => handleCountryChange( e.detail ) }
    />
    <CityInput
        selectedCountryCode={ property.countryCode }
        bind:cityId={ property.cityId }
        bind:cityName={ property.cityName }
        on:change={ ( e ) => handleCityChange( e.detail ) }
    />
    <Input
        label={ getLocalizedTextBySlug( 'personal-information-street', $languageTagStore ) }
        bind:value={ property.streetName }
    />
    <Input
        label={ getLocalizedTextBySlug( 'ad-building-number-label', $languageTagStore ) }
        type="number"
        bind:value={ property.buildingNumber }
    />
    <Input
        label={ getLocalizedTextBySlug( 'ad-apartment-number-label', $languageTagStore ) }
        type="number"
        bind:value={ property.apartmentNumber }
    />
    <Input
        label={ getLocalizedTextBySlug( 'latitude-label', $languageTagStore ) }
        type="number"
        bind:value={ property.latitude }
    />
    <Input
        label={ getLocalizedTextBySlug( 'longitude-label', $languageTagStore ) }
        type="number"
        bind:value={ property.longitude }
    />
    <LabelledSwitch
        label={ getLocalizedTextBySlug( 'shows-precise-location-label', $languageTagStore ) }
        bind:value={ showsPreciseLocation }
    />
</div>

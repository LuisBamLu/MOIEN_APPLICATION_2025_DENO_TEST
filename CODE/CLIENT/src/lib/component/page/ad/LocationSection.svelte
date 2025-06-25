<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import LabelledCheckbox from '$component/element/LabelledCheckbox.svelte';
    import CitySelectModal from '$component/page/ad/CitySelectModal.svelte';
    import CountrySelectModal from '$component/page/ad/CountrySelectModal.svelte';
    import PropertyLocation from '$component/page/property/PropertyLocation.svelte';
    import { toast } from '$src/lib/toast';
    import { createEventDispatcher, onMount } from 'svelte';

    // -- VARIABLES

    export let countryArray;
    export let cityArray;
    export let countryCode;
    export let countryName;
    export let cityId;
    export let cityName;
    export let streetName;
    export let buildingNumber;
    export let apartmentNumber;
    export let propertyTypeId;
    export let showsPreciseLocation;
    export let latitude;
    export let longitude;
    export let selectedCountry = null;
    export let selectedCity = null;
    export let errorArray = [];
    export let missingFields;
    let selectedCityId = null;
    let isEditingCountry = null;
    let isEditingCity = null;
    let isEditingPropertyAddress = null;
    let isEditingPropertyLatitude = null;
    let isEditingPropertyLongitude = null;
    let propertyLatitude = latitude;
    let propertyLongitude = longitude;
    let propertyAddress = null;
    let timer = null;
    let addressData = null;
    let dispatch = createEventDispatcher()

    // -- FUNCTIONS

    async function validateAddress(
        )
    {
        let response = await fetch(
            'https://nominatim.openstreetmap.org/search'
            + `?street=${ streetName }, `
            + `${ buildingNumber }`
            + `&city=${ getLocalizedText( cityName, $languageTagStore ) }`
            + `&country=${ getLocalizedText( countryName, $languageTagStore ) }`
            + `&polygon_geojson=1&format=jsonv2`
            );

        addressData = await response.json()

        if ( addressData.length )
        {
            propertyAddress =
                streetName + ' '
                + ( buildingNumber ? ',' + buildingNumber : '' )
                + ( apartmentNumber ? ',' + apartmentNumber : '' );
            isEditingPropertyAddress = false;
            dispatch( 'addressValidationSuccess' );
        }
        else
        {
            streetName = '';
            buildingNumber = '';
        }
    }

    // ~~

    async function handleSaveAddress(
        )
    {
        missingFields.country = !countryName;
        missingFields.city = !cityName;

        if ( missingFields.country || missingFields.city )
        {
            toast.error( 'missing-information-label' );
            return;
        }

        try
        {
            await validateAddress();
            toast.success( 'address-successfully-validated' );
        } catch( error )
        {
            console.log( error );
            toast.error( 'property-warning-address-not-found' );
        }
    }

     // ~~

     function handleCoordinates(
        )
    {
        latitude = selectedCity.latitude;
        longitude = selectedCity.longitude;
        propertyLatitude = latitude;
        propertyLongitude = longitude;
    }

    // ~~

    function updateCountryAndName(
        )
    {
        selectedCountry = countryArray.filter( country => country.code === countryCode )[ 0 ];
        if ( selectedCountry )
        {
            countryName = selectedCountry.name;
        }
        else
        {
            countryName = '';
        }
    }

    async function getCoordinatesFromAddress(
        )
    {
        if ( countryName
             && cityName
             && streetName
             && buildingNumber )
        {
            if ( addressData.length )
            {
                latitude = addressData[ 0 ].lat;
                longitude = addressData[ 0 ].lon;
            }
            else
            {
                toast.error( 'property-warning-address-not-found' );
            }
        }
    }

    // -- STATEMENTS

    onMount( validateAddress );

    // ~~

    $:
    {
        countryCode;
        updateCountryAndName();
    }

    // ~~

    $:
    {
        if ( selectedCity !== null && !showsPreciseLocation )
        {
            handleCoordinates();
            cityId = selectedCityId;
        }
    }

    // ~~

    $:
    {
        if ( selectedCity !== null && countryCode !== selectedCity.countryCode )
        {
            countryCode = selectedCity.countryCode;
            selectedCountry = countryArray.filter( country => country.code === countryCode )[ 0 ];
            countryName = getLocalizedText( selectedCountry.name, $languageTagStore );
        }
    }

    // ~~

    $: countryName = selectedCountry ? getLocalizedText( selectedCountry.name, $languageTagStore ) : countryName;

    // ~~

    $: cityName = selectedCity ? getLocalizedText( selectedCity.name, $languageTagStore ) : cityName;

    // ~~

    $: selectedCityId = selectedCity ? selectedCity.id: null;

    // ~~

    $: propertyAddress =
        streetName || buildingNumber || apartmentNumber
        ? `${ streetName ?? '' }${ buildingNumber ? ', ' + buildingNumber : '' }${ apartmentNumber ? ', ' + apartmentNumber : '' }`
        : null;

    // ~~

    $:
    {
        if ( isEditingPropertyAddress === false && showsPreciseLocation )
        {
            getCoordinatesFromAddress();
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    input
    {
        width: 100%;
        border: 2px solid grayColor700;
        border-radius: 0.75rem;
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: column;

        background-color: white;
    }

    // -- CLASSES

    .error
    {
        margin-top: -.5rem;
        margin-left: 0.5rem;

        font-size: 0.75rem;
        color: red;
    }
</style>

<div>
    <div class="font-size-100 font-weight-700 color-gray-100 margin-bottom-75">
        { getLocalizedTextBySlug( 'ad-property-location-label', $languageTagStore ) }
    </div>
    <Accordion
        label={ getLocalizedTextBySlug( 'personal-information-country', $languageTagStore ) }
        value={ countryName }
        helper={ getLocalizedTextBySlug( 'ad-select-country-label', $languageTagStore ) }
        bind:isEditing={ isEditingCountry }
    >
        <div class="modal-overlay"/>
        <CountrySelectModal
            countryArray={ countryArray }
            bind:isEditingCountry={ isEditingCountry }
            bind:selectedCountry={ selectedCountry }
            bind:selectedCountryCode={ countryCode }
            bind:selectedCountryName={ countryName }
            bind:selectedCity={ selectedCity }
        />
    </Accordion>
    {#if missingFields.country}
        <span class="error">
            { getLocalizedTextBySlug( 'select-country-label', $languageTagStore ) }
        </span>
    {/if}
    <Accordion
        label={ getLocalizedTextBySlug( 'personal-information-city', $languageTagStore ) }
        value={ cityName }
        helper={ getLocalizedTextBySlug( 'personal-information-city-helper', $languageTagStore ) }
        bind:isEditing={ isEditingCity }
    >
        <div class="modal-overlay"/>
        <CitySelectModal
            cityArray={ cityArray }
            bind:isEditingCity={ isEditingCity }
            bind:selectedCountryCode={ countryCode }
            bind:selectedCity={ selectedCity }
            bind:selectedCityId={ selectedCityId }
            bind:selectedCityName={ cityName }
        />
    </Accordion>
    {#if missingFields.city}
        <span class="error">
            { getLocalizedTextBySlug( 'select-city-label', $languageTagStore ) }
        </span>
    {/if}
    <Accordion
        label={ getLocalizedTextBySlug( 'personal-information-address', $languageTagStore ) }
        value={ propertyAddress }
        helper={ getLocalizedTextBySlug( 'personal-information-address-helper' ) }
        closeOnValueChange={ false }
        bind:isEditing={ isEditingPropertyAddress }
    >
        <div class="location-section-list">
            <div class="ad-page-section-list-option alternate no-border">
                <input
                    required
                    placeholder={ getLocalizedTextBySlug( 'personal-information-street', $languageTagStore ) }
                    bind:value={ streetName }
                >
            </div>
            <div class="ad-page-section-list-option alternate no-border">
                <input
                    required
                    placeholder={ getLocalizedTextBySlug( 'ad-building-number-label', $languageTagStore ) }
                    bind:value={ buildingNumber }
                >
            </div>
            {#if propertyTypeId ===  'appartment' || propertyTypeId === 'flat-sharing' }
                <div class="ad-page-section-list-option alternate no-border">
                    <input
                        required
                        placeholder={ getLocalizedTextBySlug( 'ad-apartment-number-label', $languageTagStore ) }
                        bind:value={ apartmentNumber }
                    >
                </div>
            {/if}
        </div>
        <button
            class="action-button"
            type="button"
            on:click={ handleSaveAddress }
        >
            <div class="font-size-100 font-weight-700 color-white">
                { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            </div>
        </button>
    </Accordion>
    {#if showsPreciseLocation }
        <Accordion
            label={ getLocalizedTextBySlug( 'latitude-label', $languageTagStore ) }
            value={ latitude }
            helper={ getLocalizedTextBySlug( 'ad-latitude-helper', $languageTagStore ) }
            bind:isEditing={ isEditingPropertyLatitude }
        >
            <div class="location-section-list">
                <div class="ad-page-section-list-option alternate no-border">
                    <input
                        required
                        type="number"
                        step="any"
                        name="property-latitude"
                        placeholder={ getLocalizedTextBySlug( 'latitude-label', $languageTagStore ) }
                        bind:value={ propertyLatitude }
                    />
                </div>
                <button
                    class="action-button"
                    type="button"
                    on:click={ () => { latitude = propertyLatitude; isEditingPropertyLatitude = false; } }
                >
                    <div class="font-size-100 font-weight-700 color-white">
                        { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                    </div>
                </button>
            </div>
        </Accordion>
        <Accordion
            label={ getLocalizedTextBySlug( 'longitude-label', $languageTagStore ) }
            value={ longitude }
            helper={ getLocalizedTextBySlug( 'ad-longitude-helper', $languageTagStore ) }
            bind:isEditing={ isEditingPropertyLongitude }
        >
            <div class="location-section=list">
                <div class="ad-page-section-list-option alternate no-border">
                    <input
                        required
                        type="number"
                        step="any"
                        name="property-longitude"
                        placeholder={ getLocalizedTextBySlug( 'longitude-label', $languageTagStore ) }
                        bind:value={ propertyLongitude }
                    />
                </div>
                <button
                    class="action-button"
                    type="button"
                    on:click={ () => { longitude = propertyLongitude; isEditingPropertyLongitude = false; } }
                >
                    <div class="font-size-100 font-weight-700 color-white">
                        { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                    </div>
                </button>
            </div>
        </Accordion>
    {/if}
</div>
<div>
    <PropertyLocation
        countryName={ countryName }
        cityName={ cityName }
        bind:propertyLatitude={ latitude }
        bind:propertyLongitude={ longitude }
    />
    <LabelledCheckbox
        name="shows-precise-location"
        label={ getLocalizedTextBySlug( 'ad-shows-precise-location-label', $languageTagStore ) }
        bind:checked={ showsPreciseLocation }
    />
</div>

<script>
    // -- IMPORTS

    import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import PersonalDetailInput from './PersonalDetailInput.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import LabelledInput from '$component/element/LabelledInput.svelte';
    import CityFilter from './CityFilter.svelte';
    import CountryFilter from './CountryFilter.svelte';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { fetchData } from '$lib/base';
    import { toast } from '$lib/toast';
    import { onMount } from 'svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    export let profile;

    let isLoading = true;
    let countryArray = $countryArrayStore;
    let selectedCountryCode = profile?.countryCode ? profile.countryCode : '';
    let selectedCityName = profile?.cityName ?? '';
    let postalCode;
    let addressInitialValue;
    let countryCode;

    // -- FUNCTIONS

    async function onBlur(
        )
    {
        isLoading = true;

        try
        {
            let response = await fetchData(
                '/api/city/get-by-code',
                {
                    method: 'POST',
                    headers:{ 'Content-Type': 'application/json' },
                    body: getJsonText( { cityCode: postalCode } ),
                }
                );

                if ( response )
                {
                    let newCity = response.city;
                    selectedCityName = newCity.name;
                    let newCountry = countryArray.filter( country => country.code === newCity.countryCode )[ 0 ];
                    selectedCountryCode = getLocalizedText( newCountry.name, $languageTagStore );
                }
        }
        catch( error )
        {
            if ( error.message.includes( '404' ) )
            {
                toast.error( 'city-code-not-found-label' );
            }
            else
            {
                toast.error( 'error-verification-address-country-city-label' );
            }
            console.log( error );
        }
        finally
        {
            setTimeout(
                () =>
                {
                    isLoading = false;
                },
                1000
                );
        }
    }

    // ~~

    function selectedCountryInfo(
        _selectedCountryName,
        _selectedCountryCode
    )
    {
        selectedCountryCode = _selectedCountryCode;
        countryCode = _selectedCountryCode;
    }

    // -- STATEMENTS

    $: addressInitialValue =
        profile?.addressLine1 && profile?.cityName && profile?.countryCode
        ? `${ profile.addressLine1 }. ${ profile.cityName }, ${ profile.countryCode }`
        : '';

    onMount(
        async () =>
        {
            if ( profile )
            {
                isLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .location-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .streets-container
    {
        width: 100%;

        display: flex;
        gap: 1rem;
    }

    .address-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
    }

    .secondary-streets-container
    {
        width: 100%;

        display: flex;
        gap: 1rem;
    }
</style>

<div class="font-size-100 font-weight-700 color-black">
    { getLocalizedTextBySlug( 'personal-information-address-of-residence', $languageTagStore ) }
</div>
<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'personal-information-address', $languageTagStore ) }
    initialValue={ addressInitialValue }
    editable={ true }
    helper={ getLocalizedTextBySlug( 'personal-information-residence-address-helper', $languageTagStore ) }
    addressInfo={ profile.addressLine1 }
    cityName={ selectedCityName }
    countryName={ selectedCountryCode }
    postalCode={ profile.cityCode }
    validationVariant="address"
>
    <div class="address-container">
        {#if isLoading}
            <Loading />
        {:else}
            <div class="location-container">
                <CountryFilter
                    selectedCountryCode={ selectedCountryCode }
                    on:countrySelected={ ( e ) => selectedCountryInfo( e.detail.countryName, e.detail.countryCode ) }
                />
                <CityFilter
                    selectedCountryCode={ selectedCountryCode }
                    selectedCityName={ selectedCityName }
                    on:citySelected={ ( e ) => selectedCityName = e.detail }
                />
                <input
                    type="hidden"
                    name="city-name"
                    value={ selectedCityName }
                />
            </div>
            <LabelledInput
                label={ `Address line 1` }
                name="address-line-1"
                placeholder={ getLocalizedTextBySlug( 'address-information-label', $languageTagStore ) }
                bind:value={ profile.addressLine1 }
            />
            <div class="secondary-streets-container">
                <LabelledInput
                    label={ `Address line 2` }
                    name="address-line-2"
                    placeholder={ getLocalizedTextBySlug( 'additional-information-options-label', $languageTagStore ) }
                    bind:value={ profile.addressLine2 }
                />
                <LabelledInput
                    label={ `Postal code` }
                    name="city-code"
                    placeholder={ `Postal code` }
                    onChange={ ( event ) => postalCode = event.target.value }
                    bind:value={ profile.cityCode }
                />
            </div>
        { /if}
    </div>
</PersonalDetailInput>

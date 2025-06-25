<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import CityFilter from '../page/account/CityFilter.svelte';
    import CountryFilter from '../page/account/CountryFilter.svelte';
    import LabelledInput from './LabelledInput.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import PersonalDetailInput from '../page/account/PersonalDetailInput.svelte';
    import { fetchData } from '$src/lib/base';
    import Loading from './Loading.svelte';
    import { toast } from '$src/lib/toast';
    import { countryArrayStore } from '$src/lib/store/countryArrayStore';

    // -- VARIABLES

    let isLoading = false;
    $: profile = $profileSignedInStore;
    $: selectedCountry = '';
    $: selectedCity = '';
    $: postalCode = '';
    $: addressInitialValue =
        profile.addressLine1 && profile.cityName && profile.countryCode
        ? `${ profile.addressLine1 }. ${ profile.cityName }, ${ profile.countryCode }`
        : '';
    $: countryArray = $countryArrayStore;

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
                    body: JSON.stringify( { cityCode: postalCode } ),
                    headers: { 'Content-Type': 'application/json' },
                }
                );

            if ( response )
            {
                let newCity = response.city;
                selectedCity = newCity.name;
                let newCountry = countryArray.filter( country => country.code === newCity.countryCode )[ 0 ];
                selectedCountry = getLocalizedText( newCountry.name, $languageTagStore );
                isLoading = false;
            }
        }
        catch ( error )
        {
            console.error( error );
            toast.error( 'address-not-valid-label' );
            isLoading = false;
        }
    }

    // -- STATEMENTS

    $: if ( profile.countryCode && !selectedCountry )
    {
        selectedCountry
            = getLocalizedText(
                countryArray.filter( country => country.code === profile.countryCode )[ 0 ].name,
                $languageTagStore
                );
    }

    // ~~

    $: if ( profile.cityName && !selectedCity )
    {
        selectedCity = profile.cityName;
    }

    // ~~

    $: console.log( `selectedCity: ${ selectedCity }, selectedCountry: ${ selectedCountry }` );
</script>

  <style lang="stylus">
      // -- IMPORTS

      @import '../../../constant.styl';
      @import '../../../mixin.styl';

      .location-container
      {
          width: 100%;

          display: flex;
          gap: 1rem;
          justify-content: space-between;
      }

      .address-container
      {
          width: 100%;

          display: flex;
          flex-direction: column;
          gap: 1rem;
          justify-content: space-between;
      }
</style>

<PersonalDetailInput
    label={ getLocalizedTextBySlug( 'personal-information-address', $languageTagStore ) }
    initialValue={ addressInitialValue }
    editable={ true }
    helper={ getLocalizedTextBySlug( 'personal-information-residence-address-helper', $languageTagStore ) }
    addressInfo={ profile.addressLine1 }
    cityName={ selectedCity }
    countryName={ selectedCountry }
    postalCode={ profile.cityCode }
>
    <div class="address-container">
        {#if isLoading}
            <Loading />
        {:else}
        <div class="location-container">
            <LabelledInput
                label={ `Postal code` }
                name="city-code"
                placeholder={ `Postal code` }
                onChange={ ( event ) => postalCode = event.target.value }
                onBlur={ onBlur }
                bind:value={ profile.cityCode }
            />
            <LabelledInput
                label={ `Address line 1` }
                name="address-line-1"
                placeholder={ getLocalizedTextBySlug( 'address-information-label', $languageTagStore ) }
                bind:value={ profile.addressLine1 }
            />
        </div>
        <div class="location-container">
            <CountryFilter
                selectedCountryCode={ selectedCountry }
                on:countrySelected={ ( e ) => selectedCountry = e.detail }
            />
            <CityFilter
                selectedCity={ selectedCity }
                on:citySelected={ ( e ) => selectedCity = e.detail }
            />
        </div>
        <LabelledInput
            label={ `Address line 2` }
            name="address-line-2"
            placeholder={ getLocalizedTextBySlug( 'additional-information-options-label', $languageTagStore ) }
            bind:value={ profile.addressLine2 }
        />
        { /if}
    </div>
</PersonalDetailInput>

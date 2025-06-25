<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { createEventDispatcher } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import { cityArrayStoreByCountryCode, cityArrayStoreLoading, showCitySelector } from '$src/lib/store/cityArrayStore';

    // -- VARIABLES

    export let selectedCountryCode = null;

    let dispatch = createEventDispatcher();
    let country = $countryArrayStore.find( country => country.code === selectedCountryCode );
    $: countrySearchTerm = country ? getLocalizedText( country.name, $languageTagStore ) : '';
    let selectElement;
    let supportedCountryArray = [ 'DE', 'LU', 'CH', 'BE', 'FR' ];

    // -- FUNCTIONS

    async function handleCountrySelect(
        countryCode
        )
    {
        let country = $countryArrayStore.find( country => country.code === countryCode );

        if ( !country )
        {
            console.error( 'Country not found:', countryCode );

            return;
        }

        let countryName = getLocalizedText( country.name, $languageTagStore );
        countrySearchTerm = countryName;
        $showCitySelector = supportedCountryArray.includes( countryCode );

        dispatch(
            'countrySelected',
            {
                countryName: countryName,
                countryCode: countryCode
            }
            );

        if ( selectElement )
        {
            selectElement.blur();
        }

        try
        {
            $cityArrayStoreLoading = true;

            let data =
                await fetchData(
                    '/api/city/get-city-by-country-code',
                    {
                        method: 'POST',
                        body: countryCode
                    }
                    );

            if ( data.cityArray?.length > 200 )
            {
                $cityArrayStoreByCountryCode = data.cityArray.slice( 0, 200 );
            }
            else
            {
                $cityArrayStoreByCountryCode = [];
            }
        }
        catch ( error )
        {
            console.error( 'Error fetching city data:', error );
        }
        finally
        {
            $cityArrayStoreLoading = false;
        }
    }

    // ~~

    function onInputFocus(
        )
    {
        selectElement.focus();
    }

    // ~~

    function getCleanCountryCode(
        countryCode
        )
    {
        return countryCode.replace( '*', '' );
    }

    // -- STATEMENTS

    // $:
    // {
    //     if ( selectedCountry )
    //     {
    //         let country = $countryArrayStore.find( country => country.code === selectedCountry );
    //         countrySearchTerm = country ? getLocalizedText( country.name, $languageTagStore ) : '';
    //     }
    // }

    // ~~

    $: if ( selectedCountryCode )
    {
        handleCountrySelect( selectedCountryCode );
    }

    // ~~

    $: filteredCountryArray =
        $countryArrayStore
            .map(
                country => (
                    {
                        ...country,
                        localizedName: getLocalizedText( country.name, $languageTagStore )
                    }
                    )
                )
            .filter(
                country => country.localizedName.toLowerCase().includes( countrySearchTerm.toLowerCase() )
                )
            .sort( ( a, b ) => a.localizedName.localeCompare( b.localizedName ) );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .country-select-modal-content
    {
        position: relative;

        width: 100%;
        min-width: 0;

        display: flex;
        flex: 1 1 0;
        flex-direction: column;
    }

    .country-select-search-input-container
    {
        position: relative;

        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.75rem 0;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: grayColor950;

        transition: all 200ms ease-in-out;
        &:focus-within
        {
            border-color: greenColor900;

            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .country-select-radio-group
    {
        overflow-y: auto;
    }

    .country-select-search-input
    {
        margin-top: 1rem;
        outline: none;
        border: none;
        border-radius: unset;
        padding: unset;
        padding-left: 1rem;

        background-color: transparent;

        font-size: 0.9rem;
        font-weight: 700;
        color: grayColor100;
    }

    .country-select-country-radio-input-flag
    {
        height: 1.25rem;
        width: 1.75rem;
    }

    .country-select-radio-group
    {
        -ms-overflow-style: none;
        z-index: 1000;
        position: absolute;
        top: 4rem;
        z-index: 1000;

        overflow-y: auto;
        scrollbar-width: none;
        max-height: 10rem;
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.75rem 0.5rem;

        display: none;
        flex-direction: column;

        background-color: whiteColor;
    }

    .country-select-modal-content:focus-within  .country-select-radio-group
    {
        display: flex;
    }

    .gray-search-icon
    {
        flex-shrink: 0;
    }

    .text-title
    {
        position: absolute;
        top: 0.6rem;
        left: 1rem;
    }

    .radio-input-container
    {
        padding: 0.5rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        cursor: pointer;
        &:hover
        {
            background-color: grayColor900;
        }
    }
</style>

<div class="country-select-modal-content" on:click={ onInputFocus }>
    <div class="country-select-search-input-container">
        <div class="font-size-75 font-weight-500 color-gray-300 text-title">
            { getLocalizedTextBySlug( 'personal-information-country', $languageTagStore ) }
        </div>
        <input
            class="country-select-search-input"
            placeholder={ getLocalizedTextBySlug( 'ad-search-country-label', $languageTagStore ) }
            bind:value={ countrySearchTerm }
            bind:this={ selectElement }
        />
    </div>

    <div class="country-select-radio-group">
        {#each filteredCountryArray as _country ( _country.code ) }
            <label
                class="radio-input-container"
                on:mousedown={ ( e ) => e.preventDefault() }
            >
                <input
                    type="radio"
                    checked={ selectedCountryCode === _country.code }
                    name="country-code"
                    value={ _country.code }
                    on:change={ () => handleCountrySelect( _country.code ) }
                />
                <img
                    class="country-select-country-radio-input-flag"
                    src="/image/flag/{ getCleanCountryCode(_country.code) }.svg"
                    alt='flag'
                >
                <div class="font-size-90 font-weight-500 color-gray-300">
                    { getLocalizedText( _country.name, $languageTagStore ) }
                </div>
            </label>
        {/each}
    </div>
</div>

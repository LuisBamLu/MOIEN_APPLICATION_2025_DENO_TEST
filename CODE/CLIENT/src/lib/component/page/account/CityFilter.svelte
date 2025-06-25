<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { cityArrayStoreByCountryCode, cityArrayStoreLoading, showCitySelector } from '$store/cityArrayStore';
    import { createEventDispatcher, onDestroy } from 'svelte';
    import Loading from '../../element/Loading.svelte';
    import { fetchData } from '$src/lib/base';

    // -- VARIABLES

    export let selectedCityName = null;
    export let selectedCountryCode = null;

    let dispatch = createEventDispatcher();
    let citySearchTerm = selectedCityName || '';
    let selectElement;
    let debounceTimeout = null;

    // -- FUNCTIONS

    function onCitySelect(
        cityName
        )
    {
        selectedCityName = cityName;
        citySearchTerm = cityName;

        dispatch( 'citySelected', cityName );

        if ( selectElement )
        {
            selectElement.blur();
        }
    }

    // ~~

    function onInputFocus(
        )
    {
        selectElement.focus();
    }

    // ~~

    async function handleSubmit(
        )
    {
        $cityArrayStoreLoading = true;

        try
        {
            let cityData
                = await fetchData(
                    '/api/city/get-by-search-name',
                    {
                        method: 'POST',
                        body:
                            JSON.stringify(
                                {
                                    searchName: citySearchTerm.toLowerCase(),
                                    countryCode: selectedCountryCode
                                }
                                ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );
            if ( cityData.cityArray.length > 200 && citySearchTerm === '' )
            {
                $cityArrayStoreByCountryCode = cityData.cityArray.slice( 0, 200 );
            }
            else
            {
                $cityArrayStoreByCountryCode = cityData.cityArray;
            }

            if ( $cityArrayStoreByCountryCode[ 0 ].countryCode !== selectedCountryCode )
            {
                $cityArrayStoreByCountryCode = [];
            }
        }
        catch ( error )
        {
            console.error( 'Error :' + error );
        }
        finally
        {
            $cityArrayStoreLoading = false;

            setTimeout(
                onInputFocus,
                50
                );
        }
    }

    // ~~

    function applyFilter(
        )
    {
        clearTimeout( debounceTimeout );
        debounceTimeout = setTimeout( handleSubmit, 1000 );
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            clearTimeout( debounceTimeout );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .city-select-modal-content
    {
        position: relative;

        width: 100%;
        min-width: 0;

        display: flex;
        flex: 1 1 0;
        flex-direction: column;
    }

    .city-select-search-input-container
    {
        position: relative;

        height: auto;
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

    .city-select-radio-group
    {
        overflow-y: auto;
    }

    .city-select-search-input
    {
        margin-top: 1rem;
        outline: none;
        width: 100%;
        border: none;
        border-radius: unset;
        padding: unset;
        padding-left: 1rem;

        background-color: transparent;

        font-size: 0.9rem;
        font-weight: 700;
        color: grayColor100;
    }

    .city-select-radio-group
    {
        -ms-overflow-style: none;
        position: absolute;
        top: 4rem;

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

    .city-select-modal-content:focus-within > .city-select-radio-group
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

    .loading
    {
        max-height: 3.5rem;
    }
</style>

{#if $showCitySelector}
    {#if $cityArrayStoreLoading}
        <div class="city-select-modal-content">
            <div class="city-select-search-input-container loading">
                <Loading isSmall={ true } />
            </div>
        </div>
    {:else}
        <div class="city-select-modal-content" on:click={ onInputFocus }>
            <div class="city-select-search-input-container">
                <div class="font-size-75 aaaa font-weight-500 color-gray-300 text-title">
                    { getLocalizedTextBySlug( 'personal-information-city', $languageTagStore ) }
                </div>
                <div>
                    <input
                        class="city-select-search-input"
                        placeholder={ getLocalizedTextBySlug( 'ad-search-city-label', $languageTagStore ) }
                        bind:value={ citySearchTerm }
                        bind:this={ selectElement }
                        on:keydown={ applyFilter }
                    />
                </div>
            </div>
            <div class="city-select-radio-group">
                {#each $cityArrayStoreByCountryCode as _city ( _city.id ) }
                    <label
                        id={ _city.id }
                        class="radio-input-container"
                        on:mousedown={ ( e ) => e.preventDefault() }
                    >
                        <input
                            type="radio"
                            checked={ _city.name === selectedCityName }
                            name="city-code"
                            value={ _city.code }
                            on:change={ () => onCitySelect( _city.name ) }
                        />
                        <div class="font-size-90 font-weight-500 color-gray-300">
                            { getLocalizedText( _city.name, $languageTagStore ) }
                            &#x2022; { getLocalizedText( _city.code, $languageTagStore ) }
                        </div>
                    </label>
                {/each}
            </div>
        </div>
    {/if}
{:else}
    <div class="city-select-modal-content" on:click={ onInputFocus }>
        <div class="city-select-search-input-container">
            <div class="font-size-75 font-weight-500 color-gray-300 text-title">
                { getLocalizedTextBySlug( 'personal-information-city', $languageTagStore ) }
            </div>
            <input
                class="city-select-search-input"
                placeholder={ getLocalizedTextBySlug( 'ad-search-city-label', $languageTagStore ) }
                bind:value={ citySearchTerm }
                bind:this={ selectElement }
                on:input=
                    {
                        () =>
                        {
                            selectedCityName = citySearchTerm;
                            dispatch( 'citySelected', citySearchTerm );
                        }
                    }
            />
        </div>
    </div>
{/if}

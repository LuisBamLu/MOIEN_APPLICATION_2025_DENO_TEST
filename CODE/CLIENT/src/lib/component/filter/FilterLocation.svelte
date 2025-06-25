<script>
    // -- IMPORTS

    import { onMount, createEventDispatcher } from 'svelte';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, clickOutside } from '$lib/base';
    import { getLocationBrowser } from '$lib/location';
    import { cityArrayStore } from '$store/cityArrayStore';
    import { selectedLocationStore } from '$src/lib/store/locationStore';

    // -- VARIABLES

    export let selectedCity = null;
    export let selectedCityName = null;
    export let selectedCountryName = null;

    let selectedCityId = null;
    let filteredCityArray = $cityArrayStore;
    let selectedCountryCode;
    let searchCityTerm = '';
    let isSearchCityActive = false;
    let formElement;
    let timer = null;
    let queryingDatabase = false;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleCitySelect(
        city
        )
    {
        searchCityTerm = getLocalizedText( city[ 'name' ] );
        selectedCityId = city.id.toLowerCase();
        selectedCountryCode = city.countryCode.toLowerCase();
        // selectedLocationStore.set( { latitude: city.latitude, longitude: city.longitude } );
        selectedCityName = city.name;
        selectedCountryName = city.countryName;

        dispatch( 'cityIdSelected', selectedCityId );
        dispatch( 'countryCodeSelected', selectedCountryCode );
        dispatch( 'currentCoordinatesSelected', null );
    }

    // ~~

    async function handleLocationBrowser(
        )
    {
        try
        {
            let { countryCode, latitude, longitude } = await getLocationBrowser();

            isSearchCityActive = false;

            selectedCountryCode = countryCode;
            // selectedLocationStore.set( { latitude: latitude, longitude: longitude } );

            dispatch( 'cityIdSelected', '' );
            dispatch( 'countryCodeSelected', selectedCountryCode );
            dispatch( 'currentCoordinatesSelected', [ latitude, longitude ] );
        }
        catch ( error )
        {
            console.error( 'Error handling location:', error );
        }
    }

    // ~~

    async function handleKeyUp(
        )
    {
        clearTimeout( timer );
        timer = setTimeout(
            () =>
            {
                formElement.requestSubmit();
            },
            1000
            )
    }

    // ~~

    async function fetchCities(
        searchTerm
        )
    {
        queryingDatabase = true;

        try
        {
            let result
                = await fetchData(
                    '/api/location/get-by-name',
                    {
                        method: 'POST',
                        body: getJsonText( { searchTerm } ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            if ( result.error )
            {
                alert( result.error );
            }
            else
            {
                filteredCityArray = result.cityArray;
            }
        }
        catch ( error )
        {
            console.error( 'Error fetching cities:', error );
        }

        finally
        {
            queryingDatabase = false;
        }
    }

    // ~~

    function handleSubmit(
        )
    {
        fetchCities( searchCityTerm );
    }

    // STATEMENTS

    onMount(
        async () =>
        {
            if ( selectedCity )
            {
                handleCitySelect( selectedCity );
                handleSubmit();
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .filter-location
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .filter-location-input
    {
        height: 3.5rem;
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 1rem 1rem 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background-color: grayColor950;
    }

    .filter-location-input-inner
    {
        width: 100%;

        background-color: transparent;
    }

    .filter-location-input-inner::placeholder
    {
        color: grayColor;
    }

    .filter-location-input-inner:focus-visible
    {
        outline: unset;
    }

    .filter-location-result
    {
        position: relative;

        overflow-y: auto;
        margin: 0;
        margin-bottom: 0.5rem;
        max-height: 10rem;
        width: 100%;
        padding: 0;
        padding-bottom: 0.5rem;
    }

    .filter-location-result-item
    {
        width: 100%;
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;

        cursor: pointer;
        transition: background-color 400ms ease-in-out;
        &:hover
        {
            +media( desktop )
            {
                background-color: grayBackgroundColor;

                transition: background-color 400ms ease-in-out;
            }
        }
    }

    .filter-location-result-item.is-selected
    {
        background-color: grayBackgroundColor;
    }

    .filter-location-close-to-me
    {
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;

        cursor: pointer;
        transition: background-color 400ms ease-in-out;
        &:hover
        {
            +media( desktop )
            {
                background-color: grayBackgroundColor;

                transition: background-color 400ms ease-in-out;
            }
        }
    }
</style>

<form
    class="filter-location"
    bind:this={ formElement }
    on:submit|preventDefault={ handleSubmit }
>
    <div
        class="filter-location-container"
        use:clickOutside
        on:clickOutside={ () => isSearchCityActive = false }
    >
        <div class="filter-location-input">
            <div class="green-search-icon size-150 filter-location-input-icon">
            </div>
            <input
                class="font-size-90 font-weight-500 color-gray filter-location-input-inner"
                type="text"
                placeholder={ getLocalizedTextBySlug( 'location-search-placeholder' ) }
                bind:value={ searchCityTerm }
                on:focus={ () => isSearchCityActive = true }
                on:keyup={ handleKeyUp }
            />
        </div>
        {#if isSearchCityActive }
            <div class="filter-location-result">
                {#if filteredCityArray.length === 0 }
                    <div class="font-size-75 font-weight-700 color-black filter-location-result-item">
                        { getLocalizedTextBySlug( 'location-search-no-results-label' ) }
                    </div>
                {:else if queryingDatabase }
                    <div class="font-size-75 font-weight-700 color-black filter-location-result-item">
                        { getLocalizedTextBySlug( 'location-searching-label' ) }
                    </div>
                {:else}
                    {#each filteredCityArray as city }
                        <button
                            type="button"
                            class="filter-location-result-item { selectedCityId === city.id ? 'is-selected' : '' }"
                            on:click={ () => handleCitySelect( city ) }
                        >
                            <div class="gray-place-icon size-150 filter-location-result-item-icon">
                            </div>
                            <div class="font-size-75 font-weight-700 color-black filter-location-result-item-label">
                                { getLocalizedText( city[ 'name' ] ) }, { city[ 'countryCode' ] }
                            </div>
                        </button>
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
    {#if !isSearchCityActive }
        <button
            type="button"
            class="filter-location-close-to-me"
            on:click={ handleLocationBrowser }
        >
            <div class="green-location-icon size-150 filter-location-close-to-me-icon"/>
            <div class="font-size-75 font-weight-500 color-gray filter-location-close-to-me-label">
                { getLocalizedTextBySlug( 'location-search-close-to-me-label' ) }
            </div>
        </button>
    {/if}
</form>

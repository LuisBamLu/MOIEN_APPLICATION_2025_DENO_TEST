<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { createEventDispatcher, onMount } from 'svelte';
    import Input from '$component/element/Input.svelte';

    // -- VARIABLES

    /** @type {{cityId: any, cityName: any, selectedCountryCode: any}} */
    let { cityId = $bindable(), cityName = $bindable(), selectedCountryCode } = $props();
    let dispatch = createEventDispatcher();
    let cityArray = [];
    let filteredCityArray = $state([]);
    let searchTerm;
    run(() => {
        searchTerm = getLocalizedText( cityName, $languageTagStore );
    });
    let isActive = $state(false);
    let timer = null;
    let isLoading = $state(true);

    // -- FUNCTIONS

    function handleCityChange(
        city
        )
    {
        cityId = city.id;
        cityName = city.name;
        searchTerm = getLocalizedText( city.name, $languageTagStore );
        isActive = false;
        dispatch( 'change', city );
    }

    // ~~

    async function handleSearchChange(
        )
    {
        isLoading = true;
        clearTimeout( timer );
        timer = setTimeout(
            async () =>
            {
                let result
                    = await fetchData(
                        '/api/city',
                        {
                            method: 'POST',
                            body: JSON.stringify(
                                {
                                    type: 'searchBySearchName',
                                    searchName: searchTerm,
                                    countryCode: selectedCountryCode
                                }
                                ),
                            headers: { 'Content-Type': 'application/json' }
                        }
                        );

                cityArray = result.cityArray;
                filteredCityArray = cityArray;
            },
            1000
            );
        isLoading = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/city', { method: 'POST' } );
            cityArray = result.cityArray;
            filteredCityArray = cityArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus" >
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .city-input-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .city-result-container
    {
        position: relative;
    }

    .city-result
    {
        z-index: 998;
        position: absolute;

        overflow-y: scroll;
        height: 8rem;
        width: 100%;
        border: 2px solid grayColor700;
        border-radius: 0.25rem;

        display: flex;
        flex-direction: column;

        background-color: grayColor950;

        transition: visibility;
        transition-delay: 100ms;
    }

    .city-result.is-hidden
    {
        visibility: hidden;
    }

    .city-item
    {
        z-index: 999;

        width: 100%;
        border-bottom: 1px solid grayColor700;
        padding: 0.5rem;

        background-color: transparent;

        text-align: left;

        cursor: pointer;
    }
</style>

<div class="city-input-container">
    <Input
        label={ getLocalizedTextBySlug( 'city-label' ) }
        on:change={ handleSearchChange }
        bind:value={ searchTerm }
        bind:shrink={ isActive }
    />
    <div class="city-result-container">
        <div class="city-result" class:is-hidden={ !isActive } >
            {#if isLoading }
                <div class="font-size-75 font-weight-500 color-gray-100">
                    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                </div>
            {:else}
                {#each filteredCityArray as city }
                    <button
                        class="font-size-75 font-weight-500 color-gray-100 city-item"
                        onclick={() => handleCityChange( city )}
                    >
                        { getLocalizedText( city.name, $languageTagStore ) } &#x2022; { getLocalizedText( city.code, $languageTagStore ) }
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</div>

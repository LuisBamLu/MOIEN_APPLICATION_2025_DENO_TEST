<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { createEventDispatcher, onMount } from 'svelte';
    import Input from '$component/element/Input.svelte';
    import { countryArrayStore } from '$store/countryArrayStore';

    // -- VARIABLES

    /** @type {{countryCode: any, countryName: any}} */
    let { countryCode = $bindable(), countryName = $bindable() } = $props();
    let dispatch = createEventDispatcher();
    let filteredCountryArray = $state($countryArrayStore);
    let searchTerm;
    run(() => {
        searchTerm = getLocalizedText( countryName, $languageTagStore );
    });
    let isActive = $state(false);
    let isLoading = true;

    // -- FUNCTIONS

    function handleCountryChange(
        country
        )
    {
        countryCode = country.code;
        countryName = country.name;
        searchTerm = getLocalizedText( country.name, $languageTagStore );
        dispatch( 'change', country );
    }

    // ~~

    function handleSearchChange(
        )
    {
        filteredCountryArray = $countryArrayStore.filter( option => option.name.toLowerCase().includes( searchTerm.toLowerCase() ) );
    }

</script>

<style lang="stylus" >
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .country-input-container
    {
        position: relative;

        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .country-result-container
    {
        position: relative;
    }

    .country-result
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

    .country-result.is-hidden
    {
        visibility: hidden;
    }

    .country-item
    {
        width: 100%;
        border-bottom: 1px solid grayColor700;
        padding: 0.5rem;

        background-color: transparent;

        text-align: left;
    }
</style>

<div class="country-input-container">
    <Input
        label={ getLocalizedTextBySlug( 'country-label' ) }
        on:change={ handleSearchChange }
        bind:value={ searchTerm }
        bind:shrink={ isActive }
    />
    <div class="country-result-container">
        <div class="country-result" class:is-hidden={ !isActive }>
            {#if isLoading }
                <div class="font-size-75 font-weight-500 color-gray-100">
                    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                </div>
            {:else}
                {#each filteredCountryArray as country }
                    <button
                        class="font-size-75 font-weight-500 color-gray-100 country-item"
                        onclick={() => handleCountryChange( country )}
                    >
                        { getLocalizedText( country.name, $languageTagStore ) }
                    </button>
                {/each}
            {/if}
        </div>
    </div>
</div>

<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import ModalHeader from '../../modal/ModalHeader.svelte';
    import ModalContent from '../../modal/ModalContent.svelte';
    import ModalActions from '../../modal/ModalActions.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';

    // -- VARIABLES

    export let cityArray;
    export let selectedCountryCode;
    export let selectedCity;
    export let selectedCityId;
    export let selectedCityName;
    export let isEditingCity;
    let cityId = selectedCityId;
    let city = selectedCity;
    let citySearchTerm = selectedCityName;
    let timer = null;
    let form;
    let isQueryingDatabase = false;

    // -- FUNCTIONS

    async function handleKeyUp(
        )
    {
        clearTimeout( timer );
        timer =
            setTimeout(
                () =>
                {
                    if ( form )
                    {
                        form.requestSubmit();
                    }
                },
                1000
                );
    }

    // ~~

    function save(
        )
    {
        selectedCity = city;
        selectedCityId = cityId;
        selectedCityName = city.name;
        selectedCountryCode = city.countryCode;
        isEditingCity = false
    }

    // ~~

    function clear(
        )
    {
        city = null;
        cityId = null
        selectedCity = null;
        selectedCityId = null;
        selectedCityName = null;
        citySearchTerm = '';
        isEditingCity = false;
    }

    // ~~

    async function handleSubmit(
        )
    {
        if ( isQueryingDatabase )
        {
            return false;
        }

        isQueryingDatabase = true;

        try
        {
            let cityData
                = await fetchData(
                    '/api/city/get-by-search-name',
                    {
                        method: 'POST',
                        body: JSON.stringify( { searchName: citySearchTerm, countryCode: selectedCountryCode } ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            cityArray = cityData.cityArray;
        }
        catch ( error )
        {
            console.error( 'Error :' + error );
        }
        finally
        {
            isQueryingDatabase = false;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( selectedCountryCode && selectedCity === null && form )
            {
                form.requestSubmit();
            }
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
        overflow-y: auto;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        -ms-overflow-style: none;
        scrollbar-width: none;
        width: 100%;
    }

    .city-select-search-input-container
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: white;
    }

    .city-select-radio-group
    {
        overflow-y: auto;
    }

    .city-select-search-input
    {
        outline: none;
        border: none;
        border-radius: unset;
        padding: unset;

        background-color: transparent;

        font-size: 0.9rem;
        color: grayColor100;
    }

    .radio-input-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        p
        {
            color: grayColor500;
        }
    }
</style>

<ModalRoot isOpen={ isEditingCity }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'ad-select-city-label', $languageTagStore ) }
        onClose={ () => isEditingCity = false }
    />
    <ModalContent>
        <div class="city-select-modal-content">
            <form
                class="city-select-search-input-container"
                on:submit|preventDefault={ handleSubmit }
                bind:this={ form }
            >
                <div class="gray-search-icon size-150" />
                <input
                    class="city-select-search-input"
                    placeholder={ getLocalizedTextBySlug( 'ad-search-city-label', $languageTagStore ) }
                    name="search-term"
                    on:keyup={ handleKeyUp }
                    bind:value={ citySearchTerm }
                />
            </form>
            <div class="city-select-radio-group">
                {#if isQueryingDatabase }
                    <div class="font-size-90 font-weight-500 color-gray-300">
                       { getLocalizedTextBySlug( 'location-searching-label', $languageTagStore ) }
                    </div>
                {:else}
                    {#each cityArray as _city ( _city.id ) }
                        <label class="radio-input-container">
                            <input
                                type="radio"
                                value={ _city.id }
                                name="city-id"
                                bind:group={ cityId }
                                on:change={ () => { city = _city } }
                            />
                            <div class="font-size-90 font-weight-500 color-gray-300">
                                { getLocalizedText( _city.name, $languageTagStore ) }
                                &#x2022; { getLocalizedText( _city.code, $languageTagStore ) }
                                {#if _city.countryCode !== selectedCountryCode}
                                    <p class="font-size-75">
                                        &#x2022; This city is located in { _city.countryName }.
                                    </p>
                                {/if}
                            </div>
                        </label>
                    {/each}
                {/if}
            </div>
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'filter-clear-all-button', $languageTagStore ) }
            on:click={ clear }
        />
        <ModalButton
            text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            on:click={ save }
        />
    </ModalActions>
</ModalRoot>

<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalHeader from '../../modal/ModalHeader.svelte';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import ModalContent from '../../modal/ModalContent.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';
    import ModalActions from '../../modal/ModalActions.svelte';

    // -- VARIABLES

    export let selectedCountry;
    export let selectedCountryCode;
    export let countryArray;
    export let selectedCountryName;
    export let selectedCity;
    export let isEditingCountry;
    let country = selectedCountry;
    let countryCode = selectedCountryCode;
    let countryName = selectedCountryName;
    let countrySearchTerm = selectedCountryName;
    $: filteredCountryArray = countryArray.filter( option => option.name.toLowerCase().includes( countrySearchTerm.toLowerCase() ) )

    // -- FUNCTIONS

    function save(
        )
    {
        selectedCountry = country;
        selectedCountryCode = countryCode;
        selectedCountryName = countryName;

        if ( selectedCity !== null && selectedCity.countryCode !== countryCode )
        {
            selectedCity = null;
        }

        isEditingCountry = false;
    }

    // ~~

    function clear(
        )
    {
        country = null;
        countryCode = null;
        countryName = '';
        countrySearchTerm = '';
        selectedCountry = null;
        selectedCountryCode = null;
        selectedCountryName = '';
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .country-select-modal-content
    {
        overflow-y: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .country-select-search-input-container
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: white;
    }

    .country-select-radio-group
    {
        overflow-y: auto;
    }

    .country-select-search-input
    {
        outline: none;
        border: none;
        border-radius: unset;
        padding: unset;

        background-color: transparent;

        font-size: 0.9rem;
        color: grayColor100;
    }

    .country-select-country-radio-input-flag
    {
        height: 1.25rem;
        width: 1.75rem;
    }
</style>

<ModalRoot isOpen={ isEditingCountry } >
    <ModalHeader
        title={ getLocalizedTextBySlug( 'filter-select-country-label', $languageTagStore ) }
        onClose={ () => isEditingCountry = false }
    />
    <ModalContent>
        <div class="country-select-modal-content">
            <div class="country-select-search-input-container">
                <div class="gray-search-icon size-150" />
                <input
                    class="country-select-search-input"
                    placeholder={ getLocalizedTextBySlug( 'ad-search-country-label', $languageTagStore ) }
                    bind:value={ countrySearchTerm }
                />
            </div>
            <div class="country-select-radio-group">
                {#each filteredCountryArray as _country }
                    <label class="radio-input-container">
                        <input
                            type="radio"
                            value={ _country.code }
                            name="country-code"
                            bind:group={ countryCode }
                            on:change={ () => country = _country }
                        />
                        <img
                            class="country-select-country-radio-input-flag"
                            src="/image/flag/{ _country.code }.svg"
                            alt='flag'
                        >
                        <div class="font-size-90 font-weight-500 color-gray-300">
                            { getLocalizedText( _country.name, $languageTagStore ) }
                        </div>
                    </label>
                {/each}
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

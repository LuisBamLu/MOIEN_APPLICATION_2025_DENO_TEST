<script>
    // -- IMPORT

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let countryCode;
    export let countryName;
    let countrySearchTerm = '';
    $: filteredCountryArray = $countryArrayStore.filter( option => option.name.toLowerCase().includes( countrySearchTerm.toLowerCase() ) );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .country-filter-search-input-container
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: white;
    }

    .country-filter-search-input
    {
        outline: none;
        border: none;
        padding: unset;

        background-color: transparent;

        font-size: 0.9rem;
        color: grayColor100;
    }

    .country-filter-radio-input-flag
    {
        height: 1.25rem;
        width: 1.75rem;
    }

    .country-filter-radio-group
    {
        overflow-y: auto;
    }
</style>

<div class="country-filter-search-input-container">
    <div class="gray-search-icon size-150" />
    <input
        class="country-filter-search-input"
        placeholder={ getLocalizedTextBySlug( 'ad-search-country-label', $languageTagStore ) }
        bind:value={ countrySearchTerm }
    />
</div>
<div class="country-filter-radio-group">
    {#each filteredCountryArray as country }
        <label class="radio-input-container">
            <input
                type="radio"
                value={ country.code }
                name="country-code"
                bind:group={ countryCode }
                on:change={ () => countryName = getLocalizedText( country.name, $languageTagStore ) }
            />
            <img
                class="country-filter-radio-input-flag"
                src="/image/flag/{ country.code }.svg"
                alt='flag'
            >
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedText( country.name, $languageTagStore ) }
            </div>
        </label>
    {/each}
</div>

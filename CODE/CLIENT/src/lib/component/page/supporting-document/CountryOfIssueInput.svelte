<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import InputModal from '$component/element/InputModal.svelte';
    import CountryFilter from '$component/page/supporting-document/CountryFilter.svelte';
    import { enableScroll } from '$lib/scroll';

    // -- VARIABLES

    export let countryCode;
    let selectedCountryCode = countryCode;
    let countryName;
    let selectedCountryName = null;
    let isEditing = false;

    // -- FUNCTIONS

    function save(
        )
    {
        countryCode = selectedCountryCode;
        countryName = selectedCountryName;
        isEditing = false;

        enableScroll();
    }

    // ~~

    function clear(
        )
    {
        countryCode = null;
        selectedCountryCode = null;
        countryName = null;
        selectedCountryCode = null;
    }
</script>

<Accordion
    value={ countryName }
    label={ getLocalizedTextBySlug( 'supporting-documents-page-country-of-issue', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'ad-select-country-label', $languageTagStore ) }
    bind:isEditing={ isEditing }
>
    <InputModal
        heading={ getLocalizedTextBySlug( 'supporting-documents-page-country-of-issue', $languageTagStore ) }
        save={ save }
        clear={ clear }
        bind:isEditing={ isEditing }
    >
        <CountryFilter
            bind:countryCode={ selectedCountryCode }
            bind:countryName={ selectedCountryName }
        />
    </InputModal>
</Accordion>

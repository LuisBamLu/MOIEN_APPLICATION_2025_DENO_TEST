<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { getLocalizedMonthDayTextFromDateText } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { totalGuestCounterStore } from '$store/bookingStore';
    import { isDesktopMapOpenStore, isDesktopListOpenStore, isMobileMapOpenStore, isMobileListOpenStore } from '$store/locationStore';
    import PropertiesSearchPopup from '$component/page/properties/PropertiesSearchPopup.svelte';
    import PropertiesFilterPopup from '$component/page/properties/PropertiesFilterPopup.svelte';

    // -- VARIABLES

    export let selectedCity;
    export let selectedCountry;
    export let arrivalDate;
    export let departureDate;

    let selectedCityName = selectedCity ? selectedCity.name : '';
    let selectedCountryName = selectedCountry ? selectedCountry.name : '';

    // -- STATEMENTS

    $: selectedCityName = selectedCity ? selectedCity.name : '';
    $: selectedCountryName = selectedCountry ? selectedCountry.name : '';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-search
    {
        position: relative;

        overflow: hidden;
        height: 3.25rem;
        width: 100%;
        max-width: 20.5rem;

        display: flex;
        justify-content: center;
    }

    .properties-filter-search-bar
    {
        z-index: 1;

        width: 100%;
        border-radius: 2rem;
        padding: 0.75rem 1rem;

        display: flex;
        flex-direction: row;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor950;

        +media( desktop )
        {
            max-width: 30rem;
        }
    }

    .properties-filter-search.is-desktop-list-open .properties-filter-search-bar,
    .properties-filter-search.is-desktop-map-open .properties-filter-search-bar
    {
        +media( desktop )
        {
            max-width: 30rem;
        }
    }

    .properties-filter-search.is-desktop-map-open.is-desktop-list-open .properties-filter-search-bar
    {
        +media( desktop )
        {
            max-width: 100%;
        }
    }
</style>

<div
    class="properties-filter-search"
    class:is-mobile-map-open={ $isMobileMapOpenStore }
    class:is-mobile-list-open={ $isMobileListOpenStore }
    class:is-desktop-map-open={ $isDesktopMapOpenStore }
    class:is-desktop-list-open={ $isDesktopListOpenStore }
>
    <div class="properties-filter-search-bar">
        <PropertiesSearchPopup
            selectedCity={ selectedCity }
            arrivalDate={ arrivalDate }
            departureDate={ departureDate }
            bind:selectedCityName={ selectedCityName }
            bind:selectedCountryName={ selectedCountryName }
        />
        <PropertiesFilterPopup
            selectedCity={ selectedCity }
        />
    </div>
</div>

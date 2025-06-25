<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { getLocalizedShortMonthDayTextFromDateText } from '$lib/base';
    import { updateUrlParameter } from '$lib/url';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import { totalGuestCounterStore } from '$store/bookingStore';
    import FilterLocation from '$component/filter/FilterLocation.svelte';
    import FilterGuest from '$component/filter/FilterGuest.svelte';
    import FilterDate from '$component/filter/FilterDate.svelte';
    import * as Modal from '$component/modal';
    import { slide } from 'svelte/transition';

    // -- VARIABLES

    export let selectedCity;
    export let selectedCityName = '';
    export let selectedCountryName = '';
    export let arrivalDate;
    export let departureDate;

    let showPropertiesSearchPopup = false;
    let dateRange;
    let activeAccordionName = null;

    // -- FUNCTIONS

    function closePopup(
        )
    {
        showPropertiesSearchPopup = false;
    }

    // ~~

    function handleDropdown(
        accordionName
        )
    {
        if ( activeAccordionName === accordionName )
        {
            activeAccordionName = null;

            return;
        }

        activeAccordionName = accordionName;
    }

    // ~~

    function handleCityIdSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.propertyParameters.cityId = event.detail;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleCountryCodeSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.propertyParameters.countryCode = event.detail;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleCurrentCoordinatesSelected(
        event
        )
    {
        let currentCoordinates = null;

        if ( event.detail )
        {
            currentCoordinates = event.detail.toString();
        }

        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.locationParameters.currentCoordinates = currentCoordinates;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleGuestCounter(
        event
    )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.bookingParameters.adultCount = event.detail.adult;
                updatedParameters.bookingParameters.childrenCount = event.detail.children;
                updatedParameters.bookingParameters.infantCount = event.detail.infant;
                updatedParameters.bookingParameters.petCount = event.detail.pet;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleDateSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.bookingParameters.arrivalDate = event.detail.arrivalDate;
                updatedParameters.bookingParameters.departureDate = event.detail.departureDate;

                return updatedParameters;
            }
            );
    }

    // ~~

    function handleSearchParametersClearAll(
        )
    {
        filterParameterByKeyMapStore.set(
            {
                propertyParameters: {},
                locationParameters: {},
                bookingParameters: {},
                featureParameters: {}
            }
            );

        updateUrlParameter( $filterParameterByKeyMapStore );

        closePopup();
    }

    // ~~

    function handleTogglePropertiesSearchPopup(
        )
    {
        showPropertiesSearchPopup = !showPropertiesSearchPopup;
    }

    // ~~

    function handleSearchParametersShowResults(
        )
    {
        updateUrlParameter( $filterParameterByKeyMapStore );

        closePopup();
    }

    // -- STATEMENTS

    if ( arrivalDate && departureDate )
    {
        dateRange = [ new Date( arrivalDate ), new Date( departureDate ) ];
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-search-popup-container
    {
        overflow-y: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .properties-search-popup-item
    {
        border: 2px solid grayColor800;
        border-radius: 0.75rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: grayColor950;
    }

    .properties-search-popup-item-button
    {
        height: 3.5rem;
        width: 100%;
        padding: 0.75rem 1rem;

        display: flex;
        gap: 2rem;
        justify-content: space-between;
        align-items: center;
    }

    .properties-search-popup-item-button-wrapper
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }

    :global( .properties-search-popup-item.is-selected .properties-search-popup-item-dropdown )
    {
        width: 100%;

        display: flex !important;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;
    }

    :global( .properties-search-popup-item.is-selected .properties-search-popup-item-dropdown >div)
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-search-bar-search-container
    {
        height: auto;
        width: 100%;

        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        gap: 0.75rem;
        justify-content: space-between;
        align-items: center;
    }

    .properties-filter-search-bar-search
    {
        flex-shrink: 0;

        background-color: greenColor500;
    }

    .properties-filter-search-bar-location-date
    {
        overflow: hidden;
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: flex-start;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .properties-search-popup-item.is-selected
    {
        padding: 2rem 1.5rem;
    }

    .properties-search-popup-item.is-selected .properties-search-popup-item-button
    {
        height: auto;
        padding: 0;
    }

    .properties-search-popup-item.is-selected .properties-search-popup-item-icon
    {
        display: none;
    }

    .properties-search-popup-item p
    {
        transition: all 400ms cubic-bezier( 0.76, 0, 0.27, 1 );
    }

    .properties-search-popup-item.is-selected p
    {
        font-size: 1.25rem;
        font-weight: 600;
    }
</style>

<button
    class="properties-filter-search-bar-search-container"
    on:click={ handleTogglePropertiesSearchPopup }
>
    <div class="gray-search-icon size-150 properties-filter-search-bar-search"/>
    <div class="properties-filter-search-bar-location-date">
        <div
            class="font-size-90 color-gray-400 properties-filter-search-bar-location"
            class:is-filled={ selectedCountryName || selectedCityName }
        >
            {#if selectedCountryName && selectedCityName }
                { getLocalizedText( selectedCityName ) },
                { getLocalizedText( selectedCountryName ) }
            {:else if selectedCountryName }
                { getLocalizedText( selectedCountryName ) }
            {:else if selectedCityName }
                { getLocalizedText( selectedCityName ) }
            {:else}
                { getLocalizedTextBySlug( 'filter-your-search-label' ) }
            {/if}
        </div>
        {#if arrivalDate && departureDate }
            <div class="font-size-75 font-weight-500 color-gray-400 properties-filter-search-bar-date">
                { getLocalizedShortMonthDayTextFromDateText( arrivalDate ) }
                - { getLocalizedShortMonthDayTextFromDateText( departureDate ) }
                {#if $totalGuestCounterStore }
                    &#x2022; { $totalGuestCounterStore }
                    { getLocalizedTextBySlug( 'filter-guests-label' ) }
                {/if}
            </div>
        {/if}
    </div>
</button>

<Modal.Root isOpen={ showPropertiesSearchPopup } --mobile-modal-overlay-top="-4rem">
    <Modal.Header
        title={ getLocalizedTextBySlug( 'filter-search-button' ) }
        onClose={ closePopup }
    />
    <Modal.Content>
        <div class="properties-search-popup-container">
            <div
                class="properties-search-popup-item"
                class:is-selected={ activeAccordionName === 'where-to-accordion' }
            >
                <button
                    class="properties-search-popup-item-button"
                    on:click={ () => handleDropdown( 'where-to-accordion' ) }
                    aria-expanded="true"
                    aria-controls="where-to"
                    id="where-to-button"
                >
                    <div class="properties-search-popup-item-button-wrapper">
                        <div class="green-place-icon size-100 properties-search-popup-item-icon">
                        </div>
                        <p class="font-size-75 font-weight-500 color-black properties-search-popup-country-label">
                            { getLocalizedTextBySlug( 'location-title' ) }
                        </p>
                    </div>
                    <div class="font-size-75 font-weight-700 color-black properties-search-popup-country-value">
                        {#if selectedCityName }
                            { getLocalizedText( selectedCityName ) }
                        {/if}
                    </div>
                </button>
                {#if activeAccordionName === 'where-to-accordion'}
                    <div
                        class="properties-search-popup-item-dropdown"
                        id="where-to"
                        role="region"
                        aria-labelledby="where-to-button"
                        transition:slide
                    >
                        <FilterLocation
                            selectedCity={ selectedCity }
                            bind:selectedCityName={ selectedCityName }
                            bind:selectedCountryName={ selectedCountryName }
                            on:cityIdSelected={ handleCityIdSelected }
                            on:countryCodeSelected={ handleCountryCodeSelected }
                            on:currentCoordinatesSelected={ handleCurrentCoordinatesSelected }
                        />
                    </div>
                {/if}
            </div>
            <div
                class="properties-search-popup-item"
                class:is-selected={ activeAccordionName === 'when-accordion' }
            >
                <button
                    class="properties-search-popup-item-button"
                    on:click={ () => handleDropdown( 'when-accordion' ) }
                    aria-expanded="true"
                    aria-controls="when"
                    id="when-button"
                >
                    <div
                        class="properties-search-popup-item-button-wrapper"
                    >
                        <div class="green-calendar-icon size-100 properties-search-popup-item-icon">
                        </div>
                        <p class="font-size-75 font-weight-500 color-black properties-search-popup-calendar-label">
                            { getLocalizedTextBySlug( 'date-title' ) }
                        </p>
                    </div>
                    <div class="font-size-75 font-weight-700 color-black properties-search-popup-calendar-value">
                        {#if arrivalDate && departureDate }
                            { getLocalizedShortMonthDayTextFromDateText( arrivalDate ) }
                            - { getLocalizedShortMonthDayTextFromDateText( departureDate ) }
                        {/if}
                    </div>
                </button>
                {#if activeAccordionName === 'when-accordion'}
                    <div
                        class="properties-search-popup-item-dropdown"
                        id="when"
                        role="region"
                        aria-labelledby="when-button"
                        transition:slide
                    >
                        <FilterDate on:dateSelected={ handleDateSelected } />
                    </div>
                {/if}
            </div>
            <div
                class="properties-search-popup-item"
                class:is-selected={ activeAccordionName === 'guest-count-accordion' }
            >
                <button
                    class="properties-search-popup-item-button"
                    on:click={ () => handleDropdown( 'guest-count-accordion' ) }
                    aria-expanded="true"
                    aria-controls="guest-count"
                    id="guest-count-button"
                >
                    <div class="properties-search-popup-item-button-wrapper">
                        <div class="green-guests-icon size-100 properties-search-popup-item-icon">
                        </div>
                        <p class="font-size-75 font-weight-500 color-black properties-search-popup-guests-label">
                            { getLocalizedTextBySlug( 'guest-title' ) }
                        </p>
                    </div>
                    <div class="font-size-75 font-weight-700 color-black properties-search-popup-guests-value">
                        {#if $totalGuestCounterStore }
                            { $totalGuestCounterStore }
                            { getLocalizedTextBySlug( 'filter-guests-label' ) }
                        {/if}
                    </div>
                </button>
                {#if activeAccordionName === 'guest-count-accordion'}
                    <div
                        class="properties-search-popup-item-dropdown"
                        id="guest-count"
                        role="region"
                        aria-labelledby="guest-count-button"
                        transition:slide
                    >
                        <FilterGuest on:guestCounter={ handleGuestCounter } />
                    </div>
                {/if}
            </div>
        </div>
    </Modal.Content>
    <Modal.Actions>
        <Modal.Button
            variant="light"
            text={ getLocalizedTextBySlug( 'filter-clear-all-button' ) }
            on:click={ handleSearchParametersClearAll }
        />
        <Modal.Button
            text={ getLocalizedTextBySlug( 'filter-show-results-button' ) }
            on:click={ handleSearchParametersShowResults }
        />
    </Modal.Actions>
</Modal.Root>

<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import TravellingDataCard from './TravellingDataCard.svelte';
    import { bookedPropertyStore, totalGuestCounterStore } from '$src/lib/store/bookingStore';
    import Accordion from '../../element/Accordion.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { slide } from 'svelte/transition';
    import CitySelectModal from '../ad/CitySelectModal.svelte';
    import { cityArrayStore } from '$src/lib/store/cityArrayStore';
    import Tag from '../../element/Tag.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';

    // -- VARIABLES

    export let cityName;
    export let selectedCity;
    export let vehicleTypeByIdMap;
    export let selectedVehicleTypeId;
    export let handleSubmit = () => {};
    export let errorMap = {};
    let cityArray = $cityArrayStore;
    let selectedCityId = '';
    let countryCode = '';
    let isEditingCity = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../mixin.styl';
    @import '../../../../constant.styl';

    // -- CLASSES

    .step-container
    {
        height: calc( 100dvh - 12rem );
        width: 100%;
        padding: 0 1.5rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            width: 100vw;
            max-width: 46rem;
            padding: 0;
        }
    }

    .checkout-page-emission-head-section
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        text-align: center;
    }

    .checkout-page-heading-image-medium
    {
        height: 5.475rem;
    }

    .checkout-page-emission-travelling-data-section
    {
        width: 100%;
        max-width: 46rem;

        display: flex;
        gap: 1.5rem;
    }

    .checkout-page-emission-departure-section
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .checkout-page-vehicles-section
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .checkout-page-vehicles-tags
    {
        width: 100%;
        padding-bottom: 1rem;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .desktop-button-container
    {
        display: none;

        +media( desktop )
        {
            width: 100%;

            display: flex;
            justify-content: center;
        }
    }
</style>

<div class="step-container">
    <section class="checkout-page-emission-head-section">
        <img
            src="/image/supporting-documents/heading.svg"
            alt="heading"
            class="checkout-page-heading-image-medium"
        />
        <div class="font-size-125 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'booking-checkout-page-contribute', $languageTagStore ) }
        </div>
        <div class="font-size-90 font-weight-500 color-gray-300 checkout-page-emission-ecotree" transition:slide>
            {@html getLocalizedTextBySlug( 'booking-checkout-page-ecotree-text-with-anchor-tag', $languageTagStore ) }
        </div>
    </section>
    <section class="checkout-page-emission-travelling-data-section">
        <TravellingDataCard
            label={ getLocalizedTextBySlug( 'booking-checkout-page-travelers', $languageTagStore ) }
            dataText="{ $totalGuestCounterStore ?? 1 } { getLocalizedTextBySlug( 'booking-checkout-page-people' ) }"
        />
        <TravellingDataCard
            label={ getLocalizedTextBySlug( 'booking-checkout-page-destination', $languageTagStore ) }
            dataText={ $bookedPropertyStore.cityName ?? '...' }
        />
    </section>
    <section class="checkout-page-emission-departure-section">
        <Accordion
            label={ getLocalizedTextBySlug( 'booking-checkout-page-where-are-you-traveling-from', $languageTagStore ) }
            value={ cityName }
            helper={ getLocalizedTextBySlug( 'booking-checkout-page-select-departure-city', $languageTagStore ) }
            error={ errorMap?.[ 'cityName' ] }
            bind:isEditing={ isEditingCity }
        >
            <CitySelectModal
                cityArray={ cityArray }
                bind:isEditingCity={ isEditingCity }
                bind:selectedCountryCode={ countryCode }
                bind:selectedCity={ selectedCity }
                bind:selectedCityId={ selectedCityId }
                bind:selectedCityName={ cityName }
            />
        </Accordion>
    </section>
    <section class="checkout-page-vehicles-section">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'booking-checkout-page-how-do-you-travel', $languageTagStore ) }
        </div>
        <div class="checkout-page-vehicles-tags">
            {#each Object.values( vehicleTypeByIdMap ) as vehicleType }
                <Tag
                    name={ vehicleType.id }
                    label={ getLocalizedText( vehicleType.label, $languageTagStore ) }
                    isSelected={ selectedVehicleTypeId === vehicleType.id }
                    on:change={ () => selectedVehicleTypeId = vehicleType.id }
                />
            {/each}
        </div>
    </section>
    <div class="desktop-button-container">
        <ModalButton
            fullWidth={ false }
            --modal-action-button-padding="0.8125rem 7.5rem"
            text={ getLocalizedTextBySlug( 'booking-checkout-page-estimate-emissions', $languageTagStore ) }
            on:click={ handleSubmit }
        />
    </div>
</div>

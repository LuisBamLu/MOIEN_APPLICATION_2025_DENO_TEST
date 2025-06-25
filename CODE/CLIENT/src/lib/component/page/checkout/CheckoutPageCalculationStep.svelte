<script>
    // -- IMPORTS

    import { bookedPropertyStore, totalGuestCounterStore } from '$src/lib/store/bookingStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import Counter from '$component/element/Counter.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { getFormattedPrice } from '$src/lib/base';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { fade } from 'svelte/transition';

    // -- VARIABLES

    export let selectedCity;
    export let distance;
    export let selectedVehicleType;
    export let carbonEmission;
    export let compensation;
    export let handleSubmit = () => {};
    let isCalculationModalOpen = false;

    // -- FUNCTIONS

    function handleCompensationChange(
        { detail }
        )
    {
        if ( detail === 'increase' )
        {
            compensation++;
        }
        else
        {
            compensation--;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../mixin.styl';
    @import '../../../../constant.styl';

    // -- CLASSES

    .step-container
    {
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

    .dialog
    {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .checkout-page-calculation-modal-section
    {
        height: 80%;
        width: 90%;
        border: 1px solid grayColor700;
        border-radius: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        background-color: white;

        +media( desktop )
        {
            height: 60%;
            width: 70%;
        }
    }

    .checkout-page-calculation-modal-calculation
    {
        width: 100%;
        padding: 1rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: start;
    }

    .checkout-page-calculation-modal-explanation
    {
        width: 100%;
        padding: 1rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: center;
        align-items: center;

        text-align: start;
    }

    .desktop-button-container
    {
        display: none;

        +media( desktop )
        {
            width: 100%;

            display: flex;
        }
    }

    .calculation-details-button
    {
        height: 3.25rem;
        border-radius: 0.75rem;
        padding: 0.8125rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: whiteColor;
    }
</style>

<div class="step-container">
    {#if isCalculationModalOpen }
        <div
            role="button"
            tabindex="0"
            class="dialog"
            on:click={ () => { isCalculationModalOpen = false } }
            on:keydown={ () => { isCalculationModalOpen = false } }
            transition:fade
        >
            <section class="checkout-page-calculation-modal-section">
                <div class="checkout-page-calculation-modal-calculation">
                    <div class="font-size-125 font-weight-700 color-gray-100">
                        { getLocalizedTextBySlug( 'distance-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-100 font-weight-700 color-gray-100">
                        { `${ selectedCity.name } - ${ $bookedPropertyStore.cityName } = ${ distance }km` }
                    </div>
                    <div class="font-size-125 font-weight-700 color-gray-100">
                        <br>
                        { getLocalizedTextBySlug( 'emission-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-100 font-weight-700 color-gray-100">
                        { getLocalizedText( selectedVehicleType.label, $languageTagStore ) } :
                        {
                            ( selectedVehicleType.fourPassangers !== undefined && $totalGuestCounterStore > 2 )
                            ? selectedVehicleType.fourPassangers
                            : selectedVehicleType.grams
                        } g
                        { distance }
                        *
                        {
                            ( selectedVehicleType.fourPassangers !== undefined && $totalGuestCounterStore > 2 )
                            ? selectedVehicleType.fourPassangers
                            : selectedVehicleType.grams
                        } / 1000 =
                        { carbonEmission.toFixed( 2 ) } kg CO²
                    </div>
                </div>
                <div class="checkout-page-calculation-modal-explanation">
                    <div class="font-size-100 font-weight-700 color-gray-100">
                        { getLocalizedTextBySlug( 'booking-checkout-page-carbon-compensation-explanation', $languageTagStore ) }
                    </div>
                </div>
            </section>
        </div>
    {/if}
    <section class="checkout-page-emission-head-section">
        <img
            src="/image/supporting-documents/heading.svg"
            alt="heading"
            class="checkout-page-heading-image-big"
        />
        <div class="font-size-100 font-weight-700 color-gray-300">
            { getLocalizedTextBySlug( 'booking-checkout-page-carbon-emissions', $languageTagStore ) }
        </div>
        <div class="font-size-150 font-weight-600 color-gray-100">
            { `${ carbonEmission.toFixed( 2 ) } kg / CO²` }
        </div>
        <button
            class="calculation-details-button font-size-100 font-weight-700 color-blue"
            on:click={ () => isCalculationModalOpen = true }
        >
            { getLocalizedTextBySlug( 'booking-checkout-page-calculation-details', $languageTagStore ) }
        </button>
        <div class="display-flex align-items-center flex-direction-column flex-direction-row-desktop gap-150">
            <div class="font-size-90 font-weight-700 color-gray-100 text-align-left">
                { getLocalizedTextBySlug( 'booking-checkout-page-capture-emissions', $languageTagStore ) }
            </div>
            <Counter
                maxCount={ 1000 }
                bind:count={ compensation }
                on:change={ handleCompensationChange }
                --counter-gap="1.5rem"
            >
                {
                    getFormattedPrice(
                        compensation,
                        $languageTagStore,
                        $profileSignedInStore.currencyCode ?? 'EUR'
                        )
                }
            </Counter>
        </div>
    </section>
    <div class="desktop-button-container justify-content-center">
        <ModalButton
            --modal-action-button-padding="0.8125rem 7.5rem"
            fullWidth={ false }
            text={ getLocalizedTextBySlug( 'onboarding-next-label', $languageTagStore ) }
            on:click={ handleSubmit }
        />
    </div>
</div>

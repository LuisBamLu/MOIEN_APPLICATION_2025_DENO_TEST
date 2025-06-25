<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { getFormattedPrice } from '$src/lib/base';

    // -- VARIABLES

    export let handleSubmitBooking = () => {}
    export let isSubmitting;
    export let checkoutStepArray;
    export let activeStep;
    export let totalPrice;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .checkout-page-button-container
    {
        z-index: 2;
        position: fixed;
        bottom: 4rem;

        width: 100%;
        border-top: 1px solid lightGrayBorderColor;
        padding: 1rem 1.5rem ;

        display: flex;
        justify-content: center;

        background-color: pageBackgroundColor;

        +media( desktop )
        {
            display: none;
        }
    }
</style>

<div class="checkout-page-button-container">
    <ModalButton
        isLoading={ isSubmitting }
        on:click={ handleSubmitBooking }
    >
        {#if checkoutStepArray[ activeStep ] === 'Emission Start' }
            { getLocalizedTextBySlug( 'booking-checkout-page-estimate-emissions', $languageTagStore ) }
        {:else if checkoutStepArray[ activeStep ] === 'Emission Calculation' }
            { getLocalizedTextBySlug( 'onboarding-next-label', $languageTagStore ) }
        {:else if checkoutStepArray[ activeStep ] === 'Payment' }
            { getLocalizedTextBySlug( 'booking-checkout-page-book-now-for', $languageTagStore ) }
            { getFormattedPrice( totalPrice, $languageTagStore ) }
        {:else}
            { getLocalizedTextBySlug( 'booking-checkout-page-close-label', $languageTagStore ) }
        {/if}
    </ModalButton>
</div>

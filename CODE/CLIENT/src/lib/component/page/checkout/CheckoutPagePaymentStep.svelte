<script>
    // -- IMPORTS

    import { bookedPropertyStore } from '$store/bookingStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import PropertyMiniCard from '$component/element/PropertyMiniCard.svelte';
    import Alert from '$component/element/Alert.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import Switch from 'senselogic-flow/Switch.svelte';
    import AccountBankingInformationCardModal from '../account/AccountBankingInformationCardModal.svelte';
    import CheckoutPagePriceRules from './CheckoutPagePriceRules.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { getFormattedPrice } from '$lib/base';
    import { Browser } from '@capacitor/browser';
    import { profileSignedInStore } from '$store/profileStore';
    import ProfileImage from '$component/layout/ProfileImage.svelte';
    import { getProcessedMultilineTranslatedText } from '$src/lib/textProcessor';

    // -- VARIABLES

    export let nightCount;
    export let compensation;
    export let donation;
    export let totalPrice;
    export let basePrice;
    export let hasInstantBooking;
    export let paymentMethodArray;
    export let selectedPaymentMethodId;
    export let featureByTypeIdMap;
    export let isLoading;
    export let isSubmitting = false;
    export let getExtraFee = ( featureTypeId ) => {};
    export let populatePaymentMethodArrayFromPaymentMethodMap = ( paymentMethodMap ) => {};
    export let handleSubmit = () => {};
    let isCreateCardModalOpen = false;
    let payInInstallments = false;

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

        +media( desktop )
        {
            padding: 0 1rem;

            display: flex;
            gap: 3rem;
            align-items:flex-start;
        }

        +media( desktop-large )
        {
            padding: 0;
        }
    }

    .checkout-page-payment-step-content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 46rem;
        }
    }

    .checkout-page-book-now-payment-methods
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .checkout-page-book-now-installment-plan
    {
        margin-bottom: 0.75rem;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .checkout-page-toggler-container
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 1rem 0;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .checkout-page-book-now-terms
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        +media( desktop )
        {
            margin-bottom: 6.125rem;
        }
    }

    .mobile-price-rules-container
    {
        width: 100%;

        +media( desktop )
        {
            display: none;
        }
    }

    .desktop-price-rules-container
    {
        display: none;

        +media( desktop )
        {
            min-width: 27.875rem;
            border: 1px solid grayColor800;
            border-radius: 1.5rem;
            padding: 1.5rem;

            display: flex;
            flex-direction: column;
            gap: 1rem;

            background: grayColor950;
        }
    }

    .terms-of-sales-button
    {
        width: fit-content;
    }
</style>

<div class="step-container">
    <div class="checkout-page-payment-step-content-container">
        <PropertyMiniCard
            bookingData={ $bookedPropertyStore }
        />
        <Alert
            type="informative"
            text={ getLocalizedTextBySlug( 'booking-checkout-page-donation-alert', $languageTagStore ) }
        />
        <div class="mobile-price-rules-container">
            <CheckoutPagePriceRules
                basePrice={ basePrice }
                nightCount={ nightCount }
                compensation={ compensation }
                totalPrice={ totalPrice }
                featureByTypeIdMap={ featureByTypeIdMap }
                getExtraFee={ getExtraFee }
                bind:donation={ donation }
            />
        </div>
        {#if hasInstantBooking }
            <div class="checkout-page-book-now-payment-methods">
                <div class="font-size-100 font-weight-700 color-gray-100">
                    { getLocalizedTextBySlug( 'booking-checkout-page-payment-method', $languageTagStore ) }
                </div>
                {#if isLoading }
                    <Loading
                        --outter-height="auto"
                    />
                {:else}
                    <RadioCardGroup
                        bind:optionArray={ paymentMethodArray }
                        bind:selected={ selectedPaymentMethodId }
                    />
                {/if}
                <ModalButton
                    variant="light"
                    on:click={ () => { isCreateCardModalOpen = true; isLoading = true } }
                >
                    <div class="add-icon size-150"/>
                    { getLocalizedTextBySlug( 'booking-checkout-page-add-new-payment', $languageTagStore ) }
                </ModalButton>
            </div>
            <div class="checkout-page-book-now-installment-plan">
                <div class="checkout-page-toggler-container">
                    <div class="font-size-90 font-weight-700 color-black checkout-page-toggler-label">
                        { getLocalizedTextBySlug( 'booking-checkout-page-payment-in-two-times-label', $languageTagStore ) }
                    </div>
                    <Switch value={ payInInstallments }/>
                </div>
                <div class="margin-top-75 margin-bottom-75">
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'booking-checkout-page-payment-in-two-times-description', $languageTagStore ) }
                    </div>
                </div>
            </div>
        {/if}
        <div class="checkout-page-book-now-terms display-flex flex-direction-column gap-75">
            <button
                type="button"
                class="font-size-90 font-weight-700 color-gray-100 padding-bottom-25 terms-of-sales-button"
                on:click={ () => Browser.open( { url: `/${ $languageTagStore }/terms#5` } ) }
            >
                { getLocalizedTextBySlug( 'booking-checkout-page-terms-of-sales', $languageTagStore ) }
            </button>

            <span class="font-size-90 font-weight-500 color-gray-300">
                {
                    @html getProcessedMultilineTranslatedText( getLocalizedTextBySlug( 'terms-of-sales-text', $languageTagStore ) )
                }
            </span>
        </div>
    </div>
    <div class="desktop-price-rules-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'summary-label', $languageTagStore ) }
        </div>
        <CheckoutPagePriceRules
            basePrice={ basePrice }
            nightCount={ nightCount }
            compensation={ compensation }
            totalPrice={ totalPrice }
            featureByTypeIdMap={ featureByTypeIdMap }
            getExtraFee={ getExtraFee }
            bind:donation={ donation }
        />
        <ModalButton
            isLoading={ isSubmitting }
            on:click={ handleSubmit }
        >
            { getLocalizedTextBySlug( 'booking-checkout-page-book-now-for', $languageTagStore ) }
            {
                getFormattedPrice(
                   Number( totalPrice ) * $bookedPropertyStore.conversionRate,
                   $languageTagStore,
                   $profileSignedInStore.currencyCode ?? 'EUR'
                   )
            }
        </ModalButton>
    </div>
</div>
<AccountBankingInformationCardModal
    isOpen={ isCreateCardModalOpen }
    onClose=
        {
            ( card ) =>
            {
                populatePaymentMethodArrayFromPaymentMethodMap(
                    {
                        cardArray: card ? [ card ] : [],
                        walletArray: [],
                        bankAccountArray: []
                    }
                    );
                selectedPaymentMethodId = paymentMethodArray[ paymentMethodArray.length - 1 ].value;
                isCreateCardModalOpen = false;
                isLoading = false;
            }
        }
/>

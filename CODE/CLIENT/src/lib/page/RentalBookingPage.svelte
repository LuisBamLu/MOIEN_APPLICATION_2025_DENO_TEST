<script>

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import Loading from '$component/element/Loading.svelte';
    import RentalBookingCard from '$component/page/rental-booking/RentalBookingCard.svelte';
    import RentalBookingDetailsStep from '$component/page/rental-booking/RentalBookingDetailsStep.svelte';
    import RentalBookingPageHeader from '$component/page/rental-booking/RentalBookingPageHeader.svelte';
    import RentalBookingPaymentStep from '$component/page/rental-booking/RentalBookingPaymentStep.svelte';
    import RentalBookingRefundStep from '$component/page/rental-booking/RentalBookingRefundStep.svelte';
    import RentalBookingPageActions from '$component/page/rental-booking/RentalBookingPageActions.svelte';
    import Alert from '$component/element/Alert.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { fade } from 'svelte/transition';
    import { linear } from 'svelte/easing';

    // -- VARIABLES

    export let id;
    let stepTitleSlugArray =
        [
            'rental-booking-page-booking-details-label',
            'current-stays-page-payment-label',
            'rental-booking-page-refund-label'
        ];
    let activeStepIndex = 0;
    let rentalBooking = {};
    let property = {};
    let rentalDayByDateMap = {};
    let selectedPaymentMethodId = '';
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/page/rental-booking/' + id,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            rentalBooking = result.rentalBooking;
            property = result.property;
            rentalDayByDateMap = result.rentalDayByDateMap;

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .rental-booking-page
    {
        position: relative;

        margin-bottom: 4rem;
        padding: 0rem 1rem;
        padding-bottom: 6.75rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
        }
    }

    .rental-booking-page-content-container
    {
        width: 100%;
        padding-top: 2rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( stepTitleSlugArray[ activeStepIndex ] ) }
    </title>
</svelte:head>

<div class="rental-booking-page">
    <RentalBookingPageHeader
        activeStepLabel={ stepTitleSlugArray[ activeStepIndex ] }
        bind:activeStepIndex={ activeStepIndex }
    />
    <div class="rental-booking-page-content-container">
        {#if isLoading }
            <Loading />
        {:else}
            <RentalBookingCard
                property={ property }
                rentalBooking={ rentalBooking }
            />
            {#key activeStepIndex}
                <div
                    out:fade={ { duration: 350, easing: linear } }
                    in:fade={ { delay: 350, duration: 350, easing: linear } }
                >
                    {#if activeStepIndex === 1 && rentalBooking.status === 'requested' }
                        <Alert type="warning" text={ getLocalizedTextBySlug( 'wait-for-host-confirmation', $languageTagStore ) }/>
                    {:else if activeStepIndex === 1 && rentalBooking.status === 'cancelled' }
                        <Alert type="error" text={ getLocalizedTextBySlug( 'cancelled-rental-booking-payment', $languageTagStore ) }/>
                    {/if}
                    {#if activeStepIndex === 0 }
                        <RentalBookingDetailsStep
                            rentalBooking={ rentalBooking }
                            property={ property }
                            rentalDayByDateMap={ rentalDayByDateMap }
                        />
                    {:else if activeStepIndex === 1 }
                        <RentalBookingPaymentStep bind:selectedPaymentMethodId={ selectedPaymentMethodId }/>
                    {:else if activeStepIndex === 2 }
                        <RentalBookingRefundStep bind:selectedPaymentMethodId={ selectedPaymentMethodId }/>
                    {/if}
                </div>
            {/key}
        {/if}
    </div>
    <RentalBookingPageActions
        property={ property }
        selectedPaymentMethodId={ selectedPaymentMethodId }
        bind:rentalBooking={ rentalBooking }
        bind:activeStepIndex={ activeStepIndex }
    />
</div>

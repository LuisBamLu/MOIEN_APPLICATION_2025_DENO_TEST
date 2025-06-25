<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let id;
    let isLoading = true;
    let paymentSucceeded = false;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let queryParameters = new URLSearchParams( window.location.search );
            let transactionStatus = queryParameters.get( 'status' );
            paymentSucceeded = transactionStatus === 'succeeded';

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .confirm-booking-payment-page
    {
        overflow-y: auto;
        height: calc( 100dvh - 4.5rem );

        display: flex;
        justify-content: center;
        align-items: center;
    }

    .content-container
    {
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem ;
        justify-content: center;
        align-items: center;
        -ms-overflow-style: none;
        scrollbar-width: none;
        margin-top: headerHeight;
        margin-bottom: footerHeight;

        +media( desktop )
        {
            max-width: calc( var( --viewport-width ) * 0.35 );
            padding: 2rem;
        }
    }

    .checkout-page-arrow-link-container
    {
        display: flex;
        gap: 0.5rem;
    }

    .confirm-booking-payment-page.success
    {
        background-color: blueColor950;
    }

    .confirm-booking-payment-page.error
    {
        background-color: redColor950;
    }
</style>

<div
    class="confirm-booking-payment-page"
    class:success={ !isLoading && paymentSucceeded }
    class:error={ !isLoading && !paymentSucceeded }
>
    {#if isLoading }
        <Loading />
    {:else}
        {#if paymentSucceeded }
            <div class="content-container">
                <img
                    src="/image/supporting-documents/heading.svg"
                    alt="heading"
                    class="checkout-page-heading-image-big"
                />
                <div class="font-size-125 font-weight-600 color-black">
                    { getLocalizedTextBySlug( 'booking-checkout-page-booking-confirmed', $languageTagStore ) }
                </div>
                <a
                    class="checkout-page-arrow-link-container"
                    href="/dashboard/rental-booking/{ id }"
                    use:link
                >
                    <div class="green-right-arrow-icon size-150" />
                    <div class="font-size-90 font-weight-700 color-green">
                        { getLocalizedTextBySlug( 'booking-checkout-page-view-details', $languageTagStore ) }
                    </div>
                </a>
            </div>
        {:else}
            <div class="content-container">
                <img
                    src="/image/supporting-documents/heading.svg"
                    alt="heading"
                    class="checkout-page-heading-image-big"
                />
                <div class="font-size-125 font-weight-600 color-black">
                    { getLocalizedTextBySlug( 'confirm-payment-page-payment-failed-label', $languageTagStore ) }
                </div>
            </div>
        {/if}
    {/if}
</div>

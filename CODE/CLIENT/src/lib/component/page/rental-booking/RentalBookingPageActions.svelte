<script>
    // -- IMPORTS

    import { Browser } from '@capacitor/browser';
    import { getJsonObject, getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { gtag } from '$lib/tracking';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let activeStepIndex = 0;
    export let rentalBooking = {};
    export let property;
    export let selectedPaymentMethodId;
    export let errorMessage = '';
    let isPastRentalBooking = Date.now() > new Date( rentalBooking.departureDate ).getTime();
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleContinue(
        )
    {
        if ( activeStepIndex === 0 )
        {
            if ( rentalBooking.status === 'paid' )
            {
                activeStepIndex = 2;
            }
            else
            {
                activeStepIndex++;
            }
        }
        else if ( activeStepIndex === 1 && rentalBooking.status === 'confirmed' )
        {
            let data =
                {
                    propertyUserId: property.userId,
                    price: rentalBooking.totalPrice - rentalBooking.donation,
                    paymentMethodId: selectedPaymentMethodId,
                    rentalBooking,
                    browserInfo:
                        {
                            JavaEnabled: navigator.javaEnabled(),
                            Language: navigator.language,
                            ColorDepth: window.screen.colorDepth,
                            ScreenHeight: window.screen.height,
                            ScreenWidth: window.screen.width,
                            TimeZoneOffset: new Date().getTimezoneOffset(),
                            UserAgent: navigator.userAgent,
                            JavascriptEnabled: true
                        }
                };

            isSubmitting = true;
            errorMessage = '';

            let bookingData = await fetchData(
                '/api/pay-rental-booking/pay',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText( { data: data, type: 'addRentalBooking' } )
                }
                );

            gtag(
                'event',
                'purchase',
                {
                    'event_category': 'booking',
                    'event_label': 'booking_step_' + activeStepIndex,
                    'value': rentalBooking.totalPrice - rentalBooking.donation,
                    'day_count': rentalBooking?.dayCount
                }
                );

            if ( bookingData.secureModeRedirectUrl )
            {
                Browser.open( { url: bookingData.secureModeRedirectUrl } );
            }

            if ( bookingData.error )
            {
                toast.error( bookingData.error );
            }

            isSubmitting = false;
        }
        else if ( activeStepIndex === 2 )
        {
            isSubmitting = true;

            if ( isPastRentalBooking )
            {
                toast.error( 'Cannot cancel past rental booking' );
            }

            if ( rentalBooking.status === 'paid' )
            {
                let result
                    = await fetchData(
                        '/api/rental-booking/cancel/' + rentalBooking.id,
                        {
                            method: 'POST',
                            credentials: 'include'
                        }
                        );

                gtag(
                    'event',
                    'refund',
                    {
                        'event_category': 'booking',
                        'event_label': 'booking_step_' + activeStepIndex,
                        'value': rentalBooking.totalPrice - rentalBooking.donation,
                        'day_count': rentalBooking?.dayCount
                    }
                    );

                rentalBooking = result.rentalBooking;
            }
            else
            {
                let result
                    = await fetchData(
                        '/api/rental-booking/update/' + rentalBooking.id,
                        {
                            method: 'POST',
                            body: getJsonText( { rentalBooking: { status: 'cancelled' } } ),
                            credentials: 'include'
                        }
                        );

                rentalBooking = result.rentalBooking;
            }

            isSubmitting = false;
        }
    }
</script>
<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .page-actions
    {
        position: fixed;
        bottom: 4rem;

        width: 100%;
        border-top: 2px solid lightGrayBorderColor;
        padding: 1rem;

        display: flex;
        gap: 3rem;
        justify-content: center;

        background-color: grayColor900;

        +media( desktop )
        {
            bottom: 0;
        }
    }
</style>

<div class="page-actions">
    <ModalButton
        variant="light"
        text={ getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
        fullWidth={ false }
    />
    <ModalButton
        variant="contained"
        text=
            {
                getLocalizedTextBySlug(
                    activeStepIndex === 0
                    ? 'auth-continue-button'
                    : activeStepIndex === 1
                    ? 'rental-booking-page-confirm-and-pay-booking-label'
                    : 'rental-booking-page-cancel-booking-label',
                    $languageTagStore
                    )
            }
        fullWidth={ false }
        isLoading={ isSubmitting }
        disabled=
            {
                ( activeStepIndex === 1 && rentalBooking.status !== 'confirmed' )
                || ( activeStepIndex === 2 && isPastRentalBooking )
            }
        on:click={ handleContinue }
    />
</div>

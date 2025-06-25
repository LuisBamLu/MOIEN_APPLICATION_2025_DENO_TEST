<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { navigate } from 'svelte-routing';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import ModalHeader from '../../modal/ModalHeader.svelte';
    import ModalActions from '../../modal/ModalActions.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';
    import ModalContent from '../../modal/ModalContent.svelte';

    // -- VARIABLES

    export let bookingId;
    export let isOpen = false;
    export let bookingStatus = null;
    let showItinerary = false;

    // -- FUNCTIONS

    function handleClose(
        )
    {
        isOpen = false;
        navigate( '/dashboard/events' );
    }

    // ~~

    function getBookingStatusText(
        )
    {
        switch ( bookingStatus )
        {
            case 'paid':
                return 'booking-checkout-page-booking-paid';
            case 'confirmed':
                return 'booking-checkout-page-booking-confirmed';
            default:
                return 'booking-checkout-page-booking-requested';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../mixin.styl';
    @import '../../../../constant.styl';

    // -- CLASSES

    .content-container
    {
        width: 100%;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        background-color: blueColor950;
    }

    .checkout-page-arrow-link-container
    {
        display: flex;
        gap: 0.5rem;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'account-transfer-to-account-modal-success-title', $languageTagStore ) }
        onClose={ handleClose }
    />
    {#if showItinerary }
        <ModalContent>
            <div class='font-size-125 font-weight-700'>
                { getLocalizedTextBySlug( 'booking-checkout-page-itinerary' ) }
            </div>
        </ModalContent>
    {:else}
        <div class="content-container">
            <img
                src="/image/supporting-documents/heading.svg"
                alt="heading"
                class="checkout-page-heading-image-big"
            />
            <div class="font-size-125 font-weight-600 color-black">
                {
                    getLocalizedTextBySlug(
                        getBookingStatusText(),
                        $languageTagStore
                        )
                }
            </div>
            <div class="checkout-page-arrow-link-container">
                <div class="green-right-arrow-icon size-150" />
                <button
                    class="font-size-90 font-weight-700 color-green"
                    on:click={ () => navigate( '/dashboard/rental-booking/' + bookingId ) }
                >
                    { getLocalizedTextBySlug( 'booking-checkout-page-view-details', $languageTagStore ) }
                </button>
            </div>
        </div>
    {/if}
    <ModalActions>
        <ModalButton
            text={ getLocalizedTextBySlug( 'filter-close-button', $languageTagStore ) }
            on:click={ handleClose }
        />
    </ModalActions>
</ModalRoot>

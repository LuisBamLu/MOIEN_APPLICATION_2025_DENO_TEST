<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getMap } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import PaymentSection from '$component/page/current-stays/PaymentSection.svelte';
    import BookingDetailsSection from '$component/page/current-stays/BookingDetailsSection.svelte';
    import RentalBookingGuestProfile from '$component/page/current-stays/RentalBookingGuestProfile.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { toast } from '$src/lib/toast';

    // -- VARIABLES

    export let isOpen = false;
    export let rentalBooking = {};
    export let profileByUserIdMap;
    export let propertyByIdMap;
    export let rentalDayArray = [];
    export let rentalBookingArrayByPropertyIdMap;
    export let rentalBookingArray;
    export let rentalBookingByIdMap;
    $: rentalDayByDateMap = getMap( rentalDayArray, 'date' );
    let isSubmitting = false;

    // -- FUNCTIONS

    async function handleClick(
        )
    {
        if ( rentalBooking.status === 'confirmed' || rentalBooking.status === 'paid' )
        {
            navigate( '/conversation/' + rentalBooking.propertyId + '/' + rentalBooking.userId + '/' + 'contact' );
        }
        else
        {
            isSubmitting = true;
            let result
                = await fetchData(
                    '/api/rental-booking/confirm/' + rentalBooking.id,
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );

            if ( result.error )
            {
                toast.error(
                    getLocalizedTextBySlug(
                        'current-stays-page-property-already-booked-error',
                        {
                            arrivalDate:
                                new Date( result.arrivalDate ).toLocaleDateString(
                                    $languageTagStore,
                                    { dateStyle: 'medium', timeZone: 'UTC' }
                                    ),
                            departureDate:
                                new Date( result.departureDate ).toLocaleDateString(
                                    $languageTagStore,
                                    { dateStyle: 'medium', timeZone: 'UTC' }
                                    )
                        },
                        $languageTagStore
                        )
                    );

                isSubmitting = false;
            }
            else
            {
                rentalBooking = result.rentalBooking;
                isSubmitting = false;
                isOpen = false;
            }
        }
    }

    // ~~

    async function handleCancelBooking(
        )
    {
        isSubmitting = true;
        let result
            = await fetchData(
                '/api/rental-booking/cancel/' + rentalBooking.id,
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

        rentalBookingArrayByPropertyIdMap[ rentalBooking.propertyId ] =
            rentalBookingArrayByPropertyIdMap[ rentalBooking.propertyId ].filter( _rentalBooking => _rentalBooking.id !== rentalBooking.id );
        rentalBookingArray = rentalBookingArray.filter( _rentalBooking => _rentalBooking.id !== rentalBooking.id );
        delete rentalBookingByIdMap[ rentalBooking.id ];

        rentalBooking = result.rentalBooking;
        isSubmitting = false;
        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .content-container.wait
    {
        cursor: wait;
    }
</style>

<ModalRoot bind:isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'current-stays-page-booking-label', $languageTagStore ) }
        onClose={ () => { isOpen = false; rentalBooking = null } }
    />
    <ModalContent>
        <div class="content-container" class:wait={ isSubmitting } >
            <RentalBookingGuestProfile
                profile={ profileByUserIdMap[ rentalBooking.userId ] }
                dayCount={ rentalBooking.dayCount ?? 0 }
                guestCount={ rentalBooking.guestCount ?? 0 }
                totalPrice={ Number( rentalBooking.totalPrice ) }
            />
            <BookingDetailsSection
                guestCount={ rentalBooking.guestCount }
                arrivalDate={ rentalBooking.arrivalDate }
                departureDate={ rentalBooking.departureDate }
                creationTimestamp={ rentalBooking.creationTimestamp }
            />
            <PaymentSection
                rentalBooking={ rentalBooking }
                property={ propertyByIdMap[ rentalBooking.propertyId ] }
                bind:rentalDayByDateMap={ rentalDayByDateMap }
            />
            <EditLeaseContractPageSection
                label={ getLocalizedTextBySlug( 'current-stays-page-contact-traveller-label', $languageTagStore ) }
            >
                <div class="font-size-90 font-weight-500 color-green">
                    { profileByUserIdMap[ rentalBooking.userId ].phonePrefix }
                    { profileByUserIdMap[ rentalBooking.userId ].phoneNumber }
                </div>
            </EditLeaseContractPageSection>
            <ModalButton
                variant="outlined"
                text={ getLocalizedTextBySlug( 'current-stays-page-cancel-booking-label', $languageTagStore ) }
                isLoading={ isSubmitting }
                on:click={ handleCancelBooking }
            />
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            text=
                {
                    rentalBooking.status === 'confirmed' || rentalBooking.status === 'paid'
                    ? getLocalizedTextBySlug( 'current-stays-page-send-a-message-label', $languageTagStore )
                    : getLocalizedTextBySlug( 'current-stays-page-confirm-booking-label', $languageTagStore )
                }
            isLoading={ isSubmitting }
            on:click={ handleClick }
        />
    </ModalActions>
</ModalRoot>

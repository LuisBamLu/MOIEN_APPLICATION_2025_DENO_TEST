<script>
    //  -- IMPORTS

    import { onMount } from 'svelte';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import { fetchData, getNormalCaseFromSnakeCaseString } from '$lib/base';
    import ProfileAccordion from './ProfileAccordion.svelte';
    import PropertyAccordion from './PropertyAccordion.svelte';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import Input from '$component/element/Input.svelte';
    import PaymentAccordion from './PaymentAccordion.svelte';

    // -- VARIABLES

    /** @type {{rentalBookingId: any, selectedRentalBookingIndex: any, isOpen?: boolean}} */
    let { rentalBookingId, selectedRentalBookingIndex = $bindable(), isOpen = false } = $props();
    let rentalBooking = $state(null);
    let property = $state(null);
    let guestProfile = $state(null);
    let hostProfile = $state(null);
    let rentalBookingStatusArray = $state([]);
    let cancellationPolicyArray = $state([]);
    let paymentArray = $state([]);
    let isLoading = $state(true);

    // -- FUNCTIONS

    function handleFeeChange(
        fieldName,
        value
        )
    {
        let previousValue = rentalBooking[ fieldName ];
        rentalBooking.totalPrice += value - ( previousValue ?? 0 );
        rentalBooking[ fieldName ] = value;
    }

    // ~~

    function handleDateChange(
        )
    {
        let arrivalDateMilisecondCount = new Date( rentalBooking.arrivalDate ).getTime();
        let departureDateMilisecondCount = new Date( rentalBooking.departureDate ).getTime();
        let dayCount = ( departureDateMilisecondCount - arrivalDateMilisecondCount ) / 86400000;
        property.dayCount = dayCount;
    }

    // ~~

    async function handleSubmit(
        )
    {
        let result
            = await fetchData(
                '/api/rental-booking/update/' + rentalBookingId,
                {
                    method: 'POST',
                    body: getJsonText( { rentalBooking } ),
                    credentials: 'include'
                }
                );
        rentalBooking = result.rentalBooking;
        selectedRentalBookingIndex = null;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result =
                await fetchData( '/api/admin/rental-booking/get-by-id/' + rentalBookingId, { method: 'POST', credentials: 'include' }  );

            rentalBooking = result.rentalBooking;
            property = result.property;
            guestProfile = result.guestProfile;
            hostProfile = result.hostProfile;
            rentalBookingStatusArray = result.rentalBookingStatusArray;
            cancellationPolicyArray = result.cancellationPolicyArray;
            paymentArray = result.paymentArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'rental-booking-label', $languageTagStore ) }
        onClose={ () => selectedRentalBookingIndex = null }
    />
    <ModalContent>
        <div class="content-container">
            {#if isLoading }
                { getLocalizedTextBySlug( 'loading-label' ) }
            {:else}
                <div class="display-flex flex-direction-column gap-100 padding-bottom-100">
                    <LabelledSelect
                        label={ getLocalizedTextBySlug( 'status-label', $languageTagStore ) }
                        bind:value={ rentalBooking.status }
                    >
                        {#each rentalBookingStatusArray as rentalBookingStatus }
                            <option value={ rentalBookingStatus.id }>
                                { getLocalizedText( rentalBookingStatus.name, $languageTagStore ) }
                            </option>
                        {/each}
                    </LabelledSelect>
                    <LabelledSelect
                        label={ getLocalizedTextBySlug( 'cancellation-policy-label', $languageTagStore ) }
                        bind:value={ rentalBooking.cancellationPolicyId }
                    >
                        {#each cancellationPolicyArray as cancellationPolicy }
                            <option value={ cancellationPolicy.id }>
                                { getLocalizedText( cancellationPolicy.name, $languageTagStore ) }
                            </option>
                        {/each}
                    </LabelledSelect>
                    <Input
                        label={ getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }
                        type="date"
                        bind:value={ rentalBooking.arrivalDate }
                        on:change={ handleDateChange }
                    />
                    <Input
                        label={ getLocalizedTextBySlug( 'events-page-check-out-label', $languageTagStore ) }
                        type="date"
                        bind:value={ rentalBooking.departureDate }
                        on:change={ handleDateChange }
                    />
                    <Input
                        label={ getLocalizedTextBySlug( 'admin-payment-manager-page-donation-amount-label', $languageTagStore ) }
                        type="number"
                        bind:value={ rentalBooking.donation }
                    />
                    <Input
                        label={ getLocalizedTextBySlug( 'filter-price-label', $languageTagStore ) }
                        type="number"
                        bind:value={ rentalBooking.totalPrice }
                    />
                    {#each Object.entries( rentalBooking ) as [ fieldName, fieldValue ] }
                        {#if fieldName.includes( 'Fee' ) }
                            <Input
                                label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                                value={ fieldValue }
                                on:change={ ( e ) => { handleFeeChange( fieldName, e.detail ) } }
                                type="number"
                            />
                        {/if}
                    {/each}
                </div>
                {#if guestProfile }
                    <ProfileAccordion label={ getLocalizedTextBySlug( 'guest-label' ) } profile={ guestProfile } />
                {/if}
                {#if hostProfile }
                    <ProfileAccordion  label={ getLocalizedTextBySlug( 'host-label' ) } profile={ hostProfile } />
                {/if}
                {#if property }
                    <PropertyAccordion property={ property } />
                {/if}
                {#each paymentArray as payment, index }
                    <PaymentAccordion
                        label={ getLocalizedTextBySlug( 'current-stays-page-payment-label', $languageTagStore ) + ' ' + ( index + 1 )  }
                        payment={ payment }
                    />
                {/each}
            {/if}
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton on:click={ handleSubmit }>
            { getLocalizedTextBySlug( 'admin-rental-booking-manager-page-update-rental-booking-label', $languageTagStore ) }
        </ModalButton>
    </ModalActions>
</ModalRoot>

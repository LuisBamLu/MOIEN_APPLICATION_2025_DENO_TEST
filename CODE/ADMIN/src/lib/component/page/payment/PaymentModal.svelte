<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import AccordionItem from '$component/element/AccordionItem.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import { fetchData, getNormalCaseFromSnakeCaseString } from '$lib/base';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{paymentId?: any, isOpen?: boolean, selectedPaymentIndex?: any}} */
    let { paymentId = null, isOpen = false, selectedPaymentIndex = $bindable(null) } = $props();
    let payment = $state(null);
    let payerProfile = $state(null);
    let payeeProfile = $state(null);
    let transaction = $state(null);
    let property = $state(null);
    let paymentType = $state(null);
    let paymentStatus = $state(null);
    let formatter = new Intl.NumberFormat( $languageTagStore, { style: 'currency', currency: 'EUR' } );
    let isRefundable = $state(false);
    let isLoading = $state(true);

    // -- FUNCTIONS

    async function handleCancel(
        )
    {
        let result = await fetchData( '/api/payment/cancel/' + paymentId, { method: 'POST', credentials: 'include' } );

        if ( result )
        {
            selectedPaymentIndex = null;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/payment/get-by-id/' + paymentId, { method: 'POST', credentials: 'include' } );
            payment = result.payment;
            payerProfile = result.payerProfile;
            payeeProfile = result.payeeProfile;
            transaction = result.transaction;
            property = result.property;
            paymentType = result.paymentType;
            paymentStatus = result.paymentStatus;
            isRefundable = result.isRefundable;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .container
    {
        padding: 0.25rem 0;

        display: flex;
        gap: 0.5rem;
    }

    .profile-container
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .profile-image
    {
        width: 3.5rem;
        width: 3.5rem;
        border-radius: 50%;
    }
</style>

<ModalRoot isOpen={ isOpen } >
    <ModalHeader
        title={ getLocalizedTextBySlug( 'current-stays-page-payment-label', $languageTagStore ) }
        onClose={ () => selectedPaymentIndex = null }
    />
    <ModalContent>
        <div class="content-container">
            {#if isLoading }
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            {:else}
                {#if !isRefundable && payment.typeId !== 'refund' }
                    <div class="font-size-100 font-weight-700 color-red">
                        { getLocalizedTextBySlug( 'admin-payment-manager-page-this-payment-has-been-refunded-label', $languageTagStore ) }
                    </div>
                {/if}
                <div class="container">
                    <div class="font-size-75 font-weight-600 color-gray-100">
                        { getLocalizedTextBySlug( 'transfer-to-account-modal-amount-label', $languageTagStore ) }:
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-100">
                        { formatter.format( payment.amount ) }
                    </div>
                </div>
                {#if paymentStatus }
                    <div class="container">
                        <div class="font-size-75 font-weight-600 color-gray-100">
                            { getLocalizedTextBySlug( 'status-label', $languageTagStore ) }:
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-100">
                            { getLocalizedText( paymentStatus.name, $languageTagStore ) }
                        </div>
                    </div>
                {/if}
                {#if paymentType }
                    <div class="container">
                        <div class="font-size-75 font-weight-600 color-gray-100">
                            { getLocalizedTextBySlug( 'type-label', $languageTagStore ) }:
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-100">
                            { getLocalizedText( paymentType.name, $languageTagStore ) }
                        </div>
                    </div>
                {/if}
                {#if transaction && transaction.donation }
                    <div class="container">
                        <div class="font-size-75 font-weight-600 color-gray-100">
                            { getLocalizedTextBySlug( 'admin-payment-manager-page-rent-amount-label', $languageTagStore ) }:
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-100">
                            { formatter.format( transaction.totalPrice - transaction.donation ) }
                        </div>
                    </div>
                {/if}
                {#if transaction && transaction.donation }
                    <div class="container">
                        <div class="font-size-75 font-weight-600 color-gray-100">
                            { getLocalizedTextBySlug( 'admin-payment-manager-page-donation-amount-label', $languageTagStore ) }:
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-100">
                            { formatter.format( transaction.donation ) }
                        </div>
                    </div>
                {/if}
                <AccordionItem displayName={ getLocalizedTextBySlug( 'admin-payment-manager-page-payer-details-label', $languageTagStore ) }>
                    <div class="profile-container">
                        <img class="profile-image" src={ getStorageImagePath( payerProfile.imagePath, 640 ) } alt='payer profile' />
                        <div class="profile-text-container">
                            <div class="font-size-75 font-weight-600 color-gray-100">
                                { payerProfile.firstName } { payerProfile.lastName }
                            </div>
                        </div>
                    </div>
                    {#each Object.entries( payerProfile ) as [ fieldName, fieldValue ] }
                        {#if !fieldName.includes( 'Id' ) && !fieldName.includes( 'Name' ) && fieldName !== 'imagePath' }
                            <div class="container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray-100">
                                    { fieldValue }
                                </div>
                            </div>
                        {/if}
                    {/each}
                </AccordionItem>
                {#if payeeProfile }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'admin-payment-manager-page-payee-details-label', $languageTagStore ) }>
                        <div class="profile-container">
                            <img class="profile-image" src={ getStorageImagePath( payeeProfile.imagePath, 640 ) } alt='payer profile' />
                            <div class="profile-text-container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                    { payeeProfile.firstName } { payeeProfile.lastName }
                                </div>
                            </div>
                        </div>
                        {#each Object.entries( payeeProfile ) as [ fieldName, fieldValue ] }
                            {#if !fieldName.includes( 'Id' ) && !fieldName.includes( 'Name' ) && fieldName !== 'imagePath' }
                                <div class="container">
                                    <div class="font-size-75 font-weight-600 color-gray-100">
                                       { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                    </div>
                                    <div class="font-size-75 font-weight-500 color-gray-100">
                                        { fieldValue }
                                    </div>
                                </div>
                            {/if}
                        {/each}
                    </AccordionItem>
                {/if}
                {#if transaction }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'transaction-label', $languageTagStore ) }>
                        {#each Object.entries( transaction ) as [ fieldName, fieldValue ] }
                            <div class="container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray-100">
                                    { fieldValue }
                                </div>
                            </div>
                        {/each}
                    </AccordionItem>
                {/if}
                {#if property }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'property-label', $languageTagStore ) }>
                        <img class="property-image" src={ getStorageImagePath( property.imagePath, 640 ) } />
                        {#each Object.entries( property ) as [ fieldName, fieldValue ] }
                            {#if !fieldName.includes( 'Array' ) && fieldName !== 'imagePath' }
                                {#if fieldName === 'title' || fieldName === 'description' }
                                    <div class="container">
                                        <div class="font-size-75 font-weight-600 color-gray-100">
                                           { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                        </div>
                                        <div class="font-size-75 font-weight-500 color-gray-100">
                                            { getLocalizedText( fieldValue, $languageTagStore ) }
                                        </div>
                                    </div>
                                {:else}
                                    <div class="container">
                                        <div class="font-size-75 font-weight-600 color-gray-100">
                                           { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                        </div>
                                        <div class="font-size-75 font-weight-500 color-gray-100">
                                            { fieldValue }
                                        </div>
                                    </div>
                                {/if}
                            {/if}
                        {/each}
                    </AccordionItem>
                {/if}
            {/if}
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton on:click={ handleCancel } variant="contained" disabled={ !isRefundable } >
            { getLocalizedTextBySlug( 'admin-payment-manager-page-refund-payment-label', $languageTagStore ) }
        </ModalButton>
    </ModalActions>
</ModalRoot>

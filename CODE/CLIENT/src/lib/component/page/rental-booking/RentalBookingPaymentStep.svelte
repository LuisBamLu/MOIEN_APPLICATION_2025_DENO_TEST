<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';
    import AccountBankingInformationCardModal from '$component/page/account/AccountBankingInformationCardModal.svelte';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    export let selectedPaymentMethodId;
    let paymentMethodArray = [];
    let isLoading = true;
    let isCreateCardModalOpen = false;

    // -- FUNCTIONS

    async function populatePaymentMethodArrayFromPaymentMethodMap(
        paymentMethodMap
        )
    {
        for ( let card of paymentMethodMap.cardArray )
        {
            if ( card.Active && card.Currency === $profileSignedInStore.currencyCode )
            {
                let expirationDate = card.ExpirationDate.substring( 0, 2 ) + '/' + card.ExpirationDate.substring( 2, 4 );
                paymentMethodArray.push(
                    {
                        label: `${ card.CardProvider } ${ card.Alias }`,
                        description:
                            getLocalizedTextBySlug( 'expiration-label', $languageTagStore )
                            + ': '
                            + expirationDate,
                        icon: card.CardProvider.toLowerCase(),
                        value: card.Id
                    }
                    );
            }
        }

        for ( let wallet of paymentMethodMap.walletArray )
        {
            if ( wallet.Currency === $profileSignedInStore.currencyCode )
            {
                paymentMethodArray.push(
                    {
                        label: wallet.Description,
                        description:
                            getLocalizedTextBySlug( 'balance-label', $languageTagStore )
                            + ': '
                            + getFormattedPrice( wallet.Balance.Amount / 100, $languageTagStore, wallet.Currency ),
                        value: wallet.Id
                    }
                    );
            }
        }

        for ( let bankAccount of paymentMethodMap.bankAccountArray )
        {
            // if ( bankAccount.Currency === $profileSignedInStore.currencyCode )
            // {
                paymentMethodArray.push(
                    {
                        label: bankAccount.OwnerName,
                        description: `${ bankAccount.IBAN } · ${ bankAccount.BIC }`,
                        value: bankAccount.Id
                    }
                    );
            // }
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let paymentMethodMap =
                await fetchData(
                    '/api/get-payment-method-map',
                    {
                        method: 'POST',
                        credentials: 'include'
                    }
                    );
            populatePaymentMethodArrayFromPaymentMethodMap( paymentMethodMap );
            isLoading = false;
        }
        );
</script>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'booking-checkout-page-payment-method', $languageTagStore ) } >
    {#if isLoading }
        <Loading/>
    {:else}
            <RadioCardGroup
                optionArray={ paymentMethodArray }
                bind:selected={ selectedPaymentMethodId }
            />
            <div class="display-flex justify-content-center">
                <ModalButton
                    variant="light"
                    fullWidth={ false }
                    text={ getLocalizedTextBySlug( 'booking-checkout-page-add-new-payment', $languageTagStore ) }
                    on:click={ () => { isCreateCardModalOpen = true; isLoading = true } }
                />
            </div>
    {/if}
</EditLeaseContractPageSection>
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

                let paymentMethodCount = paymentMethodArray.length;

                if ( paymentMethodCount > 0 )
                {
                    selectedPaymentMethodId = paymentMethodArray[ paymentMethodCount - 1 ].value;
                }

                isCreateCardModalOpen = false;
                isLoading = false;
            }
        }
/>

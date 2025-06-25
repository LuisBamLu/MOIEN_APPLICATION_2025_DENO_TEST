<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARIABLES

    export let selectedPaymentMethodId = '';
    let rentalBooking = {};
    let paymentMethodArray = [];
    let isLoading = true;

    // -- FUNCTIONS

    async function populatePaymentMethodArrayFromPaymentMethodMap(
        paymentMethodMap
        )
    {
        for ( let wallet of paymentMethodMap.walletArray )
        {
            paymentMethodArray.push(
                {
                    label: wallet.Description,
                    description: `Available: ${ wallet.Balance.Amount / 100 } ${ wallet.Balance.Currency } `,
                    value: wallet.Id
                }
                );
        }

        for ( let bankAccount of paymentMethodMap.bankAccountArray )
        {
            paymentMethodArray.push(
                {
                    label: bankAccount.OwnerName,
                    description: `${ bankAccount.IBAN } · ${ bankAccount.BIC }`,
                    value: bankAccount.Id
                }
                );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let paymentMethodMap
                = await fetchData(
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

{#if rentalBooking.status === 'paid' }
    <EditLeaseContractPageSection
        label={ getLocalizedTextBySlug( 'transfer-to-account-modal-choose-the-account-to-credit-label', $languageTagStore ) }
    >
        {#if isLoading }
            <Loading />
        {:else}
            <RadioCardGroup
                optionArray={ paymentMethodArray }
                bind:selected={ selectedPaymentMethodId }
            />
        {/if}
    </EditLeaseContractPageSection>
{/if}

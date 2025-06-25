<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import RadioCardGroup from '$component/element/RadioCardGroup.svelte';
    import Accordion from '$component/element/Accordion.svelte';
    import Loading from '$component/element/Loading.svelte';
    import EditLeaseContractPageSection from '$component/page/edit-lease-contract/EditLeaseContractPageSection.svelte';

    // -- VARIABLES

    export let leaseContract;
    export let selectedSubscriptionOption = 'no-subscription';
    export let selectedPaymentMethod = '';
    let subscriptionOptionArray =
        [
            {
                label: getLocalizedTextBySlug( 'edit-lease-contract-page-subscribe-to-digital-package-label', $languageTagStore ),
                description: getLocalizedTextBySlug( 'edit-lease-contract-page-subscribe-to-digital-package-helper', $languageTagStore ),
                value: 'digital-package'
            },
            {
                label: getLocalizedTextBySlug( 'edit-lease-contract-page-manage-rent-due-dates-label', $languageTagStore ),
                description: getLocalizedTextBySlug( 'edit-lease-contract-page-rent-will-be-paid-to-account-of-your-choice-label', $languageTagStore ),
                value: 'no-subscription'
            }
        ];
    let paymentMethodArray = [];
    let isLoading = true;

    // -- FUNCTIONS

    async function populatePaymentMethodArrayFromPaymentMethodMap(
        paymentMethodMap
        )
    {
        for ( let card of paymentMethodMap.cardArray )
        {
            if ( card.Active )
            {
                let expirationDate = card.ExpirationDate.substring( 0, 2 ) + '/' + card.ExpirationDate.substring( 2, 4 );
                paymentMethodArray.push(
                    {
                        label: `${ card.CardProvider } ${ card.Alias }`,
                        description: 'Expiration: ' + expirationDate,
                        icon: card.CardProvider.toLowerCase(),
                        value: card.Id
                    }
                    );
            }
        }

        for ( let wallet of paymentMethodMap.walletArray )
        {
            paymentMethodArray.push(
                {
                    label: wallet.Description,
                    description:
                        'Available: '
                        + getFormattedPrice(
                            wallet.Balance.Amount / 100,
                            $languageTagStore,
                            wallet.Balance.Currency
                            ),
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
        )
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .digital-package-container
    {
        border-radius: 0.75rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: grayColor800;
    }

    .digital-package-container-heading
    {
        display: flex;
        justify-content: space-between;
    }

    .digital-package-feature-list
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .digital-package-feature-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'edit-lease-contract-page-monitoring-due-dates-and-rents-owed-label', $languageTagStore ) }>
    <div class="digital-package-container">
        <div class="digital-package-container-heading">
            <div class="font-size-100 font-weight-600 color-gray-100">
                { getLocalizedTextBySlug( 'edit-lease-contract-page-digital-package-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-600 color-gray-100">
                { getFormattedPrice( leaseContract.monthlyRent * 0.02, $languageTagStore ) }
                /{ getLocalizedTextBySlug( 'month-label', $languageTagStore ) }
            </div>
        </div>
        <div class="digital-package-feature-list">
            <div class="digital-package-feature-container">
                <div class="green-check-icon size-100" />
                <div class="font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'edit-lease-contract-page-remind-tenats-of-due-dates-label', $languageTagStore ) }
                </div>
            </div>
            <div class="digital-package-feature-container">
                <div class="green-check-icon size-100" />
                <div class="font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'edit-lease-contract-page-support-service-label', $languageTagStore ) }
                </div>
            </div>
            <div class="digital-package-feature-container">
                <div class="green-check-icon size-100" />
                <div class="font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'edit-lease-contract-page-drafting-leases-label', $languageTagStore ) }
                </div>
            </div>
        </div>
    </div>
</EditLeaseContractPageSection>
<EditLeaseContractPageSection label={ getLocalizedTextBySlug( 'edit-lease-contract-page-choose-an-option-label', $languageTagStore ) }>
    <RadioCardGroup
        optionArray={ subscriptionOptionArray }
        bind:selected={ selectedSubscriptionOption }
    />
    <Accordion label={ getLocalizedTextBySlug( 'edit-lease-contract-page-select-account-to-be-credited-label', $languageTagStore ) }>
        {#if isLoading }
            <Loading />
        {:else}
            <RadioCardGroup
                optionArray={ paymentMethodArray }
                bind:selected={ selectedPaymentMethod }
            />
        {/if}
    </Accordion>
</EditLeaseContractPageSection>

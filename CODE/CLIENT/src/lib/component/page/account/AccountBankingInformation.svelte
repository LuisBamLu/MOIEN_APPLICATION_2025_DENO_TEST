<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import AccountAddPaymentMethodButton from '$component/page/account/AccountAddPaymentMethodButton.svelte'
    import AccountPaymentMethodCard from '$component/page/account/AccountPaymentMethodCard.svelte';
    import AccountBankingInformationCardModal from '$component/page/account/AccountBankingInformationCardModal.svelte';
    import AccountBankingInformationAccountModal from '$component/page/account/AccountBankingInformationAccountModal.svelte';
    import AccountPaymentMethodAccount from '$component/page/account/AccountPaymentMethodAccount.svelte';
    import Alert from '$component/element/Alert.svelte';

    // -- VARIABLES

    let isNewCardModalOpen = false;
    let isNewAccountModalOpen = false;
    let isLoading = true;
    let error;
    let cardArray = [];
    let bankAccountArray = [];

    // -- FUNCTIONS

    function handleToggleNewCardModal(
        )
    {
        isNewCardModalOpen = !isNewCardModalOpen;
    }

    // ~~

    function handleToggleNewAccountModal(
        )
    {
        isNewAccountModalOpen = !isNewAccountModalOpen;
    }

    //

    async function loadData(
        )
    {
        try
            {
                let data
                    = await fetchData(
                            '/api/get-payment-method-map',
                            {
                                method: 'POST',
                                credentials: 'include'
                            }
                            );

                let newCardArray = [];

                for ( let index = 0; index < data.cardArray.length; index += 1 )
                {
                    let card = data.cardArray[ index ];

                    if ( card.Active )
                    {
                        let expirationDate =
                            card.ExpirationDate.substring( 0, 2 )
                            + '/'
                            + card.ExpirationDate.substring( 2, 4 );
                        newCardArray.push(
                            {
                                cardName: `${ card.CardProvider } ${ card.Alias }`,
                                number: card.Alias,
                                expiration: expirationDate,
                                icon: card.CardProvider.toLowerCase(),
                                value: card.Id,
                                cardHolder: data.holderInfo.firstName
                                    + ' '
                                    + data.holderInfo.lastName,
                            }
                            );
                    }
                }
                cardArray = newCardArray;

                for ( let bankAccount of data.bankAccountArray )
                {
                    bankAccountArray.push(
                        {
                            accountName: bankAccount.OwnerName,
                            accountDescription: `${ bankAccount.IBAN } · ${ bankAccount.BIC }`,
                        }
                        );
                }
            }
            catch
            {
                error = true;
            }
            finally
            {
                isLoading = false;
            }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            loadData();
        }
        );
</script>

<style lang="stylus">
   // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .account-banking-information-container
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-banking-information-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-banking-information-title
    {
        padding-bottom: 0.25rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .account-banking-card-list-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
    }
</style>
{#if isLoading }
    <Loading />
{:else}
    <div class="account-banking-information-container">
        {#if error }
            <Alert text="An error occurred. Please verify your Address, Country, and City information." type="error"/>
        {:else}
            <div class="account-banking-information-content">
            <span class="account-banking-information-title font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'banking-information-payment-methods-label', $languageTagStore ) }
            </span>
            <div class="account-banking-card-list-container">
                {#each cardArray as card, index }
                    <AccountPaymentMethodCard
                        cardName={ card.cardName }
                        card={ card }
                        cardDescription=
                            {
                                getLocalizedTextBySlug(
                                    'expiration-date-label',
                                    { expiration: card.expiration },
                                    $languageTagStore
                                    )
                            }
                        hasIcon
                        isDefault={ index === 0 }
                    />
                {/each}
                <AccountAddPaymentMethodButton
                    text={ getLocalizedTextBySlug( 'banking-information-add-new-card-label', $languageTagStore ) }
                    hasCards
                    onClick={ handleToggleNewCardModal }
                />
                <AccountBankingInformationCardModal
                    onClose={ handleToggleNewCardModal }
                    isOpen={ isNewCardModalOpen }
                    on:cardRegistered={ () => loadData() }
                    on:cardDeactivated={ () => loadData() }
                />
            </div>
        </div>
        <div class="account-banking-information-content">
            <span class="account-banking-information-title font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'banking-information-bank-accounts-label', $languageTagStore ) }
            </span>
            <div class="account-banking-card-list-container">
                {#each bankAccountArray as bankAccount, index }
                    <AccountPaymentMethodAccount
                        accountName={ bankAccount.accountName }
                        accountDescription={ bankAccount.accountDescription }
                        isDefault={ index === 0 }
                        account={ { bankAccount } }
                    />
                {/each}
                <AccountAddPaymentMethodButton
                    text={ getLocalizedTextBySlug( 'banking-information-add-new-banking-information-account-modal-account-label', $languageTagStore ) }
                    hasCards
                    onClick={ handleToggleNewAccountModal }
                >
                    <AccountBankingInformationAccountModal
                        onClose={ handleToggleNewAccountModal }
                        isOpen={ isNewAccountModalOpen }
                    />
                </AccountAddPaymentMethodButton>
            </div>
        </div>
        {/if}
    </div>
{/if}

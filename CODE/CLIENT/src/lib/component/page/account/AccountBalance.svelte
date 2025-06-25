<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import AccountBalanceSummary from '$component/page/account/AccountBalanceSummary.svelte';
    import AccountTransferToAccountModal from '$component/page/account/AccountTransferToAccountModal.svelte';
    import Alert from '$component/element/Alert.svelte';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    let isTransferToAccountModalOpen = false;

    // -- FUNCTIONS

    function handleToggleTransferToAccountModal(
        )
    {
        isTransferToAccountModalOpen = !isTransferToAccountModalOpen;
    }

    // ~~

    function getBalance(
        )
    {
        return fetchData(
            '/api/balance',
            {
                method: 'POST',
                credentials: 'include'
            }
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .account-balance-container
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-balance-available-amount
    {
        border: 2px solid blueColor900;
        border-radius: 1rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        background: blueColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .account-balance-amount
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .account-balance-transfer-to-account-button
    {
        height: 3.5rem;
        border-radius: 0.5rem;
        padding: 0.75rem 2.5rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        background: blueColor300;

        transition: background 400ms ease-in-out;
        &:hover
        {
            background-color: blueColor500;
        }
    }

    :global( .dashboard-accordion )
    {
    }
</style>

<div class="account-balance-container">
    {#await getBalance() }
        <Loading />
    {:then { balance, walletId, currencyCode } }
        <div class="account-balance-available-amount">
            <div class="account-balance-amount">
                <span class="font-size-90 font-weight-500 color-blue-300">
                    { getLocalizedTextBySlug( 'account-balance-available-transfer-to-account-modal-amount-label', $languageTagStore ) }
                </span>
                <span class="font-size-200 font-weight-600 color-blue">
                    {
                        getFormattedPrice(
                            ( balance ?? 0 ) / 100,
                            $languageTagStore,
                            currencyCode ?? 'EUR'
                            )
                    }
                </span>
            </div>
            <button
                class="account-balance-transfer-to-account-button color-white font-size-100 font-weight-700"
                on:click={ handleToggleTransferToAccountModal }
            >
                { getLocalizedTextBySlug( 'account-balance-transfer-to-banking-information-account-modal-account-label', $languageTagStore ) }
            </button>
            <AccountTransferToAccountModal
                isOpen={ isTransferToAccountModalOpen }
                onClose={ handleToggleTransferToAccountModal }
            />
        </div>
        <AccountBalanceSummary walletId={ walletId } />
    {:catch error }
        <Alert text={ getLocalizedTextBySlug( 'error-verification-address-country-city-label', $languageTagStore ) } type="error"/>
    {/await}
</div>

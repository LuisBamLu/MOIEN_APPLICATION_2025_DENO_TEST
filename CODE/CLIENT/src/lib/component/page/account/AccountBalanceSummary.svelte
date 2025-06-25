<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, getFormattedPrice } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalButton from '$component/modal/ModalButton.svelte';

    // -- VARIABLES

    export let walletId;
    let transactionArray = [];
    let page = 1;
    let canLoadMore = true;
    let monthYearSet = new Set();
    let isLoading = true;

    // -- FUNCTIONS

    async function loadData(
        )
    {
        isLoading = true;
        let result = await fetchData(
            '/api/transaction',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        walletId,
                        page
                    }
                    )
            }
            );

        if ( result.transactionArray && result.transactionArray?.length > 0 )
        {
            transactionArray = [ ...transactionArray, ...result.transactionArray ];
            monthYearSet = new Set();

            for ( let transaction of transactionArray )
            {
                if ( transaction.ExecutionDate === null )
                {
                    continue;
                }

                let date = new Date( transaction.ExecutionDate * 1000 );
                let monthYear = date.toLocaleString( $languageTagStore, { month: 'long', year: 'numeric' } )
                monthYearSet.add( monthYear );
                transaction.monthYear = monthYear;
                transaction.fullDate
                    = date.toLocaleDateString(
                        $languageTagStore,
                        {
                            month:
                            '2-digit',
                            year: 'numeric',
                            day: '2-digit'
                        }
                        );

                if ( transaction.DebitedWalletId === walletId )
                {
                    transaction.value
                        = getFormattedPrice(
                            transaction.DebitedFunds.Amount / -100,
                            $languageTagStore,
                            transaction.DebitedFunds.Currency
                            );
                }
                else
                {
                    transaction.value
                        = getFormattedPrice(
                            transaction.CreditedFunds.Amount / 100,
                            $languageTagStore,
                            transaction.CreditedFunds.Currency
                            );
                }

                if ( transaction.Tag === null )
                {
                    transaction.Tag = getLocalizedTextBySlug( 'rental-booking-page-refund-label', $languageTagStore );
                }
            }

            page++;
        }
        else
        {
            canLoadMore = false;
        }

        isLoading = false;
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

    .account-balance-summary
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;
    }

    .account-balance-summary-month-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .account-balance-summary-month-container > .account-balance-summary-transaction:last-child
    {
        border-bottom: unset;
    }

    .account-balance-summary-month-label
    {
        width: 100%;
        padding-bottom: 0.25rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .account-balance-summary-transaction
    {
        width: 100%;
        border-bottom: 1px solid grayColor800;
        padding: 0.75rem 0px;

        display: flex;
        gap: 0.75rem;
        align-items: flex-start;
    }

    .account-balance-summary-transaction-detail
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 6px;
        justify-content: center;
        align-items: flex-start;
    }
</style>

<div class="account-balance-summary">
    {#each Array.from( monthYearSet ) as monthYear }
        <div class="account-balance-summary-month-container">
            <div class="account-balance-summary-month-label">
                <span class="font-size-100 font-weight-700 color-gray-100">
                    { monthYear }
                </span>
            </div>
            {#each transactionArray as transaction }
                {#if transaction.monthYear === monthYear }
                    <div class="account-balance-summary-transaction">
                        <div class="account-balance-summary-transaction-detail">
                            <span class="font-size-90 font-weight-500 color-gray-100">
                                { transaction.fullDate }
                            </span>
                            <span class="font-size-75 font-weight-500 color-gray-300">
                                { transaction.Tag }
                            </span>
                        </div>
                        <div class="account-balance-summary-transaction-amount">
                            <span class="font-size-90 font-weight-700 color-gray-100">
                                { transaction.value }
                            </span>
                        </div>
                    </div>
                {/if}
            {/each}
        </div>
    {/each}
    {#if canLoadMore }
        <ModalButton
            fullWidth={ false }
            variant="light"
            text={ getLocalizedTextBySlug( 'load-more-label', $languageTagStore ) }
            bind:isLoading={ isLoading }
            on:click={ loadData }
        />
    {/if}
</div>

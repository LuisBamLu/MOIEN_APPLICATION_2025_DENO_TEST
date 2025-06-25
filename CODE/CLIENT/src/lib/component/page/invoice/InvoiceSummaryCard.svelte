<script>
    // -- IMPORTS

    import { fetchData } from '$src/lib/base';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { getLocalizedText } from 'senselogic-gist';
    import { createEventDispatcher, onMount } from 'svelte';

    // -- VARIABLES

    export let invoice;
    let billArray = [];
    let billLineArray = [];
    let totalAmount = 0;
    let symbol = '€';
    let isLoading = true;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleOpenInvoiceModal(
        invoice,
        total,
        billArray,
        billLineArray
        )
    {
        dispatch( 'openInvoiceModal', { invoice, total, billArray, billLineArray } );
    };

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let data = await fetchData(
                `/api/bill`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(
                        {
                            type: 'getBillArray',
                            userId: $profileSignedInStore.userId,
                            billIdArray: invoice.billIdArray
                        }
                        )
                }
                );

            billArray = data.billArray;
            billLineArray = data.billLineArray;
            totalAmount = billLineArray.reduce(
                ( total, billLine ) =>
                {
                    return total + billLine.totalPrice;
                },
                0
                );

            isLoading = false;
        }
        );

    $:
    {
        switch ( invoice.currencyCode )
        {
            case 'USD':
                symbol = '$';
            case 'EUR':
                symbol = '€';
            case 'GBP':
                symbol = '£';
            case 'CHF':
                symbol = 'CHF';
            default:
                symbol = '€';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .invoice-summary-card
    {
        border: 1px solid greenColor300;
        border-radius: 0.5rem;
        padding: 1rem 2.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        font-size: 1.2rem;
        + media( desktop )
        {
            flex-direction: row;
            gap: 0;
            justify-content: space-between;

            font-size: 1.5rem;
        }
    }

    h3
    {
        font-weight: bold;
        color: greenColor300;
    }

    .invoice-summary-card-total-amount
    {
        font-weight: bold;
        color: greenColor300;
    }

    .invoice-button
    {
        width: 90%;
        border-radius: 0.5rem;

        background-color: greenColor900;

        cursor: pointer;
    }
</style>

{#if isLoading }
    <button
        class="invoice-button"
    >
        <article class="invoice-summary-card">
            <div class="invoice-summary-card-title">
                <h3>{ invoice.title }</h3>
            </div>
            <div class="invoice-summary-card-total-amount">
                <span class="font-weight-700 color-blue-300">
                    { getLocalizedText( 'Total:¨fr:Total¨de:Insgesamt', $languageTagStore ) }
                </span>
                { symbol }
                ...
            </div>
        </article>
    </button>
{:else}
    <button
        class="invoice-button"
        on:click={ () => handleOpenInvoiceModal( invoice, totalAmount, billArray, billLineArray ) }
    >
        <article class="invoice-summary-card">
            <div class="invoice-summary-card-title">
                <h3>{ invoice.title }</h3>
            </div>
            <div class="invoice-summary-card-total-amount">
                <span class="font-weight-700 color-blue-300">
                    { getLocalizedText( 'Total:¨fr:Total¨de:Insgesamt', $languageTagStore ) }
                </span>
                { symbol }
                { totalAmount }
            </div>
        </article>
    </button>
{/if}

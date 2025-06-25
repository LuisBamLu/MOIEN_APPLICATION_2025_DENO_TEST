<script>

    // -- IMPORTS

    import { billLineArrayStore } from '$src/lib/store/billLineArrayStore';
    import { createEventDispatcher, onMount } from 'svelte';

    // -- VARIABLES

    export let bill;
    let billLineArray;
    let totalAmount = 0;
    let symbol = '€';
    let isLoading = true;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleOpenBillModal(
        bill,
        total,
        billLines
        )
    {
        dispatch( 'openBillModal', { bill, total, billLines } )
    };

    // -- STATEMENTS

    onMount(
        () =>
        {
            billLineArray = $billLineArrayStore.filter(
                billLine =>
                {
                    return billLine.billId === bill.id;
                }
                );

            for ( let billLine of billLineArray )
            {
                totalAmount += billLine.totalPrice;
            }

            isLoading = false;
        }
        );

    $:
    {
        switch ( bill.currencyCode )
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

    .bill-card-sumarry
    {
        border: 1px solid grayColor700;
        border-radius: 0.5rem;
        padding: 1rem 3rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        font-size: 1.2rem;
        font-weight: bold;
        color: grayColor100;
    }

    .bill-button
    {
        width: 90%;
        border-radius: 0.5rem;

        background-color: white;

        cursor: pointer;
    }
</style>

{#if isLoading }
    <article class="bill-card-sumarry">
        <div class="bill-card-sumarry-title">
            <h3>{ bill.title }</h3>
        </div>
        <div class="bill-card-sumarry-total-amount">
            { symbol }
            ...
        </div>
    </article>
{:else}
    <button
        class="bill-button"
        on:click={ () => handleOpenBillModal( bill, totalAmount, billLineArray ) }
    >
        <article class="bill-card-sumarry">
            <div class="bill-card-sumarry-title">
                <h3>{ bill.title }</h3>
            </div>
            <div class="bill-card-sumarry-total-amount">
                { symbol }
                { totalAmount }
            </div>
        </article>
    </button>
{/if}

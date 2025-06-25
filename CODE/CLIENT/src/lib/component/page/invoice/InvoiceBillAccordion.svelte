<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { billTypeArrayStore } from '$src/lib/store/billTypeArrayStore';
    import { currencyArrayStore } from '$src/lib/store/currencyArrayStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import BoldAccordion from '../../element/BoldAccordion.svelte';
    import InvoiceBillLine from './InvoiceBillLine.svelte';

    // -- CONSTANTS

    const currencySymbolMap =
        {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CHF': 'CHF'
        };

    // -- VARIABLES

    export let bill;
    export let billLineArray;
    let isLoading = true;
    let symbol = currencySymbolMap[ bill.currencyCode ] || '€';
    let totalPrice = 0;
    let title;

    // -- FUNCTIONS

    function localizeDate( date )
    {
        return new Date( date ).toLocaleDateString( $languageTagStore, { year: 'numeric', month: 'long', day: 'numeric' } );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            billLineArray = billLineArray.filter( billLine => billLine.billId === bill.id );
            totalPrice = billLineArray.reduce( ( total, billLine ) => total + billLine.totalPrice, 0 );
            title = $billTypeArrayStore.find( ( billType ) => billType.id === bill.typeId ).title;
            isLoading = false;
        }
        );

    // ~~

    $: symbol = $currencyArrayStore.find( currency => currency.code === bill.currencyCode ).symbol;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .bill-accordion
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        color: grayColor100;
    }

    .bill-accordion-header
    {
        margin-top: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;

        background-color: blueColor950;
    }

    .bill-accordion-header-left
    {
        display: flex;
        flex-direction: column-reverse;
        + media( desktop )
        {
            flex-direction: row-reverse;
            justify-content: space-between;
        }
    }

    .bill-accordion-header-left-date
    {
        text-decoration: underline;
    }

    .bill-accordion-header-right
    {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;
    }

    .bill-accordion-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;

        background-color: blueColor950;
    }

    .bill-accordion-content-description
    {
        width: 96%;
        border-top: 1px solid grayColor;
        padding: 1rem 0 0;
    }

    .bill-accordion-content-items
    {
        width: 100%;
    }
</style>

<div class="bill-accordion" id={ bill.id }>
    {#if isLoading }
        { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
    {:else}
        <BoldAccordion label={ getLocalizedText( title, $languageTagStore ) }>
            <div class="bill-accordion-header">
                <div class="bill-accordion-header-left">
                    <div class="bill-accordion-header-left-title">
                        { bill.title }
                    </div>
                    <div class="bill-accordion-header-left-date">
                        <span class="font-weight-700">
                            { `${ getLocalizedText( 'Date¨fr:Date¨de:Datum', $languageTagStore ) }:` }
                        </span>
                        {#if bill.startDate === bill.endDate }
                            { localizeDate( bill.startDate ) }
                        {:else}
                            { `${ localizeDate( bill.startDate ) } - ${ localizeDate( bill.endDate ) }` }
                        {/if}
                    </div>
                </div>
                <div class="bill-accordion-header-right">
                    <div class="font-weight-700 bill-accordion-header-right-total">
                        { symbol } { totalPrice }
                    </div>
                </div>
            </div>
            <div class="bill-accordion-content">
                <div class="bill-accordion-content-description">
                    { bill.description }
                </div>
                <div class="bill-accordion-content-items">
                    {#each billLineArray as billLine }
                        <InvoiceBillLine { billLine } />
                    {/each}
                </div>
            </div>
        </BoldAccordion>
    {/if}
</div>

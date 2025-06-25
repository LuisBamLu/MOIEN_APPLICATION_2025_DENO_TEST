<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { currencyArrayStore } from '$src/lib/store/currencyArrayStore';

    // -- CONSTANTS

    const currencySymbolMap =
        {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'CHF': 'CHF'
        };

    // -- VARIABLES

    export let billLine;
    let symbol = '€';

    // -- STATEMENTS

    $: symbol = $currencyArrayStore.find( currency => currency.code === billLine.currencyCode ).symbol;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .bill-line
    {
        width: 100%;
        border-top: 1px solid lightGrayBorderColor;
        padding: 0.5rem;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        + media( desktop )
        {
            border-top: none;
            padding: 0 1rem 0.5rem;
        }
    }

    .bill-line-label
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        + media( desktop )
        {
            flex: 1;

            font-weight: bold;
        }
    }

    .bill-line-price
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        + media( desktop )
        {
            flex: 1;

            font-weight: bold;
        }
    }

    .bill-line-discount
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        + media( desktop )
        {
            flex: 1;

            font-weight: bold;
        }
    }

    .bill-line-total-price
    {
        display: flex;
        flex-direction: row-reverse;
        justify-content: space-between;

        font-weight: bold;
        + media( desktop )
        {
            flex: 1;
        }
    }
</style>

<li class="bill-line" id={ billLine.id }>
    <div class="bill-line-label">
        { billLine.label } :
        { billLine.quantity }
    </div>
    <div class="bill-line-price">
        { getLocalizedTextBySlug( 'bill-line-unit-price', $languageTagStore ) } :
        { symbol }
        { billLine.unitPrice }
    </div>
    {#if billLine.discountRatio }
        <div class="bill-line-discount">
            { getLocalizedTextBySlug( 'bill-line-discount-ratio-label', $languageTagStore ) }
            { `: ${ billLine.discountRatio }%` }
        </div>
    {/if}
    <div class="bill-line-total-price">
        { `${ symbol } ${ billLine.totalPrice }` }
    </div>
</li>

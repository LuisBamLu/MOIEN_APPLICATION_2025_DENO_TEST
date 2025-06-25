<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let billLine;
    let symbol = '€';

    // -- STATEMENTS

    $:
    {
        switch ( billLine.currencyCode )
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

    .bill-line
    {
        border-bottom: 1px solid grayColor;
        padding: 1rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .bill-line-label
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }
</style>

<li class="bill-line" id={ billLine.id }>
    <div class="bill-line-label">
        { billLine.label }
        { billLine.quantity }
    </div>
    <div class="bill-line-price">
        { getLocalizedTextBySlug( 'bill-line-unit-price', $languageTagStore ) }
        { symbol }
        { billLine.unitPrice }
    </div>
    {#if billLine.discountRatio }
        <div class="bill-line-discount">
            { getLocalizedTextBySlug( 'bill-line-discount-ratio', $languageTagStore ) }
            { `-${ billLine.discountRatio }%` }
        </div>
    {/if}
    <div class="bill-line-total-price">
        { symbol }
        { billLine.totalPrice }
    </div>
</li>

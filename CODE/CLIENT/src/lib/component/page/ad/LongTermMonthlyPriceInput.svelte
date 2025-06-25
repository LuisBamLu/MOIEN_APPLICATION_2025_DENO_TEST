<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let longTermMonthlyPrice;
</script>

<style lang="stylus">
    // -- CLASSES

    .long-term-monthly-price-input
    {
        max-width: 6rem;

        text-align: right
        -moz-appearance: textfield;
    }

    .long-term-monthly-price-input:focus
    {
        outline: none;
        border: none;
    }

    .long-term-monthly-price-input::-webkit-inner-spin-button
    {
        -webkit-appearance: none;
        margin: 0;
    }
</style>

<div class="ad-page-section-list-option">
    <div class="font-size-90 font-weight-500 color-gray-300">
        { getLocalizedTextBySlug( 'ad-long-term-monthly-price-label', $languageTagStore ) }
    </div>
    <input
        class="long-term-monthly-price-input font-size-90 font-weight-700 color-black"
        type="number"
        bind:value={ longTermMonthlyPrice }
    />
</div>

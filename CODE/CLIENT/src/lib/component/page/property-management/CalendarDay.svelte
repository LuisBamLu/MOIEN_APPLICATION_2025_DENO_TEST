<script>
    // -- IMPORTS

    import { getFormattedPrice } from '$src/lib/base';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getContext } from 'svelte';

    // -- VARIABLES

    export let day;
    let rentalDayByDateMap = getContext( 'rentalDayByDateMap' );
    let property = getContext( 'rentalDayProperty' );
    $: dateString = day.date.toISOString().split( 'T' )[ 0 ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .price-label
    {
        font-size: 0.5rem

        +media( desktop )
        {
            font-size: 0.75rem;
        }
    }
</style>

<div class="calendar-day">
    <div
        class:color-gray-600=
            {
                $rentalDayByDateMap[ dateString ]?.isAvailableForShortTerm === false
                && !( day.isInside || day.isGrayed )
            }
    >
        { day.text }
    </div>
    <div
        class=
            {
                'price-label '
                + ( day.isGrayed || $rentalDayByDateMap[ dateString ]?.isAvailableForShortTerm === false
                    ? 'color-transparent'
                    : day.isInside
                    ? 'color-white'
                    : 'color-gray-500' )
            }
    >
        {#if $rentalDayByDateMap[ dateString ] && $rentalDayByDateMap[ dateString ]?.isAvailableForShortTerm }
            { getFormattedPrice( $rentalDayByDateMap[ dateString ].shortTermDailyPrice, $languageTagStore ) }
        {:else}
            { getFormattedPrice( property.shortTermDailyPrice, $languageTagStore ) }
        {/if}
    </div>
</div>

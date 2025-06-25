<script>
    // -- IMPORTS

    import { getRatingText } from '$lib/base';

    // -- VARIABLES

    export let rating;
</script>
<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-card-rating
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    .filled
    {
        color: greenColor;
    }

    .empty
    {
        color: greenColor900;
    }
</style>

<div class="property-card-rating">
    {#if rating }
        <div class="font-size-90 font-weight-700 color-green">
            { getRatingText( rating ) }
        </div>
        <div class="font-size-90 font-weight-700 color-green">
            {#each Array( 5 ).fill( 0 ) as _, index }
                <span class="{ index < rating ? 'filled' : 'empty' }">●</span>
            {/each}
        </div>
    { /if}
</div>

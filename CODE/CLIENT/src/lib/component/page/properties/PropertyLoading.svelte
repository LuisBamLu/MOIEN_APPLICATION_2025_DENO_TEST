<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';

    // -- VARIABLES

    let propertyLoadingCardLength = [ 1, 2, 3, 4 ];
</script>
<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-loading
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: space-between;
    }

    .property-loading-image
    {
        aspect-ratio: 16 / 9;
        border: 1px solid transparent;
        border-radius: 0.5rem;

        background-color: whiteColor;
    }

    .property-loading-title
    {
        height: 1rem;
        border: 1px solid transparent;
        border-radius: 0.5rem;

        background-color: whiteColor;
    }

    .property-loading-details
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    .property-loading-first,
    .property-loading-second
    {
        height: 2.5rem;
        border-radius: 0.5rem;

        flex: 1;

        background-color: whiteColor;
    }
</style>

{#each propertyLoadingCardLength as propertyLoadingCard }
    <div class="property-loading" transition:fade>
        <div class="property-loading-image"/>
        <div class="property-loading-title"/>
        <div class="property-loading-details">
            <div class="property-loading-first"/>
            <div class="property-loading-second"/>
        </div>
    </div>
{/each}

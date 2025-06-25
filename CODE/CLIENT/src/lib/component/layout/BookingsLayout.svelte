<style lang="stylus">
    // -- CLASSES

    .bookings-page
    {
        height: calc( var( --viewport-height ) - 4.55rem )
        overflow-y: auto;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }
</style>

<div class="bookings-page">
    <slot />
</div>

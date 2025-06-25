<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { guestCounterStore, guestCounterMaxStore } from '$store/bookingStore';
    import Counter from '$component/element/Counter.svelte';

    // -- VARIABLES

    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleGuestCounterChange(
        guestCounterCategory,
        counterDirection
        )
    {
        let currentCount = $guestCounterStore[ guestCounterCategory ];

        if ( counterDirection === 'increase' && currentCount < $guestCounterMaxStore )
        {
            $guestCounterStore = { ...$guestCounterStore, [ guestCounterCategory ]: currentCount + 1 };
        }
        else if ( counterDirection === 'decrease' && currentCount > 0 )
        {
            $guestCounterStore = { ...$guestCounterStore, [ guestCounterCategory ]: currentCount - 1 };
        }

        dispatch( 'guestCounter', $guestCounterStore );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .filter-guest-content
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem
    }

    .filter-guest-item
    {
        border-bottom: 1px solid grayColor700;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .filter-guest-item:last-child
    {
        border-bottom: unset;
    }

    .filter-guest-item-content
    {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        align-items: flex-start;
    }

    .filter-guest-item-counter
    {
        display: flex;
        align-content: center;
    }
</style>

<div class="filter-guest">
    <div class="filter-guest-content">
        <div class="font-size-90 font-weight-500 color-gray filter-guest-description">
            { getLocalizedTextBySlug( 'guest-description' ) }
        </div>
    </div>
    <div class="filter-guest-container">
        {#each Object.entries( $guestCounterStore ) as [ guestCounterCategory, guestCount ] }
            <div class="filter-guest-item">
                <div class="filter-guest-item-content">
                    {#if guestCounterCategory === 'adult' }
                        <div class="font-size-90 font-weight-700 color-black filter-guest-item-label">
                            { getLocalizedTextBySlug( 'guest-adult-label' ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                            { getLocalizedTextBySlug( 'guest-adult-helper-label' ) }
                        </div>
                    {:else if guestCounterCategory === 'children' }
                        <div class="font-size-90 font-weight-700 color-black filter-guest-item-label">
                            { getLocalizedTextBySlug( 'guest-children-label' ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                            { getLocalizedTextBySlug( 'guest-children-helper-label' ) }
                        </div>
                    {:else if guestCounterCategory === 'infant' }
                        <div class="font-size-90 font-weight-700 color-black filter-guest-item-label">
                            { getLocalizedTextBySlug( 'guest-infant-label' ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                            { getLocalizedTextBySlug( 'guest-infant-helper-label' ) }
                        </div>
                    {:else if guestCounterCategory === 'pet' }
                        <div class="font-size-90 font-weight-700 color-black filter-guest-item-label">
                            { getLocalizedTextBySlug( 'guest-pet-label' ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray filter-guest-item-message">
                            { getLocalizedTextBySlug( 'guest-pet-helper-label' ) }
                        </div>
                    {/if}
                </div>
                <div class="filter-guest-item-counter">
                    <Counter
                        count={ guestCount }
                        maxCount={ $guestCounterMaxStore }
                        on:change={ event => handleGuestCounterChange( guestCounterCategory, event.detail ) }
                    >
                        { guestCount }
                    </Counter>
                </div>
            </div>
        {/each}
    </div>
</div>

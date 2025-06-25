<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let freeParking;
    export let freeCancellationHours;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-park-container
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-park-item
    {
        display: flex;
        gap: 1rem;
    }
</style>

<div class="property-park-container">
    {#if freeParking }
        <div class="property-park-item">
            <div class="green-car-icon size-150 property-reserve-short-term-rule-icon"/>
            <div class="property-park-description">
                <div class="font-size-90 font-weight-700 color-black">
                    { getLocalizedTextBySlug( 'property-rental-park-for-free-text', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray">
                    { getLocalizedTextBySlug( 'property-rental-park-few-places-free-parking-text', $languageTagStore ) }
                </div>
            </div>
        </div>
    {/if}
    <div class="property-park-item">
        <div class="green-default-icon size-150 property-reserve-short-term-rule-icon"/>
        <div class="property-park-description">
            <div class="font-size-90 font-weight-700 color-black">
                {
                    getLocalizedTextBySlug(
                        'property-rental-park-free-cancellation-hours-text',
                        { freeCancellationHoursCount: freeCancellationHours },
                        $languageTagStore
                        )
                }
            </div>
        </div>
    </div>
</div>

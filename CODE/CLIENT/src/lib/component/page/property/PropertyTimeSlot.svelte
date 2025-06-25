<script>
    // - IMPORTS

    import Tag from '$component/element/Tag.svelte';
    import Accordion from '$component/element/Accordion.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // - VARIABLES

    export let label=''
    export let selectedVisitId = null;
    export let timeSlotArray = [];
    export let propertyTimeZone;

    // - FUNCTIONS

    function handleSelect(
        timeSlot,
        isSelecting
        )
    {
        if ( isSelecting )
        {
            selectedVisitId = timeSlot.id;
        }
        else
        {
            selectedVisitId = null;
        }
    }
</script>

<style lang="stylus">
    // - IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // - CLASSES

    .property-time-slots-container
    {
        margin-top: 0.75rem;
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }
</style>

<Accordion label={ label }>
    <div class="property-time-slots-container">
        {#each timeSlotArray as timeSlot }
            <Tag
                label=
                    {
                        new Date( timeSlot.date ).toLocaleTimeString(
                            $languageTagStore,
                            {
                                hour: '2-digit',
                                minute: '2-digit',
                                timeZone: propertyTimeZone
                            }
                            )
                    }
                isSelected={ selectedVisitId === timeSlot.id }
                on:change={ ( event ) => handleSelect( timeSlot, event.detail ) }
            />
        {/each}
    </div>
</Accordion>

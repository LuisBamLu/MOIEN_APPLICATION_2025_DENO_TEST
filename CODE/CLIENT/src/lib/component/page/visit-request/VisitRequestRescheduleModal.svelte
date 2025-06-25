<script>
    // - IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import Loading from '$component/element/Loading.svelte';
    import Error from '$component/element/Error.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import PropertyTimeSlot from '$component/page/property/PropertyTimeSlot.svelte';

    // - VARIABLES

    export let visit;
    export let isOpen = false;
    export let propertyTimeZone;
    let isLoading = true;
    let availableVisitArray = [];
    let selectedVisitId = null;
    let timeSlotByDayMap = {};
    let errorMessage = null;
    let isSubmitting = false;

    // - FUNCTIONS

    async function submitVisitRequest(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/update-rental-visit',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            previousVisitId: visit.id,
                            visitId: selectedVisitId,
                            visit:
                                {
                                    visitorUserId: visit.visitorUserId,
                                    status: 'rescheduled-by-host',
                                    propertyId: visit.propertyId
                                }
                        }
                        ),
                    credentials: 'include'
                }
                );

        if ( result.error )
        {
            errorMessage = result.error;
        }
        else
        {
            visit = result.visit;
            navigate( result.visit.id );
            isOpen = false;
        }

        isSubmitting = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result
                = await fetchData(
                    '/api/get-available-rental-visit-array-by-user-id',
                    {
                        method: 'POST',
                        body: JSON.stringify( { userId: $profileSignedInStore.userId } )
                    }
                    );
            availableVisitArray = result.availableVisitArray;

            for ( let visit of availableVisitArray )
            {
                if ( !timeSlotByDayMap[ visit.date ] )
                {
                    timeSlotByDayMap[ visit.date ] = [];
                }

                let [ hour, minute ] = visit.time.split( ':' );
                let date = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );

                if ( date.getTime() > Date.now() )
                {
                    timeSlotByDayMap[ visit.date ].push( { date: date, id: visit.id } );
                }
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // - IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // - CLASSES

    .property-schedule-visit-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .property-schedule-visit-show-more
    {
        margin-top: 1rem;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<ModalRoot bind:isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'choose-time-slot-label', $languageTagStore ) }
        onClose={ () => isOpen = false }
    />
    <ModalContent>
        {#if isLoading }
            <Loading />
        {:else}
            <div class="property-schedule-visit-container">
                {#key errorMessage }
                    <Error error={ errorMessage } />
                {/key}
                <div class="property-schedule-visit-time-slot">
                    {#each Object.entries( timeSlotByDayMap ) as [ day, timeSlotArray ] }
                        <PropertyTimeSlot
                            label=
                                {
                                    new Date( day )
                                        .toLocaleDateString(
                                            $languageTagStore,
                                            {
                                                timeZone: propertyTimeZone,
                                                month: 'long',
                                                year: 'numeric',
                                                day: '2-digit'
                                            }
                                            )
                                }
                            propertyTimeZone={ propertyTimeZone }
                            timeSlotArray={ timeSlotArray }
                            bind:selectedVisitId={ selectedVisitId }
                        />
                    {/each}
                </div>
                <div class="property-schedule-visit-show-more">
                    <ModalButton
                        fullWidth={ false }
                        text={ getLocalizedTextBySlug( 'show-more-availabilities-label', $languageTagStore ) }
                        variant="light"
                    />
                </div>
            </div>
        {/if}
    </ModalContent>
    <ModalActions>
        <ModalButton
            isLoading={ isSubmitting }
            disabled={ selectedVisitId === null }
            variant="contained"
            text={ getLocalizedTextBySlug( 'confirm-time-slot-label', $languageTagStore ) }
            on:click={ submitVisitRequest }
       />
    </ModalActions>
</ModalRoot>

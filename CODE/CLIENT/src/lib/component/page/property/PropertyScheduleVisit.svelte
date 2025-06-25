<script>
    // - IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getTimeZoneFromLocation } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import Error from '$component/element/Error.svelte';
    import Loading from '$component/element/Loading.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import PropertyTimeSlot from '$component/page/property/PropertyTimeSlot.svelte';
    import { toast } from '$src/lib/toast';

    // - VARIABLES

    export let property;
    export let isOpen = false;
    export let visit = null;
    export let isVisitResultModalOpen;
    export let visitResult;
    export let userHasAllDocuments;
    export let hasCompleteRentalFile;
    export let propertyTimeZone = getTimeZoneFromLocation( property.latitude, property.longitude, property.countryCode );

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
        if ( userHasAllDocuments )
        {
            isSubmitting = true;

            let result
                = await fetchData(
                    '/api/update-rental-visit',
                    {
                        method: 'POST',
                        body: JSON.stringify(
                            {
                                visitId: selectedVisitId,
                                previousVisitId: visit ? visit.id : undefined,
                                visit:
                                    {
                                        visitorUserId: $profileSignedInStore.userId,
                                        status: 'pending',
                                        propertyId: property.id
                                    }
                            }
                            ),
                        credentials: 'include'
                    }
                    );

            if ( result.error )
            {
                toast.error( result.error );
            }

            visit = result.visit
            visitResult = 'sent';
            isSubmitting = false;
        }

        isVisitResultModalOpen = true;
        isOpen = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData(
                '/api/get-available-rental-visit-array-by-user-id',
                {
                    method: 'POST',
                    body: JSON.stringify( { userId: property.userId } )
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
        {:else if !hasCompleteRentalFile }
            <div class="property-schedule-visit-show-more">
                <button
                    class="property-schedule-visit-load-button"
                    on:click={ () => navigate( '/dashboard/rental-file' )  }
                >
                    <span class="font-size-100 font-weight-700 color-blue">
                        { getLocalizedTextBySlug( 'property-rental-complete-rental-file-label', $languageTagStore ) }
                    </span>
                </button>
            </div>
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
                            timeSlotArray={ timeSlotArray }
                            propertyTimeZone={ propertyTimeZone }
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
            disabled={ selectedVisitId === null || $profileSignedInStore?.userId === property.userId }
            variant="contained"
            text={ getLocalizedTextBySlug( 'confirm-time-slot-label', $languageTagStore ) }
            bind:isLoading={ isSubmitting }
            on:click={ submitVisitRequest }
       />
    </ModalActions>
</ModalRoot>

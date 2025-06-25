<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getMap, getTimeZoneFromLocation } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import VisitRequestReserve from '$component/page/visit-request/VisitRequestReserve.svelte';
    import VisitRequestRescheduleModal from '$component/page/visit-request/VisitRequestRescheduleModal.svelte';
    import VisitScheduleResultModal from '$component/page/visit-request/VisitScheduleResultModal.svelte';
    import VisitInfo from '$component/page/visit-request/VisitInfo.svelte';

    // -- VARIABLES

    export let id;
    let isLoading = true;
    let visit;
    let visitDate;
    let property;
    let visitorProfile;
    let isRescheduleModalOpen = false;
    let isScheduleResultModalOpen = false;
    let scheduleResult;
    let leaseContract = {};
    let leaseSignatory = {};
    let employmentStatusByIdMap = {};
    let propertyFeatureByTypeIdMap = {};
    let completeRentalFile = false;
    let visitDone = false;
    let propertyTimeZone = null;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let pageData = await fetchData( '/api/page/visit-request/' + id, { method: 'POST', credentials: 'include' } );
            property = pageData.property;
            visit = pageData.visit;
            visitorProfile = pageData.visitorProfile;
            propertyFeatureByTypeIdMap = getMap( property.featureArray, 'typeId' );
            completeRentalFile = pageData.completeRentalFile;
            propertyTimeZone = getTimeZoneFromLocation( property.latitude, property.longitude, property.countryCode );

            if ( pageData.leaseContract )
            {
                leaseContract = pageData.leaseContract;
            }

            if ( pageData.leaseSignatory )
            {
                leaseSignatory = pageData.leaseSignatory;
            }

            employmentStatusByIdMap = pageData.employmentStatusByIdMap;

            if ( !visitorProfile )
            {
                navigate( '/dashboard/events' );
            }

            let [ hour, minute ] = visit.time.split( ':' );
            visitDate = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );

            let currentDate = new Date();
            let fiveHoursAfterVisitDate = new Date( visitDate.getTime() + 18300000 );

            if ( currentDate.getTime() >= fiveHoursAfterVisitDate.getTime()
                 && completeRentalFile
                 && visit.status === 'booked' )
            {
                visitDone = true;
            }

            isLoading = false;
        }
        );

    // ~~

    $:
    {
        if ( visit )
        {
            let [ hour, minute ] = visit.time.split( ':' );
            visitDate = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .visit-request-page
    {
        margin-bottom: 4rem;
        padding: 2rem 1rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            margin-bottom: unset;
            padding-top: 2rem;
            padding-bottom: 5rem;
        }
    }

    .visit-request-page-content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            max-width: 76.875rem;
        }
    }

    .visit-request-page-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-start;

        +media( desktop )
        {
            flex-direction: row;
            gap: 3rem;
        }
    }
</style>

<div class="visit-request-page">
    {#if isLoading }
        <Loading />
    {:else}
        <div class="visit-request-page-content-container">
            <div class="visit-request-page-heading">
                <div class="font-size-150 font-weight-600 color-gray-100">
                    { getLocalizedTextBySlug( 'visit-request-page-title', $languageTagStore ) }
                </div>
            </div>
            <div class="visit-request-page-content">
                <VisitInfo
                    completeRentalFile={ completeRentalFile }
                    employmentStatusByIdMap={ employmentStatusByIdMap }
                    leaseSignatory={ leaseSignatory }
                    property={ property }
                    propertyTimeZone={ propertyTimeZone }
                    visitorProfile={ visitorProfile }
                    bind:isRescheduleModalOpen={ isRescheduleModalOpen }
                    bind:visit={ visit }
                    bind:visitDate={ visitDate }
                />
                <VisitRequestReserve
                    leaseContract={ leaseContract }
                    property={ property }
                    propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
                    visit={ visit }
                    visitDone={ visitDone }
                    bind:isScheduleResultModalOpen={ isScheduleResultModalOpen }
                    bind:scheduleResult={ scheduleResult }
                />
            </div>
        </div>
    {/if}
</div>
{#if isRescheduleModalOpen }
    <VisitRequestRescheduleModal
        propertyTimeZone={ propertyTimeZone }
        bind:isOpen={ isRescheduleModalOpen }
        bind:visit={ visit }
    />
{/if}
{#if isScheduleResultModalOpen }
<VisitScheduleResultModal
        scheduleResult={ scheduleResult }
        bind:isOpen={ isScheduleResultModalOpen }
    />
{/if}

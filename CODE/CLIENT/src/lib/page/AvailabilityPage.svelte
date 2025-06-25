<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import FormAccordion from '$component/element/FormAccordion.svelte';
    import Loading from '$component/element/Loading.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import DateTimeOptionButton from '$component/page/availability-for-visit/DateTimeOptionButton.svelte';

    // -- VARIABLES

    let currentDate = new Date();
    let currentWeekDateArray = getWeek();
    let timeArray = getTimeArray();
    let availableDateTimeSet = new Set();
    let pendingDateTimeSet = new Set();
    let bookedDateTimeSet = new Set();
    let isLoading = true;
    let isSubmitting = false;

    // -- FUNCTIONS

    function getWeek(
        )
    {
        let weekDateArray = new Array( 7 ).fill( new Date( currentDate.toISOString() ) );

        for ( let dateIndex = 0; dateIndex < weekDateArray.length; ++dateIndex )
        {
            let date = weekDateArray[ dateIndex ];
            weekDateArray[ dateIndex ] = new Date( date.setDate( date.getDate() - date.getDay() + dateIndex ) );
        }

        return weekDateArray;
    }

    // ~~

    function selectWeek(
        direction
        )
    {
        if ( direction === 'increase' )
        {
            currentDate = new Date( currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() + 7 );
        }
        else
        {
            if ( currentDate.getTime() > Date.now() )
            {
                currentDate = new Date( currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 7 );
            }
        }

        currentWeekDateArray = getWeek();

        if ( direction === 'increase' )
        {
            loadData();
        }
    }

    // ~~

    function getTimeArray(
        )
    {
        let timeArray = [];
        let hour = 8;
        let minute = 0;

        for ( let hourAccumulator = 0; hourAccumulator < 12; ++hourAccumulator )
        {
            for ( let minuteAccumulator = 0; minuteAccumulator < 2; ++minuteAccumulator )
            {
                let time = { hour: hour, minute: minute + ( minuteAccumulator * 30 ) };
                timeArray.push( time );
            }

            hour++;
        }

        return timeArray;
    }

    // ~~

    async function handleUpload(
        )
    {
        isSubmitting = true;

        let result
            = await fetchData(
                '/api/create-rental-visit',
                {
                    method: 'POST',
                    body: JSON.stringify( { availableDateTimeArray: Array.from( availableDateTimeSet ) } ),
                    credentials: 'include'
                }
                );

        isSubmitting = false;
    }

    // ~~

    async function loadData(
        )
    {
        isLoading = true;

        let dateRange = [ currentWeekDateArray[ 0 ], currentWeekDateArray[ 6 ] ];
        let { visitArray }
            = await fetchData(
                '/api/page/availability',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText( { dateRange } )
                }
                );

        for ( let visit of visitArray )
        {
            let [ hour, minute ] = visit.time.split( ':' );
            let dateTimeISOString
                = new Date(
                    new Date( visit.date )
                        .setUTCHours( Number( hour ), Number( minute ), 0, 0 )
                    )
                    .toISOString();

            if ( visit.status === 'available' )
            {
                availableDateTimeSet.add( dateTimeISOString );
            }
            else if ( visit.status === 'pending' || visit.status === 'rescheduled-by-host' )
            {
                pendingDateTimeSet.add( dateTimeISOString );
            }
            else if ( visit.status === 'booked' )
            {
                bookedDateTimeSet.add( dateTimeISOString );
            }
        }

        isLoading = false;
    }

    // ~~

    function getIsDateTimeSelected(
        date,
        time
        )
    {
        return availableDateTimeSet.has(
            new Date( date.setHours( time.hour, time.minute, 0, 0 ) ).toISOString()
            );
    }

    // ~~

    function getIsDateTimeBooked(
        date,
        time
        )
    {
        return bookedDateTimeSet.has(
            new Date( date.setHours( time.hour, time.minute, 0, 0 ) ).toISOString()
            );
    }

    // ~~

    function getIsDateTimePending(
        date,
        time
        )
    {
        return pendingDateTimeSet.has(
            new Date( date.setHours( time.hour, time.minute, 0, 0 ) ).toISOString()
            );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadData();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl'
    @import '../../mixin.styl'

    // -- CLASSES

    .availability-page
    {
        margin: 0 auto;
        margin-bottom: 4rem;
        width: 100%;
        max-width: 76rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            margin-bottom: 0;
        }
    }

    .availability-page.wait
    {
        cursor: wait;
    }

    .week-selection-buttons-container
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
    }

    .time-buttons-container
    {
        border-top: 2px solid lightGrayBorderColor;
        padding: 1rem;

        display: grid;
        grid-template-columns: repeat( auto-fit, minmax( 0, min( 100% / 3, max( 3.75rem, 100% / 5 ) ) ) );
        gap: 0.75rem;
        justify-content: center;
    }

    .date-accordions-container
    {
        margin-bottom: 7rem;

        display: flex;
        flex-direction: column;
    }

    .availability-page-button-container
    {
        position: fixed;

        inset: auto 0 4rem auto;

        +media( desktop )
        {
            inset: auto 0 0 auto;
        }

        width: 100%;
        border-top: 2px solid lightGrayBorderColor;
        padding: 1.5rem 1rem;

        display: flex;
        justify-content: center;

        background-color: grayColor900;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'my-ads-page-availability-for-visits', $languageTagStore ) }
    </title>
</svelte:head>

<div class="availability-page" class:wait={ isSubmitting }>
    <div class="availability-page-header">
        <div class="font-size-125 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'availability-page-title', $languageTagStore ) }
        </div>
        <div class="font-size-90 font-weight-500 color-gray-100">
            { getLocalizedTextBySlug( 'availability-page-subtitle', $languageTagStore ) }
        </div>
    </div>
    <div class="availability-page-content">
        <div class="week-selection-buttons-container">
            <ModalButton
                variant="light"
                fullWidth={ false }
                on:click={ () => selectWeek( 'decrease' ) }
            >
                <div class="blue-left-caret-icon size-150"/>
                { getLocalizedTextBySlug( 'availability-page-previous-week-label', $languageTagStore ) }
            </ModalButton>
            <ModalButton
                variant="light"
                fullWidth={ false }
                on:click={ () => selectWeek( 'increase' ) }
            >
                { getLocalizedTextBySlug( 'availability-page-next-week-label', $languageTagStore ) }
                <div class="blue-right-caret-icon size-150"/>
            </ModalButton>
        </div>
        <div class="date-accordions-container">
            {#if isLoading }
                <Loading />
            {:else}
                {#each currentWeekDateArray as date }
                    {#if new Date( date.setHours( 19, 30, 0 ) ).getTime() >= Date.now() }
                        <FormAccordion
                            label={ date.toLocaleString( $languageTagStore, { weekday: 'long', day: 'numeric', month: 'long' } ) }
                        >
                            <div class="time-buttons-container">
                                {#each timeArray as time }
                                    {#if new Date( date.setHours( time.hour, time.minute, 0, 0 ) ).getTime() > Date.now() }
                                        <DateTimeOptionButton
                                            dateTime={ new Date( date.setHours( time.hour, time.minute, 0, 0 ) ) }
                                            isSelected={ getIsDateTimeSelected( date, time ) }
                                            isBooked={ getIsDateTimeBooked( date, time ) }
                                            isPending={ getIsDateTimePending( date, time ) }
                                            bind:selectedDateTimeSet={ availableDateTimeSet }
                                        />
                                    {/if}
                                {/each}
                            </div>
                        </FormAccordion>
                    {/if}
                {/each}
            {/if}
        </div>
    </div>
    <div class="availability-page-button-container">
        <ModalButton
            text={ getLocalizedTextBySlug( 'availability-page-update-availability-label', $languageTagStore ) }
            fullWidth={ false }
            isLoading={ isSubmitting }
            on:click={ handleUpload }
        />
    </div>
</div>

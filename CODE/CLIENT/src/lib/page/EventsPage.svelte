<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug, getTimeZoneFromLocation } from 'senselogic-gist';
    import { fetchData, getLocalizedWeekdayStringFromDateISOString, getTimelessISOStringFromDate } from '$lib/base';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import CallToAction from '$component/element/CallToAction.svelte';
    import Loading from '$component/element/Loading.svelte';
    import Calendar from '$component/page/events/Calendar.svelte';
    import EventMiniCard from '$component/page/events/EventMiniCard.svelte';
    import { countNightsBetweenArrivalDateAndDepartureDate } from '../booking';

    // -- VARIABLES

    let isLoading = true;
    let selectedDate = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) );
    let eventArrayByDateMap = {};
    let filteredEventArrayByDateMap = {};
    let rentalBookingCount = 0;
    let propertyCount = 0;
    let datePickerType = 'month';

    // -- FUNCTIONS

    function handleChangeSelectedDate(
        )
    {
        filteredEventArrayByDateMap = {};
        let dateArray
            = Object.keys( eventArrayByDateMap )
                .sort(
                    ( a, b ) =>
                    {
                        return new Date( a ).getTime() - new Date( b ).getTime();
                    }
                    );

        for ( let eventDate of dateArray )
        {
            if ( datePickerType === 'month' )
            {
                if ( new Date( eventDate ).getTime() >= selectedDate.getTime() )
                {
                   filteredEventArrayByDateMap[ eventDate ] = eventArrayByDateMap[ eventDate ];
                }
            }
            else if ( datePickerType === 'week' )
            {
                let selectedDateWeekdayIndex = selectedDate.getUTCDay();
                let selectedSundayDate = new Date( selectedDate );
                selectedSundayDate.setUTCDate( selectedDate.getUTCDate() + ( 7 - selectedDateWeekdayIndex ) );

                if ( new Date( eventDate ).getTime() >= selectedDate.getTime()
                     && new Date( eventDate ).getTime() <= selectedSundayDate.getTime() )
                {
                    filteredEventArrayByDateMap[ eventDate ] = eventArrayByDateMap[ eventDate ];
                }
            }
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( !$profileSignedInStore && !$isLoadingProfile )
            {
                navigate( '/' );
            }
            else
            {
                let pageData = await fetchData( '/api/page/events', { method: 'POST', credentials: 'include' } );
                propertyCount = pageData.propertyCount;
                rentalBookingCount = pageData.rentalBookingCount;
                let hostVisitArray = pageData.hostVisitArray;
                let visitorVisitArray = pageData.visitorVisitArray;
                let visitorProfileByUserIdMap = pageData.visitorProfileByUserIdMap;
                let propertyByIdMap = pageData.propertyByIdMap;
                let tenantRentalBookingArray = pageData.tenantRentalBookingArray;
                let hostRentalBookingArray = pageData.hostRentalBookingArray;

                for ( let visit of hostVisitArray )
                {
                    let [ hour, minute ] = visit.time.split( ':' );
                    let eventDate = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );
                    let eventTimelessISOString = getTimelessISOStringFromDate( eventDate );
                    let property = propertyByIdMap[ visit.propertyId ];

                    if ( !property )
                    {
                        continue;
                    }

                    let propertyTimeZone = getTimeZoneFromLocation(
                        property.latitude,
                        property.longitude,
                        property.countryCode
                        );

                    if ( eventArrayByDateMap[ eventTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ eventTimelessISOString ] = [];
                    }

                    eventArrayByDateMap[ eventTimelessISOString ]
                        .push(
                            {
                                typeId: 'guest-visit',
                                propertyName: propertyByIdMap[ visit.propertyId ].title,
                                profile: visitorProfileByUserIdMap[ visit.visitorUserId ],
                                date: eventDate,
                                href: 'visit-request/' + visit.id,
                                timeZone: propertyTimeZone
                            }
                            );
                }

                for ( let visit of visitorVisitArray )
                {
                    let [ hour, minute ] = visit.time.split( ':' );
                    let eventDate = new Date( new Date( visit.date ).setUTCHours( hour, minute, 0, 0 ) );
                    let eventTimelessISOString = getTimelessISOStringFromDate( eventDate );
                    let property = propertyByIdMap[ visit.propertyId ];

                    if ( !property )
                    {
                        continue;
                    }

                    let propertyTimeZone = getTimeZoneFromLocation(
                        property.latitude,
                        property.longitude,
                        property.countryCode
                        );

                    if ( eventArrayByDateMap[ eventTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ eventTimelessISOString ] = [];
                    }

                    console.log( propertyTimeZone )

                    eventArrayByDateMap[ eventTimelessISOString ]
                        .push(
                            {
                                typeId: 'visit',
                                propertyName: property?.title,
                                date: eventDate,
                                src: property?.imagePath,
                                href: '/property/' + visit.propertyId,
                                timeZone: propertyTimeZone
                            }
                            );
                }

                for ( let rentalBooking of tenantRentalBookingArray )
                {
                    let checkInDate = new Date( new Date( rentalBooking.arrivalDate ) );
                    let checkInTimelessISOString = getTimelessISOStringFromDate( checkInDate );
                    let checkOutDate = new Date( new Date( rentalBooking.departureDate )  );
                    let checkOutTimelessISOString = getTimelessISOStringFromDate( checkOutDate );
                    let nightCount = countNightsBetweenArrivalDateAndDepartureDate( checkInDate, checkOutDate );

                    if ( eventArrayByDateMap[ checkInTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ checkInTimelessISOString ] = [];
                    }

                    eventArrayByDateMap[ checkInTimelessISOString ]
                        .push(
                            {
                                typeId: 'check-in',
                                propertyName: propertyByIdMap[ rentalBooking.propertyId ]?.title,
                                date: checkInDate,
                                src: propertyByIdMap[ rentalBooking.propertyId ]?.imagePath,
                                guestCount: rentalBooking.guestCount,
                                nightCount: nightCount,
                                href: 'rental-booking/' + rentalBooking.id
                            }
                            );

                    if ( eventArrayByDateMap[ checkOutTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ checkOutTimelessISOString ] = [];
                    }

                    eventArrayByDateMap[ checkOutTimelessISOString ]
                        .push(
                            {
                                typeId: 'check-out',
                                propertyName: propertyByIdMap[ rentalBooking.propertyId ]?.title,
                                date: checkInDate,
                                src: propertyByIdMap[ rentalBooking.propertyId ]?.imagePath,
                                guestCount: rentalBooking.guestCount,
                                nightCount: nightCount,
                                href: 'rental-booking/' + rentalBooking.id
                            }
                            );
                }

                for ( let rentalBooking of  hostRentalBookingArray )
                {
                    let checkInDate = new Date( new Date( rentalBooking.arrivalDate ) );
                    let checkInTimelessISOString = getTimelessISOStringFromDate( checkInDate );
                    let checkOutDate = new Date( new Date( rentalBooking.departureDate )  );
                    let checkOutTimelessISOString = getTimelessISOStringFromDate( checkOutDate );
                    let nightCount = countNightsBetweenArrivalDateAndDepartureDate( checkInDate, checkOutDate );

                    if ( eventArrayByDateMap[ checkInTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ checkInTimelessISOString ] = [];
                    }

                    eventArrayByDateMap[ checkInTimelessISOString ]
                        .push(
                            {
                                typeId: 'guest-check-in',
                                profile: visitorProfileByUserIdMap[ rentalBooking.userId ],
                                propertyName: propertyByIdMap[ rentalBooking.propertyId ]?.title,
                                date: checkInDate,
                                guestCount: rentalBooking.guestCount,
                                nightCount: nightCount,
                                href: 'ads/current-stays/' + rentalBooking.id
                            }
                            );

                    if ( eventArrayByDateMap[ checkOutTimelessISOString ] === undefined )
                    {
                        eventArrayByDateMap[ checkOutTimelessISOString ] = [];
                    }

                    eventArrayByDateMap[ checkOutTimelessISOString ]
                        .push(
                            {
                                typeId: 'guest-check-out',
                                profile: visitorProfileByUserIdMap[ rentalBooking.userId ],
                                propertyName: propertyByIdMap[ rentalBooking.propertyId ]?.title,
                                date: checkInDate,
                                guestCount: rentalBooking.guestCount,
                                nightCount: nightCount,
                                href: 'ads/current-stays/' + rentalBooking.id
                            }
                            );
                }

                console.log( eventArrayByDateMap );

                handleChangeSelectedDate();
            }

            isLoading = false;
        }
        );

    // ~~

    $:
    {
        selectedDate;
        handleChangeSelectedDate();
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant'
    @import '../../mixin.styl'

    // -- CLASSES

    .events-page
    {
        height: calc( var( --viewport-height ) - 4em );
        width: 100%;
        padding-bottom: 4rem;

        display: flex;
        flex-direction: column;

        +media( desktop )
        {
            height: unset;
            min-height: calc( var( --viewport-height ) - 4.5em );
            padding-bottom: 0;

            flex-direction: row;
        }
    }

    .events-page-content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;

        +media( desktop )
        {
            background-color: grayColor950;
        }
    }

    .events-page-content
    {
        width: 100%;
        max-width: 46rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            overflow-y: scroll;
            scrollbar-width: none;
            height: calc( 100dvh - 10.25rem );
        }
    }

    .events-page-header
    {
        display: none;

        +media( desktop )
        {
            margin-bottom: 2rem 0;
            width: 100%;
            border-bottom: 1px solid lightGrayBorderColor;
            padding: 2rem 2rem 1rem;

            display: flex;

            background-color: grayColor900;

            line-height: 2.725rem;
        }
    }

    .events-page-event-list
    {
        width: 100%;

        display:flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
    }

    .events-page-call-to-action-list
    {
        margin-top: 1.5rem;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            display: none;
        }
    }

    .events-page-date-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }
</style>

<svelte:head>
    <title>
        { getLocalizedTextBySlug( 'events-page-title', $languageTagStore ) }
    </title>
</svelte:head>

<div class="events-page">
    <Calendar
        eventDateArray={ Object.keys( eventArrayByDateMap ) }
        rentalBookingCount={ rentalBookingCount }
        propertyCount={ propertyCount }
        bind:selectedDate={ selectedDate }
        bind:datePickerType={ datePickerType }
        bind:isLoading={ isLoading }
    />
    <div class="events-page-content-container">
        <div class="events-page-header">
            <div class="font-size-150 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'events-page-title', $languageTagStore ) }
            </div>
        </div>
        <div class="events-page-content">
            {#if isLoading }
                <Loading />
            {:else}
                {#if Object.entries( filteredEventArrayByDateMap ).length === 0 }
                    <div class="font-size-75 font-weight-500 color-gray-500">
                        { getLocalizedTextBySlug( 'events-page-empty-state-text', $languageTagStore ) }
                    </div>
                {:else}
                    {#each Object.entries( filteredEventArrayByDateMap ) as [ eventDateTimelessISOString, eventArray ] }
                        <div class="events-page-date-container">
                            <div class="font-size-100 font-weight-700 color-gray-100">
                                {#if eventDateTimelessISOString === getTimelessISOStringFromDate( new Date() )  }
                                    { getLocalizedTextBySlug( 'events-page-today-label', $languageTagStore ) }
                                {:else}
                                    { getLocalizedWeekdayStringFromDateISOString( eventDateTimelessISOString, $languageTagStore ) }
                                {/if}
                            </div>
                            <div class="events-page-event-list">
                                {#each eventArray as event }
                                    <EventMiniCard
                                        typeId={ event.typeId }
                                        propertyName={ event.propertyName }
                                        profile={ event.profile }
                                        imagePath={ event.src }
                                        guestCount={ event.guestCount }
                                        nightCount={ event.nightCount }
                                        date={ event.date }
                                        href={ event.href }
                                        timeZone={ event.timeZone }
                                    />
                                {/each}
                            </div>
                        </div>
                    {/each}
                {/if}
                {#if rentalBookingCount === 0 || propertyCount === 0 }
                    <div class="events-page-call-to-action-list">
                        {#if !isLoading }
                            {#if rentalBookingCount === 0 }
                                <CallToAction
                                    title={ getLocalizedTextBySlug( 'events-page-warning-call-to-action-title', $languageTagStore ) }
                                    actionLabel={ getLocalizedTextBySlug( 'events-page-warning-call-to-action-action-label', $languageTagStore ) }
                                    actionHref="/search"
                                    type="error"
                                />
                            {/if}
                            {#if propertyCount === 0 }
                                <CallToAction
                                    title={ getLocalizedTextBySlug( 'events-page-informative-call-to-action-title', $languageTagStore ) }
                                    actionLabel={ getLocalizedTextBySlug( 'events-page-informative-call-to-action-action-label', $languageTagStore ) }
                                    actionHref="/dashboard/ads/new"
                                    type="informative"
                                />
                            {/if}
                        {/if}
                    </div>
                {/if}
            {/if}
        </div>
    </div>
</div>

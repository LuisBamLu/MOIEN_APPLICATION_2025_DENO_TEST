<script>
    // -- IMPORTS

    import { createEventDispatcher } from 'svelte';
    import DatePicker from '$component/element/DatePicker.svelte';

    // -- VARIABLES

    export let dateRange = [ null, null ];
    export let rentalBookingArray = [];
    export let rentalDayByDateMap = {};
    export let dateIndex = 0;
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleDateSelected(
        event
        )
    {
        let arrivalDate = event.detail.arrivalDate;
        let departureDate = event.detail.departureDate;

        dispatch( 'dateSelected', { arrivalDate, departureDate } );
    }

    // ~~

    function isForbiddenDate(
        date
        )
    {
        let currentDateMilisecondCount = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) ).getTime();
        let dateMilisecondCount = new Date( date ).getTime();
        let dateISOString = new Date( date ).toISOString().slice( 0, 10 );

        if ( dateMilisecondCount < currentDateMilisecondCount )
        {
            return true;
        }

        if ( rentalDayByDateMap[ dateISOString ] !== undefined
             && rentalDayByDateMap[ dateISOString ].isAvailableForShortTerm === false )
        {
            return true;
        }

        for ( let rentalBooking of rentalBookingArray )
        {
            let arrivalDateMilisecondCount = new Date( rentalBooking.arrivalDate ).getTime();
            let departureDateMilisecondCount = new Date( rentalBooking.departureDate ).getTime();

            if ( dateMilisecondCount >= arrivalDateMilisecondCount
                 && dateMilisecondCount <= departureDateMilisecondCount )
            {
                return true;
            }
        }

        return false;
    }
</script>

<div class="filter-date">
    <div class="filter-date-container">
        <DatePicker
            dateArray={ dateRange }
            isForbiddenDate={ isForbiddenDate }
            bind:dateIndex={ dateIndex }
            on:dateSelected={ handleDateSelected }
        />
    </div>
</div>

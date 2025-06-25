<script>
    // -- IMPORTS

    import DatePicker from 'senselogic-flow/DatePicker.svelte';
    import CalendarDay from './CalendarDay.svelte';
    import DatePickerElement from '../../element/DatePickerElement.svelte';

    // -- VARIABLES

    export let dateArray = [];
    export let rentalBookingArray = [];
    let selectedDateRange = [ null, null ];

    // -- FUNCTIONS

    function isForbiddenDate(
        date
        )
    {
        let currentDateMilisecondCount = new Date( new Date().setUTCHours( 0, 0, 0, 0 ) ).getTime();
        let dateMilisecondCount = new Date( date ).getTime();

        if ( dateMilisecondCount < currentDateMilisecondCount )
        {
            return true;
        }

        for ( let rentalBooking of rentalBookingArray )
        {
            let arrivalDateMilisecondCount = new Date( rentalBooking.arrivalDate ).getTime();
            let departureDateMilisecondCount = new Date( rentalBooking.departureDate ).getTime();

            if ( dateMilisecondCount >= arrivalDateMilisecondCount && dateMilisecondCount <= departureDateMilisecondCount )
            {
                return true;
            }
        }

        return false;
    }

    // ~~

    function handleDateSelected(
        selectedDateArray
        )
    {
        dateArray = [];
        let indexOfNull = selectedDateArray.indexOf( null );

        if ( indexOfNull !== -1 )
        {
            selectedDateArray[ indexOfNull ] = selectedDateArray.filter( date => date !== null )[ 0 ];
        }

        let dayCount = ( selectedDateArray[ 1 ].getTime() - selectedDateArray[ 0 ].getTime() ) / 1000 / 60 / 60 / 24;

        for ( let dayIndex = 0; dayIndex <= dayCount; ++dayIndex )
        {
            let date = new Date( selectedDateArray[ 0 ] );
            date.setTime( date.getTime() + ( dayIndex * 86400000 ) );
            dateArray.push( date.toISOString().split( 'T' )[ 0 ] );
        }

        dateArray = dateArray;
        selectedDateRange = selectedDateArray;
    }
</script>

<DatePickerElement
    isFordiddenDate={ isForbiddenDate }
    onChange={ handleDateSelected }
    getDayComponent={ ( day ) => CalendarDay }
    dateArray={ selectedDateRange }
/>

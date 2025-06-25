<script>
    // -- IMPORTS

    import { getLocalizedMonthNameArray, getLocalizedWeekdayNameArray } from '$lib/base';
    import { createEventDispatcher } from 'svelte';
    import DatePickerElement from './DatePickerElement.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let dateArray;
    export let dateIndex = 0;
    export let isForbiddenDate = ( date ) => false;
    let dispatch = createEventDispatcher();
    let previousDateArray = dateArray;

    // -- FUNCTIONS

    function handleChange(
        selectedDateArray
        )
    {
        let indexOfNull = selectedDateArray.indexOf( null );

        if ( indexOfNull !== -1 )
        {
            selectedDateArray[ indexOfNull ]
                = selectedDateArray.filter( date => date !== null )[ 0 ];
        }

        if ( dateIndex === 0
             && previousDateArray[ 1 ]
             && selectedDateArray[ 1 ].getTime() > previousDateArray[ 1 ].getTime() )
        {
            selectedDateArray[ 0 ] = selectedDateArray[ 1 ];
        }

        if ( dateIndex === 1
             && previousDateArray[ 0 ]
             && selectedDateArray[ 0 ].getTime() < previousDateArray[ 0 ].getTime() )
        {
            selectedDateArray[ 1 ] = selectedDateArray[ 0 ];
            dateIndex = 0;
        }

        let arrivalDate = selectedDateArray[ 0 ].toISOString();
        let departureDate = selectedDateArray[ 1 ].toISOString();
        let date = new Date( arrivalDate );
        let endDate = new Date( departureDate );

        while ( isForbiddenDate( date ) )
        {
            date.setUTCDate( date.getUTCDate() + 1 );
            arrivalDate = date.toISOString();
        }

        if ( date.getTime() > endDate.getTime() )
        {
            endDate = date;
            departureDate = endDate.toISOString();
        }

        while ( date.getTime() < endDate.getTime() )
        {
            date.setUTCDate( date.getUTCDate() + 1 );

            if ( isForbiddenDate( date ) )
            {
                arrivalDate = new Date( date.setUTCDate( date.getUTCDate() + 1 ) ).toISOString();
            }
        }

        dateIndex = 1 - dateIndex;
        dateArray = [ new Date( arrivalDate ), new Date( departureDate ) ];
        previousDateArray = dateArray;
        dispatch(
            'dateSelected',
            {
                arrivalDate: arrivalDate.slice( 0, 10 ),
                departureDate: departureDate.slice( 0, 10 )
            }
            );
    }
</script>

{#key previousDateArray }
    <DatePickerElement
        monthCount={ 3 }
        monthNameArray={ getLocalizedMonthNameArray() }
        weekdayNameArray={ getLocalizedWeekdayNameArray( $languageTagStore ) }
        onChange={ handleChange }
        isFordiddenDate={ isForbiddenDate }
        dateArray={ dateArray }
        dateIndex={ dateIndex }
    />
{/key}

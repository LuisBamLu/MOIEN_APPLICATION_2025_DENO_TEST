// -- FUNCTIONS

export function countNightsBetweenArrivalDateAndDepartureDate(
    arrivalDate,
    departureDate
    )
{
    let differenceInDays;

    if ( arrivalDate && departureDate )
    {
        arrivalDate = new Date( arrivalDate );
        departureDate = new Date( departureDate );
        let differenceInMilliseconds = departureDate - arrivalDate;

        differenceInDays = Math.floor( differenceInMilliseconds / ( 1000 * 60 * 60 * 24 ) );
    }
    else
    {
        differenceInDays = 0;
    }

    return differenceInDays;
}

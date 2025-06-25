<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let dateTime;
    export let selectedDateTimeSet;
    export let isSelected;
    export let isPending;
    export let isBooked;

    // -- FUNCTIONS

    function handleSelectDateTime(
        dateTime
        )
    {
        if ( !isBooked && !isPending )
        {
            if ( selectedDateTimeSet.has( dateTime ) )
            {
                selectedDateTimeSet.delete( dateTime );
            }
            else
            {
                selectedDateTimeSet.add( dateTime );
            }

            isSelected = !isSelected;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .time-option-button
    {
        border: 2px solid blueColor;
        border-radius: 0.5rem;
        padding: 0.75rem 0.5rem;

        color: blueColor;

        transition: all 0.2s ease-in;
    }

    .time-option-button:hover
    {
        background-color: blueColor300;

        color: whiteColor;
    }

    .time-option-button.is-selected
    {
        border-color: greenColor800;

        background-color: greenColor800;

        color: greenColor100;
    }

    .time-option-button.is-pending
    {
        border-color: yellowColor800;

        background-color: yellowColor900;

        color: yellowColor100;
    }

    .time-option-button.is-booked
    {
        border-color: grayColor800;

        background-color: grayColor900;

        text-decoration: line-through;
        color: grayColor100;
    }
</style>

<button
    class="time-option-button"
    class:is-selected={ isSelected }
    class:is-booked={ isBooked }
    class:is-pending={ isPending }
    on:click={ () => handleSelectDateTime( dateTime.toISOString() ) }
>
    <div class="font-size-75 font-weight-700">
        { dateTime.toLocaleTimeString( $languageTagStore, { hour: '2-digit', minute: '2-digit' } ) }
    </div>
</button>

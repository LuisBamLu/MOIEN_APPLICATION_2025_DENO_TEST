<script>
    // -- VARIABLES

    /** @type {{currentProfile?: any, currentMonth?: any}} */
    let { currentProfile = {}, currentMonth = [ { day: '1', dayOfWeek: 'Wednesday' } ] } = $props();

    let currentMonthDays =
        Array.from(
            { length: 31 }, ( _, index ) =>
            (
                {
                    day: ( index + 1 ).toString(),
                    dayOfWeek: getDayOfWeek( index + 1, currentMonth[ 0 ].dayOfWeek )
                }
            )
            );

    // -- FUNCTIONS

    function getDayOfWeek( day, firstDayOfWeek )
    {
        let daysOfWeek =
        [
            'Sunday',
            'Monday',
            'Tuesday',
            'Wednesday',
            'Thursday',
            'Friday',
            'Saturday'
        ];
        let firstDayIndex = daysOfWeek.indexOf( firstDayOfWeek );
        let dayIndex = ( firstDayIndex + day - 1 ) % 7;

        return daysOfWeek[ dayIndex ];
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../../constant.styl';
    @import '../../../../../../mixin.styl';

    // -- CLASSES

    .calendar
    {
        height: 100%;
        width: 100%;
        border-radius: 0.5rem;
        padding: 0.7vw;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;
    }

    .calendar-header
    {
        width: 100%;
        border-bottom: 1px solid grayColor800;
        padding-bottom: 0.5vw;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .calendar-header p
    {
        font-size: 0.9vw;
        font-weight: 700;
        color: grayColor100;
    }

    .calendar-header-navigator
    {
        display: flex;
        gap: 0.7vw;
    }

    .schedule-calendar
    {
        height: 100%;
        width: 100%;

        display: grid;
        grid-template-columns: repeat( 7, 1fr );
        gap: 0.5vw;
    }

    .schedule-calendar-day
    {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        &.selected
        {
            border: 1px solid grayColor600;
            border-radius: 0.5rem;

            background-color: greenColor;
        }
    }

    .schedule-calendar-day-name
    {
        font-size: 0.7vw;
        font-weight: 500;
        color: grayColor500;
    }

    .schedule-calendar-day-number
    {
        font-size: 0.7vw;
        font-weight: 700;
        color: grayColor100;
    }
</style>

<div class="calendar">
    <div class="calendar-header">
        <p>Month, YYYY</p>
        <div class="calendar-header-navigator">
            <button
                class=""
                onclick={() => {}}
            >
                <i class="green-chevron-left-icon size-150"></i>
            </button>
            <button
                class=""
                onclick={() => {}}
            >
                <i class="green-chevron-right-icon size-150"></i>
            </button>
        </div>
    </div>
    <div class="schedule-calendar">
        {#each [ 'SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT' ] as dayOfWeek }
            <div class="schedule-calendar-day">
                <p class="schedule-calendar-day-name">{ dayOfWeek }</p>
            </div>
        {/each}
        {#each currentMonthDays as day }
            <div class="schedule-calendar-day">
                <p class="schedule-calendar-day-number">{ day.day }</p>
            </div>
        {/each}
    </div>
</div>

<script>
    // -- IMPORTS

    import { getLocalizedMonthYearTextFromDate } from '$lib/base';
    import EventsDatePicker from '$component/page/events/EventsDatePicker.svelte';
    import Tab from '../../element/Tab.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import CallToAction from '../../element/CallToAction.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    export let selectedDate = new Date();
    export let eventDateArray = [];
    export let datePickerType =  'month';
    export let rentalBookingCount;
    export let propertyCount;
    export let isLoading;
    let currentMonthYear = getLocalizedMonthYearTextFromDate( new Date(), $languageTagStore );

    // -- FUNCTIONS

    function handleChange(
        date
        )
    {
        selectedDate = date;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl'

    // -- CLASSES

    .calendar
    {
        width: 100%;

        display: flex;
        flex-direction: column;

        +media( desktop )
        {
            width: 20%;
            min-width: 24.5rem;
            border-right: 1px solid lightGrayBorderColor;
        }
    }

    .calendar-header
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 2rem 1.5rem 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .tab-container
    {
        display: flex;
        gap: 0.5rem;
    }

    .container
    {
        height: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .calendar-content
    {
        background-color: blueColor950;
    }

    .desktop-call-to-action-list-container
    {
        display: none;

        +media( desktop )
        {
            padding: 2rem 1.5rem;

            display: flex;
            flex-direction: column;
            gap: 1.5rem;
        }
    }
</style>

<div class="calendar">
    <div class="calendar-header">
        <div class="font-size-125 font-weight-600 color-gray-100">
            { currentMonthYear }
        </div>
        <div class="tab-container">
            <Tab
                label="week"
                isActive={ datePickerType === 'week' }
                on:click={ () => datePickerType = 'week' }
            />
            <Tab
                label="month"
                isActive={ datePickerType === 'month' }
                on:click={ () => datePickerType = 'month' }
            />
        </div>
    </div>
    <div class="container">
        <div class="calendar-content">
            <EventsDatePicker
                bind:date={ selectedDate }
                eventDateArray={ eventDateArray }
                onChange={ handleChange }
                bind:type={ datePickerType }
            />
        </div>
        {#if !isLoading }
            <div class="desktop-call-to-action-list-container">
                {#if rentalBookingCount === 0 }
                    <CallToAction
                        title={ getLocalizedTextBySlug( 'events-page-warning-call-to-action-title', $languageTagStore ) }
                        actionLabel={ getLocalizedTextBySlug( 'events-page-warning-call-to-action-action-label', $languageTagStore ) }
                        actionHref="/search"
                        type="error"
                    />
                {/if}
                {#if propertyCount === 0 && $profileSignedInStore.mangopayUserId }
                    <CallToAction
                        title={ getLocalizedTextBySlug( 'events-page-informative-call-to-action-title', $languageTagStore ) }
                        actionLabel={ getLocalizedTextBySlug( 'events-page-informative-call-to-action-action-label', $languageTagStore ) }
                        actionHref="/dashboard/ads/new"
                        type="informative"
                    />
                {/if}
            </div>
        {/if}
    </div>
</div>

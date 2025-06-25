<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { getLocalizedDateWeekdayMonthDay } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import FilterDate from '$component/filter/FilterDate.svelte';

    // -- VARIABLES

    let dateContainerElement;
    let todayDate = new Date();
    let dateIndex = null;

    // -- FUNCTIONS

    function handleDatePicker(
        selectedDateIndex
        )
    {
        if ( dateIndex !== selectedDateIndex )
        {
            dateIndex = selectedDateIndex;
            dateContainerElement.classList.add( 'is-selected' );
        }
        else
        {
            dateIndex = null;
            dateContainerElement.classList.remove( 'is-selected' );
        }
    }

    // ~~

    function handleDateSelected(
        event
        )
    {
        filterParameterByKeyMapStore.update(
            currentParameters =>
            {
                let updatedParameters = { ...currentParameters };

                updatedParameters.bookingParameters.arrivalDate = event.detail.arrivalDate;
                updatedParameters.bookingParameters.departureDate = event.detail.departureDate;

                return updatedParameters;
            }
            );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    .properties-filter-date-popup
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .properties-filter-date-popup-container
    {
        height: 100%;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: stretch;
    }

    :global( .properties-filter-date-popup-container.is-selected )
    {
        border-bottom: 1px solid transparent;
    }

    .properties-filter-date-popup-item
    {
        border: 2px solid grayColor700;
        border-radius: 0.75rem;
        padding: 1.5rem;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;

        transition: all 200ms ease-in-out;
    }

    .properties-filter-date-popup-item.is-selected
    {
        border-color: greenColor500
        background-color: greenColor950;
    }

    .properties-filter-date-popup-separator
    {
        display: flex;
        flex: 1;
        justify-content: center;
        align-items: center;
    }

    .properties-filter-date-popup-picker
    {
        display: none;
    }

    :global( .properties-filter-date-popup-container.is-selected~.properties-filter-date-popup-picker )
    {
        display: block;
    }

    :global( .properties-filter-date-popup-picker >div )
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<div class="properties-filter-date-popup">
    <div class="font-size-100 font-weight-700 color-gray">
        { getLocalizedTextBySlug( 'filter-date-label', $languageTagStore ) }
    </div>
    <div class="properties-filter-date-popup-container" bind:this={ dateContainerElement }>
        <button
            class="properties-filter-date-popup-item"
            class:is-selected={ dateIndex === 0 }
            on:click={ () => handleDatePicker( 0 ) }
        >
            <div class="font-size-75 font-weight-600 color-gray properties-filter-date-popup-item-label">
                { getLocalizedTextBySlug( 'filter-date-from-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-700 color-gray properties-filter-date-popup-item-value">
                {#if $filterParameterByKeyMapStore.bookingParameters.arrivalDate }
                    { getLocalizedDateWeekdayMonthDay( $filterParameterByKeyMapStore.bookingParameters.arrivalDate ) }
                {:else}
                    { getLocalizedDateWeekdayMonthDay( todayDate.toISOString() ) }
                {/if}
            </div>
        </button>
        <div class="properties-filter-date-popup-separator">
            <div class="blue-right-arrow-icon size-150"/>
        </div>
        <button
            class="properties-filter-date-popup-item"
            class:is-selected={ dateIndex === 1 }
            on:click={ () => handleDatePicker( 1 ) }
        >
            <div class="font-size-75 font-weight-600 color-gray properties-filter-date-popup-item-label">
                { getLocalizedTextBySlug( 'filter-date-to-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-700 color-gray properties-filter-date-popup-item-value">
                {#if $filterParameterByKeyMapStore.bookingParameters.departureDate }
                    { getLocalizedDateWeekdayMonthDay( $filterParameterByKeyMapStore.bookingParameters.departureDate ) }
                {:else}
                    <div class="green-increase-icon size-200"/>
                {/if}
            </div>
        </button>
    </div>
    <div class="properties-filter-date-popup-picker">
        <FilterDate
            dateRange=
                {
                    [
                        $filterParameterByKeyMapStore.bookingParameters.arrivalDate
                        ? new Date( $filterParameterByKeyMapStore.bookingParameters.arrivalDate )
                        : null,
                        $filterParameterByKeyMapStore.bookingParameters.departureDate
                        ? new Date( $filterParameterByKeyMapStore.bookingParameters.departureDate )
                        : null
                    ]
                }
            bind:dateIndex={ dateIndex }
            on:dateSelected={ handleDateSelected }
        />
    </div>
</div>

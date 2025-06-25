<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { navigate } from 'svelte5-router';
    import
    {
        getCurrentLocalDateTime,
        getLocalizedTextBySlug,
        getSystemDate,
        logError
    }
    from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { createEventDispatcher, onMount } from 'svelte';
    import { loadTicketArray, ticketArrayStore } from '$store/ticketStore';
    import PeriodSelect from '../PeriodSelect.svelte';
    import TicketLine from './TicketLine.svelte';
    import Loading from '$component/element/Loading.svelte';
    import SearchBar from '$component/element/SearchBar/SearchBar.svelte';
    import { msInDay, msInMonth, msInWeek } from '$lib/base';

    // -- VARIABLES

    let ticketArray = $state([]);
    let temporaryTicketArray = $state([]);
    let period = $state('all');
    let isLoading = $state(true);
    let filterParameterByKeyMap =
    {
        type:
        {
            type: 'text',
            name: 'Type',
            optionArray: [],
            value: ''
        },
        key:
        {
            type: 'text',
            name: 'Key',
            value: ''
        },
        text:
        {
            type: 'text',
            name: 'Text',
            value: ''
        }
    }

    // -- FUNCTIONS

    function handleActionButton(
        id = 'new'
        )
    {
        navigate( `/admin/statistics/dashboard/ticket/${ id }` );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                await loadTicketArray();

                ticketArray = $ticketArrayStore;

                temporaryTicketArray = ticketArray;
            }
            catch( error )
            {
                logError( error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );

    // ~~

    run(() => {
        let now = getCurrentLocalDateTime().getTime();
        let filterDateTimeMs = null;

        switch ( period )
        {
            case 'all':
                temporaryTicketArray = ticketArray;
                break;
            case 'day':
                filterDateTimeMs = ( now - msInDay );
                break;
            case 'week':
                filterDateTimeMs = ( now - msInWeek );
                break;
            case 'month':
                filterDateTimeMs = ( now - msInMonth );
                break;
        }

        if ( filterDateTimeMs )
        {
            temporaryTicketArray = ticketArray.filter(
                ( ticket ) =>
                {
                    let creationDateTime = getSystemDate( ticket.creationTimestamp ).getTime();

                    return creationDateTime > filterDateTimeMs;
                }
                );
        }
        else
        {
            temporaryTicketArray = ticketArray;
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    section
    {
        height: auto;
        max-height: 60vh;
        border-radius: 0.5rem;
        padding: 1vw;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: white;
        @media( max-width: 1200px )
        {
            padding: 1rem;
        }
    }

    table
    {
        width: 100%;
        border-collapse: collapse;
    }

    thead
    {
        z-index: 1;
        position: sticky;
        top: 0;

        border-radius: 0.5rem;

        background-color: blueColor950;
    }

    td
    {
        padding: 0.5rem 1rem;

        font-size: 1vw;
        font-weight: 700;
        color: grayColor100;
    }

    // -- CLASSES

    .ticket-section-head
    {
        display: flex;
        justify-content: space-between;
        align-items: center;

        font-size: 1.5vw;
        font-weight: 600;
        color: grayColor100;
        @media( max-width: 1200px )
        {
            font-size: 3vw;
        }
    }

    .ticket-admin-table
    {
        overflow-y: auto;
        overflow-x: auto;
        scrollbar-width: none;
        max-height: 60vh;
        width: 100%;
        border: 1px solid blueColor900;
        border-radius: 0.5rem;

        text-align: left;
    }

    .divisor
    {
        height: 1px;
        width: 100%;
        padding: 0;

        background-color: blueColor900;
    }

    .ticket-section-footer
    {
        display: flex;
        align-items: center;
        button
        {
            border: 1px solid blueColor300;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;

            background-color: transparent;

            font-size: 1rem;
            font-weight: 700;
            color: blueColor300;
            &:hover
            {
                border: 1px solid blueColor500;

                color: blueColor500;
            }
        }
    }
</style>

<section>
    {#if isLoading }
        <Loading/>
    {:else}
        <div class="ticket-section-head">
            { getLocalizedTextBySlug( 'admin-dashboard-ticket-section-label', $languageTagStore ) }
            <SearchBar
                value={ '' }
                column={ '' }
                filterParameterByKeyMap={ filterParameterByKeyMap }
            />
            <PeriodSelect bind:value={ period }/>
        </div>
        <div class="ticket-admin-table">
            <table>
                <thead>
                    <tr>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-key-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'title-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-summary-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-reporter-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-assignee-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-status-label', $languageTagStore ) }</td>
                        <td>{ getLocalizedTextBySlug( 'admin-dashboard-ticket-solve-label', $languageTagStore ) }</td>
                    </tr>
                    <tr>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                        <td class="divisor"></td>
                    </tr>
                </thead>
                <tbody>
                    {#each temporaryTicketArray as ticket }
                        <TicketLine { ticket } onTicketClick={ handleActionButton }/>
                    {/each}
                </tbody>
            </table>
        </div>
        <div class="ticket-section-footer">
            <button
                onclick={() => handleActionButton( 'new' )}
            >
                { getLocalizedTextBySlug( 'admin-dashboard-ticket-create-label', $languageTagStore ) }
            </button>
        </div>
    {/if}
</section>

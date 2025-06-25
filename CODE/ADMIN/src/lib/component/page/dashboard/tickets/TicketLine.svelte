<script>
    // -- IMPORTS

    import DashboardTag from '../DashboardTag.svelte';
    import { onMount } from 'svelte';
    import { ticketStatusArrayStore } from '$store/ticketStore';
    import Loading from '$component/element/Loading.svelte';
    import { msInSecond, msInDay, msInHour, msInMinute } from '$lib/base';
    import { getFloorInteger, getLocalizedTextBySlug, getRandomInteger } from 'senselogic-gist';
    import ProfileImage from '$src/lib/component/element/ProfileImage.svelte';

    // -- VARIABLES

    /** @type {{ticket: any, onTicketClick?: any}} */
    let { ticket, onTicketClick = () => {} } = $props();
    let assigneeName = $state('');
    let statusColor = $state('');
    let statusText = $state('Who');
    let timeColor = $state('');
    let solveTime = $state('00:00');
    let isLoading = $state(true);

    // -- FUNCTIONS

    function getAssigneeName( assignee )
    {
        if ( assignee === null || assignee === undefined )
        {
            return 'Unknown assign';
        }

        return `${ assignee.firstName } ${ assignee.lastName }`;
    }

    // ~~

    function getStatusColor( statusId )
    {
        let color;

        switch ( statusId )
        {
            case 'cancelled':
                color = 'red';
                break;
            case 'pending':
                color = 'yellow';
                break;
            case 'resolved':
                color = 'green';
                break;
            case 'active':
                color = 'blue';
        }

        return color;
    }

    // ~~

    function getHours( difference )
    {
        let hours = getFloorInteger( difference / msInHour ) % 24;

        return hours < 10 ? `0${ hours }` : hours;
    }

    // ~~

    function getMinutes( difference )
    {
        let minutes = getFloorInteger( difference / msInMinute ) % 60;

        return minutes < 10 ? `0${ minutes }` : minutes;
    }

    // ~~

    function getImageAlt( assignee )
    {
        return `${ assignee.firstName } ${ getLocalizedTextBySlug( 'profile-photo-label' ) }`;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            assigneeName = getAssigneeName( ticket.assignee );
            statusColor = getStatusColor( ticket.statusId );

            if ( $ticketStatusArrayStore && $ticketStatusArrayStore.length > 0 )
            {
                statusText = $ticketStatusArrayStore.find( ( status ) => status.id === ticket.statusId ).text;
            }
            else
            {
                statusText = ticket.statusId.charAt( 0 ).toUpperCase() + ticket.statusId.slice( 1 );
            }

            let creation = new Date( ticket.creationTimestamp );
            let solved = new Date();

            if ( ticket.solvedTimestamp )
            {
                solved = new Date( ticket.solvedTimestamp );
                timeColor = solved > creation ? 'green' : 'red';
            }
            else if ( ticket.statusId === 'resolved' )
            {
                timeColor = 'green';
            }

            let difference = solved.getTime() - creation.getTime();
            let dayCount = difference < msInDay ? null : getFloorInteger( difference / msInDay );
            let hourCount = difference < msInHour ? '00' : getHours( difference );
            let minuteCount = getMinutes( difference );

            if ( dayCount )
            {
                solveTime = `${ dayCount } ${ getLocalizedTextBySlug( 'day-label' ) } ${ hourCount } ${ getLocalizedTextBySlug( 'hour-label' ) }`;
            }
            else
            {
                solveTime = `${ hourCount }:${ minuteCount }`;
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../constant.styl';
    @import '../../../../../mixin.styl';

    // -- ELEMENTS

    tr
    {
        border-top: 1px solid blueColor900;
        padding: 1rem 0;

        font-size: 1vw;

        cursor: pointer;
    }

    td
    {
        overflow: hidden;
        padding: 0.5rem 1rem;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    // -- CLASSES

    .highlight
    {
        max-width: 20vw;

        font-weight: 700;
        color: blueColor500;
    }

    .user
    {
        display: flex;
        flex-direction: row;
        gap: 0.5vw;
        align-items: center;
        img
        {
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
        }

        p
        {
            overflow: hidden;

            text-overflow: ellipsis;
        }
    }
</style>

{#if isLoading }
    <Loading/>
{:else}
    <tr
        id={ ticket.id }
        role="button"
        tabindex="0"
        onkeydown={() => onTicketClick( ticket.id )}
        onclick={() => onTicketClick( ticket.id )}
    >
        <td>{ ticket.key }</td>
        <td>{ ticket.title }</td>
        <td class="highlight">
            { ticket.text }
        </td>
        <td title={ `${ ticket.reporter.firstName } ${ ticket.reporter.lastName }` }>
            { ticket.reporter.firstName }
        </td>
        <td>
            <div class="user">
                <ProfileImage
                    size="medium"
                    imagePath={ ticket.assignee.imagePath }
                    userName={ assigneeName }
                />
                <p title={ assigneeName }>{ assigneeName }</p>
            </div>
        </td>
        <td>
            <DashboardTag color={ statusColor } text={ statusText } line/>
        </td>
        <td>
            <DashboardTag color={ timeColor } time={ true } text={ solveTime } line/>
        </td>
    </tr>
{/if}

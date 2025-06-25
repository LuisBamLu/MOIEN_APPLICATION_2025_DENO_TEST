<script>
    // -- IMPORTS

    import { notificationArrayStore } from '$store/notificationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import NotificationDataCard from './NotificationDataCard.svelte';

    // -- VARIABLES

    let notificationSummaryMap = $state({});

    notificationArrayStore.subscribe(
        ( { eventArray } ) =>
        {
            notificationSummaryMap = eventArray.reduce(
                ( accumulator, notification ) =>
                {
                    if ( !accumulator[ notification.notificationMedium ] )
                    {
                        accumulator[ notification.notificationMedium ] = 0;
                    }

                    if ( notification.eventStatus === 'done' )
                    {
                        accumulator[ notification.notificationMedium ] += 1;
                    }

                    if ( !accumulator[ notification.eventStatus ] )
                    {
                        accumulator[ notification.eventStatus ] = 0;
                    }

                    accumulator[ notification.eventStatus ] += 1;

                    return accumulator;
                },
                {}
                );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .notification-head
    {
        padding-bottom: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .notification-head h1
    {
        font-size: 2rem;
        font-weight: 700;
        color: blueColor300;
    }

    .notification-head-cards
    {
        overflow: auto;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;

        scroll-snap-type: x mandatory;

        +media( desktop )
        {
            overflow: hidden;
        }
    }

    .notification-head-cards::-webkit-scrollbar-track
    {
        background-color: #F4F4F4;
    }

    .notification-head-cards::-webkit-scrollbar
    {
        height: 0.5em;

        background: #F4F4F4;
    }

    .notification-head-cards::-webkit-scrollbar-thumb
    {
        border-radius: 16px;

        background: #dad7d7;
    }
</style>

<section class="notification-head">
    <h1>Notifications</h1>
    <div class="notification-head-cards">
        <NotificationDataCard
            color="green"
            statistic={ notificationSummaryMap[ 'pending' ] || 0 }
            legend={ getLocalizedTextBySlug( 'planned-label', $languageTagStore ) }
        />
        <NotificationDataCard
            color="blue"
            statistic={ notificationSummaryMap[ 'email' ] || 0 }
            legend={ getLocalizedTextBySlug( 'sent-email-label', $languageTagStore ) }
        />
        <NotificationDataCard
            color="red"
            statistic={ notificationSummaryMap[ 'push' ] || 0 }
            legend={ getLocalizedTextBySlug( 'sent-push-label', $languageTagStore ) }
        />
    </div>
</section>

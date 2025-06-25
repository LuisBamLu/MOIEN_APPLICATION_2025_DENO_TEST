<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug, getProcessedMultilineText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { fetchData, flyFade } from '$lib/base';
    import { notificationCenterStore } from '$store/notificationCenterStore';
    import { onDestroy } from 'svelte';

    // -- VARIABLES

    let notificationArray = [];

    let unsubscribe = notificationCenterStore.subscribe( ( _notificationArray ) => notificationArray = _notificationArray );

    // -- FUNCTIONS

    async function loadNotificationByUserId(
        )
    {
        try
        {
            let response = await fetchData(
                '/api/notification',
                {
                    method: 'POST',
                    credentials : 'include'
                }
                );
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    async function markNotificationAsRead(
        notificationId
        )
    {
        try
        {
            let response = await fetchData(
                '/api/notification/read/' + notificationId,
                {
                    method : 'POST',
                    credentials : 'include'
                }
                );

            notificationCenterStore.read( notificationId )
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    async function dismissNotitication(
        notificationId
        )
    {
        try
        {
            let response = await fetchData(
                '/api/notification/dismiss/' + notificationId,
                {
                    method : 'POST',
                    credentials : 'include'
                }
                );

            notificationCenterStore.dismiss( notificationId );
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    async function dismissAllNotitication(
        notificationId
        )
    {
        if ( confirm( 'Are you sure you want to delete all notifications?' ) !== true ) return;

        try
        {
            let response = await fetchData(
                '/api/notification/dismiss/all',
                {
                    method : 'POST',
                    credentials : 'include'
                }
                );

            notificationCenterStore.dismissAll();
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    async function markAllAsRead(
        )
    {
        try
        {
            let response = await fetchData(
                '/api/notification/read/all',
                {
                    method : 'POST',
                    credentials : 'include'
                }
                );

            notificationCenterStore.markAllAsRead();
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // ~~

    function getFormattedDate(
        date
        )
    {
        return new Intl.DateTimeFormat( 'en-US', { dateStyle: 'long' } ).format( new Date( date ) );
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            unsubscribe();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .notification-container
    {
        padding: 0 1.5rem;

        +media( desktop )
        {
            margin: 0 auto;
            max-width: 1440px;
            padding: 0 5rem;
        }
    }

    .notification-list
    {
        +media( tablet )
        {
            margin-left: 25%;
            width: 50%;
        }
    }

    .notification-list-item
    {
        border-bottom: 1px solid grayColor700;

        display: flex;
    }

    .notification-list-item-button
    {
        flex: 1;

        transition: box-shadow 0.2s cubic-bezier( 0.2, 0, 0, 1 ), transform 0.1s cubic-bezier( 0.2, 0, 0, 1 );
    }

    .notification-list-item-button-content
    {
        padding: 1rem 1rem 1rem 0;

        display: flex;
    }

    .notification-list-item-button-image-container
    {
        margin-right: 0.75rem;
        height: 3rem;
        width: 3rem;

        background: grayColor900;
    }

    .border-radius-50
    {
        border-radius: 50%;
    }

    .notification-list-item-button-content-image
    {
        object-fit: cover;
    }

    .notification-list-item-close-button-container
    {
        margin-left: 0.75rem;

        align-self: center;
    }

    .notification-list-item-close-button-container,
    .notification-list-item-button-image-container
    {
        flex-shrink: 0;
    }

    .notification-list-item-text-content-date
    {
        padding-top: 0.25rem;

        line-height: 1.125rem;
    }

    .notification-list-item-close-button
    {
        position: relative;
        touch-action: manipulation;
    }

    .notification-list-item-close-button::before
    {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        height: 2rem;
        width: 2rem;
    }

    .notification-list-header
    {
        margin-top: 2.5rem;
        margin-bottom: 2rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .notification-list-header h1
    {
        margin-bottom: 1rem;

        +media( desktop )
        {
            margin: 0;
        }
    }

    .notification-list-header-actions
    {
        display: flex;
        gap: 0.5rem;
        justify-content: flex-end;
        align-items: center;
    }

    .notification-list-header-action-button
    {
        border: 1px solid grayColor600;
        border-radius: 1.25rem;
        padding: 0.25rem 0.75rem 0.3125rem 0.75rem;

        display: inline-flex;
        gap: 0.25rem;
        justify-content: center;
        align-items: center;

        line-height: 1.375rem;
        font-size: 0.75rem;
        font-weight: 500;
        color: grayColor500;
    }
</style>

<div class="padding-bottom-350">
    <div class="notification-container">
        <div class="notification-list">
            <div class="notification-list-header">
                <h1 class="font-size-200 font-weight-600 color-gray-100">
                    { getLocalizedTextBySlug( 'notification-settings-notifications-label', $languageTagStore ) }
                </h1>

                <div class="notification-list-header-actions">
                    <button
                        class="notification-list-header-action-button"
                        type="button"
                        on:click={ markAllAsRead }
                    >
                        Read all
                    </button>
                    <button
                        class="notification-list-header-action-button"
                        type="button"
                        on:click={ dismissAllNotitication }
                    >
                        Clear all
                    </button>
                </div>
            </div>
            {#if notificationArray.length === 0 }
                <p
                    class="font-size-85 color-gray-100"
                >
                    You're up to date
                </p>
            {:else}
                {#each $notificationCenterStore as notification ( notification.id ) }
                    <div
                        class="notification-list-item"
                    >
                        <button
                            class="notification-list-item-button"
                            id={ notification.id }
                            aria-label=
                                {
                                    notification.isRead ?
                                    `${ getLocalizedTextBySlug( 'notification-read-label', $languageTagStore ) }, `
                                    : `${ getLocalizedTextBySlug( 'notification-unread-label', $languageTagStore ) }, `
                                    + `${ notification.message }, `
                                    + `${ notification.creationTimestamp }`
                                }
                            type="button"
                            on:click={ () => markNotificationAsRead( notification.id ) }
                            out:flyFade={ { x: 100, delay: 100 } }
                        >
                            <div class="notification-list-item-button-content">
                                <div class="notification-list-item-button-image-container border-radius-50">
                                    <div class="border-radius-50">
                                        <img
                                            class="notification-list-item-button-content-image border-radius-50"
                                            aria-hidden="true"
                                            alt=""
                                            src="/image/icon/moien_happy.svg"
                                            data-original-uri="/image/icon/moien.svg"
                                        >
                                    </div>
                                </div>
                                <div class="notification-list-item-text-container">
                                    <div
                                        class=
                                            "
                                                font-size-85
                                                {
                                                    notification.isRead
                                                    ? 'font-weight-400 color-gray-300'
                                                    : 'font-weight-600 color-gray-100'
                                                }
                                                text-align-left
                                            "
                                    >
                                        {@html getProcessedMultilineText( notification.message, $languageTagStore ) }
                                    </div>
                                    <div class="notification-list-item-text-content-date font-size-85 color-gray-300 text-align-left">
                                        { getFormattedDate( notification.creationTimestamp ) }
                                    </div>
                                </div>
                            </div>
                        </button>
                        <div class="notification-list-item-close-button-container">
                            <button
                                aria-label={ getLocalizedTextBySlug( 'dismiss-notification-button', $languageTagStore ) }
                                aria-describedby={ notification.id }
                                type="button"
                                class="notification-list-item-close-button"
                                on:click={ () => dismissNotitication( notification.id ) }
                            >
                                <div class="gray-close-icon size-75"/>
                            </button>
                        </div>
                    </div>
                {/each}
            {/if}
        </div>
    </div>
</div>

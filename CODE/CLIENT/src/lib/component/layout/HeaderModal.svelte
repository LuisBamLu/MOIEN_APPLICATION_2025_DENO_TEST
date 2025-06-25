<script>

    // -- IMPORTS

    import { Link, navigate } from 'svelte-routing';
    import { slide } from 'svelte/transition';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { notificationCenterStore } from '$src/lib/store/notificationCenterStore';
    import { onDestroy } from 'svelte';
    import { conversationArrayStore } from '$src/lib/store/conversationStore';
    import { currentPathname } from '$src/lib/router';

    // -- VARIABLES

    let notificationCount;
    let newMessageCount;
    let unsubscribeNotificationCenter
        = notificationCenterStore.subscribe(
            ( notificationArray ) =>
            notificationCount = notificationArray.filter( ( notification ) => !notification.isRead ).length
            );
    let unsubscribeNewMessageCount = conversationArrayStore
        .subscribe(
            ( conversationArray ) =>
            {
                newMessageCount = conversationArray.reduce(
                    ( messageCount, conversation ) =>
                    {
                        if ( !$profileSignedInStore?.userId )
                        {
                            return messageCount;
                        }

                        if ( $profileSignedInStore.userId === conversation.targetUserProfileId )
                        {
                            return messageCount + ( conversation.targetNewMessageCount || 0 );
                        }
                        else if ( $profileSignedInStore.userId === conversation.sourceUserProfileId )
                        {
                            return messageCount + ( conversation.sourceNewMessageCount || 0 );
                        }

                        return messageCount;
                    },
                    0
                    );
            }
            );

    // -- FUNCTIONS

    async function handleSignOut(
        )
    {
        if ( $currentPathname.includes( '/dashboard' ) )
        {
            navigate( '/search' );
        }

        let result = await fetchData( '/api/sign-out', { method: 'POST', credentials: 'include' } );

        if ( result )
        {
            $profileSignedInStore = result.profile;
        }
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            unsubscribeNotificationCenter();
            unsubscribeNewMessageCount();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .header-modal
    {
        z-index: 1000;
        position: fixed;
        top: 4rem;
        right: 2rem;

        width: 20rem;
        max-width: calc( var( --viewport-width ) - 4rem );
        border-radius: 0.75rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        -ms-overflow-style: none;
        scrollbar-width: none;

        +media( desktop )
        {
            max-width: 35rem;
        }
    }

    .header-modal-itens
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 1.5rem;
    }

    .header-modal-itens:last-child
    {
        border-bottom: unset;
    }

    .header-modal::-webkit-scrollbar
    {
        display: none;
    }

    :global( .header-modal-item )
    {
        padding: 0.75rem 0;

        display: flex;
        justify-content: space-between;
    }

    :global( .header-modal-item:hover div )
    {
        color: greenColor300;
    }

    .position-relative
    {
        position: relative;
    }

    .badge
    {
        position: absolute;
        top: 0;
        right: -1rem;

        height: 0.35rem;
        width: 0.35rem;
        border-radius: 50%;

        background-color: redColor500;
    }

    .logout-container
    {
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;
    }

    .separator
    {
        height: 1px;

        align-items: center;

        background-color: lightGrayBorderColor;
    }
</style>

<div class="header-modal" transition:slide>
    <div class="header-modal-itens">
        <Link class="header-modal-item" to="/dashboard/conversation">
            <div class="font-size-100 font-weight-700 color-black position-relative">
                { getLocalizedTextBySlug( 'header-messages-label', $languageTagStore ) }
                {#if newMessageCount > 0 }
                    <div class="badge"/>
                {/if}
            </div>
            <div class="gray-right-caret-icon size-150"></div>
        </Link>
        <div class="separator"></div>
        {#if notificationCount > 0 }
            <Link class="header-modal-item" to="/dashboard/notifications">
                <div class="font-size-100 font-weight-700 color-black position-relative">
                    { getLocalizedTextBySlug( 'notification-settings-notifications-label', $languageTagStore ) }
                    <div class="badge"/>
                </div>
            </Link>
            <div class="separator"></div>
        {/if}
        <Link class="header-modal-item" to="/dashboard/favorites">
            <div class="font-size-100 font-weight-700 color-black">
                { getLocalizedTextBySlug( 'header-favorites-label', $languageTagStore ) }
            </div>
        </Link>
        <div class="separator"></div>
        <Link class="header-modal-item" to="/dashboard/history">
            <div class="font-size-100 font-weight-700 color-black">
                { getLocalizedTextBySlug( 'header-history-label', $languageTagStore ) }
            </div>
        </Link>
    </div>
    <div class="header-modal-itens">
        {#if $profileSignedInStore.mangopayUserId }
            <Link class="header-modal-item" to="/dashboard/ads">
                <div class="font-size-100 font-weight-500 color-black">
                    { getLocalizedTextBySlug( 'header-advertise-your-space-label', $languageTagStore ) }
                </div>
            </Link>
            <div class="separator"></div>
        {/if}
        <Link class="header-modal-item" to="/dashboard/events">
            <div class="font-size-100 font-weight-500 color-black">
                { getLocalizedTextBySlug( 'header-events-label', $languageTagStore ) }
            </div>
        </Link>
        <div class="separator"></div>
        <Link class="header-modal-item" to="/dashboard">
            <div class="font-size-100 font-weight-500 color-black">
                { getLocalizedTextBySlug( 'header-banking-information-account-modal-account-label', $languageTagStore ) }
            </div>
        </Link>
        <div class="separator"></div>
        <Link class="header-modal-item" to="/dashboard/help">
            <div class="font-size-100 font-weight-500 color-black">
                { getLocalizedTextBySlug( 'header-help-label', $languageTagStore ) }
            </div>
        </Link>
    </div>
    <div class="header-modal-itens">
        <form
            class="header-modal-item"
            on:submit|preventDefault={ handleSignOut }
        >
            <div class="logout-container">
                <div class="green-logout-icon size-150"></div>
                <button class="font-size-100 font-weight-700 color-green header-button">
                    { getLocalizedTextBySlug( 'auth-log-out-button', $languageTagStore ) }
                </button>
            </div>
        </form>
    </div>
</div>

<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ModalRoot from '../modal/ModalRoot.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { link, Link, navigate } from 'svelte-routing';
    import { notificationCenterStore } from '$src/lib/store/notificationCenterStore';
    import { clickOutside, fetchData } from '$src/lib/base';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { onDestroy } from 'svelte';
    import { conversationArrayStore } from '$src/lib/store/conversationStore';
    import { currentPathname } from '$src/lib/router';

    // -- VARIABLES

    export let isHeaderModalOpen = false;

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
            isHeaderModalOpen = false;
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

    .container
    {
        height: 90vh;
        width: 100%;
        padding-top: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        background-color: grayColor950;
    }

    .mobile-header-modal-items
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem 1.5rem;
    }

    .mobile-header-modal-items:last-child
    {
        border-top: 1px solid lightGrayBorderColor;
        border-bottom: unset;
        padding: 0.5rem 1.5rem;
    }

    .mobile-header-modal::-webkit-scrollbar
    {
        display: none;
    }

    .mobile-header-modal-item
    {
        width: 100%;
        padding: 0.75rem 0;

        display: flex;
        justify-content: space-between;
    }

    .mobile-header-modal-item:first-child
    {
        border-top: unset;
    }

    .notifiation-list-item
    {
        position: relative;
    }

    .notification-badge
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
</style>

<ModalRoot bind:isOpen={ isHeaderModalOpen }>
    <div
        class="container"
        use:clickOutside
        on:clickOutside={ () => isHeaderModalOpen = false }
    >
        <div class="display-flex flex-direction-column">
            <div class="mobile-header-modal-items">
                <a
                    class="mobile-header-modal-item"
                    href="/dashboard/conversation"
                    use:link
                    on:click={ () => isHeaderModalOpen = false }
                >
                    <div class="font-size-100 font-weight-700 color-black position-relative">
                        { getLocalizedTextBySlug( 'header-messages-label', $languageTagStore ) }
                        {#if newMessageCount > 0 }
                            <div class="badge"/>
                        {/if}
                    </div>
                    <div class="gray-right-caret-icon size-150"></div>
                </a>
                <div class="separator"></div>
                {#if notificationCount > 0 }
                    <a
                        class="mobile-header-modal-item"
                        href="/dashboard/notifications"
                        use:link
                        on:click={ () => isHeaderModalOpen = false }
                    >
                        <div class="font-size-100 font-weight-700 color-black notifiation-list-item">
                            { getLocalizedTextBySlug( 'notification-settings-notifications-label', $languageTagStore ) }
                            <div class="notification-badge"/>
                        </div>
                    </a>
                    <div class="separator"></div>
                {/if}
                <a
                    class="mobile-header-modal-item"
                    href="/dashboard/favorites"
                    use:link
                    on:click={ () => isHeaderModalOpen = false }
                >
                    <div class="font-size-100 font-weight-700 color-black">
                        { getLocalizedTextBySlug( 'header-favorites-label', $languageTagStore ) }
                    </div>
                </a>
            </div>
            <div class="mobile-header-modal-items">
                {#if $profileSignedInStore.mangopayUserId }
                    <a
                        class="mobile-header-modal-item"
                        href="/dashboard/ads"
                        use:link
                        on:click={ () => isHeaderModalOpen = false }
                    >
                        <div class="font-size-100 font-weight-500 color-black">
                            { getLocalizedTextBySlug( 'header-advertise-your-space-label', $languageTagStore ) }
                        </div>
                    </a>
                    <div class="separator"></div>
                {/if}
                <a
                    class="mobile-header-modal-item"
                    href="/dashboard/events"
                    use:link
                    on:click={ () => isHeaderModalOpen = false }
                >
                    <div class="font-size-100 font-weight-500 color-black">
                        { getLocalizedTextBySlug( 'header-events-label', $languageTagStore ) }
                    </div>
                </a>
                <div class="separator"></div>
                <a
                    class="mobile-header-modal-item"
                    href="/dashboard"
                    use:link
                    on:click={ () => isHeaderModalOpen = false }
                >
                    <div class="font-size-100 font-weight-500 color-black">
                        { getLocalizedTextBySlug( 'header-banking-information-account-modal-account-label', $languageTagStore ) }
                    </div>
                </a>
                <div class="separator"></div>
                <a
                    class="mobile-header-modal-item"
                    href="/dashboard/help"
                    use:link
                    on:click={ () => isHeaderModalOpen = false }
                >
                    <div class="font-size-100 font-weight-500 color-black">
                        { getLocalizedTextBySlug( 'header-help-label', $languageTagStore ) }
                    </div>
                </a>
            </div>
        </div>
        <div class="mobile-header-modal-items">
            <div class="logout-container">
                <div class="green-logout-icon size-150"></div>
                <button
                    class="mobile-header-modal-item"
                    on:click={ handleSignOut }
                >
                    <div class="font-size-100 font-weight-700 color-green mobile-header-button">
                        { getLocalizedTextBySlug( 'auth-log-out-button', $languageTagStore ) }
                    </div>
                </button>
            </div>
        </div>
    </div>
</ModalRoot>

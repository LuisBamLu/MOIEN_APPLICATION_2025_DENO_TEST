<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedHourMinuteTextFromDate } from '$lib/base';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { webSocket } from '$store/webSocketStore';
    import { onMount } from 'svelte';

    // -- VARIABLES

    /** @type {{conversation: any, message: any}} */
    let { conversation, message } = $props();
    let isMessageUnreadByCurrentUser = message.targetUserProfileId !== $profileSignedInStore.userId;

    // -- FUNCTIONS

    function handleViewMessage(
        message
        )
    {
        if ( !message.isReaded && message.targetUserProfileId === $profileSignedInStore.userId )
        {
            message.isReaded = true;

            let messageData =
                {
                    type : 'markMessageAsRead',
                    messageId : message.id,
                    conversationId : message.conversationId,
                };

            $webSocket.send( JSON.stringify( messageData ) );
        }
    }
    // -- STATEMENTS

    run(() => {
        handleViewMessage( message );
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message
    {
        display: flex;
        gap: 1rem;
        justify-content: center;
        align-items: flex-start;
        align-self: stretch;
    }

    .conversation-message-image
    {
        overflow: clip;
        height: 4rem;
        min-width: 4rem;
        max-width: 4rem;
        border-radius: 0.75rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .conversation-message-detail
    {
        flex: 1;
    }

    .conversation-message-name
    {
        display: flex;
        justify-content: space-between;
    }

    .conversation-message-text
    {
        white-space: pre-wrap;
    }
</style>

<div class="conversation-message">
    <div class="conversation-message-image">
        {#if conversation.sourceUserProfileId === message.sourceUserProfileId }
            <img
                src={ getStorageImagePath( conversation.sourceUserProfile.imagePath, 640 ) }
                alt={ conversation.sourceUserProfile.firstName + ' ' + conversation.sourceUserProfile.lastName  }
            />
        {:else}
            <img
                src={ getStorageImagePath( conversation.targetUserProfile.imagePath, 640 ) }
                alt={ conversation.targetUserProfile.firstName + ' ' + conversation.targetUserProfile.lastName }
            />
        {/if}
    </div>

    <div class="conversation-message-detail">
        <div class="conversation-message-name">
            {#if conversation.sourceUserProfileId === message.sourceUserProfileId }
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { conversation.sourceUserProfile.firstName + ' ' + conversation.sourceUserProfile.lastName }
                </div>
            {:else}
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { conversation.targetUserProfile.firstName + ' ' + conversation.targetUserProfile.lastName }
                </div>
            {/if}
            <div class="font-size-75 font-weight-500 color-gray-300">
                { getLocalizedHourMinuteTextFromDate( message.creationTimestamp ) }
            </div>
        </div>
        <div class="font-size-90 font-weight-500 color-gray conversation-message-text">
            {@html message.text }
        </div>
        <span class="font-size-75 font-weight-500 color-gray-300">
            {#if message.isReaded && isMessageUnreadByCurrentUser }
                { getLocalizedTextBySlug( 'read-at-label', $languageTagStore ) }
                { getLocalizedHourMinuteTextFromDate( message.updateTimestamp ) }
            {:else if isMessageUnreadByCurrentUser }
                { getLocalizedTextBySlug( 'unread-label', $languageTagStore ) }
            {/if}
        </span>
    </div>
</div>

<script>
    // -- IMPORTS

    import { getLocalizedHourMinuteTextFromDate } from '$lib/base';
    import { getJsonText, getLocalizedTextBySlug, getProcessedMultilineText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { webSocketManager } from '$src/lib/web_socket_manager';
    import { handleUpdateNewMessageCount, selectedConversation } from '$store/conversationStore';
    import { onDestroy, onMount } from 'svelte';

    // -- VARIABLES

    export let message;
    let isCurrentUser = message.targetUserProfileId !== $profileSignedInStore.userId;
    let messageElement;
    let messageElementObserver;

    // -- FUNCTIONS

    function handleViewMessage(
        )
    {
        if ( message.isReaded ) return;

        let isTargetUser = message.targetUserProfileId === $profileSignedInStore.userId;

        if ( isTargetUser )
        {
            message.isReaded = true;
            let messageData =
                {
                    type : 'markMessageAsRead',
                    messageId : message.id,
                    conversationId : message.conversationId
                };

            webSocketManager.send( messageData );
        }

        handleUpdateNewMessageCount();
    }

    // ~~

    function startObserving(
        )
    {
        if ( message.isReaded ) return;

        messageElementObserver = new IntersectionObserver(
            ( [ entry ] ) =>
            {
                if ( entry.isIntersecting )
                {
                    handleViewMessage();
                    messageElementObserver.unobserve( messageElement );
                }
            },
            {
                threshold: 1.0
            }
            );

        if ( messageElement ) messageElementObserver.observe( messageElement );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            startObserving();
        }
        );

    // ~~

    onDestroy(
        () =>
        {
            if ( messageElementObserver )
            {
                messageElementObserver.disconnect();
                messageElementObserver = null;
            }
        }
        );

    // ~~

    $: handleViewMessage();
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

    .conversation-message.is-current-user,
    .conversation-message-name.is-current-user
    {
        flex-direction: row-reverse;
    }

    .conversation-message-detail
    {
        overflow: hidden;
        width: 100%;

        flex: 1;

        white-space: normal;
        overflow-wrap: break-word;
        word-wrap: break-word;
    }

    .conversation-message-detail.is-current-user
    {
        align-items: flex-end;
    }

    .conversation-message-name
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
    }

    .conversation-message-name >div
    {
        overflow: hidden;
        max-width: 30ch;

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .read-label.is-current-user,
    {
        text-align: right;
    }
</style>

<div class="conversation-message" class:is-current-user={ isCurrentUser } bind:this={ messageElement }>
        {#if $selectedConversation.sourceUserProfileId === message.sourceUserProfileId }
            <ProfileImage profile={ $selectedConversation.sourceUserProfile } size="medium" />
        {:else}
            <ProfileImage profile={ $selectedConversation.targetUserProfile } size="medium" />
        {/if}

    <div class="conversation-message-detail" class:is-current-user={ isCurrentUser }>
        <div class="conversation-message-name" class:is-current-user={ isCurrentUser }>
            {#if $selectedConversation.sourceUserProfileId === message.sourceUserProfileId }
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { $selectedConversation.sourceUserProfile.firstName + ' ' + $selectedConversation.sourceUserProfile.lastName }
                </div>
            {:else}
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { $selectedConversation.targetUserProfile.firstName + ' ' + $selectedConversation.targetUserProfile.lastName }
                </div>
            {/if}
            <div class="font-size-75 font-weight-500 color-gray-300">
                { getLocalizedHourMinuteTextFromDate( message.creationTimestamp + 'Z' ) }
            </div>
        </div>
        <div class="font-size-90 font-weight-500 color-gray conversation-message-text" class:is-current-user={ isCurrentUser }>
            {@html getProcessedMultilineText( message.text ) }
        </div>
        <p class="font-size-75 font-weight-500 color-gray-300 read-label" class:is-current-user={ isCurrentUser }>
            {#if message.isReaded && isCurrentUser }
                { getLocalizedTextBySlug( 'read-at-label', $languageTagStore ) }
                { getLocalizedHourMinuteTextFromDate( message.updateTimestamp + 'Z' ) }
            {:else if isCurrentUser }
                { getLocalizedTextBySlug( 'unread-label', $languageTagStore ) }
            {/if}
        </p>
    </div>
</div>

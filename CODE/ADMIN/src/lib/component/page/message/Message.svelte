<script>
    // -- IMPORTS

    import { getLocalizedHourMinuteTextFromDate } from '$lib/base';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { getStorageImagePath } from '$lib/storage';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{conversationItem?: any, message?: any}} */
    let { conversationItem = {}, message = {} } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

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
        {#if conversationItem.sourceUserProfileId === message.sourceUserProfileId }
            <img
                src={ getStorageImagePath( conversationItem.sourceUserProfile.imagePath, 640 ) }
                alt={ conversationItem.sourceUserProfile.firstName + ' ' + conversationItem.sourceUserProfile.lastName  }
            />
        {:else}
            <img
                src={ getStorageImagePath( conversationItem.targetUserProfile.imagePath, 640 ) }
                alt={ conversationItem.targetUserProfile.firstName + ' ' + conversationItem.targetUserProfile.lastName }
            />
        {/if}
    </div>

    <div class="conversation-message-detail">
        <div class="conversation-message-name">
            {#if conversationItem.sourceUserProfileId === message.sourceUserProfileId }
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { conversationItem.sourceUserProfile.firstName + ' ' + conversationItem.sourceUserProfile.lastName }
                </div>
            {:else}
                <div class="font-size-90 font-weight-700 color-gray-100">
                    { conversationItem.targetUserProfile.firstName + ' ' + conversationItem.targetUserProfile.lastName }
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
            {#if message.updateTimestamp }
                { getLocalizedTextBySlug( 'read-at-label', $languageTagStore ) }
                { getLocalizedHourMinuteTextFromDate( message.updateTimestamp ) }
            {:else}
                { getLocalizedTextBySlug( 'unread-label', $languageTagStore ) }
            {/if}
        </span>
    </div>
</div>

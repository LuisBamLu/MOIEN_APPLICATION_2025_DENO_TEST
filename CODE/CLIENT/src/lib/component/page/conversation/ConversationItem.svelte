<script>
    // -- IMPORTS

    import { getLocalizedText, getProcessedMultilineText } from 'senselogic-gist';
    import { getLocalizedHourMinuteTextFromDate, getLocalizedMonthYearTextFromDateText } from '$lib/base';
    import { selectedConversation } from '$store/conversationStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import ProfileImage from '../../layout/ProfileImage.svelte';

    // -- VARIABLES

    export let conversation;
    export let mainConversationContainer;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-item
    {
        width: 100%;
        border-radius: 1rem;
        padding: .5rem;

        display: flex;
        gap: 1rem;
        align-items: center;

        cursor: pointer;
        transition: background 200ms ease-in-out;
        &:hover
        {
            background: grayColor800;
        }
    }

    .conversation-item.is-unread
    {
        background: whiteColor;
    }

    .conversation-item-detail
    {
        overflow: hidden;
        padding: 0.5rem;

        display: flex;
        flex: 1 1 auto;
        flex-direction: column;
        justify-content: space-between;
    }

    .conversation-item-detail-name
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;
    }

    .conversation-item-detail-name >div
    {
        overflow: hidden;
        max-width: 10ch;

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .conversation-item-detail-message
    {
        overflow: hidden;

        align-self: stretch;

        white-space: nowrap;
        text-align: left;
        text-overflow: ellipsis;
    }

    .conversation-item-detail-message >div
    {
        overflow: hidden;
        max-width: 100%;

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;

        +media( tablet )
        {
            max-width: 15rem;
        }
    }

    .conversation-item-detail-date
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .unread[data-unread-messages]
    {
        position: relative;

        content: attr(data-unread-messages);

        color: whiteColor;
    }

    .unread:after
    {
        height: 1.125rem;
        width: 1.125rem;
        border-radius: 50%;

        display: flex;
        justify-content: center;
        align-items: center;

        content: attr(data-unread-messages);
        background: greenColor;

        font-size: 12px;
        font-weight: 700;
        color: whiteColor;
    }

    .is-unread
    {
        font-weight: 700;
    }

    .conversation-item-detail-hour.is-unread
    {
        color: greenColor;
    }

    .is-selected
    {
        background: grayColor800;
    }

    .conversation-item-detail-message-text
    {
        max-height: 1.5em;
    }
</style>

<button
    class="conversation-item"
    class:is-selected={ $selectedConversation === conversation }
    class:is-unread=
        {
            $profileSignedInStore.userId === conversation.sourceUserProfileId
                ? conversation.sourceNewMessageCount > 0
                : conversation.targetNewMessageCount > 0
        }
    on:click={ () => { selectedConversation.set( conversation ) } }
    on:click={ () => { mainConversationContainer.scrollIntoView( { behavior:'smooth', inline: 'end' } ) } }
>
        {#if conversation.targetUserProfileId === $profileSignedInStore.userId }
            <ProfileImage
                profile={ conversation.sourceUserProfile }
                size="extra-large"
            />
        {:else}
            <ProfileImage
                profile={ conversation.targetUserProfile }
                size="extra-large"
            />
        {/if}
    <div class="conversation-item-detail">
        <div class="conversation-item-detail-name">
            {#if conversation.targetUserProfileId === $profileSignedInStore.userId }
                <div class="font-size-90 color-gray-100 font-weight-700">
                    { conversation.sourceUserProfile.firstName + ' ' + conversation.sourceUserProfile.lastName }
                </div>
            {:else}
                <div class="font-size-90 color-gray-100 font-weight-700">
                    { conversation.targetUserProfile.firstName + ' ' + conversation.targetUserProfile.lastName }
                </div>
            {/if}
            <div
                class="conversation-item-detail-hour color-gray-300 font-weight-500"
                class:is-unread={ '' }
            >
                { getLocalizedHourMinuteTextFromDate( conversation.updateTimestamp + 'Z' ) }
            </div>
        </div>
        <div class="conversation-item-detail-message">
            {#if conversation.lastMessage }
                <div class="font-size-90 color-gray-100 conversation-item-detail-message-text" class:is-unread={ '' }>
                    {@html getProcessedMultilineText( conversation.lastMessage.text ) }
                </div>
            {/if}
        </div>
        <div class="conversation-item-detail-date">
            <div class="font-size-75 color-gray-300 font-weight-500">
                { getLocalizedText( conversation.type.name ) }
                &#x2022;
                { getLocalizedMonthYearTextFromDateText( conversation.lastMessage.creationTimestamp + 'Z' , $languageTagStore ) }
            </div>
            {#if conversation.targetUserProfileId === $profileSignedInStore.userId }
                {#if conversation.targetNewMessageCount && conversation.targetNewMessageCount > 0 }
                    <div class="unread" data-unread-messages={ conversation.targetNewMessageCount }/>
                {/if}
            {:else}
                {#if conversation.sourceNewMessageCount && conversation.sourceNewMessageCount > 0 }
                    <div class="unread" data-unread-messages={ conversation.sourceNewMessageCount }/>
                {/if}
            {/if}
        </div>
    </div>
</button>

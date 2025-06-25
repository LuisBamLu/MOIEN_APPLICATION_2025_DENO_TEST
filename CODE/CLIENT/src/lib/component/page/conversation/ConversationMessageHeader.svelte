<script>
    // -- IMPORTS

    import { profileSignedInStore } from '$store/profileStore';
    import ProfileImage from '../../layout/ProfileImage.svelte';

    // -- VARIABLES

    export let conversation;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message-header
    {
        height: 5rem;
        width: 100vw;
        border-bottom: 1px solid grayColor800;
        padding: 0.5rem 1.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
        align-self: stretch;

        background: grayColor900;

        +media( tablet )
        {
            width: auto;
        }
    }

    .conversation-message-header-user-info
    {
        display: flex;
        flex: 1 0 0;
        gap: 0.5rem;
        align-items: center;
    }

    .conversation-message-header-user-name
    {
        padding: 1.25rem 0;
    }

    .conversation-message-header-user-name >div
    {
        overflow: hidden;
        max-width: 80vw;

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;

        +media( tablet )
        {
            max-width: 70vw;
        }

        +media( desktop )
        {
            max-width: 50vw;
        }
    }

    .conversation-message-header-back-button
    {
        +media( tablet )
        {
            display: none;
        }
    }
</style>

<div class="conversation-message-header"  id="conversation-message-header">
    <div class="conversation-message-header-user-info">
        <button
            class="conversation-message-header-back-button size-150 green-400-crevron-left-icon"
            type="button"
            on:click=
                {
                    () =>
                    {
                        document
                            .querySelector( '#conversation-header' )
                            .scrollIntoView(
                                {
                                    behavior: 'smooth',
                                    block: 'center',
                                    inline: 'center'
                                }
                                );
                    }
                }
        />
        {#if conversation.targetUserProfileId === $profileSignedInStore.userId }
            <ProfileImage profile={ conversation.sourceUserProfile } size="small" />
        {:else}
            <ProfileImage profile={ conversation.targetUserProfile } size="small" />
        {/if}
        <div class="conversation-message-header-user-name">
            {#if conversation.targetUserProfileId === $profileSignedInStore.userId }
                <div class="font-size-100 font-weight-700 color-blue">
                    { conversation.sourceUserProfile.firstName + ' ' + conversation.sourceUserProfile.lastName }
                </div>
            {:else}
                <div class="font-size-100 font-weight-700 color-blue">
                    { conversation.targetUserProfile.firstName + ' ' + conversation.targetUserProfile.lastName }
                </div>
            {/if}
        </div>
    </div>
    <div class="green-shield-icon size-150"/>
</div>

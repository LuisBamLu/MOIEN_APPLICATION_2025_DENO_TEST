<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';
    import ConversationItem from '$component/page/conversation/ConversationItem.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { isArray, getJsonObject, getJsonText } from 'senselogic-gist';
    import { selectedConversation, conversationArrayStore, loadConversationArray } from '$store/conversationStore';

    // -- VARIABLES

    export let mainConversationContainer;
    let isLoading = true;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            isLoading = true;

            try
            {
                await loadConversationArray();
            }
            catch ( error )
            {
                console.log( error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-list
    {
        height: 100%;
    }

    .conversation-list ul
    {
        overflow-y: auto;
        max-height: calc( 100dvh - 20.25rem );

        display: flex;
        flex-direction: column;
        gap: 1rem;
        -ms-overflow-style: none;
        scrollbar-width: none;

        +media( desktop )
        {
            max-height: calc( 100dvh - 22.75rem );
        }
    }

    .conversation-list ul::-webkit-scrollbar
    {
        display: none;
    }

    .conversation-item
    {
        transform: translateX( -100% );

        flex: 1 0 96px;

        opacity: 0;

        animation: slide-to-right 350ms ease-in-out forwards;
    }

    @keyframes slide-to-right
    {
        to
        {
            transform: translateX( 0 );

            opacity: 1;
        }
    }

    .loading-container
    {
        height: calc( 100dvh - 22.25rem );
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="conversation-list">
    {#if isLoading }
        <div class="loading-container">
            <Loading/>
        </div>
    {:else}
        <ul>
            {#if isArray( $conversationArrayStore ) && $conversationArrayStore.length === 0 }
                <span class="font-size-90 text-align-center color-gray-300">
                    No conversations found
                </span>
            {/if}
            {#each $conversationArrayStore as conversation, conversationIndex ( conversation.id ) }
                {#if ( isArray( conversation.messageCountArray )
                     && conversation.messageCountArray.length > 0
                     && conversation.messageCountArray[ 0 ].count > 0 )
                     || $selectedConversation?.id === conversation.id }
                    <li class="conversation-item" style="animation-delay: { conversationIndex * 100 }ms;">
                        <ConversationItem
                            conversation={ conversation }
                            mainConversationContainer={ mainConversationContainer }
                        />
                    </li>
                {/if}
            {/each}
        </ul>
    {/if}
</div>

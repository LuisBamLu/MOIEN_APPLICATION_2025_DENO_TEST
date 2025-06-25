<script>
    // -- IMPORTS

    import { onDestroy, onMount } from 'svelte';
    import { getLocalizedTextBySlug, getJsonText } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { selectedConversation } from '$store/conversationStore';
    import ConversationHeader from '$component/page/conversation/ConversationHeader.svelte';
    import ConversationMessageHeader from '$component/page/conversation/ConversationMessageHeader.svelte';
    import ConversationAsideBar from '$component/page/conversation/ConversationAsideBar.svelte';
    import ConversationMessageContainer from '$component/page/conversation/ConversationMessageContainer.svelte';

    // -- VARIABLES

    let urlParams = new URLSearchParams( window.location.search );
    let mainConversationContainer;
    let conversationPageContainer;
    let conversationId = urlParams.get( 'conversationId' );
    let conversation;

    // -- FUNCTIONS

    async function loadConversation(
        )
    {
        try
        {
            let response
                = await fetchData(
                    `/api/conversation/get-by-id`,
                    {
                        method: 'POST',
                        body: getJsonText(
                            {
                                type: 'getConversationById',
                                conversationId: conversationId
                            }
                            ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            if ( response.conversation )
            {
                conversation = response.conversation;
            }
        }
        catch ( error )
        {
            console.error( 'Error loading conversation:', error );
        }
    }

    // ~~

    function handleScrollEnd(
        event
        )
    {
        let container = conversationPageContainer;
        let scrollWidth = container.scrollWidth;
        let scrollLeft = container.scrollLeft;
        let clientWidth = container.clientWidth;

        if ( scrollLeft < scrollWidth / 4 )
        {
            container.scrollTo( { left: 0, behavior: 'smooth' } );
        }
        else
        {
            container.scrollTo( { left: scrollWidth, behavior: 'smooth' } );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( conversationId )
            {
                await loadConversation();
                selectedConversation.set( conversation );
            }

            if ( conversationPageContainer )
            {
                conversationPageContainer.addEventListener( 'scrollend', handleScrollEnd );
            }
        }
        );

    // ~~

    onDestroy(
        () =>
        {
            selectedConversation.set( null );
            if ( conversationPageContainer )
            {
                conversationPageContainer.removeEventListener( 'scrollend', handleScrollEnd );
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- CLASSES

    .conversation-page-container
    {
        overflow-y: hidden;
        overflow-x: auto;
        height: 100%;
        width: 100%;

        display: flex;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .conversation-page-container::-webkit-scrollbar
    {
        display: none;
    }

    .conversation-page-aside
    {
        +media( desktop )
        {
            max-width: 30%;

            flex: 0 0 30%;
        }
    }

    .conversation-page-main
    {
        flex: 1;

        background: grayColor950;
    }
</style>

<svelte:head>
    <title>{ getLocalizedTextBySlug( 'messages-page-title', $languageTagStore ) }</title>
</svelte:head>

<div bind:this={ conversationPageContainer } class="conversation-page-container">
    <div class="conversation-page-aside">
        <ConversationHeader/>
        <ConversationAsideBar
            mainConversationContainer={ mainConversationContainer }
        />
    </div>
    <div bind:this={ mainConversationContainer } class="conversation-page-main">
        {#if $selectedConversation }
            <ConversationMessageHeader
                conversation={ $selectedConversation }
            />
        {/if}
        {#key $selectedConversation }
            <ConversationMessageContainer/>
        {/key}
    </div>
</div>

<script>
    // -- IMPORTS

    import ConversationFilter from '$component/page/conversation/ConversationFilter.svelte';
    import ConversationSearchInput from '$component/page/conversation/ConversationSearchInput.svelte';
    import ConversationList from '$component/page/conversation/ConversationList.svelte';

    // -- VARIABLES

    export let mainConversationContainer;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-aside-bar
    {
        height: calc( 100dvh - 9rem );
        max-width: 100vw;
        border-right: 1px solid grayColor800;

        +media( desktop )
        {
            height: calc( 100dvh - 9.5rem );
        }
    }

    .conversation-aside-bar-container
    {
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        +media( desktop )
        {
            padding: 2rem;
        }
    }
</style>

<aside class="conversation-aside-bar">
    <div class="conversation-aside-bar-container">
        <ConversationFilter/>
        <ConversationSearchInput/>
        <ConversationList mainConversationContainer={ mainConversationContainer }/>
    </div>
</aside>

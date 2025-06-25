<script>
    // -- IMPORTS

    import ConversationHeader from './ConversationHeader.svelte';
    import ConversationMessageContainer from './ConversationMessageContainer.svelte';

    // -- VARIABLES

    /** @type {{conversation: any}} */
    let { conversation } = $props();

    // -- FUNCTIONS

    // -- STATEMENTS

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .conversation-container
    {
        position: relative;

        overflow-y: scroll;
        width: 100%;
        border: 1px solid lightGrayBorderColor;
        border-radius: 0.75rem;

        display: flex;
        flex-direction: column;

        background-color: whiteColor;
    }
</style>

<div class="conversation-container">
    <ConversationHeader
        rentalMode={ conversation.rentalMode ?? conversation.type }
        targetProfile={ conversation.targetUserProfile }
        sourceProfile={ conversation.sourceUserProfile }
        property={ conversation.property }
    />
    <ConversationMessageContainer selectedConversation={ conversation } />
</div>

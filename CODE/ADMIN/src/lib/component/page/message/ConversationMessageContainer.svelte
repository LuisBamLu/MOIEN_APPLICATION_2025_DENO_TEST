<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData, getLocalizedMonthDayYearTextFromDateText } from '$lib/base';
    import ConversationActionType from './ConversationActionType.svelte';
    import ConversationMessageProperty from './ConversationMessageProperty.svelte';
    import ConversationMessage from './ConversationMessage.svelte';

    // -- VARIABLES

    /** @type {{selectedConversation: any}} */
    let { selectedConversation } = $props();
    let conversationMessageContainerSection = $state();
    let messageArray = $state([]);
    let messageMapByDate = $state();
    let messageData =
        {
            conversationId: null,
            sourceUserProfileId: null,
            targetUserProfileId: null,
            text: null,
            isReaded: null
        };

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( selectedConversation )
            {
                await loadMessageArray();

                setTimeout(
                        () =>
                        {
                            conversationMessageContainerSection.scrollTop = conversationMessageContainerSection.scrollHeight;
                        },
                        0
                        );
            }
        }
        );

    // -- FUNCTIONS

    async function loadMessageArray(
        )
    {
        try
        {
            let response = await fetchData( `/api/message/get-by-conversation-id`,
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'getMessageArrayByConversationId',
                            conversationId: selectedConversation.id
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            messageArray = response.messageArray;
            messageMapByDate = getMessagesMapByDate( messageArray );
            messageMapByDate = getSortMessagesMapByDateDescending( messageMapByDate );
        }
        catch ( error )
        {
            console.error('Error loading messages:', error);
        }
    }

    // ~~

    function getMessagesMapByDate(
        messageArray
        )
    {
        return messageArray.reduce(
            ( groupedMessageArrayByDate, message ) =>
            {
                let date = new Date( message.creationTimestamp );
                let monthDayYear = getLocalizedMonthDayYearTextFromDateText( date );

                if ( !groupedMessageArrayByDate[ monthDayYear ] )
                {
                    groupedMessageArrayByDate[ monthDayYear ] = [];
                }

                groupedMessageArrayByDate[ monthDayYear ].push( message );

                return groupedMessageArrayByDate;
            },
            {}
            );
    }

    // ~~

    function getSortMessagesMapByDateDescending(
        messageMapByDate
        )
    {
        let sortedEntries = Object.entries( messageMapByDate ).sort(
            ( a, b ) =>
            {
                let dateA = new Date( a[ 0 ] );
                let dateB = new Date( b[ 0 ] );

                return dateA.getTime() - dateB.getTime();
            }
            );

        let sortedMessageArrayByDate = sortedEntries.reduce(
            ( sortedMessageArrayByDate, [ key, value ] ) =>
            {
                sortedMessageArrayByDate[ key ] = value;

                return sortedMessageArrayByDate;
            },
            {}
            );

        return sortedMessageArrayByDate;
    }
    run(() => {
        messageArray, messageMapByDate = getMessagesMapByDate( messageArray );
    });
    run(() => {
        messageArray, messageMapByDate = getSortMessagesMapByDateDescending( messageMapByDate );
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message-container
    {
        height: 100%;

        display: flex;
        flex-direction: column;
    }

    .conversation-message-container-section
    {
        overflow-y: auto;
        max-height: calc( var( --viewport-height ) - 19rem );

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        background: grayColor950;

        +media( desktop )
        {
            max-height: calc( var( --viewport-height ) - 15.2rem );
            padding: 2rem 1rem;
        }
    }

    .conversation-message-content
    {
        width: 100%;
        max-width: 46rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            padding: 0;
        }
    }
</style>

<div class="conversation-message-container">
    <div class="conversation-message-container-section" bind:this={ conversationMessageContainerSection }>
            <div class="conversation-message-content">
                {#each Object.entries( messageMapByDate ) as [ messageCreationDate, messageArray ] }
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { messageCreationDate }
                    </div>
                    {#each messageArray as message }
                        <ConversationMessage
                            conversation={ selectedConversation }
                            message={ message }
                        />
                    {/each}
                {/each}
            </div>
    </div>
</div>

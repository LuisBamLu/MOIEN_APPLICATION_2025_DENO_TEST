<script>
    // -- IMPORTS

    import Message from './Message.svelte';
    import { fetchData, getLocalizedHourMinuteTextFromDate, getLocalizedMonthDayYearTextFromDateText } from '$lib/base';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { getStorageImagePath } from '$lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';

    // -- VARIABLES

    /** @type {{conversationItem?: any}} */
    let { conversationItem = {} } = $props();
    let messageArray = $state([]);
    let messageMapByDate = $state({});

    // ~~

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
                            conversationId: conversationItem.id
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

    // -- STATEMENT

    onMount(
        async () =>
        {
            await loadMessageArray();
        }
        );
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

    .conversation-message-container-empty
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            width: 43rem;
        }
    }

    .conversation-message-container-empty-text
    {
        padding: 1.5rem 0;

        text-align: center;
    }

    .moien-icon
    {
        height: 5rem;
        width: 5rem;

        background: url( '/image/icon/moien.svg' ) no-repeat;
        background-position: center;
        background-size: cover;
    }

    .conversation-message-content
    {
        width: 100%;
        max-width: 90%;
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
    <div class="conversation-message-container-section">
        {#if messageArray.length === 0 }
            <div class="conversation-message-container-empty">
                <div class="conversation-message-container-empty-text font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'conversation-you-have-no-messages-label', $languageTagStore ) }
                </div>
                <div class="moien-icon"></div>
            </div>
        {:else}
            <div class="conversation-message-content">
                {#each Object.entries( messageMapByDate ) as [ messageCreationDate, messageArray ] }
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { messageCreationDate }
                    </div>
                    {#each messageArray as message }
                        <Message
                            conversationItem={ conversationItem }
                            message={ message }
                        />
                    {/each}
                {/each}
            </div>
        {/if}
    </div>
</div>

<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData, getLocalizedMonthDayYearTextFromDateText } from '$lib/base';
    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { conversationArrayStore, conversationMessageContainerSectionStore, messageArrayStore, selectedConversation } from '$store/conversationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import ConversationActionType from '$component/page/conversation/ConversationActionType.svelte';
    import ConversationMessageProperty from '$component/page/conversation/ConversationMessageProperty.svelte';
    import ConversationMessage from '$component/page/conversation/ConversationMessage.svelte';
    import { webSocketManager } from '$lib/web_socket_manager';

    // -- VARIABLES

    let messageMapByDate;
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
            if ( $selectedConversation )
            {
                await loadMessageArray();

                setTimeout(
                    () =>
                    {
                        if ( $conversationMessageContainerSectionStore !== null && $conversationMessageContainerSectionStore !== undefined )
                        {
                            $conversationMessageContainerSectionStore.scrollTop = $conversationMessageContainerSectionStore.scrollHeight;
                        }
                    },
                    100
                    );
            }
        }
        );

    $: $messageArrayStore, messageMapByDate = getMessagesMapByDate();
    $: $messageArrayStore, messageMapByDate = getSortMessagesMapByDateDescending( messageMapByDate );
    $: placeholderLabel = !webSocketManager.isConnected()
        ? getLocalizedTextBySlug( 'you-are-disconnected-message-label', $languageTagStore )
        : getLocalizedTextBySlug( 'conversation-write-a-message-label', $languageTagStore );

    // -- FUNCTIONS

    function handleSubmitMessage(
        )
    {
        if ( !webSocketManager.isConnected() ) return;

        if ( typeof messageData.text === 'string'
             && messageData.text.trim() === '' ) return;

        messageData.conversationId = $selectedConversation.id;
        messageData.sourceUserProfileId = $profileSignedInStore.userId;

        if ( $selectedConversation.sourceUserProfileId === $profileSignedInStore.userId )
        {
            messageData.targetUserProfileId = $selectedConversation.targetUserProfileId;
        }
        else
        {
            messageData.targetUserProfileId = $selectedConversation.sourceUserProfileId;
        }

        const messageToSend =
            {
                type: 'addMessage',
                data: messageData
            };

        webSocketManager.send( messageToSend );
        messageData.text = '';
    }

    // ~~

    async function loadMessageArray(
        )
    {
        try
        {
            let response = await fetchData( `/api/message/get-by-conversation-id`,
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            type: 'getMessageArrayByConversationId',
                            conversationId: $selectedConversation.id
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            messageArrayStore.set( response.messageArray );
            messageMapByDate = getMessagesMapByDate();
            messageMapByDate = getSortMessagesMapByDateDescending( messageMapByDate );
        }
        catch ( error )
        {
            console.error('Error loading messages:', error);
        }
    }

    // ~~

    function getMessagesMapByDate(
        )
    {
        return $messageArrayStore.reduce(
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

    // ~~

    function handleKeyDown(
        event
        )
    {
        if ( event.key === 'Enter' && !event.shiftKey )
        {
            event.preventDefault();

            handleSubmitMessage();
        }
        else if ( event.key === 'Escape'  && !event.shiftKey )
        {
            event.preventDefault();

            selectedConversation.set( null );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message-container
    {
        height: calc( 100% - 5rem );

        display: flex;
        flex-direction: column;

        +media( desktop )
        {
            height: 100%;
        }
    }

    .conversation-message-container-section
    {
        overflow-y: auto;
        max-height: calc( var( --viewport-height ) - 14.5rem );

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

    .conversation-message-input
    {
        border-top: 1px solid grayColor800;
        padding: 1rem;

        display: flex;
        gap: 1rem;
        align-items: center;
        align-self: stretch;

        background: grayColor900;
    }

    .conversation-message-input form
    {
        position: relative;

        border-radius: 0.75rem
        border: 1px solid grayColor800;
        padding: 1rem;

        display: flex;
        flex: 1 0 0;
        gap: 0.5rem;
        align-items: center;

        background: grayColor950;
    }

    .conversation-message-input form:focus-within
    {
        border: 1px solid greenColor;
    }

    .conversation-message-input form textarea
    {
        outline: none;
        max-height: 1.5rem;

        flex: 1;

        background: grayColor950;

        color: blackColor;

        resize: none;
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

<svelte:window on:keydown={ handleKeyDown }/>

<div class="conversation-message-container">
    <div class="conversation-message-container-section" bind:this={ $conversationMessageContainerSectionStore }>
        {#if $messageArrayStore.length === 0 || !$selectedConversation }
            <div class="conversation-message-container-empty">
                <div class="conversation-message-container-empty-text font-size-75 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'conversation-you-have-no-messages-label', $languageTagStore ) }
                </div>
                <div class="moien-icon"/>
            </div>
        {:else}
            <div class="conversation-message-content">
                <ConversationMessageProperty/>
                <ConversationActionType>
                    <span slot="icon" class="circle-wavy-check-icon size-150"/>
                </ConversationActionType>
                {#if $selectedConversation !== null }
                    {#each Object.entries( messageMapByDate ) as [ messageCreationDate, messageArray ] }
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { messageCreationDate }
                        </div>
                        {#each messageArray as message }
                            <ConversationMessage
                                message={ message }
                            />
                        {/each}
                    {/each}
                {/if}
            </div>
        {/if}
    </div>
    {#if $selectedConversation }
        <div class="conversation-message-input">
            <form on:submit|preventDefault={ handleSubmitMessage }>
                <textarea
                    placeholder={ placeholderLabel }
                    name="message"
                    class="input-message"
                    disabled={ !webSocketManager.isConnected() }
                    bind:value={ messageData.text }
                    on:keydown={ handleKeyDown }
                />
                <button class="green-submit-icon size-150" disabled={ !webSocketManager.isConnected() }></button>
            </form>
        </div>
    {/if}
</div>

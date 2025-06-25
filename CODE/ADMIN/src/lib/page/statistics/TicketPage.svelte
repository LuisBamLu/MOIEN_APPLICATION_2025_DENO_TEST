<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug, logError, getJsonText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { navigate } from 'svelte5-router';
    import { ticketStatusArrayStore, ticketTypeArrayStore } from '$store/ticketStore';
    import Loading from '$component/element/Loading.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import Button from '$component/element/Button.svelte';
    import Select from '$component/element/Select.svelte';
    import Input from '$component/element/Input.svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import TicketAssigneeSelect from '$component/page/ticket/TicketAssigneeSelect.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { fetchData } from '$lib/base';

    // -- VARIABLES

    /** @type {{id: any}} */
    let { id } = $props();
    let ticket = $state(getInitialTicketState());
    let isEditTicket = id !== 'new';
    let isSubmitting = $state(false);
    let isLoading = $state(true);
    let isConfirmationModalOpen = $state(false);

    // -- FUNCTIONS
    console.log( id )
    function fetchTicket( id )
    {
        return fetchData( `/api/admin/page/ticket/${ id }`, { method: 'POST', credentials: 'include' } );
    }

    // ~~

    function getInitialTicketState()
    {
        return (
            {
                key: 'A06-FD0',
                title: '',
                text: '',
                statusId: 'pending',
                typeId: 'amenities-issue',
                reporterUserId: $profileSignedInStore.userId,
                assigneeUserId: $profileSignedInStore.userId
            }
            );
    }

    // ~~

    function createTicket( ticket )
    {
        return fetchData( '/api/admin/page/ticket/add', { method: 'POST', credentials: 'include', body: getJsonText( { ticket } ) } );
    }

    // ~~

    function editTicket( ticket )
    {
        return fetchData( `/api/admin/page/ticket/set/${ ticket.id }`, { method: 'POST', credentials: 'include', body: getJsonText( { ticket } ) } );
    }

    // ~~

    async function handleCreateTicket()
    {
        isSubmitting = true;

        try
        {
            await createTicket( ticket );
            navigate( '/admin/statistics/dashboard' );
        }
        catch ( error )
        {
            logError( error );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    function handleEditTicket()
    {
        isSubmitting = true;
        editTicket( ticket )
            .then( () => navigate( '/admin/statistics/dashboard' ) )
            .finally( () => isSubmitting = false );
    }

    // ~~

    function toggleConfirmModal(
        event
        )
    {
        event.stopPropagation();
        event.preventDefault();
        isConfirmationModalOpen = !isConfirmationModalOpen;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let [ ticketStatusResponse, ticketTypeResponse ] = await Promise.all(
                    [
                        fetchData( '/admin/api/ticket-status', { method: 'POST', credential: 'include' } ),
                        fetchData( '/admin/api/ticket-type', { method: 'POST', credential: 'include' } ),
                    ]
                    );
                ticketStatusArrayStore.set( ticketStatusResponse.ticketStatusArray );
                ticketTypeArrayStore.set( ticketTypeResponse.ticketTypeArray );

                if ( id !== 'new' )
                {
                    let response = await fetchTicket( id );

                    if ( response.ticket === null || response.ticket === undefined )
                    {
                        ticket = getInitialTicketState();
                    }
                    else
                    {
                        ticket = response.ticket;
                    }
                }
            }
            catch ( error )
            {
                logError( error );
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

    @import '../../../constant.styl';

    // -- ELEMENTS

    header
    {
        border-bottom: 1px solid grayColor700;
        padding-bottom: 2vw;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h1
    {
        padding: 2vw 0;

        font-size: 4vw;
        font-weight: 700;
        text-align: center;
        color: blueColor100;
    }

    span
    {
        font-size: calc( 4vw / 3 );
        font-weight: 700;
        color: grayColor100;
    }

    // -- CLASSES

    .page-section
    {
        min-height: 100vh;
        padding-top: 7vh;

        display: grid;
        grid-template-columns: min-content 1fr;

        background: pageBackgroundColor;
    }

    .header-back
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        font-size: 2vh
        color: blueColor100;
        font-weight: 600;
    }

    .back-button
    {
        border: none;

        background: none;

        cursor: pointer;
    }

    .form
    {
        overflow-y: scroll;
        scrollbar-width: none;
        margin: 0 auto;
        height: calc(100vh - 12vh - 5.5vw);
        max-width: 70%;
        padding-bottom: 3vw;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        &::-webkit-scrollbar
        {
            display: none;
        }
    }

    .form-image-section
    {
        padding-bottom: 1.5vw;

        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .block-title
    {
        border-top: 1px solid grayColor700;
    }

    .page-main
    {
        margin: 3vw 3vw 0;
        width: calc(100% - 6vw);
    }

    .question-mark-icon
    {
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.04);
    }

    .block-button
    {
        border: 2px solid blueColor900;
        border-radius: 0.5rem;
        padding: 2vw 0;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: blueColor950;

        font-size: calc(4vw / 3);
        font-weight: 500;
        color: blueColor500;

        cursor: pointer;
    }
</style>

<ConfirmModal
    isOpen={ isConfirmationModalOpen }
    onConfirm={ () => navigate( '/admin/' ) }
    onCancel={ () => toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>
<div class="page-section">
    <Sidebar/>
    {#if isLoading }
        <Loading/>
    {:else}
        <main class="page-main">
            <form onsubmit={preventDefault(isEditTicket ? handleEditTicket : handleCreateTicket)}>
                <header>
                    <div class="header-back">
                        <button
                            class="back-button"
                            onclick={toggleConfirmModal}
                        >
                            <div class="back-icon size-150"></div>
                        </button>
                        { getLocalizedTextBySlug( 'back-label', $languageTagStore ) }
                    </div>
                    <Button loading={ isSubmitting } type="submit">
                        {
                            isEditTicket
                                ? getLocalizedTextBySlug( 'save-label', $languageTagStore )
                                : getLocalizedTextBySlug( 'create-label', $languageTagStore )
                        }
                    </Button>
                </header>
                <div class="form">
                    <h1>Ticket</h1>
                    <span>
                        { getLocalizedTextBySlug( 'schema-status-id-field-label', $languageTagStore ) }
                    </span>
                    <Select
                        id="statusId"
                        name="statusId"
                        bind:value={ ticket[ 'statusId' ] }
                        fullWidth
                        required
                    >
                        {#each $ticketStatusArrayStore as ticketStatus }
                            <option
                                value={ ticketStatus.id }
                            >
                                { getLocalizedText( ticketStatus.name, $languageTagStore ) }
                            </option>
                        {/each}
                    </Select>
                    <span>
                        { getLocalizedTextBySlug( 'schema-type-id-field-label', $languageTagStore ) }
                    </span>
                    <Select
                        id="typeId"
                        name="typeId"
                        bind:value={ ticket[ 'typeId' ] }
                        fullWidth
                        required
                    >
                        {#each $ticketTypeArrayStore as ticketType }
                            <option
                                value={ ticketType.id }
                            >
                                { getLocalizedText( ticketType.name, $languageTagStore ) }
                            </option>
                        {/each}
                    </Select>
                    <span>
                        { getLocalizedTextBySlug( 'title-label', $languageTagStore ) }
                    </span>
                    <Input
                        id="title"
                        name="title"
                        bind:value={ ticket[ 'title' ] }
                        required
                        fullWidth
                    />
                    <span>
                        { getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) }
                    </span>
                    <Input
                        id="text"
                        name="text"
                        bind:value={ ticket[ 'text' ] }
                        fullWidth
                        required
                        multiline
                        rows={ 6 }
                    />
                    <span>
                        { getLocalizedTextBySlug( 'assignee-label', $languageTagStore ) }
                    </span>
                    <TicketAssigneeSelect
                        bind:assigneeUserId={ ticket.assigneeUserId }
                    />
                </div>
            </form>
        </main>
    {/if}
</div>

<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getRandomInteger } from 'senselogic-gist';
    import { onMount } from 'svelte';
    import IconButton from '$component/element/IconButton.svelte';
    import { getStorageImagePath } from '$lib/storage';

    // -- VARIABLES

    /** @type {{assigneeUserId?: any}} */
    let { assigneeUserId = $bindable(null) } = $props();
    let assigneeModalOpen = $state(false);
    let assigneeArray = $state([]);
    let assignee = $derived(assigneeArray.find( _assignee => _assignee.userId === assigneeUserId ));

    // -- FUNCTIONS

    function handleAssigneeModal(
        event
        )
    {
        if ( event.type === 'click' || event.key === 'Enter' )
        {
            event.preventDefault();
            assigneeModalOpen = !assigneeModalOpen;
        }
    }

    // ~~

    async function getAssignee()
    {
        let response = await fetchData(
            '/api/admin/assignees',
            {
                method: 'POST',
                credentials: 'include',
            }
            );

        let newAssigneeArray = [];

        for ( let assignee of response.assigneeArray )
        {
            assignee.name = [ assignee.firstName, assignee.lastName ].join( ' ' );
            assignee.role = assignee.roleSlugArray.join( ', ' );

            newAssigneeArray.push( assignee );
        }

        assigneeArray = newAssigneeArray;
    }

    // ~~

    function handleAssigneeSelect( selectedAssignee )
    {
        assigneeModalOpen = false;
        assigneeUserId = selectedAssignee.userId;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await getAssignee();
        }
        );
</script>

<style lang="stylus">
    // -- ELEMENTS

    dialog
    {
        display: none;
    }

    dialog.is-open
    {
        z-index: 1;
        position: absolute;
        top: 0;
        left: 0;

        height: 100vh;
        max-height: 100vh;
        width: 100vw;
        max-width: 100vw;

        display: flex;

        background-color: rgba(0, 0, 0, 0.5);
    }

    h2
    {
        font-size: 1.5rem;
        font-weight: 500;
    }

    // -- CLASSES

    .ticket-assignee-select
    {
        border: 2px solid rgba(0, 0, 0, 0.1);
        border-radius: 1em;
        padding: 0.5rem 1rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        background-color: white;

        font-size: 0.875rem;
        font-weight: 600;
        color: #333;

        cursor: pointer;
        transition: background-color 0.3s;
        &:hover
        {
            background-color: #e0e0e0;
        }

        img
        {
            height: 2rem;
            width: 2rem;
            border-radius: 50%;
        }
    }

    .modal
    {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        height: 22.5rem;
        width: 80%;
        max-width: 40rem;
        border-radius: 0.5rem;
        padding: 1rem;

        display: grid;
        grid-template-rows: min-content 1fr min-content;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .modal-header
    {
        padding-bottom: 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
        button
        {
            border: none;

            background-color: transparent;

            font-size: 1.5rem;
            color: #333;

            cursor: pointer;
            transition: color 0.3s;
            &:hover
            {
                color: #f00;
            }
        }
    }

    .modal-body
    {
        overflow-y: auto;
        max-height: 15rem;
        padding-bottom: 1rem;
        .modal-body-row
        {
            margin-bottom: 5px;
            width: 100%;
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;

            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
            &:hover
            {
                background-color: #40DCB644;
            }

            &.is-selected
            {
                background-color: #40DCB688;
                &:hover
                {
                    background-color: #40DCB633;
                }
            }

            .modal-body-row-label
            {
                overflow: hidden;
                width: 30%;
                padding-right: 1vw;

                font-size: 1rem;
                font-weight: 600;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .modal-body-row-value
            {
                overflow: hidden;
                width: 30%;
                padding-right: 1vw;

                font-size: 1rem;
                font-weight: 400;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .modal-body-row-photo
            {
                width: 10%;

                display: flex;
                justify-content: flex-end;
                img
                {
                    height: 2rem;
                    width: 2rem;
                    border-radius: 50%;
                }
            }
        }
    }

    .modal-footer
    {
        display: flex;
        justify-content: flex-end
        align-items: center;
        button
        {
            border-radius: 0.5rem;
            padding: 0.5rem 1rem;

            background-color: #f0f0f0;

            font-size: 1rem;
            color: #333;

            cursor: pointer;
        }
    }
</style>

<dialog class:is-open={ assigneeModalOpen }>
    <div class="modal">
        <div class="modal-header">
            <h2>Assignee</h2>
            <IconButton on:click={ handleAssigneeModal }>
                <span class="gray-close-icon size-90"></span>
            </IconButton>
        </div>
        <div class="modal-body">
            {#each assigneeArray as assigneeOption }
                <div
                    class="modal-body-row"
                    class:is-selected={ assigneeUserId === assigneeOption.userId }
                    role="button"
                    tabindex="0"
                    onkeydown={() => handleAssigneeSelect( assigneeOption )}
                    onclick={() => handleAssigneeSelect( assigneeOption )}
                >
                    <div class="modal-body-row-label">
                        { assigneeOption.name }
                    </div>
                    <div class="modal-body-row-value">
                        { assigneeOption.role }
                    </div>
                    <div class="modal-body-row-value">
                        { assigneeOption.email }
                    </div>
                    <div class="modal-body-row-photo">
                        <img src={ getStorageImagePath( assigneeOption?.imagePath || '/image/profile/default.png', 640 ) } alt="">
                    </div>
                </div>
            {/each}
        </div>
        <div class="modal-footer">
            <button onclick={( event ) => handleAssigneeModal( event )}>Close</button>
        </div>
    </div>
</dialog>
<div
    class="ticket-assignee-select"
    role="button"
    tabindex="0"
    onkeydown={( event ) => handleAssigneeModal( event )}
    onclick={( event ) => handleAssigneeModal( event )}
>
    {#if assigneeUserId !== null && assignee !== undefined }
        { `${ assignee?.name }` }
        <img src={ getStorageImagePath( assignee?.imagePath || '/image/profile/default.png', 640 ) } alt="">
    {:else}
        No assignee selected yet. Click here to select.
    {/if}
</div>

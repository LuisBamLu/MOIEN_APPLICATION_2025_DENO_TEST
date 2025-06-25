<script>
    // -- IMPORTS

    import { fetchData, isObjectEmpty } from '$lib/base';
    import { getStorageImagePath } from '$lib/storage';
    import { createEventDispatcher, onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import IconButton from './IconButton.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{property?: any, propertyArray?: any, propertyId?: any}} */
    let { property = $bindable({}), propertyArray = [], propertyId = $bindable(null) } = $props();
    let isModalOpen = $state(false);
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleToggleModal( event )
    {
        if ( event.type === 'click' || event.key === 'Enter' )
        {
            event.preventDefault();
            isModalOpen = !isModalOpen;
        }
    }

    // ~~

    function handlePropertySelect( selectedProfile )
    {
        dispatch( 'change' );
        property = selectedProfile;
        propertyId = selectedProfile.id;
        isModalOpen = false;
    }
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

        animation: fade-in 300ms ease-in-out;
    }

    h2
    {
        font-size: 1.5rem;
        font-weight: 500;
    }

    // -- CLASSES

    .ticket-property-select
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
        transform: translate( -50%, -50% );

        height: 22.5rem;
        width: 80%;
        max-width: 40rem;
        border-radius: 1.5rem;
        padding: 1rem;

        display: grid;
        grid-template-rows: min-content 1fr min-content;
        gap: 0.5rem;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
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

            cursor: pointer;
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

    @keyframes fade-in
    {
        from
        {
            opacity: 0;
        }

        to
        {
            opacity: 1;
        }
    }
</style>

<dialog class:is-open={ isModalOpen }>
    <div class="modal">
        <div class="modal-header">
            <h2>Properties</h2>
            <IconButton type="button" on:click={ handleToggleModal }>
                <span class="gray-close-icon size-90"></span>
            </IconButton>
        </div>
        <div class="modal-body">
            {#each propertyArray as currentProperty }
                <div
                    class="modal-body-row"
                    class:is-selected={ property?.id === currentProperty.id }
                    role="button"
                    tabindex="0"
                    onkeydown={() => handlePropertySelect( currentProperty )}
                    onclick={() => handlePropertySelect( currentProperty )}
                >
                    <div class="modal-body-row-label">
                        { getLocalizedText( currentProperty.title, $languageTagStore ) }
                    </div>
                    <div class="modal-body-row-value">
                        { [ currentProperty.streetName, currentProperty.buildingNumber ].join( ' - ' ) }
                    </div>
                    <div class="modal-body-row-value">
                        { [ currentProperty.cityName, currentProperty.countryCode ].join( ' ' ) }
                    </div>
                    <div class="modal-body-row-photo">
                        <img src={ getStorageImagePath( currentProperty.imagePath, 640 ) } alt={ currentProperty.title }>
                    </div>
                </div>
            {/each}
        </div>
        <div class="modal-footer">
            <button type="button" onclick={handlePropertySelect}>Close</button>
        </div>
    </div>
</dialog>
<div
    class="ticket-property-select"
    role="button"
    tabindex="0"
    onkeydown={handleToggleModal}
    onclick={handleToggleModal}
>
    {#if propertyId === null }
        Select a property
    {:else}
        { [ getLocalizedText( property?.title || '', $languageTagStore ), property?.cityName, property?.countryCode ].join( ' ' ) }
    {/if}
    <img src={ getStorageImagePath( property?.imagePath || '/image/property/default.png', 640 ) } alt={ getLocalizedText( property?.title || '', $languageTagStore ) }>
</div>

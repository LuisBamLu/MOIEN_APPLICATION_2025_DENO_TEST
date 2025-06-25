<script>
    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import { fly } from 'svelte/transition';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    /** @type {{filterParameterByKeyMap: any, value: any, column: any}} */
    let { filterParameterByKeyMap, value = $bindable(), column = $bindable() } = $props();
    let columnArray = [];
    let isLoading = $state(true);
    let actualValue = $state('');
    let actualColumn = $state('');

    // -- CONSTANTS

    const dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function closePopup(
        event
        )
    {
        event.preventDefault();
        dispatch( 'outsideClick' );
    }

    // ~~

    function handleColumnChange(
        newColumn
        )
    {
        actualColumn = newColumn;
    }

    // ~~

    function applySearch(
        )
    {
        if ( !actualValue )
        {
            alert( getLocalizedTextBySlug( 'search-please-enter-value', $languageTagStore ) );
            return;
        }

        column = filterParameterByKeyMap[ actualColumn ].name;
        value = actualValue;

        dispatch( 'submit' )
        dispatch( 'outsideClick' )
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            for ( let parameter in filterParameterByKeyMap )
            {
                if ( filterParameterByKeyMap[ parameter ].type === 'text' )
                {
                    columnArray.push( parameter );
                }
            }

            actualValue = $urlParamsStore.get( 'searchTerm' ) || '';
            actualColumn = $urlParamsStore.get( 'searchColumn' ) || columnArray[ 0 ];

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    dialog
    {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .search-modal
    {
        width: 100%;
        max-width: 30rem;
        border-radius: 0.5rem;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .search-modal-content
    {
        padding: 1rem;
    }

    .search-modal-header
    {
        border-bottom: 1px solid grayColor500;
        padding: 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-modal-header-title
    {
        font-size: 1.5rem;
        font-weight: 500;
    }

    .search-modal-header-close
    {
        .search-modal-header-close-button
        {
            border: none;

            background-color: transparent;

            cursor: pointer;
        }
    }

    .search-modal-body
    {
        padding: 1rem;
    }

    .search-modal-body-column
    {
        margin-bottom: 1rem;
    }

    .search-modal-body-column-title
    {
        margin-bottom: 0.5rem;

        font-size: 1.25rem;
        font-weight: 500;
    }

    .search-modal-body-column-input
    {
        margin-bottom: 0.5rem;
        width: 100%;
        border: 1px solid grayColor500;
        border-radius: 5px;
        padding: 0.5rem;
    }

    .search-modal-body-column-select
    {
        margin-top: 1rem;
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        color: blueColor300;
        select
        {
            min-width: 10rem;
            border: 1px solid blueColor300;
            border-radius: 5px;
            padding: 0.5rem;

            background-color: blueColor950;
        }
    }

    .search-modal-footer
    {
        padding: 2rem 0 0;

        display: flex;
        justify-content: space-between;
    }

    .search-modal-footer-button
    {
        margin-left: 0.5rem;
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;

        background-color: greenColor500;

        color: whiteColor;

        cursor: pointer;
    }

    .search-modal-footer-cancel-button
    {
        border: none;
        border-radius: 5px;
        padding: 0.5rem 1rem;

        background-color: redColor300;

        color: whiteColor;

        cursor: pointer;
    }

    .search-modal-loading
    {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .loading
    {
        height: 3rem;
        width: 3rem;
        border: 0.5rem solid grayColor500;
        border-top-color: greenColor500;
        border-radius: 50%;

        animation: spin 1s linear infinite;
    }

    @keyframes spin
    {
        to
        {
            transform: rotate( 360deg );
        }
    }
</style>

<dialog>
    <div class="search-modal" transition:fly use:clickOutside onclickOutside={closePopup}>
        {#if isLoading }
                <div class="search-modal-content">
                    <div class="search-modal-loading">
                        <div class="loading"></div>
                    </div>
                </div>
        {:else}
            <div class="search-modal-header">
                <div class="search-modal-header-title">
                    { getLocalizedTextBySlug( 'search-your-search-label', $languageTagStore ) }
                </div>
                <div class="search-modal-header-close">
                    <button
                        class="search-modal-header-close-button"
                        onclick={closePopup}
                    >
                        <div class="green-close-icon size-150"></div>
                    </button>
                </div>
            </div>
            <div class="search-modal-body">
                <div class="search-modal-body-column">
                    <div class="search-modal-body-column-title">
                        { getLocalizedTextBySlug( 'search-your-search-label', $languageTagStore ) }
                    </div>
                    <form>
                        <div hidden>
                            {#each Object.keys( filterParameterByKeyMap ) as parameter }
                                <input
                                    type="hidden"
                                    name={ parameter }
                                    value={ filterParameterByKeyMap[ parameter ].value }
                                />
                            {/each}
                        </div>
                        <input
                            type="search"
                            name="searchTerm"
                            class="search-modal-body-column-input"
                            bind:value={ actualValue }
                        />
                        <div class="search-modal-body-column-select">
                            <div class="font-size-100 font-weight-700 color-gray-100">
                                { getLocalizedTextBySlug( 'select-search-by-label', $languageTagStore ) }
                            </div>
                            <select
                                name="searchColumn"
                                onchange={( event ) => handleColumnChange( event.target.value )}
                            >
                                {#each columnArray as columnItem }
                                    <option
                                        value={ columnItem }
                                        class:is-selected={ columnItem === column }
                                        selected={ columnItem === actualColumn }
                                    >
                                        { filterParameterByKeyMap[ columnItem ].name }
                                    </option>
                                {/each}
                            </select>
                        </div>
                        <div class="search-modal-footer">
                            <button
                                class="search-modal-footer-cancel-button"
                                onclick={( event ) => closePopup( event )}
                            >
                                { getLocalizedTextBySlug( 'search-cancel-button', $languageTagStore ) }
                            </button>
                            <button
                                class="search-modal-footer-button"
                                onclick={applySearch}
                            >
                                { getLocalizedTextBySlug( 'search-apply-button', $languageTagStore ) }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        {/if}
    </div>
</dialog>

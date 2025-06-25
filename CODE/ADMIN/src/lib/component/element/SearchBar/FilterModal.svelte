<script>
    // -- IMPORTS

    import { createEventDispatcher, onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Input from '../Input.svelte';
    import ValuePicker from 'senselogic-flow/ValuePicker.svelte';
    import Select from '../Select.svelte';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    /** @type {{filterParameterByKeyMap: any}} */
    let { filterParameterByKeyMap = $bindable() } = $props();
    let newfilterParameterByKeyMap = $state({});
    let isLoading = $state(true);
    let isMobileScreen = $state(false);

    // -- CONSTANTS

    const dispatch = createEventDispatcher();
    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 48em)' );

    // -- FUNCTIONS

    function closePopup(
        )
    {
        dispatch( 'outsideClick' );
    }

    // ~~

    function handlefilterParameterByKeyMapChange(
        )
    {
        filterParameterByKeyMap = newfilterParameterByKeyMap;

        dispatch( 'submit' )
        closePopup();
    }

    // ~~

    function handlefilterParameterByKeyMapReset(
        )
    {
        newfilterParameterByKeyMap = {};

        closePopup();
    }

    // ~~

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            handleResizeEvent();

            if ( filterParameterByKeyMap )
            {
                for ( let parameter in filterParameterByKeyMap )
                {
                    newfilterParameterByKeyMap[ parameter ] = filterParameterByKeyMap[ parameter ];
                }
            }

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
        max-height: 70%;
        width: 90%;
        max-width: 50rem;
        border-radius: 0.5rem;
        padding: 1rem 0.2rem;

        display: flex;
        flex-direction: column;

        background-color: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .search-modal-content
    {
        overflow: hidden;
        padding: 0 1rem;

        display: grid;
        grid-template-rows: min-content 1fr min-content;
    }

    .search-modal-header
    {
        border-bottom: 2px solid greenColor300;
        padding-bottom: 1rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .search-modal-title
    {
        font-size: 2rem;
        font-weight: 900;
        color: greenColor300;
    }

    .search-modal-close
    {
        border: none;

        background-color: transparent;

        cursor: pointer;
    }

    .search-modal-body
    {
        overflow-y: auto;
        margin-top: 1rem;
        height: 100%;

        scroll-snap-type: y proximity;
    }

    .search-modal-filter
    {
        margin-top: 1rem;
        border-bottom: 1px solid rgba( 0, 0, 0, 0.23 );
        padding-bottom: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        +media( tablet )
        {
            flex-direction: row;
            align-items: center;
        }
    }

    .search-modal-filter-title
    {
        font-size: 1.3rem;
        font-weight: 700;
        color: blueColor300;
    }

    .search-modal-filter-text-value
    {
        margin-top: 0.5rem;
    }

    .search-modal-filter-range-value
    {
        margin-top: 0.5rem;
    }

    .search-modal-filter-range-value-range
    {
        margin-top: 0.5rem;
    }

    .search-modal-filter-range-value-number
    {
        margin-top: 0.5rem;

        display: flex;
        justify-content: space-between;
    }

    .search-modal-filter-number-value
    {
        margin-top: 0.5rem;
    }

    .search-modal-filter-select-value
    {
        margin-top: 0.5rem;
        width: auto;
    }

    .search-modal-filter-amount-value
    {
        margin-top: 0.5rem;

        display: flex;
        justify-content: space-between;
    }

    .search-modal-filter-button
    {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: greenColor900;

        cursor: pointer;
        &.is-selected
        {
            background-color: greenColor500;

            color: whiteColor;
        }
    }

    .search-modal-filter-boolean-value
    {
        margin-top: 0.5rem;

        display: flex;
        justify-content: space-between;
    }

    .search-modal-filter-boolean-value button
    {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: grayColor500;

        cursor: pointer;
        &.is-selected
        {
            background-color: greenColor500;

            color: whiteColor;
        }
    }

    .search-modal-no-filter
    {
        font-size: 1rem;
        font-weight: 500;
        color: grayColor700;
    }

    .search-modal-footer
    {
        margin-top: 2rem;

        display: flex;
        justify-content: space-between;
    }

    .search-modal-button
    {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: greenColor600;

        font-weight: 700;
        color: blueColor600;

        cursor: pointer;
    }

    .search-modal-cancel-button
    {
        border: none;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: redColor300;

        font-weight: 700;
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

<svelte:window onresize={handleResizeEvent}/>

<dialog>
    <div class="search-modal" transition:slide use:clickOutside onclickOutside={closePopup}>
        {#if isLoading }
            <div class="search-modal-content">
                <div class="search-modal-loading">
                    <div class="loading"></div>
                </div>
            </div>
        {:else}
            <form class="search-modal-content">
                <div hidden>
                    {#if $urlParamsStore.get( 'searchColumn' ) }
                        <input type="hidden" name="searchColumn" value={ $urlParamsStore.get( 'searchColumn' )} />
                    {/if}
                    {#if $urlParamsStore.get( 'searchTerm' ) }
                        <input type="hidden" name="searchTerm" value={ $urlParamsStore.get( 'searchTerm' )} />
                    {/if}
                </div>
                <div class="search-modal-header">
                    <div class="search-modal-title">
                        { getLocalizedTextBySlug( 'filter-your-searchs-label', $languageTagStore ) }
                    </div>
                    <button class="search-modal-close" onclick={closePopup}>
                        <div class="green-close-icon size-150"></div>
                    </button>
                </div>
                <div class="search-modal-body">
                    {#if Object.keys( newfilterParameterByKeyMap ).length }
                        {#each Object.keys( newfilterParameterByKeyMap ) as parameter }
                            <div class="search-modal-filter">
                                <div class="search-modal-filter-title">
                                    { getLocalizedText( newfilterParameterByKeyMap[ parameter ].name, $languageTagStore ).toUpperCase() }
                                </div>
                                {#if newfilterParameterByKeyMap[ parameter ].type === 'text' }
                                    <div class="search-modal-filter-text-value">
                                        <Input fullWidth name={ parameter } bind:value={ newfilterParameterByKeyMap[ parameter ].value }/>
                                    </div>
                                {:else if newfilterParameterByKeyMap[ parameter ].type === 'range' }
                                    <div class="search-modal-filter-range-value">
                                        <div class="search-modal-filter-range-value-range">
                                            <ValuePicker
                                                limitArray={ [ newfilterParameterByKeyMap[ parameter ].min, newfilterParameterByKeyMap[ parameter ].max ] }
                                                bind:valueArray={ newfilterParameterByKeyMap[ parameter ].values }
                                                valuePrecision={ newfilterParameterByKeyMap[ parameter ].step }
                                                hasText={ false }
                                                onChange={ () => {} }
                                            />
                                        </div>
                                        <div class="search-modal-filter-range-value-number">
                                            <Input type="number" bind:value={ newfilterParameterByKeyMap[ parameter ].value[ 0 ] }/>
                                            -
                                            <Input type="number" bind:value={ newfilterParameterByKeyMap[ parameter ].value[ 1 ] }/>
                                        </div>
                                    </div>
                                {:else if newfilterParameterByKeyMap[ parameter ].type === 'number' }
                                    <div class="search-modal-filter-number-value">
                                        <Input name={ parameter } type="number" bind:value={ newfilterParameterByKeyMap[ parameter ].value }/>
                                    </div>
                                {:else if newfilterParameterByKeyMap[ parameter ].type === 'select' }
                                    <div class="search-modal-filter-select-value">
                                        <Select
                                            fullWidth={ isMobileScreen }
                                            name={ parameter }
                                            value={ newfilterParameterByKeyMap[ parameter ].value }
                                            on:change={ (event) => newfilterParameterByKeyMap[ parameter ].value = event.target.value }
                                        >
                                            {#each newfilterParameterByKeyMap[ parameter ].optionArray as option }
                                                <option
                                                    value={ option.value }
                                                    class:is-selected={ option.value === newfilterParameterByKeyMap[ parameter ].value }
                                                    label={ getLocalizedText( option.label, $languageTagStore ) }
                                                    selected={ option.value === newfilterParameterByKeyMap[ parameter ].value }
                                                >
                                                    { getLocalizedText( option.label, $languageTagStore ) }
                                                </option>
                                            {/each}
                                        </Select>
                                    </div>
                                {:else if newfilterParameterByKeyMap[ parameter ].type === 'amount' }
                                    <div class="search-modal-filter-amount-value">
                                        {#each newfilterParameterByKeyMap[ parameter ].values as value }
                                            <button
                                                type="button"
                                                class="search-modal-filter-button"
                                                class:is-selected={ value === newfilterParameterByKeyMap[ parameter ].value }
                                                onclick={() => newfilterParameterByKeyMap[ parameter ].value = value}
                                                name={ parameter }
                                                value={ value }
                                            >
                                                { value } { getLocalizedText( newfilterParameterByKeyMap[ parameter ].sufix, $languageTagStore ) }
                                            </button>
                                        {/each}
                                    </div>
                                {:else if newfilterParameterByKeyMap[ parameter ].type === 'boolean' }
                                    <div class="search-modal-filter-boolean-value">
                                        <button
                                            type="button"
                                            class="search-modal-filter-button"
                                            class:is-selected={ newfilterParameterByKeyMap[ parameter ].value }
                                            onclick={() => newfilterParameterByKeyMap[ parameter ].value = !newfilterParameterByKeyMap[ parameter ].value}
                                            name={ parameter }
                                            value={ 'true' }
                                        >
                                            { getLocalizedText( ( newfilterParameterByKeyMap[ parameter ].trueText?.toString ?? '' ), $languageTagStore ) }
                                        </button>
                                        <button
                                            type="button"
                                            class="search-modal-filter-button"
                                            class:is-selected={ !newfilterParameterByKeyMap[ parameter ].value }
                                            onclick={() => newfilterParameterByKeyMap[ parameter ].value = !newfilterParameterByKeyMap[ parameter ].value}
                                            name={ parameter }
                                            value={ 'false' }
                                        >
                                            { getLocalizedText( ( newfilterParameterByKeyMap[ parameter ].falseText?.toString ?? '' ), $languageTagStore ) }
                                        </button>
                                    </div>
                                {/if}
                            </div>
                        {/each}
                    {:else}
                        <div class="search-modal-no-filter">
                            { getLocalizedTextBySlug( 'no-filter-label', $languageTagStore ) }
                        </div>
                    {/if}
                </div>
                <div class="search-modal-footer">
                    <button class="search-modal-cancel-button" onclick={handlefilterParameterByKeyMapReset}>
                        { getLocalizedTextBySlug( 'reset-label', $languageTagStore ) }
                    </button>
                    <button class="search-modal-button" onclick={handlefilterParameterByKeyMapChange}>
                        { getLocalizedTextBySlug( 'apply-label', $languageTagStore ) }
                    </button>
                </div>
            </form>
        {/if}
    </div>
</dialog>

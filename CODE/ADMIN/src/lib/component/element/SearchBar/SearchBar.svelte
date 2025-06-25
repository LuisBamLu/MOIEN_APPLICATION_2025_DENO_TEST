<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import SearchModal from './SearchModal.svelte';
    import FilterModal from './FilterModal.svelte';
    import { urlParamsStore } from '$store/urlParamsStore';
    import Filter from './Filter.svelte';

    // -- VARIABLES

    /** @type {{filterParameterByKeyMap?: any, filterableColumnByColumnNameMap?: any, value: any, column: any}} */
    let {
        filterParameterByKeyMap = $bindable({}),
        filterableColumnByColumnNameMap = $bindable({}),
        value = $bindable(),
        column = $bindable()
    } = $props();
    let isSearchModalOpen = $state(false);
    let isFilterModalOpen = false;

    // -- FUNCTIONS

    function capitalizeFirstLetter( string )
    {
        return string.charAt( 0 ).toUpperCase() + string.slice( 1 );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .search-bar
    {
        overflow: hidden;
        height: 100%;
        height: 2.875em;
        min-width: 20vw;
        border: 1px solid rgba(0, 0, 0, 0.23);
        border-radius: 2rem;
        padding: 0 0.5em;
        padding: 0.75vw 1.25vw;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        font-weight: 500;
    }

    .search-bar-term
    {
        width: 100%;

        display: flex;
        align-items: center;

        background-color: white;

        cursor: pointer;
    }

    .search-bar-term-searched
    {
        margin-left: 0.5vw;

        display: flex;
        flex-direction: row;

        color: grayColor500;
    }

    .search-bar-term-searched-term
    {
        color: grayColor500;

        transition: 0.3s;
    }

    .search-bar-term-searched-term.is-filled
    {
        color: grayColor100;
    }

    .icon
    {
        flex-shrink: 0;
    }
</style>

<div class="search-bar">
    {#if isSearchModalOpen }
        <SearchModal
            filterParameterByKeyMap={ filterParameterByKeyMap }
            bind:value
            bind:column
            on:outsideClick={ () => ( isSearchModalOpen = false ) }
        />
    {/if}
    <button
        class="search-bar-term"
        onclick={() => isSearchModalOpen = true}
    >
        <div class="gray-search-icon size-150 icon"></div>
        <div class="search-bar-term-searched">
            <div class="font-size-85 color-gray-900 search-bar-term-searched-term"  class:is-filled={ $urlParamsStore.get( 'searchTerm' ) }>
                {#if $urlParamsStore.get( 'searchTerm' ) }
                    { $urlParamsStore.get( 'searchTerm' ) }
                {:else}
                    { getLocalizedTextBySlug( 'filter-your-search-label', $languageTagStore ) }
                {/if}
            </div>
            {#if $urlParamsStore.get( 'searchColumn' ) }
                <div class="font-size-85 font-weight-500 search-bar-term-searched-term" style="padding-left: 0.3vw;">
                    { `${ getLocalizedTextBySlug( 'in-label') } ${ capitalizeFirstLetter( filterParameterByKeyMap[ $urlParamsStore.get( 'searchColumn' ) ].name ) }` }
                </div>
            {/if}
        </div>
    </button>

    <Filter
        bind:filterableColumnByColumnNameMap={ filterableColumnByColumnNameMap }
    />
</div>

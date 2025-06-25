<script>
    // -- IMPORTS

    import SearchBar from './SearchBar/SearchBar.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{term: any, column: any, filterParameterByKeyMap: any, filterableColumnByColumnNameMap?: any, handleClick: any, label: any}} */
    let {
        term = $bindable(),
        column = $bindable(),
        filterParameterByKeyMap = $bindable(),
        filterableColumnByColumnNameMap = $bindable({}),
        handleClick,
        label
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- STYLES

    .tool-bar
    {
        margin-bottom: 1rem;
        width: 100%;
        min-width: 20em;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        +media( smaller-48em )
        {
            flex-direction: column;
            gap: 1rem;
        }
    }

    .tool-bar-search
    {
        height: 2.875em;
        width: 30%;

        +media( smaller-48em )
        {
            width: 100%;
        }
    }

    .add-button
    {
        border-radius: 0.5rem;
        padding: 0.5rem 1.5rem;

        background-color: blueColor100;

        font-size: 1rem;
        font-weight: 700;
        color: white;

        cursor: pointer;
        transition: background-color 0.3s, color 0.3s;
    }

    .add-button:hover
    {
        background-color: blueColor900;

        color: blueColor50;
    }
</style>

<section class="tool-bar">
    <div class="tool-bar-search">
        <SearchBar
            bind:value={ term }
            bind:column={ column }
            bind:filterParameterByKeyMap={ filterParameterByKeyMap }
            bind:filterableColumnByColumnNameMap={ filterableColumnByColumnNameMap }
        />
    </div>
    <button
        class="add-button"
        onclick={handleClick}
    >
        { getLocalizedTextBySlug( label, $languageTagStore )}
    </button>
</section>

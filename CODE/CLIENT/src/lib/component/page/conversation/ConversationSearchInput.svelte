<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    let searchTerm = '';

    // -- FUNCTIONS

    function handleSearchMessage(
        )
    {
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-search-input
    {
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 1rem 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;
        align-self: stretch;

        background: grayColor950;
    }

    .conversation-search-input:focus-within
    {
        border: 2px solid greenColor;
    }

    .conversation-search-input input
    {
        outline: none;

        flex: 1;
    }

    input::-webkit-search-cancel-button
    {
        position: relative;

        background: url("/image/icon/x_circle.svg");
        background-position: center;
        background-repeat: no-repeat;
        background-size: contain;
        -webkit-appearance: none;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 50%;

        cursor: pointer;
    }
</style>

<form
    class="conversation-search-input"
    on:submit|preventDefault={ handleSearchMessage }
>
    <button
        type="submit"
        class="green-search-icon size-150"
    />
    <input
        class="font-size-90 font-weight-500 color-gray-300"
        type="search"
        name="searchTerm"
        id="searchTerm"
        placeholder={ getLocalizedTextBySlug( 'conversation-search-messages-label', $languageTagStore ) }
        bind:value={ searchTerm }
    />
</form>

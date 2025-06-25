<script>

    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { navigate } from 'svelte5-router';
    import { isObjectEmpty } from '$lib/base';
    import { useConfirmationModal } from '$lib/confirmation_modal'
    import ConfirmModal from './ConfirmModal.svelte';
    import { pageTitle } from '$store/pageTitleStore';
    import { onDestroy, onMount } from 'svelte';
    import UploadButton from './UploadButton.svelte';
    import SearchBar from './SearchBar/SearchBar.svelte';

    // -- VARIABLES

    /** @type {{title: any, onBack?: any, searchBar?: import('svelte').Snippet, button?: import('svelte').Snippet}} */
    let {
        title,
        onBack = () => { return false },
        searchBar,
        button
    } = $props();

    let isDashboard = $state(false);
    let searchTerm = '';
    let searchColumn = '';
    let
    {
        isConfirmationModalOpen,
        toggleConfirmModal
    } = useConfirmationModal();

    // -- FUNCTIONS

    function handleBackButton(
        )
    {
        if ( onBack() )
        {
            return;
        }

        if ( isObjectEmpty( history.state ) )
        {
            let url = window.location.href;

            let urlArray = url.split( '/' );
            urlArray.pop();
            url = urlArray.join( '/' );

            navigate( url );
        }
        else
        {
            history.back();
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            pageTitle.set( true );

            if ( window.location.pathname.includes( 'dashboard' ) )
            {
                isDashboard = true;
            }
        }
    );

    // ~~

    onDestroy(
        () =>
        {
            pageTitle.set( false );
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- STYLES

    // -- ELEMENTS

    span
    {
        font-size: 1.5vw;
        font-weight: 600;
        @media( max-width: 1200px )
        {
            font-size: 3vw;
        }

        @media( max-width: 750px )
        {
            font-size: 5vw;
        }
    }

    label
    {
        border: 1px solid blueColor300;
        border-radius: 12px;
        padding: 0.75vw 1.25vw;

        display: flex;
        flex-direction: row
        gap: 1vw;
        justify-content: center;
        align-items: center;

        background-color: blueColor300;

        font-weight: 700;
        color: white;

        cursor: pointer;
        &:hover
        {
            border: 1px solid blueColor500;

            background-color: blueColor500;
        }
    }

    // -- CLASSES

    .page-title
    {
        margin: 0.5rem 0;
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: 1.5rem;
        align-items: center;

        background-color: grayColor900;
    }

    .back-button
    {
        cursor: pointer;
    }

    .title-search
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        h1
        {
            font-size: 2rem;
            font-weight: 700;
            color: blueColor;

            +media( smaller-36em )
            {
                grid-column: 1 / -1;
            }
        }

        .search-bar
        {
            height: 2.875em;

            +media( smaller-48em )
            {
                min-width: unset;
            }
        }

        +media( smaller-36em )
        {
            display: grid;
            grid-template-columns: repeat( 2, 1fr );
            column-gap: 1rem;
        }
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ handleBackButton }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<section class="page-title">
    <button
        class="back-button"
        onclick={() => toggleConfirmModal()}
    >
        <div class="back-icon size-200"></div>
    </button>
    <div class="title-search">
        <h1>{ getLocalizedTextBySlug( title, $languageTagStore ) }</h1>
        {#if isDashboard }
            <UploadButton />
        {/if}
        {@render searchBar?.()}
        {@render button?.()}
    </div>
</section>

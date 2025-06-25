<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug, isObject } from 'senselogic-gist';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import PageTitle from './PageTitle.svelte';
    import ToolBar from './ToolBar.svelte';
    import AdminTable from './AdminTable/AdminTable.svelte';
    import AdminModal from './AdminModal.svelte';
    import { getFilteredArray, getFilterParameterByKeyMap, isDefinedAndNotNull, isObjectEmpty } from '$lib/base';
    import { urlParamsStore } from '$store/urlParamsStore';
    import SearchBar from './SearchBar/SearchBar.svelte';
    import Loading from './Loading.svelte';
    import Alert from './Alert.svelte';
    import Button from './Button.svelte';
    import { writable } from 'svelte/store';

    // -- VARIABLES

    let searchTerm = $state('');
    let searchColumn = $state('');
    let isEditing = $derived(isDefinedAndNotNull( $selectedObject?.id ));
    let isLoading = $state(true);
    let columnHeaderArray = [];
    /** @type {{pageTitle: any, selectedObject: any, objectArrayStore: any, isObjectModalOpen?: any, filterParameterByKeyMap: any, filterableColumnByColumnNameMap?: any, titleSlugMap: any, loadObjectArray: any, arrayProcessing: any, handleCreateObject?: any, handleEditObject?: any, handleDeleteObject?: any, finallyFunction?: any, toggleObjectModal?: any, handleNearBottom?: any, tablePage?: boolean, showButton?: boolean, search?: boolean, isCustomTable?: boolean, objectConfigMap?: any, showModalButton?: boolean, isFormModified?: boolean, useModal?: boolean, isSubmitting?: boolean, children?: import('svelte').Snippet, modal?: import('svelte').Snippet}} */
    let {
        pageTitle,
        selectedObject,
        objectArrayStore,
        isObjectModalOpen = writable( false ),
        filterParameterByKeyMap = $bindable(),
        filterableColumnByColumnNameMap = $bindable({}),
        titleSlugMap,
        loadObjectArray,
        arrayProcessing,
        handleCreateObject = ( param ) => { console.log( param ) },
        handleEditObject = ( param ) => { console.log( param ) },
        handleDeleteObject = ( param ) => { console.log( param ) },
        finallyFunction = closeModal,
        toggleObjectModal = () => {},
        handleNearBottom = () => {},
        tablePage = true,
        showButton = true,
        search = true,
        isCustomTable = false,
        objectConfigMap = $bindable({}),
        showModalButton = true,
        isFormModified = false,
        useModal = true,
        isSubmitting = false,
        children,
        modal
    } = $props();

    // -- FUNCTIONS

    export function handleEditModal(
        object
        )
    {
        $selectedObject = object;
        toggleObjectModal();
    }

    // ~~

    function closeModal(
        )
    {
        $selectedObject = {};
        toggleObjectModal();
    }

    // ~~

    function transformFilterParameterMap(
        filterParameterByKeyMap
        )
    {
        return Object.keys( filterParameterByKeyMap ).map(
            ( key ) =>
            {
                let item = filterParameterByKeyMap[ key ];

                return (
                    {
                        type: item.type,
                        label: item.name,
                        key
                    }
                    );
            }
            );
    }

    // ~~

    function updateObjectConfigMap(
        )
    {
        objectConfigMap.headerArray = transformFilterParameterMap( filterParameterByKeyMap );
        objectConfigMap.dataArray = $objectArrayStore;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( tablePage )
            {
                await loadObjectArray();
                arrayProcessing();

                if ( isCustomTable )
                {
                    isLoading = false;

                    return;
                };

                updateObjectConfigMap();

                objectArrayStore.subscribe(
                    () =>
                    {
                        updateObjectConfigMap();
                    }
                    );

                // filterParameterByKeyMap = getFilterParameterByKeyMap( filterParameterByKeyMap, $urlParamsStore );
                // $objectArrayStore = getFilteredArray( $objectArrayStore, $urlParamsStore, filterParameterByKeyMap, $languageTagStore );
            }
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- STYLES

    .page-container
    {
        overflow-y: auto;
        min-height: calc( 100dvh - 7vh );
        padding-top: 7vh;

        display: flex;

        background-color: grayColor900;
    }

    .manager-page
    {
        overflow-x: hidden;
        width: 100%;
        padding-top: 2vh;

        display: flex;
        flex-direction: column;
        gap: 2vh;
        view-transition-name: manager-page;
    }

    .main-section
    {
        width: 100%;
        padding: 0 3vh;

        display: flex;
        flex-direction: column;
        gap: 2vh;

        +media( smaller-48em )
        {
            padding: 1em 1.5vh;
        }
    }

    .divider
    {
        margin: 1.4vh 0 2vh;
        height: 1px;
        width: 100%;

        background-color: grayColor700;
    }
</style>

{#snippet searchBar()}
    {#if search }
        <SearchBar
            bind:value={ searchTerm }
            bind:column={ searchColumn }
            bind:filterParameterByKeyMap
            bind:filterableColumnByColumnNameMap
        />
    {/if}
{/snippet}
{#snippet button()}
    {#if showButton }
        <Button
            on:click={ toggleObjectModal }
        >
            { getLocalizedTextBySlug( titleSlugMap.addTitle, $languageTagStore ) }
        </Button>
    {/if}
{/snippet}

<div class="page-container">
    <Sidebar />
    <div class="manager-page">
        {#if isLoading }
            <Loading />
        {:else}
            <main class="display-flex flex-direction-column gap-100 main-section">
                <PageTitle title={ pageTitle } { searchBar } { button } />

                {#if !tablePage }
                    {@render children?.()}
                {:else}
                        {#await import( '$component/element/AdminTable/CustomAdminTable.svelte' ) }
                            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                        {:then { default : CustomAdminTable } }
                            <CustomAdminTable
                                config={ objectConfigMap }
                                handleClick={ useModal ? handleEditModal : handleEditObject }
                                on:nearBottom={ handleNearBottom }
                            />
                        {:catch _ }
                            error
                        {/await}
                    {#if modal }
                        {@render modal?.()}
                    {:else}
                        <AdminModal
                            isObjectModalOpen={ $isObjectModalOpen }
                            toggleObjectModal={ toggleObjectModal }
                            isEditing={ isEditing }
                            handleCreate={ () => handleCreateObject( finallyFunction ) }
                            handleEdit={ () => handleEditObject( finallyFunction ) }
                            handleDelete={ () => handleDeleteObject( finallyFunction ) }
                            titleSlugMap={ titleSlugMap }
                            showModalButton={ showModalButton }
                            disabled={ !isFormModified }
                            isSubmitting={ isSubmitting }
                        >
                            {@render children?.()}
                        </AdminModal>
                    {/if}
                {/if}
            </main>
        {/if}
    </div>
</div>

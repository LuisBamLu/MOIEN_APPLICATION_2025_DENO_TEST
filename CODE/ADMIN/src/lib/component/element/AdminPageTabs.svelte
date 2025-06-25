<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug, isArray } from 'senselogic-gist';
    import Sidebar from '../layout/Sidebar.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import PageTitle from './PageTitle.svelte';
    import ToolBar from './ToolBar.svelte';
    import AdminTable from './AdminTable/AdminTable.svelte';
    import AdminModal from './AdminModal.svelte';
    import { getFilteredArray, getFilterParameterByKeyMap, isDefinedAndNotNull } from '$lib/base';
    import { urlParamsStore } from '$store/urlParamsStore';
    import
    {
        isFormModified as isCategoryFormModified,
        isCategoryModalOpen,
        handleChange,
        selectedCategoryStore,
        handleCreateCategory,
        handleEditCategory,
        handleDeleteCategory,
        isSubmitting
    }
    from '$src/lib/store/categoryStore';
    import SearchBar from './SearchBar/SearchBar.svelte';
    import Tag from './Tag.svelte';
    import { get } from 'svelte/store';
    import ArticlesList from '../page/blog/ArticlesList.svelte';
    import InputLocalizedForm from './InputLocalizedForm.svelte';
    import { languageArrayStore } from '$src/lib/store/languageArrayStore';
    import Button from './Button.svelte';

    // -- VARIABLES

    /** @type {{pageTitle: any, selectedObject: any, objectArrayStore: any, isObjectModalOpen: any, filterParameterByKeyMap: any, filterableColumnByColumnNameMapArray?: any, titleSlugMap: any, loadObjectArray: any, arrayProcessingArray: any, handleCreateObjectArray?: any, handleEditObjectArray?: any, handleDeleteObjectArray?: any, toggleObjectModalArray?: any, handleNearBottomArray?: any, tablePage?: boolean, showButton?: boolean, noTable?: boolean, search?: boolean}} */
    let {
        pageTitle,
        selectedObject,
        objectArrayStore,
        isObjectModalOpen,
        filterParameterByKeyMap = $bindable(),
        filterableColumnByColumnNameMapArray = $bindable([]),
        titleSlugMap,
        loadObjectArray,
        arrayProcessingArray,
        handleCreateObjectArray = [ ( param ) => { console.log( param ) } ],
        handleEditObjectArray = [ ( param ) => { console.log( param ) } ],
        handleDeleteObjectArray = [ ( param ) => { console.log( param ) } ],
        toggleObjectModalArray = [ () => {} ],
        handleNearBottomArray = [ () => {} ],
        tablePage = true,
        showButton = $bindable(true),
        noTable = false,
        search = true
    } = $props();
    let searchTerm = $state('');
    let searchColumn = $state('');
    let isEditing = $state(true);
    let isLoading = $state(true);
    let columnHeaderArray = $state([]);
    let selectedTab = $state(new Array( filterParameterByKeyMap.length ).fill( false ));
    let selectedTabCopy = $state(new Array( filterParameterByKeyMap.length ).fill( false ));
    let hasTab = $state(null);
    let tabCount = $state(1);
    let selectedTabIndex = $state(0);

    // -- FUNCTIONS

    function pageHasTab(
        )
    {
        hasTab = true;
        const objectKeyArray =
        [
            selectedObject,
            objectArrayStore,
            isObjectModalOpen,
            filterParameterByKeyMap,
            titleSlugMap,
            loadObjectArray,
            arrayProcessingArray,
            handleCreateObjectArray,
            handleEditObjectArray,
            handleDeleteObjectArray
        ]

        for ( let key of objectKeyArray )
        {
            hasTab = isArray( key );
        }

        objectKeyArray.every( key =>
            {
                if ( tabCount === 1 )
                {
                    tabCount = key.length;
                }
                else if ( tabCount !== key.length )
                {
                    hasTab = false;
                }

                return hasTab;
            }
            );

        return hasTab;
    }

    // ~~

    function handleEditModal(
        object
        )
    {
        isEditing = true;
        $selectedCategoryStore = object;
        toggleObjectModalArray[ selectedTabIndex ]();
    }

    // ~~

    function handleUpdateCategoryLocalizedInput(
        event
        )
    {
        handleChange();
        selectedCategoryStore.update( ( category ) => ( { ...category, [ event.detail.name ]: event.detail.text } ) );
    }

    // -- STATEMENTS

    // $: isEditing = ( object !== undefined );

    // ~~

    run(() => {
        selectedTabCopy = selectedTabCopy.map(
            ( tab, index ) =>
            {
                if ( tab == true )
                {
                    selectedTab[ index ] = false;
                }

                return tab = selectedTab[ index ];
            }
            );

        selectedTabIndex = selectedTab.findIndex( tab => tab );
    });

    // ~~

    run(() => {
        if ( !$isCategoryModalOpen )
        {
            isEditing = false;
        }
    });

    run(() => {
        showButton = selectedTabIndex >= 0;
    });

    // ~~

    onMount(
        async () =>
        {
            if ( tablePage )
            {
                if ( pageHasTab() )
                {
                    columnHeaderArray = new Array( tabCount );

                    for ( let index = 0; index < tabCount; index++ )
                    {
                        let loadFunction = loadObjectArray[ index ];
                        let processingFunction = arrayProcessingArray[ index ];
                        let storeArray = objectArrayStore[ index ];
                        let filterParameterMap = filterParameterByKeyMap[ index ];
                        let tabColumnHeaderArray = columnHeaderArray[ index ];

                        await loadFunction();
                        processingFunction();

                        if ( noTable && index == 0 ) continue;

                        filterParameterMap = getFilterParameterByKeyMap( filterParameterMap, $urlParamsStore );
                        storeArray.set(
                            getFilteredArray( get( storeArray ), $urlParamsStore, filterParameterMap, $languageTagStore )
                            );

                        tabColumnHeaderArray = [];

                        for ( let key of Object.keys( get( storeArray )[ 0 ] ?? [] ) )
                        {
                            tabColumnHeaderArray.push( filterParameterMap[ key ].name )
                        }

                        columnHeaderArray[ index ] = tabColumnHeaderArray;
                    }
                }
                else
                {
                    console.error( 'Error: The page does not have tabs, or the arrays lenghts are not matching' );
                }
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

    .loading
    {
        width: 100%;
        padding: 1rem 0;

        display: flex;
        justify-content: center;

        font-size: 1.5rem;
        font-weight: 700;
        color: grayColor100;
    }

    .page-container
    {
        min-height: 100dvh;
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
    }

    .main-section
    {
        width: 100%;
        padding: 0 3vh;

        display: flex;
        flex-direction: column;
        gap: 2vh;
    }

    .divider
    {
        margin: 1.4vh 0 2vh;
        height: 1px;
        width: 100%;

        background-color: grayColor700;
    }

    .admin-page-tabs-tags
    {
        padding-left: 0.5rem;

        display: flex;
        flex-direction: row;
        gap: 5px;
    }

    .search-container
    {
        width: 100%;

        display: flex;
    }

    .admin-article-list
    {
        width: 100%;
        border-radius: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: white;
    }
</style>

<div class="page-container">
    <Sidebar/>
    <div class="manager-page">
        {#if isLoading }
            <div class="loading">
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            </div>
        {:else}
            <main class="display-flex flex-direction-column gap-100 main-section">
                <div class="admin-page-header">
                    <PageTitle title={ pageTitle }>
                        {#snippet search()}

                                {#if search && selectedTabIndex !== -1 }
                                    <SearchBar
                                        bind:value={ searchTerm }
                                        bind:column={ searchColumn }
                                        bind:filterParameterByKeyMap={ filterParameterByKeyMap[ selectedTabIndex ] }
                                        bind:filterableColumnByColumnNameMap={ filterableColumnByColumnNameMapArray[ selectedTabIndex ] }
                                    />
                                {/if}

                                            {/snippet}

                        {#snippet button()}

                                {#if showButton }
                                    <Button on:click={ toggleObjectModalArray[ selectedTabIndex ] }>
                                        { titleSlugMap[ selectedTabIndex ].addTitle }
                                    </Button>
                                {/if}

                                            {/snippet}
                    </PageTitle>
                </div>
                <div class="divider"></div>
                {#if hasTab }
                    <div class="admin-page-tabs">
                        <div class="admin-page-tabs-tags">
                            {#each new Array( tabCount ) as tab, index }
                                <Tag
                                    label={ getLocalizedTextBySlug( titleSlugMap[ index ].tabTitle, $languageTagStore ) }
                                    bind:isSelected={ selectedTab[ index ] }
                                    name="admin-page-tab"
                                />
                            {/each}
                        </div>
                        {#each new Array( tabCount ) as tab, index }
                            <div style={ `display: ${ selectedTab[ index ] ? 'flex' : 'none' }; width: 100%` }>
                                {#if noTable && index == 0 }
                                    <div class="admin-article-list">
                                        <ArticlesList
                                            isLoading={ isLoading }
                                            on:nearBottom={ handleNearBottomArray[ index ] }
                                        />
                                    </div>
                                {:else}
                                    <AdminModal
                                        isObjectModalOpen={ $isCategoryModalOpen }
                                        toggleObjectModal={ toggleObjectModalArray[ index ] }
                                        bind:isEditing
                                        handleCreate={ () => handleCreateCategory( arrayProcessingArray[ index ] ) }
                                        handleEdit={ () => handleEditCategory( arrayProcessingArray[ index ] ) }
                                        handleDelete={ () => handleDeleteCategory( arrayProcessingArray[ index ] ) }
                                        titleSlugMap={ titleSlugMap[ index ] }
                                        showModalButton={ showButton }
                                        disabled={ !$isCategoryFormModified }
                                        isSubmitting={ $isSubmitting }
                                    >
                                        <form onchange={handleChange} class="edit-modal-form">
                                            <div class="input-row">
                                                <span class="font-weight-700 line-height-150 color-gray-100">
                                                    { getLocalizedTextBySlug( 'name-label', $languageTagStore ) }
                                                </span>
                                                <InputLocalizedForm
                                                    name='name'
                                                    itemsString={ $selectedCategoryStore.name }
                                                    languageArray={ $languageArrayStore }
                                                    on:update={ handleUpdateCategoryLocalizedInput }
                                                />
                                            </div>
                                        </form>
                                    </AdminModal>
                                    <AdminTable
                                        rowArray={ get( objectArrayStore[ index ] ) }
                                        columnHeaderArray={ columnHeaderArray[ index ] }
                                        handleClick={ handleEditModal }
                                        on:nearBottom={ handleNearBottomArray[ index ] }
                                    />
                                {/if}
                            </div>
                        {/each}
                    </div>
                {:else}
                    <div class="loading">
                        { getLocalizedTextBySlug( 'Error¨fr:Erreur¨de:Fehler', $languageTagStore ) }
                    </div>
                {/if}
            </main>
        {/if}
    </div>
</div>

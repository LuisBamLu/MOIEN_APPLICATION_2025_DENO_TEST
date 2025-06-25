<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedMonthDayYearTextFromDate, getOptionArray } from '$lib/base';
    import
    {
        articleCategoryByCategoryIdMap,
        articleTypeByTypeIdMap,
        blogArrayStore,
        handleCreateBlog,
        handleDeleteBlog,
        handleEditBlog,
        hasMoreArticlePage,
        isBlogModalOpen,
        loadBlogArray,
        profileByUserIdMap,
        selectedBlogStore,
        isBlogLoading
    }
    from '$store/blogStore';
    import
    {
        categoryArrayStore,
        handleCreateCategory,
        handleDeleteCategory,
        handleEditCategory,
        isCategoryModalOpen,
        loadCategoryArray,
        selectedCategoryStore,
        toggleCategoryModal
    }
    from '$store/categoryStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getRandomUuid } from 'senselogic-gist';
    import { navigate } from 'svelte5-router';
    import AdminPageTabs from '$component/element/AdminPageTabs.svelte';
    import { articleArrayStore } from '$src/lib/store/articleArrayStore';

    // -- VARIABLES

    let filterParameterByKeyMap =
    [
        {
            title:
            {
                type: 'text',
                name: 'Title',
                value: ''
            },
            author:
            {
                type: 'text',
                name: 'Author',
                value: ''
            },
            typeName:
            {
                type: 'text',
                name: 'Type',
                value: ''
            },
            categories:
            {
                type: 'text',
                name: 'Categories',
                value: ''
            },
            number:
            {
                type: 'number',
                name: 'Number',
                value: ''
            },
            creationTimestamp:
            {
                type: 'text',
                name: 'Created at',
                value: ''
            },
            updateTimestamp:
            {
                type: 'text',
                name: 'Updated at',
                value: ''
            },
        },
        {
            id:
            {
                type: 'text',
                name: 'ID',
                value: ''
            },
            name:
            {
                type: 'text',
                name: 'Name',
                value: ''
            },
            number:
            {
                type: 'text',
                name: 'Number',
                value: ''
            },
            creationTimestamp:
            {
                type: 'text',
                name: 'Created at',
                value: ''
            },
            updateTimestamp:
            {
                type: 'text',
                name: 'Updated at',
                value: ''
            },
        }
    ];
    let filterableColumnByColumnNameMapArray =
    $state([
        {
            id: { columnLabel: 'ID', type: 'text' },
            typeId: { columnLabel: 'Type ID', type: 'select', optionArray: [] },
            slug: { columnLabel: 'Slug', type: 'text' },
            date: { columnLabel: 'Date', type: 'text' },
            number: { columnLabel: 'Number', type: 'text' },
            title: { columnLabel: 'Title', type: 'text' },
            teaser: { columnLabel: 'Teaser', type: 'text' },
            text: { columnLabel: 'Text', type: 'text' },
            userId: { columnLabel: 'User ID', type: 'text' },
            creationTimestamp: { columnLabel: 'Creation Timestamp', type: 'timestamp' },
            updateTimestamp: { columnLabel: 'Update Timestamp', type: 'timestamp' }
        },
        {
            id: { columnLabel: 'ID', type: 'text' },
            name: { columnLabel: 'Name', type: 'text' },
            creationTimestamp: { columnLabel: 'Creation Timestamp', type: 'timestamp' },
            updateTimestamp: { columnLabel: 'Update Timestamp', type: 'timestamp' }
        }
    ]);
    const titleSlugMap =
    [
        {
            tabTitle: 'article-label',
            editTitle: 'edit-article-label',
            addTitle: 'add-article-label'
        },
        {
            tabTitle: 'category-label',
            editTitle: 'edit-category-label',
            addTitle: 'add-category-label'
        }
    ];
    let selectedObjectStoreArray =
    [
        selectedBlogStore,
        selectedCategoryStore
    ];
    let objectArrayStoreArray =
    $state([
        blogArrayStore,
        categoryArrayStore
    ]);
    let isObjectModalOpenArray =
    [
        isBlogModalOpen,
        isCategoryModalOpen
    ];
    let loadObjectArray =
    [
        loadBlogArray,
        loadCategoryArray
    ];
    let handleCreateObjectArray =
    [
        handleCreateBlog,
        handleCreateCategory
    ];
    let handleEditObjectArray =
    [
        handleEditBlog,
        handleEditCategory
    ];
    let handleDeleteObjectArray =
    [
        handleDeleteBlog,
        handleDeleteCategory
    ];
    let toggleObjectModalArray =
    [
        handleAddArticleButton,
        toggleCategoryModal
    ];

    // -- FUNCTIONS

    const arrayProcessingArray =
    [
        function ()
        {
            $blogArrayStore = $blogArrayStore.map(
                ( blog ) =>
                {
                    let profile = $profileByUserIdMap[ blog.userId ];
                    let type = $articleTypeByTypeIdMap[ blog.typeId ]
                    let typeName = type ? type.name : '';
                    let localizedTypeName = getLocalizedText( typeName, $languageTagStore );
                    let categoryArray = blog.categoryIdArray.map(
                        categoryId => getLocalizedText( $articleCategoryByCategoryIdMap[ categoryId ].name || '', $languageTagStore )
                        );
                    let userFullName = profile?.firstName + ' ' + profile?.lastName

                    return (
                        {
                            ...blog,
                            profile,
                            typeName : localizedTypeName,
                            categories : categoryArray.join( ', ' ),
                            author : userFullName || 'Unknown',
                            creationTimestamp : getLocalizedMonthDayYearTextFromDate( new Date( blog.creationTimestamp ) ),
                            updateTimestamp : getLocalizedMonthDayYearTextFromDate( new Date( blog.updateTimestamp ) ),
                        }
                        );
                }
                );

            filterableColumnByColumnNameMapArray[ 0 ].typeId.optionArray = getOptionArray( Object.values( $articleTypeByTypeIdMap ) );
        },
        function ()
        {
        }
    ]

    // ~~

    function handleAddArticleButton(
        )
    {
        navigate( `/admin/settings/blog/article/new` );
    }

    // ~~

    const handleNearBottomArray =
    [
        async function (
            event
            )
        {
            let { page } = event.detail;

            if ( !$isBlogLoading && $hasMoreArticlePage )
            {
                await loadBlogArray( page );
                arrayProcessingArray[ 0 ]();
            }
        },
        async function (
            event
            )
        {
            let { page } = event.detail;

            if ( !$isBlogLoading && $hasMoreArticlePage )
            {
                await loadBlogArray( page );
                arrayProcessingArray[ 1 ]();
                // $propertyArrayStore = getFilteredArray( $propertyArrayStore, $urlParamsStore, filterParameterByKeyMap, $languageTagStore );
            }
        }
    ];

    // -- STATEMENTS

    run(() => {
        ( $categoryArrayStore || $blogArrayStore ), objectArrayStoreArray =
        [
            blogArrayStore,
            categoryArrayStore
        ];
    });
</script>

<AdminPageTabs
    pageTitle="blog-label"
    selectedObject={ selectedObjectStoreArray }
    objectArrayStore={ objectArrayStoreArray }
    isObjectModalOpen={ isObjectModalOpenArray }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    filterableColumnByColumnNameMapArray={ filterableColumnByColumnNameMapArray }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadObjectArray }
    arrayProcessingArray={ arrayProcessingArray }
    handleCreateObjectArray={ handleCreateObjectArray }
    handleEditObjectArray={ handleEditObjectArray }
    handleDeleteObjectArray={ handleDeleteObjectArray }
    toggleObjectModalArray={ toggleObjectModalArray }
    handleNearBottomArray={ handleNearBottomArray }
    noTable={ true }
/>

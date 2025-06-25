<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug, getJsonText } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { navigate } from 'svelte5-router';
    import { onMount } from 'svelte';
    import BlockList from '$component/page/article/BlockList.svelte';
    import Input from '$component/element/Input.svelte';
    import InputFile from '$component/element/InputFile.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Select from '$component/element/Select.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import Tooltip from '$component/element/Tooltip.svelte';
    import { toast } from '$lib/toast';
    import { articleTypeArrayStore } from '$store/articleTypeArrayStore';
    import { articleCategoryArrayStore } from '$store/articleCategoryArrayStore';
    import Svelecte from 'svelecte';
    import Button from '$component/element/Button.svelte';
    import Loading from '$component/element/Loading.svelte';
    import BlockItem from '$component/page/article/BlockItem.svelte';
    import { blogArrayStore } from '$store/blogStore';
    import FileInput from '$component/element/FileInput.svelte';

    // -- VARIABLES

    /** @type {{id: any}} */
    let { id = $bindable() } = $props();
    let article = $state(getInitialArticleState());
    let isEditArticle = $state(id !== 'new');
    let categoryArray = $state([]);

    let isLoading = $state(true);
    let fileArray = $state([]);

    let category = '';
    let isSubmitting = $state(false);
    let isAddBlockAccordionOpen = $state(false);
    let isUploadingImage = $state(false);

    // -- FUNCTIONS

    async function handleCreateArticle(
        )
    {
        if ( article[ 'categoryIdArray' ].length === 0 )
        {
            toast(
                {
                    variant: 'error',
                    text: 'Categories must have at least one'
                }
                );
            return;
        }

        if ( fileArray.length === 0 )
        {
            toast.error( 'Must have at least one image' );

            return;
        }

        if ( article.title === '' || article.slug === '' )
        {
            toast.error( 'Must have title and slug' );

            return;
        }

        isSubmitting = true;

        try
        {
            article.imagePath = fileArray[ 0 ];

            let response = await fetchData(
                '/api/blog/articles/add',
                {
                    method: 'POST',
                    body: getJsonText( article ),
                    credentials: 'include'
                }
                );

            isEditArticle = true;

            toast.success( 'Article created successfully' );

            navigate( '/admin/settings/blog/article/' + response.article.id );
            id = response.article.id;
        }
        catch ( error )
        {
            console.error( error );
            toast.error( 'Something went wrong' );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    async function handleEditArticle(
        )
    {
        if ( article[ 'categoryIdArray' ].length === 0 )
        {
            toast.error( 'Categories must have at least one' );

            return;
        }

        if ( fileArray.length === 0 )
        {
            toast.error( 'Must have at least one image' );

            return;
        }

        isSubmitting = true;

        try
        {
            let response = await fetchData(
                '/api/blog/articles/set-by-id/' + id,
                {
                    method: 'POST',
                    body : getJsonText( { ...article, imagePath: fileArray[ 0 ] } ),
                    credentials: 'include'
                }
                );

            toast.success( 'Article updated successfully' );
        }
        catch ( error )
        {
            console.error( error );
            toast.error( 'Something went wrong' );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    function getInitialArticleState(
        )
    {
        return (
            {
                blockIdArray: [],
                categoryIdArray: [],
                date: '',
                imagePath: '',
                number: $blogArrayStore.length,
                slug: '',
                teaser: '',
                text: '',
                title: '',
                typeId: 'post',
            }
            );
    }

    // ~~

    function handleUpdateLocalizedInput(
        event
        )
    {
        article[ event.detail.name ] = event.detail.text;
    }

    // ~~

    function getCategoryById(
        categoryId
        )
    {
        return categoryArray.find( ( category ) => category.id === categoryId );
    }

    // ~~

    function handleCheckboxChange(
        event,
        categoryId
        )
    {
        let isChecked = event.target.checked;

        if ( isChecked )
        {
            article[ 'categoryIdArray' ] = [ ...article[ 'categoryIdArray' ], categoryId ];
        }
        else
        {
            article[ 'categoryIdArray' ] = article[ 'categoryIdArray' ].filter( ( id ) => id !== categoryId );
        }

        article[ 'categoryIdArray' ] = [ ...new Set( article[ 'categoryIdArray' ] ) ];
    }

    // ~~

    async function handleCreateCategory(
        newCategory
        )
    {
        try
        {
            let response = await fetchData(
                '/api/blog/article-categories/add',
                {
                    method: 'POST',
                    credentials: 'include',
                    body: getJsonText(
                        {
                            name: newCategory.inputValue
                        }
                        )
                }
                );

            categoryArray = [ ...categoryArray,  response.category ];

            toast.success( 'Category created successfully' );

            return newCategory;
        }
        catch ( error )
        {
            toast.error( 'Something went wrong' );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let articlePromise = isEditArticle
                    ? fetchData(
                        '/api/blog/articles/get-by-id/' + id,
                        {
                            method: 'POST',
                            body:
                                getJsonText(
                                    {
                                        type: 'getArticleById'
                                    }
                                ),
                            headers:
                            {
                                'Content-Type': 'application/json'
                            }
                        }
                        )
                    : new Promise( resolve => resolve( { article: null } ) );

                let articleTypePromise = fetchData(
                    '/api/blog/article-type/get',
                    {
                        method: 'POST',
                        body: getJsonText( {} ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                let categoryPromise = fetchData(
                    '/api/blog/article-categories/get',
                    {
                        method: 'POST'
                    }
                    );

                let [ articleResponse, articleTypeResponse, categoryResponse ] = await Promise.all( [ articlePromise, articleTypePromise, categoryPromise ] );

                if ( articleResponse.article !== null )
                {
                    article = articleResponse.article;
                    fileArray = [ article.imagePath ].filter( Boolean );
                }

                $articleTypeArrayStore = articleTypeResponse.articleTypeArray;
                $articleCategoryArrayStore = categoryResponse.categoryArray;

                if ( categoryResponse.categoryArray )
                {
                    categoryArray = categoryResponse.categoryArray;
                }
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    header
    {
        border-bottom: 1px solid grayColor700;
        padding-bottom: 2vw;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    h1
    {
        padding: 2vw 0;

        font-size: 2em;
        font-weight: 700;
        text-align: center;
        color: blueColor100;
    }

    span
    {
        font-size: 1em;
        font-weight: 700;
        color: grayColor100;
    }

    // -- CLASSES

    .page-section
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: grid;
        grid-template-columns: min-content 1fr;

        background: pageBackgroundColor;

        +media( smaller-48em )
        {
            grid-template-columns: 1fr;
        }
    }

    .header-back
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        font-size: 1.25em;
        font-weight: 600;
        color: blueColor100;
    }

    .back-button
    {
        border: none;

        background: none;

        cursor: pointer;
    }

    .form
    {
        overflow-y: scroll;
        scrollbar-width: none;
        margin: 0 auto;
        height: calc(100dvh - 12vh - 5.5vw);
        max-width: 70%;
        padding-bottom: 3vw;

        display: flex;
        flex-direction: column;
        gap: 1rem;
        &::-webkit-scrollbar
        {
            display: none;
        }

        +media( smaller-48em )
        {
            max-width: 90%;
        }
    }

    .form-image-section
    {
        padding-bottom: 1.5vw;

        display: flex;
        flex-direction: row;
        gap: 1rem;
    }

    .block-title
    {
        border-top: 1px solid grayColor700;
    }

    .page-main
    {
        margin: 3vw 3vw 0;
        width: calc(100% - 6vw);
    }

    .question-mark-icon
    {
        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba(0, 0, 0, 0.04);
    }

    .block-button
    {
        border: 2px solid blueColor900;
        border-radius: 0.5rem;
        padding: 2vw 0;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: blueColor950;

        font-size: 1em;
        font-weight: 500;
        color: blueColor500;

        cursor: pointer;
    }
</style>

<div class="page-section">
    <Sidebar/>
    {#if isLoading }
        <Loading/>
    {:else}
        <main class="page-main">
            <form onsubmit={preventDefault(isEditArticle ? handleEditArticle : handleCreateArticle)}>
                <header>
                    <div class="header-back">
                        <button
                            class="back-button"
                            onclick={() => navigate( '/admin/settings/blog/' )}
                        >
                            <div class="back-icon size-150"></div>
                        </button>
                        { getLocalizedTextBySlug( 'back-label', $languageTagStore ) }
                    </div>
                    <Button loading={ isSubmitting || isUploadingImage } type="submit" disabled={ isSubmitting }>
                        { isEditArticle ? getLocalizedTextBySlug( 'save-label', $languageTagStore ) : getLocalizedTextBySlug( 'create-label', $languageTagStore ) }
                    </Button>
                </header>
                <div class="form">
                    <h1>Article</h1>
                    <span>
                        { getLocalizedTextBySlug( 'schema-type-id-field-label', $languageTagStore ) }
                    </span>
                    <Select
                        id="typeId"
                        name="typeId"
                        bind:value={ article[ 'typeId' ] }
                        fullWidth
                        required
                    >
                        {#each $articleTypeArrayStore as articleType }
                            <option value={ articleType.id } selected={ articleType.id === article[ 'typeId' ] }>{ getLocalizedText( articleType.name, $languageTagStore ) }</option>
                        {/each}
                    </Select>
                    <span>
                        { getLocalizedTextBySlug( 'schema-slug-field-label', $languageTagStore ) }
                    </span>
                    <Input
                        id="slug"
                        name="slug"
                        bind:value={ article[ 'slug' ] }
                        required
                        fullWidth
                    >
                        <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip title="The 'slug' field is used as route path in the browser." slot="end-adornment">
                            <div class="border-radius-999 question-mark-icon size-100">
                                <div class="gray-question-mark-icon size-90"></div>
                            </div>
                        </Tooltip>
                    </Input>
                    <span>
                        { getLocalizedTextBySlug( 'schema-category-id-array-field-label', $languageTagStore ) }
                    </span>
                    {#key categoryArray }
                        <Svelecte
                            required
                            name="categoryIdArray"
                            multiple
                            placeholder={ getLocalizedTextBySlug( 'schema-category-id-array-field-label', $languageTagStore ) }
                            options={
                                categoryArray.map(
                                    ( category ) =>
                                        (
                                            {
                                                ...category,
                                                name: getLocalizedText( category.name, $languageTagStore )
                                            }
                                            )
                                        )
                                    }
                            bind:value={ article[ 'categoryIdArray' ] }
                            creatable
                            createHandler={ handleCreateCategory }
                        />
                    {/key}
                    <span>
                        { getLocalizedTextBySlug( 'schema-date-field-label', $languageTagStore ) }
                    </span>
                    <Input
                        id="date"
                        name="date"
                        bind:value={ article[ 'date' ] }
                        type="date"
                        fullWidth
                        required
                    />
                    <span>
                        { getLocalizedTextBySlug( 'schema-number-field-label', $languageTagStore ) }
                    </span>
                    <Input
                        id="number"
                        name="number"
                        type="number"
                        bind:value={ article[ 'number' ] }
                        fullWidth
                        required
                    >
                        <!-- @migration-task: migrate this slot by hand, `end-adornment` is an invalid identifier -->
    <Tooltip title="The 'number' field is used to sort the articles in ascending order." slot="end-adornment" placement="left">
                            <div class="border-radius-999 question-mark-icon size-100">
                                <div class="gray-question-mark-icon size-90"></div>
                            </div>
                        </Tooltip>
                    </Input>
                    <span>
                        { getLocalizedTextBySlug( 'schema-title-field-label', $languageTagStore ) }
                    </span>
                    <InputLocalizedForm
                        name='title'
                        itemsString={ article[ 'title' ] }
                        languageArray={ $languageArrayStore }
                        on:update={ handleUpdateLocalizedInput }
                    />
                    <span>
                        { getLocalizedTextBySlug( 'schema-teaser-field-label', $languageTagStore ) }
                    </span>
                    <InputLocalizedForm
                        name='teaser'
                        itemsString={ article[ 'teaser' ] }
                        languageArray={ $languageArrayStore }
                        on:update={ handleUpdateLocalizedInput }
                    />
                    <span>
                        { getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) }
                    </span>
                    <InputLocalizedForm
                        name='text'
                        isMultiLine={ true }
                        itemsString={ article[ 'text' ] }
                        languageArray={ $languageArrayStore }
                        on:update={ handleUpdateLocalizedInput }
                    />
                    <span>
                        { getLocalizedTextBySlug( 'schema-image-field-label', $languageTagStore ) }
                    </span>
                    <div class="form-image-section">
                        <FileInput
                            fileInputName="image-path"
                            acceptedType="image/*"
                            maxFileCount={ 1 }
                            bind:fileArray={ fileArray }
                            bind:isUploadingImage={ isUploadingImage }
                            --file-input-add-new-button-width="20rem"
                        />
                        <Input
                            id="caption"
                            name="caption"
                            placeholder="Alternative text"
                            bind:value={ article[ 'caption' ] }
                            multiline
                        />
                    </div>

                    {#if isEditArticle }
                        <h1 class="block-title">Blocks</h1>
                        <button
                            type="button"
                            class="block-button"
                            onclick={() => isAddBlockAccordionOpen = true}
                        >
                            <div class="blue-plus-circle-icon size-150"></div>
                            { getLocalizedTextBySlug( 'add-block-label', $languageTagStore ) }
                        </button>
                        <BlockList
                            bind:isAddBlockAccordionOpen
                            articleId={ id }
                            bind:blockIdArray={ article[ 'blockIdArray' ] }
                        />
                    {/if}
                </div>
            </form>
        </main>
    {/if}
</div>

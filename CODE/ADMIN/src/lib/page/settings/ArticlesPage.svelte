<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { generateFilePath } from '../../filePath';
    import { languageTagStore } from '$store/languageTagStore';
    import { listModeStore } from '../../store/listModeStore';
    import { articleArrayStore } from '../../store/articleArrayStore';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import ToolContainer from '$component/element/ToolContainer.svelte';
    import CardList from '$component/element/CardList.svelte';
    import CardItem from '$component/element/CardItem.svelte';
    import Input from '$component/element/Input.svelte';
    import IconButton from '$component/element/IconButton.svelte';

    // -- VARIABLES

    let cacheArticleArray = [];
    let hasMoreArticlePage = false;
    let isLoading = $state(true);
    let searchArticleTerm = $state('');

    // -- STORES

    $listModeStore = 'rows';

    // -- FUNCTIONS

    function handleSearchByArticleTerm(
        )
    {
        $articleArrayStore = cacheArticleArray.filter(
            ( article ) => article.title.toLowerCase().includes( searchArticleTerm.toLowerCase() )
                || article.text.toLowerCase().includes( searchArticleTerm.toLowerCase() )
                || article.teaser.toLowerCase().includes( searchArticleTerm.toLowerCase() )
            );
        if ( searchArticleTerm === '' )
        {
            $articleArrayStore = cacheArticleArray;
        }
    }

    // ~~

    async function handleDeleteArticle(
        articleId
        )
    {
        isLoading = true;

        try
        {
            await fetchData(
                '/api/blog/articles/delete-by-id/' + articleId,
                {
                    method : 'POST',
                    body :
                        JSON.stringify(
                            {
                                type: 'deleteArticleById'
                            }
                        ),
                    headers:
                    {
                        'Content-Type': 'application/json'
                    }
                }
                );

                $articleArrayStore = $articleArrayStore.filter( ( article ) => article.id !== articleId );
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

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response = await fetchData(
                    '/api/blog/articles/get',
                    {
                        method : 'POST',
                        body :
                            JSON.stringify(
                                {
                                    type: 'getArticleArray'
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                $articleArrayStore = response.articleArray;
                hasMoreArticlePage = response.hasMoreArticlePage;
                cacheArticleArray = $articleArrayStore;
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

    // -- CLASSES

    .page-section
    {
        min-height: 100dvh;
        padding-top: 4.5rem;

        display: grid;
        grid-template-columns: min-content 1fr;

        background: pageBackgroundColor;
    }

    .table-list
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .form-container
    {
        width: 100%;

        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        justify-content: center;
        align-items: start;
    }

    .form-toolbar
    {
        margin-top: 1rem;

        display: flex;
        gap: 1rem;
        justify-content: end;
        align-items: center;
    }

    a
    {
        text-decoration: none;
        color: inherit;
    }

    .form-upload-container
    {
        display: flex;
        grid-template-rows: auto auto;
        grid-template-columns: auto auto auto 1fr;
        gap: 0.5rem;
        align-items: center;
    }

    .form-upload-image
    {
        margin-top: 0.5rem;
        height: 12.5rem;
        width: auto;
        max-width: 50vw;
        border-radius: 0.25rem;
    }
</style>

{#if isLoading }
    <div class="hourglass">{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}
    <div class="page-section">
        <Sidebar/>

        <main class="padding-150 table-list">
            <div class="page-tit">
                Articles
            </div>

            <ToolContainer
                bind:value={ searchArticleTerm }
                on:submit={ handleSearchByArticleTerm }
                href="/admin/articles/new"
            />

            {#key $articleArrayStore }
            <CardList>
                {#each $articleArrayStore as article, articleIndex }
                    <CardItem>
                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="type-id">
                                <input-component class="form-component component-0-scope" result-name="type-id" result-value={ article.typeId } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-type-id" name="type-id" value={ article.typeId } label={ getLocalizedTextBySlug( 'schema-type-id-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="slug">
                                <input-component class="form-component component-0-scope" result-name="slug" result-value={ article.slug } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-slug" name="slug" value={ article.slug } label={ getLocalizedTextBySlug( 'schema-slug-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="{ articleIndex }-category-id-array">
                                <input-component class="form-component component-0-scope" result-name="{ articleIndex }-category-id-array" result-value={ article.slug } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-category-id-array" name="categoryIdArray" value={ article.categoryIdArray } label={ getLocalizedTextBySlug( 'schema-category-id-array-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="date">
                                <input-component class="form-component component-0-scope" result-name="date" result-value={ article.date} is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-date" name="date" value={ article.date} label={ getLocalizedTextBySlug( 'schema-date-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="number">
                                <input-component class="form-component component-0-scope" result-name="number" result-value={ article.number } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-number" name="number" value={ article.number } label={ getLocalizedTextBySlug( 'schema-number-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="title">
                                <input-component class="form-component component-0-scope" result-name="title" result-value={ article.title } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-title" name="title" value={ article.title } label={ getLocalizedTextBySlug( 'schema-title-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="teaser">
                                <input-component class="form-component component-0-scope" result-name="teaser" result-value={ article.teaser } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-teaser" name="teaser" value={ article.teaser } label={ getLocalizedTextBySlug( 'schema-teaser-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div class="form-container" data-is-row="TEXT">
                            <div class="form-field-value" data-is-column-value="" data-column-name="text">
                                <input-component class="form-component component-0-scope" result-name="text" result-value={ article.text } is-readonly="">
                                    <div class="is-component is-container is-readonly">
                                        <Input id="{ articleIndex }-text" name="text" value={ article.text } label={ getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) } readonly fullWidth/>
                                    </div>
                                </input-component>
                            </div>
                        </div>

                        <div>
                            <div class="form-container" data-is-row="TEXT">
                                <div class="form-field-value" data-is-column-value="" data-column-name=image-path>
                                    <input-component class="form-component component-0-scope" result-name=image-path result-value={ article.imagePath } is-readonly="">
                                        <div class="is-component is-container is-readonly">
                                            <Input id="{ articleIndex }-image-path" name="image-path" value={ article.imagePath } label={ getLocalizedTextBySlug( 'schema-image-path-field-label', $languageTagStore ) } readonly disabled fullWidth/>
                                        </div>
                                    </input-component>
                                </div>
                            </div>
                            <div class="form-upload-container">
                                <img class="form-upload-image" alt="" src={ generateFilePath( article.imagePath ) } onerror={function(){ this.src='/admin/image/missing_image.avif'; }}/>
                            </div>
                        </div>

                        <div class="form-toolbar">
                            <IconButton>
                                <a href="/admin/articles/{ article.id }">
                                    <div class="blue-edit-icon size-150"></div>
                                </a>
                            </IconButton>
                            <IconButton type="button" on:click={ () => handleDeleteArticle( article.id ) }>
                                <div class="red-500-delete-icon size-150"></div>
                            </IconButton>
                        </div>
                    </CardItem>
                {/each}
            </CardList>
            {/key}

            {#if $articleArrayStore.length < 1 }
                <div class="no-data">{ getLocalizedTextBySlug( 'no-articles-found', $languageTagStore ) }</div>
            {/if}
        </main>
    </div>
{/if}

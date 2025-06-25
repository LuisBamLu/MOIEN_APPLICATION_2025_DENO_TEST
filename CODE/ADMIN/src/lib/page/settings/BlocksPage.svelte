<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import { fetchData } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { blockArrayStore } from '$store/blockArrayStore';
    import TableList from '$component/element/TableList.svelte';
    import ToolContainer from '$component/element/ToolContainer.svelte';

    // -- VARIABLES

    let hasMoreBlockPage = false;
    let isLoading = $state(true);
    let searchBlockTerm = $state('');

    // -- FUNCTIONS

    function handleSearchByBlockTerm(
        )
    {
        console.log( searchBlockTerm );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response = await fetchData(
                    '/api/blog/blocks/get',
                    {
                        method : 'POST',
                        body :
                            JSON.stringify(
                                {
                                    type: 'getBlockArray'
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                $blockArrayStore = response.blockArray;
                hasMoreBlockPage = response.hasMoreBlockPage;
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

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- ELEMENTS

    button
    {
        cursor: pointer;
    }

    a
    {
        text-decoration: none;
        color: inherit;
    }

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

    .page-title
    {
        width: 100%;

        font-size: 1.5rem;
        text-align: center;
        text-transform: uppercase;
        color: blueColor;
    }

    .card-list
    {
        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
    }

    .card
    {
        max-width: calc(var(--viewport-width) - 2rem - 0.5px);
        border: 1px solid #ccc;
        border-radius: 0.5rem;
        padding: 1rem;

        background: grayColor950;
    }

    .form-container
    {
        width: 100%;

        display: grid;
        grid-template-columns: 1fr;
        grid-gap: 1rem;
        justify-content: center;
        align-items: start;

        +media( desktop )
        {
            grid-template-columns: auto 1fr;
        }
    }

    .form-field-name
    {
        padding-top: 0.25rem;

        font-weight: 700;
    }

    .form-component .is-input,
    {
        min-height: 2rem;
        width: 100%;
        border: 0.0625rem solid #ccc;
        border-radius: 0.25rem;
        padding: 0.25rem;

        display: block;

        background-color: #fff;
    }

    .form-toolbar
    {
        margin-top: 1rem;

        display: flex;
        gap: 1rem;
        justify-content: end;
        align-items: center;
    }

    .form-button
    {
        height: 1.2rem;
        width: 1.2rem;
        border: none;

        display: inline-block;

        cursor: pointer;
    }

    .form-button + .form-button
    {
        margin-left: 0.25rem;
    }

    .form-input
    {
        min-height: 2rem;
        width: 100%;
        border: 0.0625rem solid #ccc;
        border-radius: 0.25rem;
        padding: 0.25rem;

        display: block;

        background-color: #fff;
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
            {#if isLoading }
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            {:else}
                <div class="page-title">
                    BLOCKS
                </div>

                <ToolContainer
                    bind:value={ searchBlockTerm }
                    on:submit={ handleSearchByBlockTerm }
                    href="/admin/blocks/new"
                />

                <div class="card-list">
                    {#each $blockArrayStore as block }
                        <div class="card-container">
                            <div class="card">
                                <div class="form-container" data-is-row="TEXT">
                                    <div class="form-field-name" data-is-column-title="" data-column-name="typeId">
                                        Type :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="typeId">
                                        <input-component class="form-component component-0-scope" result-name="typeId" result-value={ block.typeId } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="typeId" value={ block.typeId } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="title">
                                        Title :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="title">
                                        <input-component class="form-component component-0-scope" result-name="title" result-value={ block.title } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="title" value={ block.title } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="teaser">
                                        Teaser :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="teaser">
                                        <input-component class="form-component component-0-scope" result-name="teaser" result-value={ block.teaser } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="teaser" value={ block.teaser } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="text">
                                        Text :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="text">
                                        <input-component class="form-component component-0-scope" result-name="text" result-value={ block.text } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="text" value={ block.text } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="userId">
                                        User :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="userId">
                                        <input-component class="form-component component-0-scope" result-name="userId" result-value={ block.userId } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="userId" value={ block.userId } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="articleId">
                                        Article :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="articleId">
                                        <input-component class="form-component component-0-scope" result-name="articleId" result-value={ block.articleId } is-readonly="">
                                            <div class="is-component is-container is-readonly">
                                                <input id="" class="is-input is-result" name="articleId" value={ block.articleId } placeholder="" readonly>
                                            </div>
                                        </input-component>
                                    </div>

                                    <div class="form-field-name" data-is-column-title="" data-column-name="articleId">
                                        Image :
                                    </div>
                                    <div>
                                        <input class="form-input" name="imagePath" type="text" value={ block.imagePath } readonly/>
                                        <div class="form-upload-container">
                                            <img alt="" class="form-upload-image" src={ block.imagePath } onerror={() => this.src='/admin/image/missing_image.svg'}/>
                                        </div>
                                    </div>
                                    <!-- <div class="form-field-name" data-is-column-title="" data-column-name="Text">
                                        Text :
                                    </div>
                                    <div class="form-field-value" data-is-column-value="" data-column-name="Text">
                                        <multilingual-text-input-component class="form-component component-1-scope" result-name="Text" result-value="Our expertise¨fr:Notre savoir-faire" is-readonly="" language-tags="[&quot;en&quot;,&quot;fr&quot;,&quot;de&quot;]">
                                            <div class="is-component is-container is-translation-container is-readonly">
                                                <textarea id="" class="is-result" name="Text" placeholder="" readonly hidden></textarea>
                                                <div class="is-translation is-readonly">
                                                    <text-input-component class="is-translation-data component-152-scope" result-value="Our expertise" is-readonly="">
                                                        <div class="is-component is-container is-readonly">
                                                            <textarea id="" class="is-textarea is-result" name="" placeholder="" readonly style="height: 0px;">Our expertise</textarea>
                                                        </div>
                                                    </text-input-component>
                                                    <input class="is-input is-translation-specifier" placeholder="en" value="" readonly>
                                                    <div>
                                                    </div>
                                                </div>
                                                <div class="is-translation is-readonly">
                                                    <text-input-component class="is-translation-data component-153-scope" result-value="Notre savoir-faire" is-readonly="">
                                                        <div class="is-component is-container is-readonly">
                                                            <textarea id="" class="is-textarea is-result" name="" placeholder="" readonly style="height: 0px;">Notre savoir-faire</textarea>
                                                        </div>
                                                    </text-input-component>
                                                    <input class="is-input is-translation-specifier" placeholder="" value="fr" readonly>
                                                    <div>
                                                    </div>
                                                </div>
                                            </div>
                                        </multilingual-text-input-component>
                                    </div> -->
                                </div>
                                <div class="form-toolbar">
                                    <a class="form-button edit-button" href="/admin/blocks/{ block.id }">
                                        <div class="blue-edit-icon size-150"></div>
                                    </a>
                                    <button class="form-button remove-button">
                                        <div class="red-500-delete-icon size-150"></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    {/each}
                </div>
            {/if}
        </main>
    </div>
{/if}

<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import Input from '$component/element/Input.svelte';
    import Select from '$component/element/Select.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import InputFile from '$component/element/InputFile.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { navigate } from 'svelte5-router';
    import InputLocalizedMdEditor from '$component/element/InputLocalizedMdEditor.svelte';
    import { generateFilePath } from '$lib/filePath';
    import Button from '$component/element/Button.svelte';

    // -- VARIABLES

    /** @type {{id: any}} */
    let { id } = $props();
    let block = $state(getInitialBlockState());
    let isEditBlock = false;
    let blockTypeArray = $state([]);
    let isLoading = $state(true);
    let fileArray = $state();
    let fileInput = $state();
    let indexInputMap = $state({});
    let deletedInputMap = $state({});
    let retainedInputMap = $state({});
    let retainedIndexInputMap = $state({});
    let languageArray = [];
    let editable = $state(false);
    let isSubmitting = $state(false);

    // -- FUNCTIONS

    function setDefaultFileArray(
        )
    {
        if ( block.imagePath )
        {
            fileArray = [ block.imagePath ];
        }
    }

    // ~~

    function processFormatLine(
        line
        )
    {
        let temp = '';
        let newLine = '';
        line.split( '**' ).forEach(
            ( part, index ) =>
            {
                if ( index % 2 === 0 )
                {
                    newLine += part;
                }
                else
                {
                    newLine += `<b style="font-weight: bold">${ part }</b>`;
                }
            }
            )
        temp = newLine;
        newLine = '';
        temp.split( '*' ).forEach(
            ( part, index ) =>
            {
                if ( index % 2 === 0 )
                {
                    newLine += part;
                }
                else
                {
                    newLine += `<i>${ part }</i>`;
                }
            }
            )
        temp = newLine;
        newLine = '';
        temp.split( '^' ).forEach(
            ( part, index ) =>
            {
                if ( index % 2 === 0 )
                {
                    newLine += part;
                }
                else
                {
                    newLine += `<sup style="font-size: 0.75rem">${ part }</sup>`;
                }
            }
            )
        temp = newLine;
        newLine = '';
        temp.split( '~' ).forEach(
            ( part, index ) =>
            {
                if ( index % 2 === 0 )
                {
                    newLine += part;
                }
                else
                {
                    newLine += `<sub style="font-size: 0.75rem">${ part }</sub>`;
                }
            }
            );

        return newLine;
    }

    // ~~

    function processLinkLine(
        line
        )
    {
        let newLine = '';
        line.split( '[' ).forEach(
            ( part, index ) =>
            {
                if ( index % 2 === 0 )
                {
                    newLine += part;
                }
                else
                {
                    let text = part.split( ']' )[ 0 ];
                    let url = part.split( '](' )[ 1 ].split( ')' )[ 0 ];

                    newLine += `<a href="${ url }">${ text }</a>`;
                }
            }
            );

        return newLine;
    }

    // ~~

    function processLine(
        line
        )
    {
        let newLine = processFormatLine( line );
        newLine = processLinkLine( newLine );

        return newLine;
    }

    // ~~

    async function handleSubmit(
        )
    {
        isSubmitting = true;

        let formData = handleArticleForm();

        formData.append( 'type', 'addBlock' );

        try
        {
            let response = await fetchData(
                '/api/blog/blocks/add',
                {
                    method: 'POST',
                    body : formData,
                    credentials: 'include'
                }
                );

            block = response.block;
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isSubmitting = false;
            navigate( '/admin/articles/' + id );
        }
    }

    // ~~

    function handleArticleForm(
        )
    {
        let formData = new FormData();

        if ( fileInput )
        {
            for ( let i = 0; i < fileInput.files.length; ++i )
            {
                formData.append( 'file', fileInput.files[ i ] );
            }
        }

        for ( let [ name, element ] of Object.entries( retainedInputMap ) )
        {
            if ( element )
            {
                formData.append( name.substring( 0, name.length - 1 ), element.value );
            }
        }

        for ( let [ name, element ] of Object.entries( retainedIndexInputMap ) )
        {
            if ( element )
            {
                formData.append( name.substring( 0, name.length - 1 ), element.value );
            }
        }

        for ( let [ name, element ] of Object.entries( deletedInputMap ) )
        {
            if ( element )
            {
                formData.append( name, element.value );
            }
        }

        for ( let [ name, element ] of Object.entries( indexInputMap ) )
        {
            if ( element )
            {
                formData.append( name.substring( 0, name.length - 1 ), element.value );
            }
        }

        let newFileIndex = formData.getAll( 'file-path-index' );
        let initialFile = formData.getAll( 'file-path-retained' );
        let initialFileIndex = formData.getAll( 'file-path-retained-index' );
        let deletedFile = formData.getAll( 'file-path-deleted' );

        formData.append( 'newFileIndex', JSON.stringify( newFileIndex ) );
        formData.append( 'initialFile', JSON.stringify( initialFile ) );
        formData.append( 'initialFileIndex', JSON.stringify( initialFileIndex ) );
        formData.append( 'deletedFile', JSON.stringify( deletedFile ) );

        formData.append( 'block', JSON.stringify( block ) );

        return formData;
    }

    // ~~

    function getInitialBlockState(
        )
    {
        return (
            {
                articleId: id,
                imagePath: '',
                teaser: '',
                text: '',
                title: '',
                typeId: 'text',
                userId: $profileSignedInStore.userId,
            }
            );
    }

    // ~~

    function handleUpdateLocalizedInput(
        event
        )
    {
        block[ event.detail.name ] = event.detail.text;
    }

    // ~~

    function handleUpdateLocalizedMdEditor(
        event
        )
    {
        editable = true;
        block[ event.detail.name ] = event.detail.text;

        document.getElementById( 'preview-block-text' ).innerHTML = '';

        let previewBlockText = getLocalizedText( event.detail.text, $languageTagStore );
        let lines = previewBlockText.split( '\n' );
        let previousLine = '';
        let innerHTML = '';

        lines.forEach( line =>
            {
                let content = '';

                if ( line.startsWith( '# ' ) )
                {
                    content =
                        `<h3 style="font-size: 2rem">
                            ${ processLine( line.replace( '# ', '' ) ) }
                        </h3>`;
                }

                if ( line.startsWith( '## ' ) )
                {
                    content =
                        `<h4 style="font-size: 1.5rem">
                            ${ processLine( line.replace( '## ', '' ) ) }
                        </h4>`;
                }

                if ( line.startsWith( '### ' ) )
                {
                    content =
                        `<h5 style="font-size: 1.5rem">
                            ${ processLine( line.replace( '### ', '' ) ) }
                        </h5>`;
                }

                if ( line.startsWith( '- ' ) )
                {
                    if ( previousLine.startsWith( '- ' ) )
                    {
                        content = `<li style="margin-left: 1rem">${ processLine( line.replace( '- ', '' ) ) }</li>`;
                    }
                    else
                    {
                        content = `<ul style="list-style-type: circle"><li style="margin-left: 1rem">${ processLine( line.replace( '- ', '' ) ) }</li>`;
                    }
                }

                if ( previousLine.startsWith( '- ' ) && !line.startsWith( '- ' ) )
                {
                    content = '</ul>';
                    innerHTML += content;
                    content = ''
                }

                if ( content == '' )
                {
                    content = `<p>${  processLine( line ) }</p>`;
                }

                innerHTML += content;
                previousLine = line;
            }
            );

        document.getElementById( 'preview-block-text' ).innerHTML = innerHTML;
        editable = false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let blockTypeResponse = await fetchData(
                    '/api/blog/block-type/get',
                    {
                        method : 'POST',
                        body :
                            JSON.stringify(
                                {
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                blockTypeArray = blockTypeResponse.blockTypeArray;
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

    // -- ELEMENTS

    h1
    {
        text-align: center;
    }

    form
    {
        margin: 0 auto;
        max-width: 70%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
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

    .form-builder-footer
    {
        position: sticky;
        bottom: 0;

        background: pageBackgroundColor;
    }

    .page-main
    {
        padding: 2.5rem 2.5rem 0;
    }
</style>

{#if isLoading }
    <div class="hourglass">{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}
    <div class="page-section">
        <Sidebar/>

        <main class="page-main">
            <h1 class="font-size-200 font-weight-700 color-blue">Block</h1>

            <form onsubmit={preventDefault(handleSubmit)}>
                <Select
                    id="typeId"
                    name="typeId"
                    label={ getLocalizedTextBySlug( 'schema-type-id-field-label', $languageTagStore ) }
                    bind:value={ block[ 'typeId' ] }
                    fullWidth
                    required
                >
                    {#each blockTypeArray as option }
                        <option value={ option.id } selected={ option.id === block[ 'typeId' ] }>{ getLocalizedText( option.name, $languageTagStore ) }</option>
                    {/each}
                </Select>
                <span>
                    { getLocalizedTextBySlug( 'schema-title-field-label', $languageTagStore ) }
                </span>
                <InputLocalizedForm
                    name='title'
                    itemsString={ block[ 'title' ] }
                    languageArray={ $languageArrayStore }
                    on:update={ handleUpdateLocalizedInput }
                />
                    <!-- placeholder={ getLocalizedTextBySlug( 'schema-title-field-label', $languageTagStore ) } -->
                <span>
                    { getLocalizedTextBySlug( 'schema-teaser-field-label', $languageTagStore ) }
                </span>
                <InputLocalizedForm
                    name='teaser'
                    itemsString={ block[ 'teaser' ] }
                    languageArray={ $languageArrayStore }
                    on:update={ handleUpdateLocalizedInput }
                />
                {#if block[ 'typeId' ].includes( 'text' ) }
                    <span>
                        { getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) }
                    </span>
                    <InputLocalizedMdEditor
                        name='text'
                        itemsString={ block[ 'text' ] }
                        languageArray={ $languageArrayStore }
                        on:update={ handleUpdateLocalizedMdEditor }
                    />
                        <!-- placeholder={ getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) } -->
                {/if}
                {#if block[ 'typeId' ].includes( 'image' ) }
                    <Input
                        id="imagePath"
                        name="imagePath"
                        label={ getLocalizedTextBySlug( 'schema-image-path-field-label', $languageTagStore ) }
                        bind:value={ block[ 'imagePath' ] }
                        type="text"
                        fullWidth
                    />
                    <InputFile
                        fileInputName="imagePath"
                        maxFilesLength={ 1 }
                        bind:files={ fileArray }
                        bind:fileInput
                        bind:indexInputMap
                        bind:deletedInputMap
                        bind:retainedInputMap
                        bind:retainedIndexInputMap
                    />
                {/if}

                {#if block[ 'typeId' ] !== 'image' }
                    <section class="preview-block">
                        {#if block[ 'typeId' ] === 'image-and-text' }
                            <img src={ generateFilePath( block[ 'imagePath' ] ) } alt={ block[ 'title' ] }>
                        {/if}
                        {#if block[ 'typeId' ] !== 'image' }
                            <div id="preview-block-text" contenteditable={editable}></div>
                        {/if}
                        {#if block[ 'typeId' ] !== 'text' && block[ 'typeId' ] !== 'image-and-text' }
                            <img src={ generateFilePath( block[ 'imagePath' ] ) } alt={ block[ 'title' ] }>
                        {/if}
                    </section>
                {/if}
                <footer class="form-builder-footer padding-vertical-100">
                    <Button type="submit" loading={ isSubmitting } fullWidth>
                        { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                    </Button>
                </footer>
            </form>
        </main>
    </div>
{/if}

<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug, getJsonText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import CardItem from '$component/element/CardItem.svelte';
    import Input from '$component/element/Input.svelte';
    import InputFile from '$component/element/InputFile.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import Select from '$component/element/Select.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { generateFilePath } from '$lib/filePath';
    import { blockTypeArrayStore } from '$store/blockTypeArrayStore';
    import InputLocalizedMdEditor from '$component/element/InputLocalizedMdEditor.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { toast } from '$lib/toast';
    import FileInput from '$component/element/FileInput.svelte';

    // -- VARIABLES

    /** @type {{block: any, updateBlockArray: any, deleteBlockFromArray: any, isEditing?: boolean, isNewBlock?: boolean}} */
    let {
        block = $bindable(),
        updateBlockArray,
        deleteBlockFromArray,
        isEditing = $bindable(false),
        isNewBlock = $bindable(false)
    } = $props();
    let fileArray = $state();
    let isLoading = true;
    let isSubmitting = $state(false);

    // -- FUNCTIONS

    function setDefaultFileArray(
        )
    {
        if ( block?.imagePath )
        {
            fileArray = [ block.imagePath ];
        }
    }

    // ~~

    function handleUpdateBlockLocalizedInput(
        event
        )
    {
        block[ event.detail.name ] = event.detail.text;
    }

    // ~~

    async function handleCreateBlock(
        )
    {
        isLoading = true;
        isSubmitting = true;

        let formData = new FormData();

        try
        {
            if ( block.typeId.includes( 'image' ) )
            {
                if ( fileArray.length === 0 )
                {
                    toast.error( 'Must have at least one image' );

                    return;
                }

                block.imagePath = fileArray[ 0 ];
            }

            formData.append( 'block', getJsonText( block ) );

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
            isLoading = false;
            isNewBlock = false;
            isSubmitting = false;
            setDefaultFileArray();
            updateBlockArray( block );
        }
    }

    // ~~

    async function handleEditBlock(
        )
    {
        isLoading = true;
        isSubmitting = true;

        let formData = new FormData();

        try
        {
            if ( block.typeId.includes( 'image' ) )
            {
                if ( fileArray.length === 0 )
                {
                    toast.error( 'Must have at least one image' );

                    return;
                }

                block.imagePath = fileArray[ 0 ];
            }

            formData.append( 'type', 'updateBlockById' );
            formData.append( 'block', getJsonText( block ) );

            let response = await fetchData(
                '/api/blog/blocks/set-by-id/' + block.id,
                {
                    method: 'POST',
                    body : formData,
                    credentials: 'include'
                }
                );

            if ( response.block !== null )
            {
                block = response.block;
                fileArray = [ block.imagePath ].filter( Boolean );
            }

            toast.success( 'Saved sucessfully' );
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isLoading = false;
            isSubmitting = false;
            setDefaultFileArray();
            updateBlockArray( block );
        }
    }

    // --

    async function handleDeleteBlock(
        )
    {
        isLoading = true;
        isSubmitting = true;

        if ( confirm( 'Are you sure you want to delete this block?' ) )
        {
            try
            {
                await fetchData(
                    '/api/blog/blocks/delete-by-id/' + block.id,
                {
                        method : 'POST',
                        body :
                            getJsonText(
                                {
                                    type: 'deleteBlockById'
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                deleteBlockFromArray( block.id );
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
                isSubmitting = false;
            }
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            setDefaultFileArray();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    h2
    {
        font-size: 1em;
        font-weight: 600;
        color: blueColor300;
    }

    span
    {
        font-size: 1em;
        font-weight: 700;
        color: grayColor100;
    }

    // -- CLASSES

    .block-item-heading
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .form-image-section
    {
        display: flex;
        flex-direction: row;
        gap: 0.5vw;
        justify-content: space-between;
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
        height: 10rem;
        width: auto;
        max-width: 50vw;
        border-radius: 1rem;
    }

    .block-item
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        font-size: 1em;
        font-size: 500;
        color: blueColor500;
        &:hover
        {
            color: blueColor300;
        }
    }

    .block-item-actions
    {
        display: flex;
        flex-direction: row;
        gap: 1vw;
        align-items: center;
    }

    .block-item-action-button
    {
        display: none;
    }

    .block-item:hover .block-item-action-button
    {
        border-radius: 0.5rem;
        padding: 0.2rem 0.75rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;

        background-color: white;

        font-size: 1em;
        font-weight: 600;

        cursor: pointer;
    }

    .block-item-save-button
    {
        min-width: 5.125rem;
        border-radius: 0.5rem;
        padding: 0.2rem 0.75rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: center;

        background-color: white;

        font-size: 1em;
        font-weight: 600;

        cursor: pointer;
    }

    .edit
    {
        color: blueColor300;
    }

    .delete
    {
        color: redColor500;
    }

    .drag-icon
    {
        cursor: grab;
    }

    .drag-icon:active
    {
        cursor: grabbing;
    }

    .block-item-loading
    {
        z-index: 2;
        position: absolute;

        inset: -1rem -1rem -1rem -1rem;
        height: calc( 100% + 2rem );
        width: calc( 100% + 2rem );
        border-radius: 0.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.2 );
        backdrop-filter: blur( 2px );
    }
</style>

<CardItem>
    {#if isEditing }
        {#if isSubmitting }
            <div class="block-item-loading">
                <Loading/>
            </div>
        {/if}
        <div class="block-item-heading">
            <h2>{ getLocalizedText( block?.title || '', $languageTagStore ) }</h2>
            {#if isNewBlock }
                <button
                    type="button"
                    class="block-item-save-button"
                    onclick={handleCreateBlock}
                    disabled={ isSubmitting }
                >
                    {#if isSubmitting }
                        <Loading isSmall/>
                    {:else}
                        <div class="save-icon size-150"></div>
                        { getLocalizedTextBySlug( 'create-label', $languageTagStore ) }
                    {/if}
                </button>
            {:else}
                <button
                    type="button"
                    class="block-item-save-button"
                    onclick={handleEditBlock}
                >
                    {#if isSubmitting }
                        <Loading isSmall/>
                    {:else}
                        <div class="save-icon size-150"></div>
                        { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                    {/if}
                </button>
            {/if}
        </div>
        <span>
            { getLocalizedTextBySlug( 'schema-type-id-field-label', $languageTagStore ) }
        </span>
        <Select
            id="type-id"
            name="type-id"
            bind:value={ block.typeId }
            fullWidth
        >
            {#each $blockTypeArrayStore as blockType }
                <option value={ blockType.id } selected={ blockType.id === block.typeId }>{ getLocalizedText( blockType.name, $languageTagStore ) }</option>
            {/each}
        </Select>
        <span>
            { getLocalizedTextBySlug( 'schema-title-field-label', $languageTagStore ) }
        </span>
        <InputLocalizedForm
            id='block-title'
            name='title'
            color={ true }
            itemsString={ block.title }
            languageArray={ $languageArrayStore }
            on:update={ handleUpdateBlockLocalizedInput }
        />
        <span>
            { getLocalizedTextBySlug( 'schema-teaser-field-label', $languageTagStore ) }
        </span>
        <InputLocalizedForm
            id='block-teaser'
            name='teaser'
            color={ true }
            itemsString={ block.teaser }
            languageArray={ $languageArrayStore }
            on:update={ handleUpdateBlockLocalizedInput }
        />
        {#if block.typeId === 'image-and-text' }
            <span>
                { getLocalizedTextBySlug( 'schema-image-field-label', $languageTagStore ) }
            </span>
            <div class="form-image-section">
                <div class="form-upload-container">
                    <img class="form-upload-image" alt="" src={ generateFilePath( block.imagePath ) } onerror={function(){ this.src='/admin/image/missing_image.avif'; }}/>
                </div>
                <FileInput
                    fileInputName="image-path"
                    acceptedType="image/*"
                    maxFileCount={ 1 }
                    bind:fileArray={ fileArray }
                />
                <Input
                    id="caption"
                    name="caption"
                    placeholder={ getLocalizedTextBySlug( 'schema-caption-field-label', $languageTagStore ) }
                    bind:value={ block[ 'caption' ] }
                    multiline
                    color={ true }
                />
            </div>
        {/if}
        {#if block.typeId.includes( 'text' ) }
            <span>
                { getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ) }
            </span>
            <InputLocalizedMdEditor
                name='text'
                itemsString={ block.text }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateBlockLocalizedInput }
                isMultiLine
            />
        {/if}
        {#if block.typeId.includes( 'image' ) && block.typeId != 'image-and-text' }
            <span>
                { getLocalizedTextBySlug( 'schema-image-field-label', $languageTagStore ) }
            </span>
            <div class="form-image-section">
                <div class="form-upload-container">
                    <img class="form-upload-image" alt="" src={ generateFilePath( block.imagePath ) } onerror={function(){ this.src='/admin/image/missing_image.avif'; }}/>
                </div>
                <FileInput
                    fileInputName="image-path"
                    acceptedType="image/*"
                    maxFileCount={ 1 }
                    bind:fileArray={ fileArray }
                />
                    <!-- bind:isUploadingImage={ isUploadingImage } -->
                <Input
                    id="caption"
                    name="caption"
                    placeholder={ getLocalizedTextBySlug( 'schema-caption-field-label', $languageTagStore ) }
                    bind:value={ block[ 'caption' ] }
                    multiline
                    color={ true }
                />
            </div>
        {/if}
    {:else}
        <div class="block-item">
            <div>{ getLocalizedText( block.title, $languageTagStore ) }</div>
            <div class="block-item-actions">
                <button
                    class="block-item-action-button edit"
                    onclick={() => isEditing = true}
                >
                    <div class="blue-edit-icon size-150"></div>
                    { getLocalizedTextBySlug( 'edit-label', $languageTagStore ) }
                </button>
                <button
                    type="button"
                    class="block-item-action-button delete"
                    onclick={handleDeleteBlock}
                >
                    <div class="red-500-delete-icon size-150"></div>
                    { getLocalizedTextBySlug( 'delete-label', $languageTagStore ) }
                </button>
                <div class="blue-drag-icon size-200 drag-icon"></div>
            </div>
        </div>
    {/if}
</CardItem>

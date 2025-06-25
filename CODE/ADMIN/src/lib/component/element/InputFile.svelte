<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { getRandomTuid, isMultilingualText } from 'senselogic-gist';
    import { generateFilePath } from '$lib/filePath';
    import { encodeFileToBase64Url } from '$lib/base';
    import { writable } from 'svelte/store';
    import { getStorageImagePath } from '$src/lib/storage';
    import SortableList from './SortableList.svelte';

    // -- VARIABLES

    /** @type {{fileInputName: any, maxFilesLength: any, files?: any, fileInput: any, retainedInputMap?: any, retainedIndexInputMap?: any, indexInputMap?: any, deletedInputMap?: any}} */
    let {
        fileInputName,
        maxFilesLength,
        files = [],
        fileInput = $bindable(),
        retainedInputMap = $bindable({}),
        retainedIndexInputMap = $bindable({}),
        indexInputMap = $bindable({}),
        deletedInputMap = $bindable({})
    } = $props();
    let newFileArray = writable( [] );
    let initialFileArray = writable( [] );
    let deletedFileArray = writable( [] );

    let filesContainer = $state();
    let acceptedType = 'image/*';
    $newFileArray = [];
    $initialFileArray = files.map( ( file, index ) => ( { src: file, type: acceptedType, index, fileType: 'initial' } ) ) ;
    $deletedFileArray = [];

    // -- FUNCTIONS

    async function handleInput(
        event
        )
    {
        let files = event.target.files;

        if ( !files )
        {
            return;
        }

        let promises = Array.from( files ).map(
                async ( file ) =>
                {
                    let dataUrl = await encodeFileToBase64Url( file );
                    let uniqueId = getRandomTuid();
                    return { src: dataUrl, type: file.type, name: file.name, uniqueId: uniqueId };
                }
            );

        let results = await Promise.all( promises );
            newFileArray.update(
                existingFiles =>
                [
                    ...existingFiles,
                    ...results.map(
                        ( result, index ) => (
                        {
                            ...result,
                            index: $initialFileArray.length + existingFiles.length + index,
                            fileType: 'new'
                        }
                        )
                    )
                ]
                );
    }

    // ~~

    function handleSort(
        event
        )
    {
        updateIndices( event.from );
    }

    // ~~

    function handleDelete(
        index,
        array
        )
    {
        array.update(
            items =>
            {
                let deletedFile = items.splice( index, 1 )[ 0 ];
                deletedFileArray.update( deletedItems => [ ...deletedItems, deletedFile.src ] );

                return items;
            }
            );

        setTimeout(
            () =>
            {
                    let arrayLength;
                    array.subscribe(
                        ( value ) => arrayLength = value.length
                        );
                    if ( arrayLength )
                    {
                        updateIndices( filesContainer.$$.ctx[ 1 ] );
                    }
            },
            0
            );
    }

    // ~~

    function updateIndices(
        container
        )
    {
        let newIndices =
            Array.from( container.children ).map(
                ( child, newIndex ) =>
                {
                    return (
                        {
                            oldIndex: parseInt( child.getAttribute( 'data-item-index' ) ),
                            newIndex: newIndex,
                            fileType: child.getAttribute( 'data-item-file-type' )
                        }
                        );
                }
                );

        initialFileArray.update( files => files.map( file =>
        {
            let match = newIndices.find( item => item.oldIndex === file.index && item.fileType === 'initial' );

            return match ? { ...file, index: match.newIndex } : file;
        }
        ) );

        newFileArray.update( files => files.map( file =>
        {
            let match = newIndices.find( item => item.oldIndex === file.index && item.fileType === 'new' );

            return match ? { ...file, index: match.newIndex } : file;
        }
        ) );
    }

    // ~~

    let handleClickEvent = () => {
        fileInput.click();
    };
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    .input-file
    {
        width: 49%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    :global( .input-file >div )
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .input-file-item
    {
        position: relative;

        height: 10rem;
        width: 100%;

        cursor: grab;
    }

    .input-file-item img
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem;

        object-fit: cover;
    }

    .input-file-remove-button
    {
        position: absolute;
        top: -0.75rem;
        right: -0.75rem;

        height: 1.5rem;
        width: 1.5rem;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: redColor;
    }

    .input-file-add-new-button
    {
        height: 10rem;
        border: 1px solid blueColor900;
        border-radius: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;

        cursor: pointer;
    }
</style>

<div class="input-file">
    {#if $initialFileArray.length > 0 || $newFileArray.length > 0 }
        <SortableList
            class="input-file-list"
            bind:this={ filesContainer }
            onEnd={ handleSort }
        >
            {#each $initialFileArray as fileData, index }
                <div class="input-file-item" data-item-index="{ fileData.index }" data-item-file-type="{ fileData.fileType }" data-item-src="{ fileData.src }">
                    <img src={ getStorageImagePath( fileData.src, 512 ) } alt="file"/>
                    <input
                        type="hidden"
                        name={ fileInputName + '-retained' + index }
                        value={ fileData.src }
                        bind:this={ retainedInputMap[ fileInputName + '-retained' + index ] }
                    />
                    <input
                        type="hidden"
                        name={ fileInputName + '-retained-index' }
                        value={ fileData.index }
                        bind:this={ retainedIndexInputMap[ fileInputName + '-retained-index' + index] }
                        />
                    <button
                        class="input-file-remove-button"
                        onclick={preventDefault(() => handleDelete( index, initialFileArray ))}
                    >
                        <div class="white-close-icon size-90"></div>
                    </button>
                </div>
            {/each}
            {#each $newFileArray as fileData, index ( fileData.uniqueId ) }
                <div class="input-file-item" data-item-index="{ fileData.index }" data-item-file-type="{ fileData.fileType }" data-item-src="{ fileData.src }">
                    <img src={ fileData.src } alt="file"/>
                    <input
                        type="hidden" name={ fileInputName + '-index' + index }
                        value={ fileData.index }
                        bind:this={ indexInputMap[ fileInputName + '-index' + index ] }
                    />
                    <button
                        class="input-file-remove-button"
                        onclick={preventDefault(() => handleDelete( index, newFileArray ))}
                    >
                        <div class="white-close-icon size-90"></div>
                    </button>
                </div>
            {/each}
        </SortableList>
    {/if}
    <input
        type="hidden"
        bind:value={ $deletedFileArray }
        name={ fileInputName + '-deleted' }
        bind:this={ deletedInputMap[ fileInputName + '-deleted' ] }
    />
    <input
        bind:this={ fileInput }
        name={ fileInputName }
        type="file"
        enctype="multipart/form-data"
        accept={ acceptedType }
        onchange={handleInput}
        multiple
        style="display:none"
    />
    {#if ( $initialFileArray.length + $newFileArray.length ) < maxFilesLength }
        <button class="input-file-add-new-button" onclick={preventDefault(handleClickEvent)}>
            <div class="blue-plus-circle-icon size-150"></div>
        </button>
    {/if}
</div>

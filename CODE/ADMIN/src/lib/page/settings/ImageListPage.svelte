<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import
    {
        handleCreateImage,
        handleDeleteImage,
        handleEditImage,
        hasMorePagination,
        imageArrayStore,
        isImageArrayLoading,
        isImageModalOpen,
        loadImageArray,
        selectedImageStore,
        toggleImageModal
    }
    from '$store/storageStore';
    import { copyToClipboard, fetchData } from '$lib/base';
    import { getFilePathType, filePathPrefix } from '$lib/filePath';
    import { getFilteredArray, getFilterParameterByKeyMap } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { toast } from '$lib/toast';
    import { urlParamsStore } from '$store/urlParamsStore';
    import AdminPage from '$component/element/AdminPage.svelte';
    import Cropper from '$component/element/Cropper.svelte';
    import Dropdown from '$component/element/Dropdown/Dropdown.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import Loading from '$component/element/Loading.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { hasUserPermission } from '$store/profileStore';
    import { getStorageImagePath } from '$src/lib/storage';

    // -- CONSTANTS

    const limit = 100;

    // -- VARIABLES

    let filterParameterByKeyMap =
    $state({
        path :
            {
                type: 'text',
                name: 'Image path',
                value: ''
            },
        originalImagePath :
            {
                type: 'text',
                name: 'Image name',
                value: ''
            },
        name :
            {
                type: 'text',
                name: 'Image name',
                value: ''
            }
    });
    let columnHeaderArray = [];
    let isEditModalOpen = $state(false);
    let selectedImage = $state(null);
    let fileToSave = $state(null);
    let page = $state(1);
    let observer;
    let bottomElement = $state();

    // -- FUNCTIONS

    function handleObserver(
        )
    {
        if ( observer )
        {
            observer.disconnect();
        }

        observer = new IntersectionObserver(
            ( entryArray ) =>
            {
                for ( let index = 0; index < entryArray.length; index += 1 )
                {
                    let entry = entryArray[ index ];

                    if ( entry.isIntersecting )
                    {
                        page += 1;
                    }
                }
            }
            );

        observer.observe( bottomElement );
    }

    // ~~

    function arrayProcessing(
        )
    {
        // imageArrayStore.update(
        //     ( imageArray ) => imageArray.map(
        //         ( image ) =>
        //         {
        //             return image;
        //         }
        //         )
        //     );
    }

    // ~~

    async function handleCopyToClipboard(
        text
        )
    {
        try
        {
            await copyToClipboard( text );

            toast.success( 'Copy to clipboard successful' );
        }
        catch
        {
            toast.error( 'Copy to clipboard failed' );
        }
    }

    // ~~

    async function downloadFile(
        url,
        filename
        )
    {
        try
        {
            let response = await fetch( url );

            if ( !response.ok )
            {
                throw new Error('Network response was not ok');
            }

            let blob = await response.blob();
            let urlBlob = window.URL.createObjectURL( blob );
            let a = document.createElement( 'a' );
            a.href = urlBlob;
            a.download = filename;
            document.body.appendChild( a );
            a.click();
            a.remove();
            window.URL.revokeObjectURL( urlBlob );
        }
        catch ( error )
        {
            console.error( 'There has been a problem with your fetch operation:', error );
        }
    }

    // ~~

    function isUrl(
        string
        )
    {
        return string.startsWith( 'http://' ) || string.startsWith( 'https://' );
    }

    // ~~

    async function handleSaveFile(
        )
    {
        if ( fileToSave )
        {
            if ( isUrl( fileToSave.url ) )
            {
                toast.warning( 'File was not modified' );

                return;
            }

            let file = base64ToFile(
                    fileToSave.url,
                    fileToSave.name,
                    fileToSave.type
                    );

            let formData = new FormData();
            formData.append( 'file', file );
            formData.append( 'fileName', selectedImage.originalImagePath );

            try
            {
                let data = await fetchData(
                    '/admin/page/image/set',
                    {
                        method : 'POST',
                        body : formData,
                        credentials : 'include'
                    }
                    );

                toast.success( getLocalizedTextBySlug( data.message ) );

                let newPath =
                    selectedImage.path
                    + '?v='
                    + new Date().getTime();

                imageArrayStore.update(
                    ( imageArray ) =>
                    {
                        let updatedArray = imageArray.map( ( image ) =>
                            {
                                if ( image.path === selectedImage.path )
                                {
                                    return (
                                        {
                                            ...image,
                                            path: newPath
                                        }
                                        );
                                }

                                return image;
                            }
                            );

                        return updatedArray;
                    }
                    );

                handleToggleEditModal();
            }
            catch ( error )
            {
                console.error( error );

                toast.error( getLocalizedTextBySlug( error.message ) );
            }
        }
    }

    // ~~

    async function handleDelete(
        imagePath
        )
    {
        try
        {
            let formData = new FormData();

            formData.append( 'filePath', imagePath );

            let data = await fetchData(
                    '/admin/api/storage/remove',
                    {
                        method : 'POST',
                        body : formData,
                        credentials : 'include'
                    }
                    );

            toast.success( getLocalizedTextBySlug( data.message ) );

            imageArrayStore.update(
                    ( imageArray ) =>
                    {
                        let updatedArray = imageArray.filter( ( image ) =>  imagePath !== image.name );

                        return updatedArray;
                    }
                    );
        }
        catch
        {
            toast.error( 'Was not able to delete file' );
        }
    }

    // ~~

    function base64ToBlob(
        base64Data,
        mimeType
        )
    {
        let base64String = base64Data.split( ',' )[ 1 ];
        let byteCharacterString = atob( base64String );
        let byteNumberArray = new Array( byteCharacterString.length );

        for ( let index = 0; index < byteCharacterString.length; index++ )
        {
            byteNumberArray[ index ] = byteCharacterString.charCodeAt( index );
        }

        let byteArray = new Uint8Array( byteNumberArray );

        return new Blob( [ byteArray ], { type: mimeType } );
    }

    // ~~

    function base64ToFile(
        base64Data,
        filename,
        mimeType
        )
    {
        let blob = base64ToBlob( base64Data, mimeType );

        return new File( [ blob ], filename, { type: mimeType } );
    }

    // ~~

    function handlePreview(
        image
        )
    {
        window.open( filePathPrefix + '/' + image.path, '_blank' );
    }

    // ~~

    function handleToggleEditModal(
        image
        )
    {
        selectImage( image );
        isEditModalOpen = !isEditModalOpen;
    }

    // ~~

    function selectImage(
        image
        )
    {
        selectedImage = image;
    }

    // ~~

    function getMimeTypeFromFilePath(
        filePath
        )
    {
        let mimeTypeByExtensionMap =
        {
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'png': 'image/png',
            'gif': 'image/gif',
            'bmp': 'image/bmp',
            'avif': 'image/avif',
            'webp': 'image/webp',
            'svg': 'image/svg+xml',
            'tiff': 'image/tiff',
            'ico': 'image/vnd.microsoft.icon'
        };

        let fileExtension = getFilePathType( filePath );

        return mimeTypeByExtensionMap[ fileExtension ] || 'image/jpeg';
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadImageArray();
            arrayProcessing();
            handleObserver();

            filterParameterByKeyMap = getFilterParameterByKeyMap( filterParameterByKeyMap, $urlParamsStore );
            $imageArrayStore = getFilteredArray( $imageArrayStore, $urlParamsStore, filterParameterByKeyMap, $languageTagStore)
        }
    );

    // ~~

    run(() => {
        page, loadImageArray( page, limit );
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    img
    {
        margin: 0 auto;
        height: 100%;
        width: auto;

        object-fit: contain;
    }

    // -- CLASSES

    .image-list
    {
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100%;
        max-height: calc( 100dvh - 13rem );
        width: 100%;
        padding-top: 3rem;

        display: grid;
        grid-template-columns: repeat( auto-fill, minmax( 21rem, 1fr ) );
        gap: 1.25rem;
    }

    .image-item
    {
        position: relative;

        box-sizing: border-box;
        height: 14rem;
        width: 100%;
        border: 1px solid grayColor900;
        border-radius: 0.75em;
        padding: 0.5rem 0.5rem 1rem 1rem;

        display: flex;
        flex-direction: column;

        background: whiteColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        color: grayColor500;

        transition: all 200ms ease-in-out;
    }

    .image-item:hover .action-button,
    .image-item:focus-within .action-button,
    .action-button
    {
        display: block;

        animation: fadeIn 200ms ease-in-out forwards;
    }

    .image-name
    {
        overflow: hidden;
        margin-top: auto;
        margin-bottom: 0;

        line-height: 1.125rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-overflow: ellipsis;
        text-shadow: 1px 1px rgba( 0, 0, 0, 0.5 );
        color: whiteColor;
    }

    .image-container
    {
        height: 10em;
        width: 100%;
        border-radius: 0.5em;
        padding: 1.5em 0;

        background-color: rgb(244, 246, 251);

        text-align: center;
    }

    .action-button
    {
        z-index: 999;
        z-index: 999;
        position: absolute;
        top: 0.5em;
        right: 0.5em;
        transform: scale( 0.5 );

        border-radius: 0.25em;

        display: none;

        opacity: 0;

        cursor: pointer;
    }

    // -- MIXIN

    @keyframes fadeIn
    {
        to
        {
            transform: scale( 1 );

            opacity: 1;
        }
    }
</style>

<AdminPage
    pageTitle="admin-menu-images-manager-label"
    selectedObject={ selectedImageStore }
    objectArrayStore={ imageArrayStore }
    isObjectModalOpen={ isImageModalOpen }
    titleSlugMap={ null }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    loadObjectArray={ loadImageArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ handleCreateImage }
    handleEditObject={ handleEditImage }
    handleDeleteObject={ handleDeleteImage }
    toggleObjectModal={ toggleImageModal }
    tablePage={ false }
    showButton={ false }
>
    <div
        class="image-list"
    >
        {#if Array.isArray( $imageArrayStore ) && $imageArrayStore.length > 0 }
            {#each $imageArrayStore as image }
                <div
                    class="image-item"
                    style=
                        "
                            background:
                                url( { getStorageImagePath( filePathPrefix + '/' + image.path, image.originalImagePath ) } ) no-repeat center center / cover,
                                url( { getStorageImagePath( filePathPrefix + '/' + image.path, 360 ) } ) no-repeat center center / cover,
                                url(/image/icon/moien_happy.svg) no-repeat center center / 50%;
                        "
                >
                    <div class="action-button">
                        <Dropdown
                            label={ 'Actions' }
                            actionArray={
                                [
                                    {
                                        actionText: 'Preview',
                                        icon: 'eye',
                                        iconColor: 'blue',
                                        onClick: ( action ) => handlePreview( image ),
                                        breakline: false,
                                        permissionSlug: 'list-image'
                                    },
                                    {
                                        actionText: 'Copy URL',
                                        icon: 'link',
                                        iconColor: 'blue',
                                        onClick: async () => handleCopyToClipboard( filePathPrefix + '/' + image.path ),
                                        breakline: false,
                                        permissionSlug: 'list-image'
                                    },
                                    {
                                        actionText: 'Edit',
                                        icon: 'edit',
                                        iconColor: 'blue',
                                        onClick: ( action ) => handleToggleEditModal( image ),
                                        breakline: false,
                                        permissionSlug: 'set-image'
                                    },
                                    {
                                        actionText: 'Download',
                                        icon: 'download',
                                        iconColor: 'blue',
                                        onClick: () => downloadFile( filePathPrefix + '/' + image.path, image.name ),
                                        breakline: false,
                                        permissionSlug: 'list-image'
                                    },
                                    {
                                        actionText: 'Delete',
                                        icon: 'trash',
                                        iconColor: 'white',
                                        onClick: () => handleDelete( image.name ),
                                        breakline: false,
                                        permissionSlug: 'remove-image',
                                        backgroundColor: '#f0384a',
                                        textColor: '#fff'
                                    }
                                ]
                            }
                        />
                    </div>

                    <span class="image-name">
                        { image.originalImagePath }
                    </span>
                </div>
            {/each}
        {/if}

        {#if $isImageArrayLoading }
            <div class="display-flex justify-content-center align-items-center">
                <Loading/>
            </div>
        {/if}

        {#if $hasMorePagination }
            <div bind:this={ bottomElement }></div>
        {/if}
    </div>

    <ModalRoot isOpen={ isEditModalOpen }>
        <ModalHeader
            title={ 'Edit file' }
            onClose={ handleToggleEditModal }
        />
        <ModalContent>
            <Cropper
                data={
                    {
                        cropped: false,
                        cropping: false,
                        loaded: false,
                        name : selectedImage.name,
                        previousUrl: '',
                        type: getMimeTypeFromFilePath( filePathPrefix + '/' + selectedImage.path ),
                        url : filePathPrefix + '/' + selectedImage.path
                    }
                }
                bind:fileToSave
            />
        </ModalContent>

        <ModalActions>
            <ModalButton
                on:click={ handleSaveFile }
            >
                Save
            </ModalButton>
        </ModalActions>
    </ModalRoot>
</AdminPage>

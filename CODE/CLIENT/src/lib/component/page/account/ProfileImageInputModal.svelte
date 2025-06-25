<script>
    // -- IMPORTS

    import { getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import FileInput from '$component/backoffice/FileInput.svelte';
    import { isMobileScreen } from '$store/appDataStore';

    // -- VARIABLES

    let isOpen = false;
    let imagePathArray = [ $profileSignedInStore.imagePath ?? null ].filter( Boolean );
    let backgroundImagePathArray = [ $profileSignedInStore.backgroundImagePath ?? null ].filter( Boolean );
    let form;
    let isSubmitting = false;
    let isUploadingImage = false;

    // -- FUNCTIONS

    async function handleSubmit(
        event
        )
    {
        isSubmitting = true;

        let data
            = await fetchData(
                '/api/update-profile-image',
                {
                    method: 'POST',
                    body: getJsonText(
                        {
                            profile:
                            {
                                imagePath: imagePathArray[ 0 ] ?? null,
                                backgroundImagePath: backgroundImagePathArray[ 0 ] ?? null
                            }
                        }
                        ),
                    credentials: 'include'
                }
                );

        $profileSignedInStore = data;
        isSubmitting = false;
        handleCloseModal();
    }

    // ~~

    function handleOpenModal(
        )
    {
        isOpen = true;
    }

    // ~~

    function handleCloseModal(
        )
    {
        isOpen = false;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'
    @import '../../../../mixin.styl';

    // -- CLASSES

    .form
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .form-image-title
    {
        margin-bottom: 1rem;
    }
</style>

<button type="button" on:click={ handleOpenModal }>
    <slot/>
</button>

<ModalRoot bind:isOpen={ isOpen }  >
    <ModalHeader
        title={ getLocalizedTextBySlug( 'profile-page-update-your-profile-image-label' ) }
        onClose={ () => isOpen = false }
        isCloseDisabled={ isUploadingImage }
    />
    <ModalContent>
        <form
            bind:this={ form }
            on:submit|preventDefault={ handleSubmit }
            class="form"
        >
            <div class:full-width={ $isMobileScreen }>
                <p class="form-image-title font-size-125 font-weight-700">{ getLocalizedTextBySlug( 'profile-image-label' ) }</p>
                <FileInput
                    maxFileCount={ 1 }
                    fileInputName="image-path"
                    imageSizeArray={ [ 512, 360 ] }
                    bind:fileArray={ imagePathArray }
                    bind:isSubmitting={ isUploadingImage }
                    --file-input-image-width={ $isMobileScreen ? '100%' : '10rem' }
                    --file-input-image-height="10rem"
                />
            </div>

            <div class="full-width">
                <p class="form-image-title font-size-125 font-weight-700">
                    { getLocalizedTextBySlug( 'profile-background-image-label' ) }
                </p>
                <FileInput
                    maxFileCount={ 1 }
                    fileInputName="background-image-path"
                    imageSizeArray={ [ 1920, 1080, 360 ] }
                    bind:fileArray={ backgroundImagePathArray }
                    minimumHeight={ 200 }
                    minimumWidth={ 500 }
                    bind:isSubmitting={ isUploadingImage }
                    --file-input-image-width="100%"
                    --file-input-image-height="10rem"
                />
            </div>
        </form>

        <span class="font-size-75 font-weight-500">
            <p>{ getLocalizedTextBySlug( 'profile-image-high-resolution-images-only-no-animated' ) }</p>
        </span>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'cancel-label' ) }
            on:click={ () => isOpen = false }
            disabled={ isUploadingImage }
        />
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'save-label' ) }
            isLoading={ isSubmitting }
            on:click={ () => form.requestSubmit() }
            disabled={ isUploadingImage }
        />
    </ModalActions>
</ModalRoot>

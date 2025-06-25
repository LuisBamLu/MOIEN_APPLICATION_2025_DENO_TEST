<script>
    // -- IMPORTS

    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from './Loading.svelte';

    // -- VARIABLES

    /** @type {{isObjectModalOpen?: boolean, toggleObjectModal: any, isEditing?: boolean, handleCreate: any, handleEdit: any, handleDelete: any, titleSlugMap?: any, showModalButton?: boolean, disabled?: boolean, isSubmitting?: boolean, isDeleteButtonDisabled?: boolean, children?: import('svelte').Snippet}} */
    let {
        isObjectModalOpen = false,
        toggleObjectModal,
        isEditing = false,
        handleCreate,
        handleEdit,
        handleDelete,
        titleSlugMap = {
        editTitle: 'edit-label',
        addTitle: 'add-label'
    },
        showModalButton = true,
        disabled = false,
        isSubmitting = false,
        isDeleteButtonDisabled = false,
        children
    } = $props();

    // -- CONSTANTS

    const title =
    {
        edit: getLocalizedTextBySlug( titleSlugMap.editTitle ),
        add: getLocalizedTextBySlug( titleSlugMap.addTitle )
    }
    const buttonLabel =
    {
        edit: getLocalizedTextBySlug( 'edit-label' ),
        create: getLocalizedTextBySlug( 'create-label' ),
        delete: getLocalizedTextBySlug( 'delete-label' )
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .loading
    {
        z-index: 99999;
        position: absolute;

        height: 100%;
        width: 100%;
        border-radius: 1.5rem;

        display: flex;
        justify-content: center;
        align-items: center;

        backdrop-filter: blur( 5px );
    }
</style>

<ModalRoot isOpen={ isObjectModalOpen }>
    {#if isSubmitting }
        <div class="loading">
            <Loading/>
        </div>
    {/if}
    <ModalHeader
        title={ isEditing ? title.edit : title.add }
        onClose={ toggleObjectModal }
    />

    <ModalContent>
        {@render children?.()}
    </ModalContent>

    {#if showModalButton }
        <ModalActions>
            {#if isEditing }
                <ModalButton on:click={ handleDelete } disabled={ isDeleteButtonDisabled }>{ buttonLabel.delete }</ModalButton>
                <ModalButton on:click={ handleEdit } disabled={ disabled }>{ buttonLabel.edit }</ModalButton>
            {:else}
                <ModalButton on:click={ handleCreate } disabled={ disabled }>{ buttonLabel.create }</ModalButton>
            {/if}
        </ModalActions>
    {/if}
</ModalRoot>

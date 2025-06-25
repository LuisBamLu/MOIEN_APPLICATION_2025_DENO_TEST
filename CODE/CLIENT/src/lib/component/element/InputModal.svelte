<script>
    //  -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalHeader from '../modal/ModalHeader.svelte';
    import ModalRoot from '../modal/ModalRoot.svelte';
    import ModalContent from '../modal/ModalContent.svelte';
    import ModalActions from '../modal/ModalActions.svelte';
    import ModalButton from '../modal/ModalButton.svelte';

    // -- VARIABLES

    export let isEditing = false;
    export let heading;
    export let clear;
    export let save;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl'
    @import '../../../mixin.styl'

    // -- CLASSES

    .modal-content-container
    {
        overflow-y: auto;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>

<ModalRoot isOpen={ isEditing }>
    <ModalHeader
        title={ heading }
        onClose={ () => isEditing = false }
    />
    <ModalContent>
        <div class="modal-content-container">
            <slot />
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'filter-clear-all-button', $languageTagStore ) }
            on:click={ clear }
        />
        <ModalButton
            text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            on:click={ save }
        />
    </ModalActions>
</ModalRoot>

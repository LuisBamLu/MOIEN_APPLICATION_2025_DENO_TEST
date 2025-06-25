<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component//modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import CountryFilter from '$component/page/supporting-document/CountryFilter.svelte';

    // -- VARIABLES

    export let title = '';
    export let countryCode = '';
    export let countryName = '';
    export let isOpen = false;
</script>

<style lang="stylus">
    // -- CLASSES

    .country-modal-content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }
</style>

<ModalRoot isOpen={ isOpen } >
    <ModalHeader title={ title } onClose={ () => isOpen = false } />
    <ModalContent>
        <div class="country-modal-content-container">
            <CountryFilter
                bind:countryCode={ countryCode }
                bind:countryName={ countryName }
            />
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton
            variant="light"
            text={ getLocalizedTextBySlug( 'filter-clear-all-button', $languageTagStore ) }
        />
        <ModalButton
            variant="contained"
            text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
            on:click={ () => isOpen = false }
        />
    </ModalActions>
</ModalRoot>

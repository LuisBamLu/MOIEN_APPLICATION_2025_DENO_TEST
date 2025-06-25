<script>
    // -- IMPORTS

    import { getLocalizedText,getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import InputModal from '$component/element/InputModal.svelte';
    import { enableScroll } from '$lib/scroll';

    // -- VARIABLES

    export let documentTypeArray;
    export let documentTypeId;
    let selectedDocumentTypeId = documentTypeId;
    let documentTypeName = null;
    let selectedDocumentName = documentTypeName;
    let isEditing = false;

    // -- FUNCTIONS

    function save(
        )
    {
        documentTypeId = selectedDocumentTypeId;
        documentTypeName = selectedDocumentName;
        isEditing = false;

        enableScroll();
    }

    // ~~

    function clear(
        )
    {
        documentTypeId = null;
        selectedDocumentTypeId = null;
        documentTypeName = null;
        selectedDocumentName = null;
    }
</script>

<Accordion
    label={ getLocalizedTextBySlug( 'supporting-documents-page-type-of-document', $languageTagStore ) }
    helper={ getLocalizedTextBySlug( 'supporting-documents-page-specify-type-of-document', $languageTagStore ) }
    value=
        {
            getLocalizedText( documentTypeName ?? '', $languageTagStore ) === ''
            ? null
            : getLocalizedText( documentTypeName, $languageTagStore )
        }
    closeOnValueChange={ false }
    bind:isEditing={ isEditing }
>
    <InputModal
        heading={ getLocalizedTextBySlug( 'supporting-documents-page-type-of-document', $languageTagStore ) }
        clear={ clear }
        save={ save }
        bind:isEditing={ isEditing }
    >
        <div class="document-type-radio-group">
            {#each documentTypeArray as documentType }
                <label class="radio-input-container">
                    <input
                        type="radio"
                        name="type-id"
                        value={ documentType.id }
                        bind:group={ selectedDocumentTypeId }
                        on:change={ () => selectedDocumentName = documentType.name }
                    />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedText( documentType.name, $languageTagStore ) }
                    </div>
                </label>
            {/each}
        </div>
    </InputModal>
</Accordion>

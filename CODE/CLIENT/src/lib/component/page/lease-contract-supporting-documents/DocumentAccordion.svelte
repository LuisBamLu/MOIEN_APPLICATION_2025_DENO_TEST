<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';
    import DocumentModal from '$component/page/lease-contract-supporting-documents/DocumentModal.svelte';

    // -- VARIABLES

    export let documentTypeByIdMap;
    export let document;
    let isOpen = false;

    // -- FUNCTIONS

    function getActionLabelFromDocumentStatus(
        documentStatus
        )
    {
        let actionLabelSlug = '';

        switch ( documentStatus )
        {
            case 'pending':
                actionLabelSlug = 'lease-contract-supporting-documents-page-verify-label';
                break;
            case 'accepted':
                actionLabelSlug = 'lease-contract-supporting-documents-page-view-label';
                break;
            case 'declined':
                actionLabelSlug = 'lease-contract-supporting-documents-page-rejected-label';
                break;
            default:
                actionLabelSlug = 'lease-contract-supporting-documents-page-not-sent-label';
                break;
        }

        return getLocalizedTextBySlug( actionLabelSlug, $languageTagStore );
    }

    // ~~

    function getIconClassFromDocumentStatus(
        documentStatus
        )
    {
        let iconClass = '';

        switch ( documentStatus )
        {
            case 'accepted':
                iconClass = 'accepted-icon';
                break;
            case 'declined':
                iconClass = 'declined-icon';
                break;
            case 'pending':
            default:
                iconClass = 'pending-icon';
        }

        iconClass += ' size-150';
        return iconClass;
    }

    // -- STATEMENTS

</script>

<Accordion
    label={ getLocalizedText( documentTypeByIdMap[ document.typeId ]?.name ?? '', $languageTagStore ) }
    iconClass={ getIconClassFromDocumentStatus( document.validationStatusId ) }
    actionLabel={ getActionLabelFromDocumentStatus( document.validationStatusId ) }
    isEditable=
        {
            !document.validationStatusId
            || document.validationStatusId === 'declined'
            ? false
            : true
        }
    bind:isEditing={ isOpen }
>
    {#if document.validationStatusId === 'pending' || document.validationStatusId === 'accepted' }
        <DocumentModal
            document={ document }
            documentTypeByIdMap={ documentTypeByIdMap }
            bind:isOpen={ isOpen }
        />
    {/if}
</Accordion>

<script>
    // -- IMPORTS

    import { documentArrayStore } from '$store/documentStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Table from '$component/element/table/Table.svelte';
    import TableTitle from '$component/element/table/TableTitle.svelte';
    import TableHead from '$component/element/table/TableHead.svelte';
    import TableBody from '$component/element/table/TableBody.svelte';
    import DocumentItem from './DocumentItem.svelte';

    // -- VARIABLES

    const tableHeaderArray =
    [
        { name: getLocalizedText( 'Document¨fr:Document¨de:Dokument', $languageTagStore ) },
        { name: getLocalizedText( 'Name¨fr:Nom¨de:Name', $languageTagStore ) },
        { name: getLocalizedText( 'Owner¨fr:Propriétaire¨de:Eigentümer', $languageTagStore ) },
        { name: getLocalizedText( 'Localization¨fr:Localisation¨de:Lokalisierung', $languageTagStore ) },
        { name: getLocalizedText( 'Status¨fr:Statut¨de:Status', $languageTagStore ) },
        { name: getLocalizedText( 'Creation date¨fr:Date de création¨de:Datum der Erstellung', $languageTagStore ) },
        { name: getLocalizedText( 'Update date¨fr:Date de mise à jour¨de:Datum der Aktualisierung', $languageTagStore ) }
    ];
</script>

<section class="document-list padding-50">
    <Table>
        <TableTitle
            tableRowCount={ $documentArrayStore.length }
            title={ getLocalizedTextBySlug( 'admin-menu-documents-list-label', $languageTagStore ) }
        />
        <TableHead
            headerColumnArray={ tableHeaderArray }
        />
        <TableBody>
            {#each $documentArrayStore as document }
                <DocumentItem document={ document } />
            {/each}
        </TableBody>
    </Table>
</section>

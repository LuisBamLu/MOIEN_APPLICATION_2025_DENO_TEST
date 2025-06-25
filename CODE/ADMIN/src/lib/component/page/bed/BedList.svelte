<script>
    // -- IMPORTS

    import { bedArrayStore } from '$store/bedArrayStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Table from '$component/element/table/Table.svelte';
    import TableTitle from '$component/element/table/TableTitle.svelte';
    import TableHead from '$component/element/table/TableHead.svelte';
    import TableBody from '$component/element/table/TableBody.svelte';
    import BedItem from './BedItem.svelte';

    // -- VARIABLES

    const tableHeaderArray =
    [
        { name: getLocalizedText( 'Bed¨fr:Lit¨de:Bett', $languageTagStore ) },
        { name: getLocalizedText( 'Property¨fr:Propriété¨de:Eigentum', $languageTagStore ) },
        { name: getLocalizedText( 'Space¨fr:Espace¨de:Platz', $languageTagStore ) },
        { name: getLocalizedText( `Type¨fr:Type d'espace¨de:Typ`, $languageTagStore ) },
        { name: getLocalizedText( 'Capacity¨fr:Capacité¨de:Kapazität', $languageTagStore ) },
        { name: getLocalizedText( 'Count¨fr:Compter¨de:Anzahl', $languageTagStore ) },
        { name: getLocalizedText( 'Owner¨fr:Propriétaire¨de:Eigentümer', $languageTagStore ) }
    ];
</script>

<section class="bed-list padding-50">
    <Table>
        <TableTitle
            tableRowCount={ $bedArrayStore.length }
            title={ getLocalizedTextBySlug( 'admin-menu-beds-list-label', $languageTagStore ) }
        />
        <TableHead
            headerColumnArray={ tableHeaderArray }
        />
        <TableBody>
            {#each $bedArrayStore as bed }
                <BedItem bed={ bed } />
            {/each}
        </TableBody>
    </Table>
</section>

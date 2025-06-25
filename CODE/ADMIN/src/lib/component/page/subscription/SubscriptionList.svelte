<script>
    // -- IMPORTS

    import { subscriptionArrayStore } from '$store/subscriptionArrayStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Table from '$component/element/table/Table.svelte';
    import TableTitle from '$component/element/table/TableTitle.svelte';
    import SubscriptionItem from './SubscriptionItem.svelte';
    import TableHead from '$component/element/table/TableHead.svelte';
    import TableBody from '$component/element/table/TableBody.svelte';

    // -- VARIABLES

    const tableHeaderArray =
    [
        { name: getLocalizedText( 'Status¨fr:Statut¨de:Status', $languageTagStore ) },
        { name: getLocalizedText( 'Type¨fr:Type¨de:Typ', $languageTagStore ) },
        { name: getLocalizedText( 'Provider¨fr:Fournisseur¨de:Anbieter', $languageTagStore ) },
        { name: getLocalizedText( 'Consumer¨fr:Consommateur¨de:Verbraucher', $languageTagStore ) }
    ];
</script>

<section class="subscription-list padding-50">
    <Table>
        <TableTitle
            tableRowCount={ $subscriptionArrayStore.length }
            title={ getLocalizedTextBySlug( 'admin-menu-subscription-list-label', $languageTagStore ) }
        />
        <TableHead headerColumnArray={ tableHeaderArray }/>
        <TableBody>
            {#each $subscriptionArrayStore as subscription }
                <SubscriptionItem subscription={ subscription } />
            {/each}
        </TableBody>
    </Table>
</section>

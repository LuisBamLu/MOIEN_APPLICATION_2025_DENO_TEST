<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { cancellationPolicyArrayStore, isCancellationPolicyLoading } from '$store/cancellationPolicyStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Table from '$component/element/table/Table.svelte';
    import TableBody from '$component/element/table/TableBody.svelte';
    import TableFoot from '$component/element/table/TableFoot.svelte';
    import TableHead from '$component/element/table/TableHead.svelte';
    import TablePagination from '$component/element/table/TablePagination.svelte';
    import TableTitle from '$component/element/table/TableTitle.svelte';
    import TableRow from '$component/element/table/TableRow.svelte';
    import CancellationPolicyItem from './CancellationPolicyItem.svelte';
    import { getFilteredArray, getFilterParameterByKeyMap } from '$lib/base';
    import { urlParamsStore } from '$store/urlParamsStore';

    // -- CONSTANTS

    const tableTitle = getLocalizedText( `Cancellation Policy¨frd'Annulation¨de¨ptítica de Cancelamento`, $languageTagStore );
    const headerColumnArray =
        [
            { name : getLocalizedText( 'Name¨fr:Nom¨de:Name', $languageTagStore ) },
            { name : getLocalizedText( 'Number¨fr:Nombre¨de:Nummer', $languageTagStore ) },
            { name : getLocalizedText( 'Partial Refund Min. (Days)¨frPartiel Min. (Jours)¨deErstattung Min. (Tage)¨ptParcial Min. (Dias)', $languageTagStore ) },
            { name : getLocalizedText( 'Partial Refund Ratio¨frde Remboursement Partiel¨deErstattung Verhältnis¨ptção de Reembolso Parcial', $languageTagStore ) },
            { name : getLocalizedText( 'Full Refund Min. (Days)¨frTotal Min. (Jours)¨deErstattung Min. (Tage)¨ptTotal Min. (Dias)', $languageTagStore ) },
            { name : getLocalizedText( 'Penalty (Days)¨frénalité (Jours)¨de(Tage)¨pt(Dias)', $languageTagStore ) }
        ];

    // -- VARIABLES

    /** @type {{filterParameterByKeyMap: any}} */
    let { filterParameterByKeyMap = $bindable() } = $props();
    let cancellationPolicyArray = $state([]);
    let indexAccordionOpen = $state(null);
    let cancellationPolicyCount = Array.isArray( $cancellationPolicyArrayStore ) ? $cancellationPolicyArrayStore.length : 0;

    // -- FUNCTIONS

    function handleOpenAccordionByIndex(
        index
        )
    {
        indexAccordionOpen = index === indexAccordionOpen ? null : index;
    }

    run(() => {
        if ( !$isCancellationPolicyLoading)
        {
            cancellationPolicyArray = $cancellationPolicyArrayStore;

            filterParameterByKeyMap = getFilterParameterByKeyMap( filterParameterByKeyMap, $urlParamsStore );

            cancellationPolicyArray = getFilteredArray( cancellationPolicyArray, $urlParamsStore, filterParameterByKeyMap );

            $cancellationPolicyArrayStore = cancellationPolicyArray;
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES
</style>

<div class="padding-50">
    <Table>
        <TableTitle tableRowCount={ cancellationPolicyCount } title={ tableTitle }/>
        <TableHead headerColumnArray={ headerColumnArray }/>
        <TableBody>
            {#if $isCancellationPolicyLoading }
                {#each Array.from( { length : 5 } ) as _ }
                    <TableRow>
                        <td colspan="5">
                            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                        </td>
                    </TableRow>
                {/each}
            {:else}
                {#each $cancellationPolicyArrayStore as cancellationPolicy, index }
                    <CancellationPolicyItem { cancellationPolicy } isOpen={ indexAccordionOpen === index } on:click={ () => handleOpenAccordionByIndex( index ) }/>
                {/each}
            {/if}
        </TableBody>
    </Table>
</div>

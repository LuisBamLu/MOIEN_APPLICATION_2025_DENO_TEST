<script>
    // -- IMPORTS

    import Table from '$component/page/payment/Table.svelte'
    import TableBody from './table/TableBody.svelte';
    import TableHead from '$component/page/payment/TableHead.svelte';
    import TableTitle from './table/TableTitle.svelte';
    import TableRow from './table/TableRow.svelte';
    import TableCell from '$component/page/payment/TableCell.svelte';
    import { getLocalizedText, getLocalizedTextBySlug, isBoolean, isNumber } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{title?: string, rowArray?: any, selectedRowIndex?: any, onNearBottom?: any, isLoading?: boolean}} */
    let {
        title = '',
        rowArray = $bindable([]),
        selectedRowIndex = $bindable(null),
        onNearBottom = () => {},
        isLoading = false
    } = $props();

    // -- FUNCTIONS

    function getColumnHeaderArrayFromRowArray(
        rowArray
        )
    {
        let columnHeaderArray = [];

        if ( rowArray.length )
        {
            for ( let columnName of Object.keys( rowArray[ 0 ] ) )
            {
                columnHeaderArray.push( { name: columnName } );
            }
        }

        return columnHeaderArray;
    }

    // ~~

    function handleClickRow(
        rowIndex
        )
    {
        if ( selectedRowIndex === rowIndex )
        {
            selectedRowIndex = null;
        }
        else
        {
            selectedRowIndex = rowIndex;
        }
    }

    // ~~

    function handleSort(
        columnName
        )
    {
        if ( isNumber( rowArray[ 0 ][ columnName ] ) )
        {
            rowArray.sort( ( a, b ) => a[ columnName ] - b[ columnName ] );
        }
        else if ( isBoolean( rowArray[ 0 ][ columnName ] ) )
        {
            rowArray.sort( ( a, b ) => Number( a[ columnName ] - Number( b[ columnName ] ) ) );
        }
        else
        {
            rowArray.sort( ( a, b ) => ( a[ columnName ] ?? '' ).localeCompare( b[ columnName ] ?? '' ) );
        }

        rowArray = rowArray;
    }

    let columnHeaderArray = $derived(getColumnHeaderArrayFromRowArray( rowArray ) ?? []);
</script>

<Table onNearBottom={ onNearBottom } >
    <TableTitle tableRowCount={ rowArray.length } title={ title } />
    <TableHead headerColumnArray={ columnHeaderArray } handleSort={ handleSort } />
    <TableBody>
        {#each rowArray as row, rowIndex }
            <TableRow on:click={ () => handleClickRow( rowIndex ) }>
                {#each Object.values( row ) as fieldValue }
                    <TableCell>{ fieldValue }</TableCell>
                {/each}
            </TableRow>
        {/each}
        {#if isLoading }
            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
        {/if}
    </TableBody>
</Table>

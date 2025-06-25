<script>

    // -- IMPORTS

    import { getLocalizedText, isBoolean, isNumber } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AdminTableHead from './AdminTableHead.svelte';
    import AdminTableRow from './AdminTableRow.svelte';
    import Checkbox from '../Checkbox.svelte';
    import AdminTableCell from './AdminTableCell.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import { useIntersectionObserver } from '$lib/intersection_observer';

    // -- VARIABLES

    /** @type {{rowArray?: any, columnHeaderArray?: any, handleClick: any}} */
    let { rowArray = $bindable([]), columnHeaderArray = [], handleClick } = $props();
    let dispatch = createEventDispatcher();
    let
    {
        handleObserver,
        bottomElement,
        page,
        handleStopObserving,
        setBottomElement
    } = $state(useIntersectionObserver( () => dispatch( 'nearBottom', { page : $page } ) ));

    // -- FUNCTIONS

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

    // -- STATEMENTS

    onMount(
        () =>
        {
            setBottomElement( bottomElement );

            handleObserver();

            return () => handleStopObserving();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    tbody
    {
        +media( smaller-48em )
        {
            display: block;
        }
    }

    // -- CLASSES

    .admin-table
    {
        overflow-y: auto;
        overflow-x: auto;
        max-height: 60vh;
        width: 100%;
        border-radius: 0.5rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        text-align: left;
    }

    .admin-table table
    {
        position: relative;

        width: 100%;
        border-collapse: collapse;

        background-color: white;
    }

    td
    {
        height: 0.5rem;
        padding: 0 0.5rem;
    }
</style>

<section class="admin-table">
    <table>
        <AdminTableHead headerColumnArray={ columnHeaderArray } handleSort={ handleSort }/>
        <tbody>
            {#each rowArray as row }
                <AdminTableRow>
                    <td>
                        <Checkbox name='selected-row'/>
                    </td>
                    {#each Object.values( row ) as fieldValue, fieldIndex }
                        <AdminTableCell handleClick={ () => handleClick( row ) } title={ columnHeaderArray[ fieldIndex ] }>
                            { getLocalizedText( fieldValue?.toString() ?? '', $languageTagStore ) }
                        </AdminTableCell>
                    {/each}
                </AdminTableRow>
            {/each}

            <tr bind:this={ bottomElement } style="height: 0.1em;border: 1px solid transparent;"></tr>
        </tbody>
    </table>
</section>

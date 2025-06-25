<script>
    // -- IMPORTS

    import CategoryView from './CategoryView.svelte';
    import { getLocalizedText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { slide } from 'svelte/transition';
    import TableCell from '$component/element/table/TableCell.svelte';
    import TableRow from '$component/element/table/TableRow.svelte';

    // -- VARIABLES

    /** @type {{category: any, isOpen?: boolean}} */
    let { category, isOpen = false } = $props();

    // -- FUNCTIONS

    function formatDate(
        date
        )
    {
        return new Date( date ).toLocaleDateString( $languageTagStore, { dateStyle : 'medium' } );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES
</style>

<TableRow on:click>
    <TableCell>{ category.id }</TableCell>
    <TableCell>{ category.number }</TableCell>
    <TableCell>{ getLocalizedText( category.name, $languageTagStore ) }</TableCell>
    <TableCell>{ formatDate( category.creationTimestamp ) }</TableCell>
    <TableCell>{ formatDate( category.updateTimestamp ) }</TableCell>
</TableRow>

{#if isOpen }
    <tr transition:slide>
        <td colspan="5" class="padding-100">
            <CategoryView { category }/>
        </td>
    </tr>
{/if}

<script>
    // -- IMPORTS

    import CategoryItem from './CategoryItem.svelte';
    import { articleCategoryArrayStore, isLoadingArticleCategory } from '$store/articleCategoryArrayStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Table from '$component/element/table/Table.svelte';
    import TableBody from '$component/element/table/TableBody.svelte';
    import TableFoot from '$component/element/table/TableFoot.svelte';
    import TableHead from '$component/element/table/TableHead.svelte';
    import TablePagination from '$component/element/table/TablePagination.svelte';
    import TableTitle from '$component/element/table/TableTitle.svelte';
    import TableRow from '$component/element/table/TableRow.svelte';

    // -- CONSTANTS

    const tableTitle = getLocalizedText( `Article categories¨fr:Catégories d'articles¨de:Artikel-Kategorien`, $languageTagStore );
    const headerColumnArray =
        [
            { name : 'Id' },
            { name : getLocalizedText( 'Number¨fr:Nombre¨de:Nummer', $languageTagStore ) },
            { name : getLocalizedText( 'Name¨fr:Nom¨de:Name', $languageTagStore ) },
            { name : getLocalizedText( 'Created at¨fr:Créé à¨de:Erstellt am', $languageTagStore ) },
            { name : getLocalizedText( 'Updated at¨fr:Mise à jour à¨de:Aktualisiert am', $languageTagStore ) }
        ];

    // -- VARIABLES

    let indexAccordionOpen = $state(null);
    let categoryCount = Array.isArray( $articleCategoryArrayStore ) ? $articleCategoryArrayStore.length : 0;

    // -- FUNCTIONS

    function handleOpenAccordionByIndex(
        index
        )
    {
        indexAccordionOpen = index === indexAccordionOpen ? null : index;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES
</style>

<div class="padding-50">
    <Table>
        <TableTitle tableRowCount={ categoryCount } title={ tableTitle }/>
        <TableHead headerColumnArray={ headerColumnArray }/>
        <TableBody>
            {#if $isLoadingArticleCategory }
                {#each Array.from( { length : 5 } ) as _ }
                    <TableRow>
                        <td colspan="5">
                            { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
                        </td>
                    </TableRow>
                {/each}
            {:else}
                {#each $articleCategoryArrayStore as category, index }
                    <CategoryItem { category } isOpen={ indexAccordionOpen === index } on:click={ () => handleOpenAccordionByIndex( index ) }/>
                {/each}
            {/if}
        </TableBody>
    </Table>
</div>

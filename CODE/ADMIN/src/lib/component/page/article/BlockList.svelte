<script>
    // -- IMPORTS

    import SortableList from '../../element/SortableList.svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import { blockArrayStore } from '$store/blockArrayStore';
    import { blockTypeArrayStore } from '$store/blockTypeArrayStore';
    import { fetchData } from '$lib/base';
    import { onMount } from 'svelte';
    import { toast } from '$lib/toast';
    import BlockItem from './BlockItem.svelte';
    import { getLocalizedTextBySlug, getJsonObject, getJsonText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{articleId: any, blockIdArray?: any, isAddBlockAccordionOpen?: boolean}} */
    let { articleId, blockIdArray = $bindable([]), isAddBlockAccordionOpen = $bindable(false) } = $props();
    let isLoading = $state(true);

    // -- FUNCTIONS

    function getInitialBlockState(
        )
    {
        return (
            {
                id: '',
                articleId: articleId,
                typeId: 'text',
                title: '',
                teaser: '',
                text: '',
                imagepath: ''
            }
            );
    }

    function deleteBlockFromArray(
        blockId
        )
    {
        $blockArrayStore = $blockArrayStore.filter( ( block ) => block.id !== blockId );
        blockIdArray = blockIdArray.filter( ( id ) => id !== blockId );
    }

    // ~~

    function updateBlockArray(
        _block
        )
    {
        $blockArrayStore = $blockArrayStore.map(
            ( currentBlock ) =>
                currentBlock.id === _block.id
                ? _block
                : currentBlock
            );

        let blockAlreadyExists = $blockArrayStore.findIndex( block => block.id === _block.id );

        if ( blockAlreadyExists === -1 )
        {
            $blockArrayStore.push( _block );
        }

        if ( !blockIdArray.includes( _block.id ) )
        {
            blockIdArray.push( _block.id );
        }

        isAddBlockAccordionOpen = false;
    }

    // ~~

    async function handleSortBlockArray(
        )
    {
        let formData = new FormData();

        formData.append( 'blockIdArray', getJsonText( blockIdArray ) );
        formData.append( 'type', 'sortBlockIdArrayByArticleId' );

        let response = await fetchData(
            '/api/blog/articles/sort-block-by-article-id/' + articleId,
            {
                method: 'POST',
                body : formData,
                credentials: 'include'
            }
            );
    }

    // ~~

    function arrayMove(
        orig,
        fromIndex,
        toIndex
        )
    {
        let arr = getJsonObject( getJsonText( orig ) );
        var element = arr[ fromIndex ];
        arr.splice( fromIndex, 1 );
        arr.splice( toIndex, 0, element );

        return arr;
    }

    // ~~

    async function handleSort(
        event
        )
    {
        blockIdArray =
            arrayMove(
                [ ...blockIdArray ],
                event.oldIndex,
                event.newIndex
                );

        await handleSortBlockArray();
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let blockTypePromise = fetchData(
                    '/api/blog/block-type/get',
                    {
                        method : 'POST',
                        body :
                            JSON.stringify(
                                {
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                let blockArrayPromise = fetchData(
                    '/api/blog/blocks/get-by-article-id/' + articleId,
                    {
                        method : 'POST',
                        body :
                            JSON.stringify(
                                {
                                    type: 'getBlockArrayByArticleId'
                                }
                            ),
                        headers:
                        {
                            'Content-Type': 'application/json'
                        }
                    }
                    );

                let [ blockTypeResponse, blockArrayResponse ] = await Promise.all( [ blockTypePromise, blockArrayPromise ] );

                let orderedBlockArray = blockIdArray
                    .map( blockId => blockArrayResponse.blockArray.find( block => block.id === blockId ) )
                    .filter( block => block !== undefined );
                let blockNotFoundInBlockIdArray = blockArrayResponse.blockArray.filter(
                    block => !blockIdArray.includes( block.id )
                    );

                $blockArrayStore = [ ...orderedBlockArray, ...blockNotFoundInBlockIdArray ];
                $blockTypeArrayStore = blockTypeResponse.blockTypeArray;

                blockIdArray = $blockArrayStore.map( block => block.id );
            }
            catch ( error )
            {
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- STYLES
</style>

{#if isLoading }
    <div class="hourglass">{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}
    {#if isAddBlockAccordionOpen }
        <BlockItem
            block={ getInitialBlockState() }
            isEditing={ true }
            bind:isNewBlock={ isAddBlockAccordionOpen }
            updateBlockArray={ updateBlockArray }
            deleteBlockFromArray={ deleteBlockFromArray }
        />
    {/if}
    <SortableList
        class=""
        onSort={ handleSort }
    >
        {#each $blockArrayStore as block ( block.id ) }
            <BlockItem
                block={ block }
                updateBlockArray={ updateBlockArray }
                deleteBlockFromArray={ deleteBlockFromArray }
            />
        {/each}
    </SortableList>
{/if}

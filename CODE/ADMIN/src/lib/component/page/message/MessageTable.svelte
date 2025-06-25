<script>

    // -- IMPORTS

    import { getLocalizedText, isBoolean, isNumber } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AdminTableHead from '$component/element/AdminTable/AdminTableHead.svelte';
    import AdminTableRow from '$component/element/AdminTable/AdminTableRow.svelte';
    import Checkbox from '$component/element/Checkbox.svelte';
    import AdminTableCell from '$component/element/AdminTable/AdminTableCell.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import ProfileCard from './ProfileCard.svelte';
    import PropertyCard from './PropertyCard.svelte';

    // -- VARIABLES

    /** @type {{conversationArray?: any, filterParameterByKeyMap?: any, selectedConversation?: any}} */
    let {
            conversationArray = $bindable([]),
            filterParameterByKeyMap = {},
            selectedConversation = $bindable(null)
        } = $props();
    let columnHeaderArray = $state([]);
    let dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleSort(
        columnName
        )
    {
        if ( isNumber( conversationArray[ 0 ][ columnName ] ) )
        {
            conversationArray.sort( ( a, b ) => a[ columnName ] - b[ columnName ] );
        }
        else if ( isBoolean( conversationArray[ 0 ][ columnName ] ) )
        {
            conversationArray.sort( ( a, b ) => Number( a[ columnName ] - Number( b[ columnName ] ) ) );
        }
        else
        {
            conversationArray.sort( ( a, b ) => ( a[ columnName ] ?? '' ).localeCompare( b[ columnName ] ?? '' ) );
        }

        conversationArray = conversationArray;
    }

    // ~~

    function handleScroll(
        event
        )
    {
        let isNearBottom = event.target.scrollTop + event.target.clientHeight + 5 >= event.target.scrollHeight;

        if ( isNearBottom )
        {
            dispatch( 'nearBottom' );
        }
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            for ( let filterParameter of Object.values( filterParameterByKeyMap ) )
            {
                columnHeaderArray.push( getLocalizedText( filterParameter.name, $languageTagStore ) );
            }

            columnHeaderArray = columnHeaderArray;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .admin-table
    {
        overflow-y: auto;
        overflow-x: auto;
        max-height: calc( 100dvh - 9vh - 10rem );
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

<section class="admin-table" onscrollend={( event ) => handleScroll( event )}>
    <table>
        <AdminTableHead headerColumnArray={ columnHeaderArray } handleSort={ handleSort }/>
        <tbody >
            {#each conversationArray as conversation }
                <AdminTableRow>
                    <td>
                        <Checkbox name='selected-row'/>
                    </td>
                    {#each Object.entries( filterParameterByKeyMap ) as [ filterParameterKey, filterParameter ] }
                        <AdminTableCell handleClick={ () => selectedConversation = conversation }>
                            {#if filterParameter.type === 'profile' }
                                <ProfileCard profile={ conversation[ filterParameterKey ] } />
                            {:else if filterParameter.type === 'property' }
                                <PropertyCard property={ conversation[ filterParameterKey ] } />
                            {:else if filterParameterKey === 'type' }
                                { getLocalizedText( conversation.type.name, $languageTagStore ) }
                                {:else}
                                { getLocalizedText( ( conversation[ filterParameterKey ] ?? '' ), $languageTagStore ) }
                            {/if}
                        </AdminTableCell>
                    {/each}
                </AdminTableRow>
            {/each}
        </tbody>
    </table>
</section>

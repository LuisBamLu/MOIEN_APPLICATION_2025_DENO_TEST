<script>

    // -- IMPORTS

    import { getLocalizedText, isArray, isBoolean, isNumber } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AdminTableHead from './AdminTableHead.svelte';
    import AdminTableRow from './AdminTableRow.svelte';
    import Checkbox from '$component/element/Checkbox.svelte';
    import AdminTableCell from './AdminTableCell.svelte';
    import { createEventDispatcher, onMount } from 'svelte';
    import { formatDate, getFormattedPrice, isValidColor } from '$lib/base';
    import { useIntersectionObserver } from '$lib/intersection_observer';
    import Switch from '../Switch.svelte';
    import UserInfoCell from '../UserInfoCell.svelte';
    import PropertyCard from '../../page/message/PropertyCard.svelte';
    import Status from '../Status.svelte';
    import Rating from '../Rating.svelte';

    // -- VARIABLES

    /** @type {{config?: any, handleClick: any}} */
    let { config = $bindable({}), handleClick } = $props();
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
        if ( isNumber( config.dataArray[ 0 ][ columnName ] ) )
        {
            config.dataArray.sort( ( a, b ) => a[ columnName ] - b[ columnName ] );
        }
        else if ( isBoolean( config.dataArray[ 0 ][ columnName ] ) )
        {
            config.dataArray.sort( ( a, b ) => Number( a[ columnName ] - Number( b[ columnName ] ) ) );
        }
        else
        {
            config.dataArray.sort( ( a, b ) => ( a[ columnName ] ?? '' ).localeCompare( b[ columnName ] ?? '' ) );
        }

        config.dataArray = config.dataArray;
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

    td
    {
        height: 0.5rem;
        padding: 0 0.5rem;
    }

    // -- CLASSES

    .admin-table
    {
        overflow-y: auto;
        overflow-x: auto;
        max-height: calc( 100dvh - 18.4vh - 3.875rem );
        width: 100%;
        border-radius: 0.5rem;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        text-align: left;

        +media( desktop )
        {
            max-height: calc( 100dvh - 18.4vh - 4.0625rem );
        }
    }

    .admin-table table
    {
        position: relative;

        width: 100%;
        border-collapse: collapse;

        background-color: white;
    }

    .box-color
    {
        height: 1em;
        width: 1em;
        border: 1px solid grayColor100;
    }

    .box-container
    {
        display: flex;
        gap: 0.5em;
        align-items: center;

        +media( smaller-48em )
        {
            justify-content: flex-end;
        }
    }
</style>

<section class="admin-table">
    <table>
        <AdminTableHead headerColumnArray={ config.headerArray.map( ( { label } ) => label ) } handleSort={ handleSort }/>
        <tbody >
            {#each config.dataArray as row }
                <AdminTableRow>
                    <td>
                        <Checkbox name='selected-row'/>
                    </td>

                    {#each config.headerArray as { type, label, key } }
                        {#if type === 'element' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label } --table-cell-max-width="fit-content">
                                {@const SvelteComponent = row[ key ]?.component}
                                <SvelteComponent { ...row[ key ]?.propMap }/>
                            </AdminTableCell>
                        {:else if type === 'tag' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                {#if isArray( row[ key ] )}
                                    {#each row[ key ] as item }
                                        <Status
                                            name={ item.name }
                                            color="green"
                                        />
                                    {/each}
                                {:else}
                                    <Status
                                        name={ row[ key ] }
                                        color="green"
                                    />
                                {/if}
                            </AdminTableCell>
                        {:else if type === 'rating' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label } --table-cell-max-width="15rem">
                                <div class="box-container">
                                    <Rating rating={ row[ key ] } size={ 20 }/>
                                </div>
                            </AdminTableCell>
                        {:else if type === 'color' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                {#if isValidColor( row[ key ]?.toString() ) }
                                    <div class="box-container">
                                        <div class="box-color" style="background:{ row[ key ]?.toString() };"></div>
                                        { getLocalizedText( row[ key ]?.toString() ?? '', $languageTagStore ) }
                                    </div>
                                {:else}
                                    { getLocalizedText( 'invalid-color-label', $languageTagStore ) }
                                {/if}
                            </AdminTableCell>
                        {:else if type === 'boolean' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                <Switch
                                    bind:value={ row[ key ] }
                                    disabled
                                />
                            </AdminTableCell>
                        {:else if type === 'amount' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                {#if row[ key ] === null || row[ key ] === undefined }
                                    { getFormattedPrice( 0 ) }
                                {:else}
                                    { getFormattedPrice( row[ key ] ) }
                                {/if}
                            </AdminTableCell>
                        {:else if type === 'date' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                { formatDate( row[ key ] ) || '' }
                            </AdminTableCell>
                        {:else if type === 'profile' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                {#if row[ key ] === null || row[ key ] === undefined }
                                    No profile found
                                {:else}
                                    <UserInfoCell
                                        userName={ [ row[ key ].firstName, row[ key ].lastName ].join( ' ' ) }
                                        email={ row[ key ].email }
                                        imagePath={ row[ key ].imagePath }
                                    />
                                {/if}
                            </AdminTableCell>
                        {:else if type === 'property' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                <PropertyCard
                                    property={ row[ key ] }
                                />
                            </AdminTableCell>
                        {:else if type === 'timestamp' }
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                {  formatDate( row[ key ] ) }
                            </AdminTableCell>
                        {:else}
                            <AdminTableCell handleClick={ () => handleClick( row ) } title={ label }>
                                { getLocalizedText( row[ key ]?.toString() ?? '' ) }
                            </AdminTableCell>
                        {/if}
                    {/each}
                </AdminTableRow>
            {/each}

            <tr bind:this={ bottomElement } style="height: 0.1em;border: 1px solid transparent;"></tr>
        </tbody>
    </table>
</section>

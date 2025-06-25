<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { createEventDispatcher } from 'svelte';

    // -- CONSTANTS

    const dispatch = createEventDispatcher();

    // -- VARIABLES

    export let itemsString = '';
    export let placeholder = '';
    export let name = '';
    export let isMultiLine = false;
    export let languageArray;

    let itemsToExport ='';
    let showAddNew = false;
    let usedLanguages = new Set();
    let allLanguagesUsed = false;

    if ( !itemsString )
    {
        itemsString = '';
    }

    let items =
        itemsString.split( '¨' )
        .reduce(
            ( accumulator, currentValue, index ) =>
            {
                if ( index === 0 )
                {
                    accumulator[ 'default' ] = currentValue;
                }
                else
                {
                    const [ key, value ] = currentValue.split( ':' );
                    accumulator[ key ] = value;
                }

                return accumulator;
            },
            {}
            );

    // -- FUNCTIONS

    function addNewItem(
        langCode
        )
    {
        if ( !Object.keys( items ).includes( langCode ) )
        {
            items = { ...items, [ langCode ]: "" };
        }
    }

    // ~~

    function deleteItem(
        itemKey
        )
    {
        delete items[ itemKey ];
        items = { ...items };
    }

    // -- STATEMENTS
    $:
    {
        itemsToExport = Object.entries( items )
            .map( ( [ key, value ] ) => key === 'default' ? value : `¨${key}:${value}` )
            .join( '' );
    }

    // ~~

    $:
    {
        usedLanguages.clear();

        for ( let key of Object.keys( items ) )
        {
            usedLanguages.add( key );
        }

        allLanguagesUsed = usedLanguages.size >= languageArray.length;
    }

    // ~~

    $:
    {
        dispatch( 'update', { text: itemsToExport } );
    }

</script>

<style lang="stylus">
    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    .language-container
    {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .language-container button
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
        align-items: center;

        background-color: grayColor950;

        white-space: nowrap;

        cursor: pointer;
        transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
    }

    .language-container button:hover,
    {
        border: 2px solid greenColor900;

        background-color: greenColor950;

        color: greenColor;

        transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
    }

    .input-container
    {
        display: flex;
        gap: 1rem;
        align-items: center;
    }

    .input-item
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }

    .input-item-language
    {
        height: 3rem;
        width: 3rem;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor;

        text-transform: uppercase;
    }

    .input-item-button
    {
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
    }
</style>

{#each Object.entries( items ) as [ lang ] }
    <div class="input-container">
        {#if isMultiLine }
            <div class="input-item">
                {#if lang !== 'default' }
                    <div class="font-size-75 font-weight-700 color-white input-item-language">{ lang }</div>
                    <button class="input-item-button" on:click|preventDefault={ () => deleteItem( lang ) }>
                        <div class="gray-decrease-icon size-150"/>
                    </button>
                {/if}
                <textarea name={ lang } bind:value={ items[ lang ] } placeholder={ placeholder } />
            </div>
        {:else}
            <div class="input-item">
                {#if lang !== 'default' }
                    <div class="font-size-75 font-weight-700 color-white input-item-language">{ lang }</div>
                    <button class="input-item-button" on:click|preventDefault={ () => deleteItem( lang ) }>
                        <div class="gray-decrease-icon size-150"/>
                    </button>
                {/if}
                <input name={ lang } bind:value={ items[ lang ] } placeholder={ placeholder }/>
            </div>
        { /if}
    </div>
{/each}
{#if showAddNew }
    <div class="language-container">
        {#each languageArray as language }
            {#if !Object.keys( items ).includes( language.code ) }
                <button
                    on:click|preventDefault={ () => { addNewItem( language.code ); showAddNew = false; } }
                    class="font-size-75 font-weight-700 color-black"
                >
                    { getLocalizedText( language.name ) }
                </button>
            { /if}
        {/each}
    </div>
{:else}
    <button class="language-button green-increase-icon size-150" on:click|preventDefault={ () => showAddNew = !showAddNew }/>
{/if}

<input hidden name={ name } bind:value={ itemsToExport }/>

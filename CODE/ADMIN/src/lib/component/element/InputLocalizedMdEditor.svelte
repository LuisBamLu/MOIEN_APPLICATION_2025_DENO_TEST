<script>
    import { run, preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import { createEventDispatcher } from 'svelte';
    import Tooltip from './Tooltip.svelte';
    import IconButton from './IconButton.svelte';
    import MdTextEditor from './MDTextEditor.svelte';

    // -- CONSTANTS

    const dispatch = createEventDispatcher();

    // -- VARIABLES

    /** @type {{itemsString?: string, name?: string, isMultiLine?: boolean, languageArray: any}} */
    let {
        itemsString = $bindable(''),
        name = '',
        isMultiLine = false,
        languageArray
    } = $props();

    let itemsToExport =$state('');
    let showAddNew = $state(false);
    let usedLanguages = new Set();
    let allLanguagesUsed = $state(false);

    if ( !itemsString )
    {
        itemsString = '';
    }

    let items =
        $state(itemsString.split( '¨' )
        .reduce(
            ( accumulator, currentValue, index ) =>
            {
                if ( index === 0 )
                {
                    accumulator[ 'default' ] = currentValue;
                }
                else
                {
                    const [ key, ...valueParts ] = currentValue.split( ':' );
                    const value = valueParts.join( ':' );
                    accumulator[ key ] = value;
                }

                return accumulator;
            },
            {}
            ));

    // -- FUNCTIONS

    function addNewItem(
        langCode
        )
    {
        if ( !Object.keys( items ).includes( langCode ) )
        {
            items = { ...items, [ langCode ]: '' };
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
    run(() => {
        itemsToExport = Object.entries( items )
            .map( ( [ key, value ] ) => key === 'default' ? value : `¨${key}:${value}` )
            .join( '' );
    });

    // ~~

    run(() => {
        usedLanguages.clear();
        for ( let key of Object.keys( items ) )
        {
            usedLanguages.add( key );
        }

        allLanguagesUsed = usedLanguages.size >= languageArray.length;
    });

    // ~~

    run(() => {
        dispatch( 'update', { text: itemsToExport, name } );
    });
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

    .input-file-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<div class="input-file-container">
    {#each Object.entries( items ) as [ lang ] }
        <div class="input-container">
            {#if isMultiLine }
                <div class="input-item">
                    {#if lang !== 'default' }
                        <div class="font-size-75 font-weight-700 color-white input-item-language">{ lang }</div>
                        <button class="input-item-button" onclick={preventDefault(() => deleteItem( lang ))}>
                            <div class="gray-decrease-icon size-150"></div>
                        </button>
                    {/if}
                    <MdTextEditor
                        bind:editorText={ items[ lang ] }
                    />
                </div>
            {:else}
                <div class="input-item">
                    {#if lang !== 'default' }
                        <div class="font-size-75 font-weight-700 color-white input-item-language">{ lang }</div>
                        <Tooltip title="Remove '{ lang.toUpperCase() }' language" placement="bottom">
                            <IconButton on:click={ () => deleteItem( lang ) }>
                                <div class="gray-decrease-icon size-150"></div>
                            </IconButton>
                        </Tooltip>
                    {/if}
                    <MdTextEditor
                        bind:editorText={ items[ lang ] }
                    />
                </div>
            { /if}
        </div>
    {/each}
    {#if showAddNew }
        <div class="language-container">
            {#each languageArray as language }
                {#if !Object.keys( items ).includes( language.code ) }
                    <button
                        onclick={preventDefault(() => { addNewItem( language.code ); showAddNew = false; })}
                        class="font-size-75 font-weight-700 color-black"
                    >
                        { getLocalizedText( language.name ) }
                    </button>
                { /if}
            {/each}
        </div>
    {:else}
        <div>
            <Tooltip title="Add new language">
                <IconButton on:click={ () => showAddNew = !showAddNew }>
                    <div class="language-button green-increase-icon size-150"></div>
                </IconButton>
            </Tooltip>
        </div>
    {/if}

    <input hidden name={ name } bind:value={ itemsToExport }/>
</div>

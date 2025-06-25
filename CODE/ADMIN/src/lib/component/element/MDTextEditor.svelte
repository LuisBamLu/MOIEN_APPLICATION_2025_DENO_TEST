<script>
    // -- IMPORTS

    import Fa from 'svelte-fa';
    import
    {
        faBold,
        faItalic,
        faLink,
        faListUl,
        faSubscript,
        faSuperscript
    } from '@fortawesome/free-solid-svg-icons';

    // -- VARIABLES

    /** @type {{editorText?: string}} */
    let { editorText = $bindable('') } = $props();

    let heading = $state(0);

    // -- FUNCTIONS

    function replaceSelectTextarea(
        textarea,
        action,
        value = 0
        )
    {
        let newText = '';
        let first = textarea.value.slice( 0, textarea.selectionStart );
        let text = textarea.value.slice(textarea.selectionStart, textarea.selectionEnd );
        let rest = textarea.value.slice( textarea.selectionEnd, textarea.value.length );

        switch ( action )
        {
            case 'heading':
                newText = `${ '!'.repeat( value ) } ${ text }`;
                break;
            case 'bold':
                newText = `**${ text }**`;
                break;
            case 'italic':
                newText = `%%${ text }%%`;
                break;
            case 'superscript':
                newText = `^^${ text }^^`;
                break;
            case 'subscript':
                newText = `,,${ text },,`;
                break;
            case 'list':
                newText = `* ${ text }`;
                break;
            case 'link':
                newText = `((url)(${ text }))`;
                break;
        }

        textarea.value = first + newText + rest;

        textarea.selectionEnd = ( first + newText ).length;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    .text-editor
    {
        width: 100%;
    }
    .text-editor-header
    {
        padding: 0 0 1rem;

        display: flex;
        flex-direction: row;
        gap: 0.3vw;
    }

    .text-editor-button
    {
        border-radius: 0.5rem;
        padding: 0.3rem 1rem;

        display: flex;
        align-items: center;

        background-color: white;

        cursor: pointer;
        transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
    }

    .text-editor-button:hover
    {
        background-color: blueColor500;

        color: white;

        transition: background-color 400ms ease-in-out, color 400ms ease-in-out;
    }

    .text-editor-body
    {
        width: 100%;
        border: 2px solid blueColor900;
        border-radius: 0.5rem;
        padding: 1rem;

        display: inline-block;

        font-size: calc( 4vw / 3 );
        font-weight: 500;
        color: blueColor500;
    }

    select
    {
        outline: none;
        height: 1.7rem;
        width: 3rem;
        border-radius: 0.5rem;
        padding: 0.3rem 1.8rem;
    }

    .head-select
    {
        position: relative;
        top: 0;
        left: -22.3rem;
    }
</style>

<div class="text-editor">
    <div class="text-editor-header">
        <select
            id="formatBlock"
            class="text-editor-advanced-button"
            bind:value={ heading }
            onchange={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'heading', heading )}
        >
            <option value={ 1 }>H1</option>
            <option value={ 2 }>H2</option>
            <option value={ 3 }>H3</option>
        </select>
        <button
            type="button"
            class="text-editor-button"
            title="Bold"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'bold' )}
        >
            <Fa icon={ faBold }/>
        </button>
        <button
            type="button"
            class="text-editor-button"
            title="Italic"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'italic' )}
        >
            <Fa icon={ faItalic }/>
        </button>
        <button
            type="button"
            class="text-editor-button"
            title="SuperScript"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'superscript' )}
        >
            <Fa icon={ faSuperscript }/>
        </button>
        <button
            type="button"
            class="text-editor-button"
            title="subscript"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'subscript' )}
        >
            <Fa icon={ faSubscript }/>
        </button>
        <button
            type="button"
            class="text-editor-button"
            title="Bullet list"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'list' )}
        >
            <Fa icon={ faListUl }/>
        </button>
        <button
            type="button"
            class="text-editor-button"
            title="Link"
            onclick={() => replaceSelectTextarea( document.getElementById( 'text-input' ), 'link' )}
        >
            <Fa icon={ faLink }/>
        </button>
        <div class="heading-icon size-150 head-select"></div>
    </div>
    <textarea
        class="text-editor-body"
        name="editor-body"
        id="text-input"
        wrap="hard"
        rows="8"
        bind:value={ editorText }
></textarea>
</div>

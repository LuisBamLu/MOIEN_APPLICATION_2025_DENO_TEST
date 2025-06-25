<script>
    // -- IMPORTS

    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import { AceEditor } from 'svelte-ace';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { TemplateEngine } from '$lib/template_engine';
    import Button from '$component/element/Button.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import 'brace/mode/html';
    import 'brace/mode/json';
    import 'brace/theme/chrome';

    // -- VARIABLES

    /** @type {{isOpen?: boolean, onToggle?: any}} */
    let { isOpen = false, onToggle = () => {} } = $props();
    let exampleJson = { itemArray: [ { text : 'Item 1' }, { text : 'Item 2' } ], languageTag : $languageTagStore };
    let exampleHtml = `<!DOCTYPE html>
<h1>${ getLocalizedTextBySlug( 'list-example-text', $languageTagStore ) }:</h1>
<ul>
    {{#each itemArray}}
        <li style="font-size:16px;">{{item.text}}</li>
    {{/each}}
</ul>
<h1>${ getLocalizedTextBySlug( 'conditional-example-text', $languageTagStore ) }:</h1>
{{#if itemArray.length === 0}}
    <span style="font-size:16px;">Items length = 0</span>
{{/if}}
{{#if itemArray.length > 0}}
    <span style="font-size:16px;">Items length > 0</span>
{{/if}}
<h1>${ getLocalizedTextBySlug( 'internationalization-example-text', $languageTagStore ) }:</h1>
<p style="font-size:16px;">__This is an example of internationalization for the {{languageTag}} language.¨pt:Este é um exemplo de internacionalização para a língua {{languageTag}}.¨de:Dies ist ein Beispiel für die Internationalisierung der {{languageTag}} Sprache.¨fr:Il s'agit d'un exemple d'internationalisation de la langue {{languageTag}}.__</p>`;
    let examplePreview = new TemplateEngine( exampleHtml, exampleJson, $languageTagStore ).render();

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .template-example-container
    {
        height: 500px;
        width: 100%;

        display: grid;
        grid-template-rows: 1fr 1fr;
        grid-template-columns: 1fr 1fr;
        grid-template-areas: "html json" "preview preview";
        row-gap: 1rem;
    }

    .template-example-ace-editor-html
    {
        grid-area: html;

        border-right: 1px solid grayColor700;
    }

    .template-example-ace-editor-json
    {
        grid-area: json;
    }

    .example-preview
    {
        grid-area: preview;

        width: 100%;
        border: 1px solid grayColor700;
        padding: 2rem;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader title={ getLocalizedTextBySlug( 'email-template-example-title', $languageTagStore ) } onClose={ onToggle }/>

    <ModalContent>
        <div class="template-example-container">
            <div class="template-example-ace-editor-html">
                <AceEditor
                    lang="html"
                    theme="chrome"
                    value={ exampleHtml }
                />
            </div>
            <div class="template-example-ace-editor-json">
                <AceEditor
                    lang="json"
                    theme="chrome"
                    value={ JSON.stringify( exampleJson, null, '\t' ) }
                    options={{
                        tabSize: 4
                    }}
                />
            </div>
            <div class="example-preview">
                {@html examplePreview }
            </div>
        </div>
    </ModalContent>

    <ModalActions>
        <ModalButton fullWidth on:click={ onToggle }>
            { getLocalizedTextBySlug( 'filter-close-button', $languageTagStore ) }
        </ModalButton>
    </ModalActions>
</ModalRoot>

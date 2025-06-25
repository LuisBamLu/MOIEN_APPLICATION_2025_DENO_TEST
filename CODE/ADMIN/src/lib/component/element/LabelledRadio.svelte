<script>

    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { isSlugText, getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{group?: any, label: any, optionArray?: any}} */
    let { group = $bindable([]), label, optionArray = [] } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    fieldset
    {
        display: flex;
        flex-direction: column;
    }

    fieldset legend
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 700;
    }

    input[type="checkbox"]
    {
        display: none;
    }

    input[type="checkbox"]:checked ~ .cbx
    {
        border: 1px solid greenColor500;

        background: greenColor500;

        color: whiteColor;
    }

    input[type="checkbox"]:checked ~ .cbx:after
    {
        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAxNiAxMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEzLjI4ODYgMi42MzQ3N0w2LjIzNDEyIDkuMzY0NzdMMi43MTI4OSA1Ljk5OTc3IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjMiIHN0cm9rZS1saW5lY2FwPSJzcXVhcmUiLz4KPC9zdmc+Cg==");
    }

    // -- CLASSES

    .cbx-container
    {
        padding: 0.25rem 0;

        display: inline-flex;
        gap: 0.75rem;
        align-items: center;

        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor500;
    }

    .cbx
    {
        height: 1rem;
        width: 1rem;
        border: 1px solid grayColor600;
        border-radius: 0.875rem;
        padding: 0.625rem;

        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        justify-content: center;
        align-items: center;

        background: grayColor800;

        cursor: pointer;
    }

    .is-selected
    {
        font-weight: 700;
        color: grayColor;
    }
</style>

<fieldset>
    <legend>{ isSlugText( label ) ? getLocalizedTextBySlug( label, $languageTagStore ) : label }</legend>

    {#each optionArray as option }
        <div class="cbx-container" class:is-selected={ group && group.includes( option.value ) }>
            <input
                value={ option.value }
                bind:group
                type="checkbox"
                name={ option.value }
                id={ option.value }
            />
            <label class="cbx" for={ option.value } aria-label="checkbox"></label>
            { option.label }
        </div>
    {/each}
</fieldset>

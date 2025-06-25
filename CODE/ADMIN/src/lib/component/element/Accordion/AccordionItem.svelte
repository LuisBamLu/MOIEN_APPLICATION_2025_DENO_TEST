<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- VARIABLES

    /** @type {{text: any, disabled?: boolean, isOpen: any, isSelected?: boolean, children?: import('svelte').Snippet}} */
    let {
        text,
        disabled = false,
        isOpen,
        isSelected = false,
        children
    } = $props();

    // -- STATEMENTS

    let open = $derived(isOpen);
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- ELEMENTS

    summary
    {
        list-style: none;
        padding: 1rem 1.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    details
    {
        width: 100%;

        flex-shrink: 0;
        gap: 1rem;
        align-items: flex-start;

        background: var( --accordion-item-details-background, transparent );

        cursor: pointer;
    }

    summary.is-selected::after
    {
        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlBob3NwaG9yIEljb25zIC8gQ2FyZXRSaWdodCI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik05IDQuNUwxNi41IDEyTDkgMTkuNSIgc3Ryb2tlPSIjQURBNjkwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+Cjwvc3ZnPgo=");

        transition: transform 0.3s ease;
    }

    details[ open ] summary.is-selected::after
    {
        transform: rotate( 90deg );

        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgaWQ9IlBob3NwaG9yIEljb25zIC8gQ2FyZXRSaWdodCI+CjxwYXRoIGlkPSJWZWN0b3IiIGQ9Ik05IDQuNUwxNi41IDEyTDkgMTkuNSIgc3Ryb2tlPSIjQURBNjkwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPgo8L2c+Cjwvc3ZnPgo=");
    }

    summary::after
    {
        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgNC41TDE2LjUgMTJMOSAxOS41IiBzdHJva2U9IiM4NThCOTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=");

        transition: transform 0.3s ease;
    }

    details[ open ] summary::after
    {
        transform: rotate( 90deg );

        content: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTkgNC41TDE2LjUgMTJMOSAxOS41IiBzdHJva2U9IiM4NThCOTAiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+Cjwvc3ZnPgo=");
    }

    // -- CLASSES

    .text
    {
        line-height: 1.75rem;
        font-size: 1.25rem;
        font-weight: 700;
        letter-spacing: -0.025rem;
        text-transform: capitalize;
        color: blueColor;
    }

    .is-disabled
    {
        color: grayColor600;
    }

    .accordion-content
    {
        width: 100%;
        padding: 1rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;

        background: var( --accordion-item-content-background, transparent );
    }
</style>

{#key open }
    <details open={ open }>
        <summary onclick={bubble('click')} class:is-selected={ isSelected }>
            <p class="text" class:is-disabled={ disabled }>{ text }</p>
        </summary>

        <div class="accordion-content">
            {@render children?.()}
        </div>
    </details>
{/key}

<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AccordionItem from '$component/element/AccordionItem.svelte';
    import { getNormalCaseFromSnakeCaseString } from '$lib/base';

    // -- VARIABLES

    /** @type {{isOpen?: boolean, label: any, payment: any}} */
    let { isOpen = $bindable(false), label, payment } = $props();

    // -- FUNCTIONS

    // -- STATEMENTS

</script>

<style lang="stylus">
    // -- CLASSES

    .container
    {
        padding: 0.25rem 0;

        display: flex;
        gap: 0.5rem;
    }
</style>

<AccordionItem displayName={ label } bind:isOpen>
    {#each Object.entries( payment ) as [ fieldName, fieldValue ] }
        {#if !fieldName.includes( 'Array' ) && fieldName !== 'imagePath' && !fieldName.includes( 'Map' ) }
            <div class="container">
                <div class="font-size-75 font-weight-600 color-gray-100">
                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                </div>
                <div class="font-size-75 font-weight-500 color-gray-100">
                    { fieldValue }
                </div>
            </div>
        {/if}
    {/each}
</AccordionItem>

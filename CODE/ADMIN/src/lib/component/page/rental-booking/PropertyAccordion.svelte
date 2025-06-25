<script>
    // -- IMPORTS

    import { getNormalCaseFromSnakeCaseString } from '$lib/base';
    import { getStorageImagePath } from '$src/lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import AccordionItem from '$component/element/AccordionItem.svelte';

    // -- VARIABLES

    /** @type {{property: any}} */
    let { property } = $props();
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

<AccordionItem displayName={ getLocalizedTextBySlug( 'property-label', $languageTagStore ) }>
    <img class="property-image" src={ getStorageImagePath( property.imagePath, 640 ) } alt="" />
    {#each Object.entries( property ) as [ fieldName, fieldValue ] }
        {#if !fieldName.includes( 'Array' ) && fieldName !== 'imagePath' && !fieldName.includes( 'Map' ) }
            {#if fieldName === 'title' || fieldName === 'description' }
                <div class="container">
                    <div class="font-size-75 font-weight-600 color-gray-100">
                       { getNormalCaseFromSnakeCaseString( fieldName ) }:
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-100">
                        { getLocalizedText( fieldValue, $languageTagStore ) }
                    </div>
                </div>
            {:else}
                <div class="container">
                    <div class="font-size-75 font-weight-600 color-gray-100">
                       { getNormalCaseFromSnakeCaseString( fieldName ) }:
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-100">
                        { fieldValue }
                    </div>
                </div>
            {/if}
        {/if}
    {/each}
</AccordionItem>

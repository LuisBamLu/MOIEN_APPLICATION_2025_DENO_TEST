<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getProcessedMultilineTranslatedText } from '$lib/textProcessor';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$src/lib/store/languageTagStore';

    // -- VARIABLES

    export let description;
    let descriptionElement;
    let isExpanded = false;
    let showButton = false;

    // -- FUNCTIONS

    function toggleDescription(
        )
    {
        isExpanded = !isExpanded;
        descriptionElement.classList.toggle( 'closed' );
    }

    // ~~

    onMount(
        () =>
        {
            const limitedHeight = parseFloat( getComputedStyle( descriptionElement ).fontSize ) * 2.4;

            if ( descriptionElement.scrollHeight > limitedHeight )
            {
                showButton = true;
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-description
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;
    }

    .property-description-container
    {
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: initial;
        overflow: visible;

        text-overflow: ellipsis;

        transition: all 400ms ease-in-out;
    }

    .property-description-container.closed
    {
        -webkit-line-clamp: 2;
        overflow: hidden;
    }

    .property-description-button
    {
        margin-top: 1rem;
    }
</style>

<div class="property-description">
    <div class="font-size-90 font-weight-500 color-gray property-description-container closed" bind:this={ descriptionElement }>
        {@html getProcessedMultilineTranslatedText( description ) }
    </div>
    {#if showButton }
        <button class="font-size-90 font-weight-700 color-green property-description-button" on:click={ toggleDescription }>
            {
                isExpanded
                ? getLocalizedTextBySlug( 'show-less-label', $languageTagStore )
                : getLocalizedTextBySlug( 'show-more-label', $languageTagStore )
            }
        </button>
    {/if}
</div>

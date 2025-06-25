<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { isObjectEmpty } from '$lib/base';

    // -- VARIABLES

    /** @type {{property: any}} */
    let { property } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-card
    {
        overflow: hidden;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;

        +media( desktop )
        {
            justify-content: flex-start;
        }
    }

    .property-image
    {
        height: 2.75rem;
        width: 3.75rem;
        border-radius: 0.375rem;

        flex-shrink: 0;
    }
</style>

<div class="property-card">
    {#if !isObjectEmpty( property ) }
        <img
            class="property-image"
            src={ getStorageImagePath( property.imagePath, 640 ) }
            alt={ getLocalizedText( property.title, $languageTagStore ) }
        />
        <div class="display-flex flex-direction-column">
            <div class="font-size-90 font-weight-700 color-gray-100">
                { getLocalizedText( property.title, $languageTagStore ) }
            </div>
            <div class="font-size-75 font-weight-500 color-gray-300">
                { getLocalizedText( property.cityName, $languageTagStore ) }
                &#183;
                {#if property.status === 'offline' }
                    { getLocalizedTextBySlug( 'unpublished-label', $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'published-label', $languageTagStore ) }
                {/if}
            </div>
        </div>
    {:else}
        { getLocalizedTextBySlug( 'property-does-not-exists-label', $languageTagStore ) }
    {/if}
</div>

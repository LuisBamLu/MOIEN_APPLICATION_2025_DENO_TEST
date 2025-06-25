<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { getStorageImagePath } from '$lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    /** @type {{property: any}} */
    let { property } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message-property
    {
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 1rem;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            border-radius: 1rem;
            padding: 1rem;

            background: whiteColor;
            box-shadow: 0px 2px 16px 0px rgba(23, 23, 23, 0.06);
        }
    }

    .conversation-message-property-image
    {
        height: 4rem;
        width: 4rem;
        border-radius: 0.5rem;

        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        object-fit: cover;

        +media( desktop )
        {
            height: 8rem;
            width: 15rem;
        }
    }

    .conversation-message-property-description
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
    }
</style>

<header class="conversation-message-property">
    <img class="conversation-message-property-image" src={ getStorageImagePath( property.imagePath, 640 ) } alt="">
    <div class="conversation-message-property-description">
        <span class="font-size-90 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'visit-label', $languageTagStore ) }
            { getLocalizedText( property.title, $languageTagStore ) }
        </span>
        <span class="font-size-75 font-weight-500 color-gray">
            { getLocalizedText( property.title, $languageTagStore ) } .
            { getLocalizedTextBySlug( 'published-label', $languageTagStore ) }
        </span>
    </div>
</header>

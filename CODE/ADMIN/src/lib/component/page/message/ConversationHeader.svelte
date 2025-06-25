<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedText } from 'senselogic-gist';
    import ProfileCard from './ProfileCard.svelte';
    import PropertyCard from './PropertyCard.svelte';

    // -- VARIABLES

    /** @type {{rentalMode: any, sourceProfile?: any, targetProfile?: any, property?: any}} */
    let {
        rentalMode,
        sourceProfile = {},
        targetProfile = {},
        property = {}
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .conversation-header
    {
        position: sticky;

        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 1.5rem;

        display: flex;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;
        top 0;
        width: 100%;

        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .divider
    {
        height: 2.25rem;
        width: 2px;

        background-color: lightGrayBorderColor;
    }
</style>

<div class="conversation-header">
    <div class="font-size-100 font-weight-700 color-gray-100">
        { getLocalizedText( rentalMode.name, $languageTagStore ) }
    </div>
    <ProfileCard profile={ sourceProfile } />
    <div class="divider"></div>
    <ProfileCard profile={ targetProfile } />
    <PropertyCard property={ property } />
</div>

<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { languageTagStore } from '$store/languageTagStore';
</script>

<div class="ad-page-section disabled">
    <div class="subletting-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-600">
            { getLocalizedTextBySlug( 'ad-subletting-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-weight-550 color-gray-600">
            { getLocalizedTextBySlug( 'ad-subletting-helper', $languageTagStore ) }
        </div>
    </div>
    <div class="ad-page-section-list-option alternate">
        <div class="font-size-90 font-weight-500 color-gray-600">
            { getLocalizedTextBySlug( 'ad-subletting-input-label', $languageTagStore ) }
        </div>
        <Switch />
    </div>
</div>

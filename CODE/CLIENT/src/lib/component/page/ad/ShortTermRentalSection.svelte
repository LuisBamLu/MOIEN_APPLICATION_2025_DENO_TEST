<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let isAvailableForShortTermRental = false;
</script>

<div>
    <div class="short-term-rental-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-color-500 color-gray-300">
            { getLocalizedTextBySlug( 'ad-short-term-rental-helper', $languageTagStore ) }
        </div>
    </div>
    <div class="ad-page-section-list-option alternate">
        <div class="font-size-90 font-weight-500 color-gray-300">
            { getLocalizedTextBySlug( 'filter-short-term-label', $languageTagStore ) }
        </div>
        <Switch bind:value={ isAvailableForShortTermRental } />
    </div>
</div>

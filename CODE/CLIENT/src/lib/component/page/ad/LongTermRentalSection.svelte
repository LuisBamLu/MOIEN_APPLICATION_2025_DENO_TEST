<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    export let isAvailableForLongTermRental = false;
</script>

<!-- <div>
    <div class="long-term-rental-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'filter-long-term-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-color-500 color-gray-300">
            { getLocalizedTextBySlug( 'ad-long-term-rental-helper', $languageTagStore ) }
        </div>
    </div>
    <div class="ad-page-section-list-option alternate">
        <div class="font-size-90 font-weight-500 color-gray-300">
            { getLocalizedTextBySlug( 'filter-long-term-label', $languageTagStore ) }
        </div>
        <Switch bind:value={ isAvailableForLongTermRental } />
    </div>
</div> -->

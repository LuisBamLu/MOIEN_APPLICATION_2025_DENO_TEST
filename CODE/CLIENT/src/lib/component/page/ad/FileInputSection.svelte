<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import FileInput from '$src/lib/component/backoffice/FileInput.svelte';

    // -- VARIABLES

    export let fileArray;
</script>

<div class="ad-page-section">
    <div class="file-input-section-header">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'ad-photos-of-your-property-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-weight-500 color-gray-300">
            { getLocalizedTextBySlug( 'ad-photos-of-property-helper', $languageTagStore ) }
        </div>
    </div>
    <div>
        <FileInput
            imageSizeArray={ [ 1280, 640, 360 ] }
            maxFileCount={ 10 }
            bind:fileArray={ fileArray }
        />
    </div>
</div>

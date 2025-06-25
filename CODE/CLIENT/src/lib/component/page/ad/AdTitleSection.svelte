<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import InputLocalizedForm from '$component/backoffice/InputLocalizedForm.svelte'

    // -- VARIABLES

    export let title;
    export let languageArray;

    // -- FUNCTIONS

    function handleTitleUpdate(
        event
        )
    {
        title = event.detail.text;
    }
</script>

<div class="display-flex flex-direction-column gap-75">
    <div class="ad-title-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'ad-title-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-color-500 color-gray-300">
            { getLocalizedTextBySlug( 'ad-title-helper', $languageTagStore ) }
        </div>
    </div>
    <InputLocalizedForm
        name='title'
        itemsString={ title }
        languageArray={ languageArray }
        isMultiLine={ false }
        placeholder={ getLocalizedTextBySlug( 'ad-title-placeholder-text', $languageTagStore ) }
        on:update={ handleTitleUpdate }
    />
</div>

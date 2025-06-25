<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import InputLocalizedForm from '$component/backoffice/InputLocalizedForm.svelte'

    // -- VARIABLES

    export let description;
    export let languageArray;

    // -- FUNCTIONS

    function handleDescriptionUpdate(
        event
        )
    {
        description = event.detail.text;
    }
</script>

<div class="display-flex flex-direction-column gap-75">
    <div class="ad-description-section-header-container">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'ad-your-ad-label', $languageTagStore ) }
        </div>
        <div class="font-size-75 font-color-500 color-gray-300">
            { getLocalizedTextBySlug( 'ad-your-ad-helper', $languageTagStore ) }
        </div>
    </div>
    <InputLocalizedForm
        name='description'
        itemsString={ description }
        languageArray={ languageArray }
        isMultiLine={ true }
        placeholder={ getLocalizedTextBySlug( 'ad-description-placeholder-text', $languageTagStore ) }
        on:update={ handleDescriptionUpdate }
    />
</div>

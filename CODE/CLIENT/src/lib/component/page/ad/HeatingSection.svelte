<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';

    // -- VARIABLES

    export let heatingTypeArray;
    export let heatingTypeId;

    let heatingTypeName;

    // -- STATEMENTS

    $:if ( heatingTypeId )
    {
        let selectedType = heatingTypeArray.find( heatingType => heatingType.id === heatingTypeId );
        heatingTypeName = selectedType ? getLocalizedText( selectedType.name, $languageTagStore ) : '';
    }
</script>

    <Accordion label={ getLocalizedTextBySlug( 'ad-heating-label', $languageTagStore ) } value={ heatingTypeName }>
        <div class="radio-group">
            {#each heatingTypeArray as heatingType }
                <label class="radio-input-container">
                    <input
                        required
                        type="radio"
                        value={ heatingType.id }
                        name="heating-type"
                        bind:group={ heatingTypeId }
                        on:change={ () => heatingTypeName = getLocalizedText( heatingType.name, $languageTagStore ) }
                    />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedText( heatingType.name, $languageTagStore ) }
                    </div>
                </label>
            {/each}
        </div>
    </Accordion>

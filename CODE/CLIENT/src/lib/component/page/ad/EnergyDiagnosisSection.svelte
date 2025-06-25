<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte';

    // -- VARIABLES

    export let energyDiagnosisArray;
    export let energyDiagnosisId;

    let energyDiagnosisName;

    // -- STATEMENTS

    $:if ( energyDiagnosisId )
    {
        let selectedType = energyDiagnosisArray.find( energyDiagnosis => energyDiagnosis.id === energyDiagnosisId );
        energyDiagnosisName = selectedType ? getLocalizedText( selectedType.name, $languageTagStore ) : '';
    }
</script>

    <Accordion label={ getLocalizedTextBySlug( 'ad-energy-assessment', $languageTagStore ) } value={ energyDiagnosisName }>
        <div class="radio-group">
            {#each energyDiagnosisArray as energyDiagnosis }
                <label class="radio-input-container">
                    <input
                        required
                        type="radio"
                        value={ energyDiagnosis.id }
                        name="energy-diagnosis"
                        bind:group={ energyDiagnosisId }
                        on:change={ () => energyDiagnosisName = getLocalizedText( energyDiagnosis.name, $languageTagStore ) }
                    />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedText( energyDiagnosis.name, $languageTagStore ) }
                    </div>
                </label>
            {/each}
        </div>
    </Accordion>

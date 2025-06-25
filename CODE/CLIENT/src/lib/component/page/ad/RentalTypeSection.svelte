<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import BoldAccordion from '../../element/BoldAccordion.svelte';

    // -- VARIABLES

    export let rentalTypeId;
    export let rentalTypeArray;

    let rentalTypeName;

    // -- STATEMENTS

    $:
    {
        if ( rentalTypeId )
        {
            let selectedType = rentalTypeArray.find( rentalType => rentalType.id === rentalTypeId );
            rentalTypeName = selectedType ? getLocalizedText( selectedType.name, $languageTagStore ) : '';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- STYLES

    .selected
    {
        font-weight: 700;
    }

    .rental-type-radio-group
    {
        width: 100%;
    }
</style>

<div class="ad-page-section">
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-type-of-rental-label', $languageTagStore ) }
        isEditing={ true }
    >
        <div class="ad-page-section-list-option">
            <div class="rental-type-radio-group">
                {#each rentalTypeArray as rentalType }
                    <label class="radio-input-container">
                        <input
                            required
                            type="radio"
                            value={ rentalType.id }
                            name="rental-type"
                            bind:group={ rentalTypeId }
                            on:change={ () => rentalTypeName = getLocalizedText( rentalType.name, $languageTagStore ) }
                        />
                        <div class="font-size-100 font-weight-500 color-gray-100" class:selected={ rentalTypeId == rentalType.id }>
                            { getLocalizedText( rentalType.name, $languageTagStore ) }
                        </div>
                    </label>
                {/each}
            </div>
        </div>
    </BoldAccordion>
</div>

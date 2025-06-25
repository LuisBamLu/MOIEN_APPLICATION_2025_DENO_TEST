<script>
    // -- IMPORTS

    import { getLocalizedText ,getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Accordion from '$component/element/Accordion.svelte'
    import AdPageSection from './AdPageSection.svelte';

    // -- VARIABLES

    export let propertyTypeArray;
    export let typeId;
    let isShowingAll = false;
    $: filteredPropertyTypeArray = propertyTypeArray.slice( 0, isShowingAll ? propertyTypeArray.length - 1 : 3 );
    let propertyTypeName;

    // -- STATEMENTS

    $:
    {
        if ( typeId )
        {
            let selectedType = propertyTypeArray.find( propertyType => propertyType.id === typeId );
            propertyTypeName = selectedType ? getLocalizedText( selectedType.name, $languageTagStore ) : '';
        }
    }
</script>

<AdPageSection>
    <div class="font-size-100 font-weight-700 color-gray-100">
        { getLocalizedTextBySlug( 'ad-property-type-label', $languageTagStore ) }
    </div>
    <div class="property-type-list">
        <Accordion
            label={ getLocalizedTextBySlug( 'ad-property-type-helper', $languageTagStore ) }
            value={ propertyTypeName }
        >
            <div class="property-type-radio-group">
                {#each filteredPropertyTypeArray as propertyType }
                    <label class="radio-input-container">
                        <input
                            required
                            type="radio"
                            value={ propertyType.id }
                            name="property-type"
                            bind:group={ typeId }
                            on:change={ () => propertyTypeName = getLocalizedText( propertyType.name, $languageTagStore ) }
                        />
                        <div class="font-size-90 font-weight-500 color-gray-300">
                            { getLocalizedText( propertyType.name, $languageTagStore ) }
                        </div>
                    </label>
                {/each}
                <button
                    type="button"
                    class="radio-input-container font-size-90 font-weight-500 color-gray-300"
                    on:click={ () => isShowingAll = !isShowingAll }
                >
                    {#if !isShowingAll }
                        { getLocalizedTextBySlug( 'ad-show-all-label', $languageTagStore ) }
                    {:else}
                        { getLocalizedTextBySlug( 'ad-show-less-label', $languageTagStore ) }
                    {/if}
                </button>
            </div>
        </Accordion>
    </div>
</AdPageSection>

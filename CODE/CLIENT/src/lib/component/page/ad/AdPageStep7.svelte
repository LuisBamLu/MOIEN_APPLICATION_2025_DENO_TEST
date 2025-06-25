<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import BoldAccordion from '$component/element/BoldAccordion.svelte';
    import AdPageSection from '$component/page/ad/AdPageSection.svelte';
    import PriceInput from '$component/element/PriceInput.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Tag from '$component/element/Tag.svelte';
    import FeatureTypeBySubcategoryInput from '$component/page/ad/FeatureTypeBySubcategoryInput.svelte';

    // -- VARIABLES

    export let property;
    export let propertyFeatureByTypeIdMap;
    export let documentTypeArray;
    export let handleFeatureChange = ( event ) => {};

    // -- FUNCTIONS

    function handleRequiredDocumentChange(
        documentTypeId
        )
    {
        let documentTypeIdIndex = property.requiredLongTermDocumentTypeIdList.indexOf( documentTypeId );

        if ( documentTypeIdIndex > -1 )
        {
            property.requiredLongTermDocumentTypeIdList.splice( documentTypeIdIndex, 1 );
        }
        else
        {
            property.requiredLongTermDocumentTypeIdList.push( documentTypeId );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .tag-list
    {
        margin: 1rem 0;
        border-bottom: 1px solid lightGrayBorderColor;
        padding-bottom: 1rem;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
    }

    .input-container
    {
        display: flex;
        flex-direction: row !important;
        justify-content: space-between;
        align-items: center;
    }

    .ad-document-list
    {
        padding-top: 1rem;
    }
</style>

<AdPageSection>
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-rental-file-label', $languageTagStore ) }
        isEditing={ true }
    >
        <PriceInput
            priceNameLabel={ getLocalizedTextBySlug( 'ad-required-monthly-income-label', $languageTagStore ) }
            bind:value={ property.requiredLongTermMonthlyIncome }
        />
        <div class="ad-document-list font-size-90 font-weight-500 color-black">
            { getLocalizedTextBySlug( 'ad-required-documents-label', $languageTagStore ) }
        </div>
        <div class="tag-list">
            {#if documentTypeArray }
                {#each documentTypeArray as documentType }
                    {#if documentType.id !== 'company-extract' }
                        <Tag
                            label={ getLocalizedText( documentType.name ) }
                            isSelected={ property.requiredLongTermDocumentTypeIdList.indexOf( documentType.id ) > -1 }
                            on:change={ () => handleRequiredDocumentChange( documentType.id ) }
                        />
                    {/if}
                {/each}
            {/if}
        </div>
        <div class="input-container">
            <div class="font-size-90 font-weight-500 color-black">
                { getLocalizedTextBySlug( 'ad-require-rental-file-label', $languageTagStore ) }
            </div>
            <Switch bind:value={ property.requiresCompleteRequestForVisits } />
        </div>
    </BoldAccordion>
</AdPageSection>
<AdPageSection>
    <BoldAccordion
        label={ getLocalizedTextBySlug( 'ad-long-term-rental-label', $languageTagStore ) }
    >
        <FeatureTypeBySubcategoryInput
            category="booking-options"
            subCategory="long-term-rental"
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
</AdPageSection>

<script>
    // -- IMPORTS

    import { getLocalizedText } from 'senselogic-gist';
    import BoldAccordion from '$component/element/BoldAccordion.svelte';
    import PriceSection from '$component/page/ad/PriceSection.svelte';
    import RentalTypeSection from '$component/page/ad/RentalTypeSection.svelte';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import FeatureTypeBySubcategoryInput from '$component/page/ad/FeatureTypeBySubcategoryInput.svelte';

    // -- VARIABLES

    export let rentalTypeArray;
    export let property;
    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
</script>

<div>
    <RentalTypeSection
        rentalTypeArray={ rentalTypeArray }
        bind:rentalTypeId={ property.rentalTypeId }
    />
    <PriceSection
        propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        handleFeatureChange={ handleFeatureChange }
        bind:shortTermDailyPrice={ property.shortTermDailyPrice }
        bind:shortTermExtendedStayDailyPrice={ property.shortTermExtendedStayDailyPrice }
        bind:shortTermProlongedStayDailyPrice={ property.shortTermProlongedStayDailyPrice }
        bind:hasShortTermExtendedStayDiscount={ property.hasShortTermExtendedStayDiscount }
        bind:hasShortTermProlongedStayDiscount={ property.hasShortTermProlongedStayDiscount }
    />
    <BoldAccordion
        label=
            {
                getLocalizedText(
                    $featureTypeByCategoryAndSubCategoryArrayStore[ 'booking-options' ].name,
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySubcategoryInput
            category="booking-options"
            subCategory="short-term-rental"
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
        <FeatureTypeBySubcategoryInput
            category="booking-options"
            subCategory=""
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
    <BoldAccordion
        label=
            {
                getLocalizedText(
                    $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ]
                        .subCategory[ 'linen-kitchen-and-bath' ]
                        .name,
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySubcategoryInput
            category='equipment-and-services'
            subCategory='linen-kitchen-and-bath'
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
    <BoldAccordion
        label=
            {
                getLocalizedText(
                    $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ]
                        .subCategory[ 'recreation-and-connectivity' ]
                        .name,
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySubcategoryInput
            category='equipment-and-services'
            subCategory='recreation-and-connectivity'
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
    <BoldAccordion
        label=
            {
                getLocalizedText(
                    $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ]
                        .subCategory[ 'equipment-for-children' ]
                        .name,
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySubcategoryInput
            category='equipment-and-services'
            subCategory='equipment-for-children'
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
    <BoldAccordion
        label=
            {
                getLocalizedText(
                    $featureTypeByCategoryAndSubCategoryArrayStore[ 'equipment-and-services' ]
                        .subCategory[ 'available-services' ]
                        .name,
                    $languageTagStore
                    )
            }
    >
        <FeatureTypeBySubcategoryInput
            category='equipment-and-services'
            subCategory='available-services'
            on:featureChange={ event => handleFeatureChange( event.detail ) }
            bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
        />
    </BoldAccordion>
</div>

<script>
    // -- IMPORTS

    import BedSection from '$component/page/ad/BedSection.svelte';
    import TypeOfRentalSection from '$component/page/ad/TypeOfRentalSection.svelte';

    // -- VARIABLES

    export let propertyFeatureByTypeIdMap;
    export let bedTypeArray;
    export let spaceTypeMap;
    export let roomMap;
    export let handleFeatureChange = ( event ) => {};
</script>

<TypeOfRentalSection
    isPropertyFurnished={ propertyFeatureByTypeIdMap[ 'is-furnished' ]?.value ?? false }
    bedCount={ propertyFeatureByTypeIdMap[ 'bed-count' ]?.value ?? 0 }
    handleFeatureChange={ handleFeatureChange }
/>
<BedSection
    bedTypeArray={ bedTypeArray }
    spaceTypeMap={ spaceTypeMap }
    bedCount={ propertyFeatureByTypeIdMap[ 'bed-count' ]?.value ?? 0 }
    bind:roomArrayByTypeIdMap={ roomMap }
    on:changeBedCount={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'bed-count' } ) }
/>

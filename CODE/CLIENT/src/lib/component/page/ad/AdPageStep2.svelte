<script>
    // -- IMPORTS

    import LocationSection from '$component/page/ad/LocationSection.svelte';

    // -- VARIABLES

    export let countryArray = [];
    export let cityArray = [];
    export let property;
    export let errorArray;
</script>

<LocationSection
    countryArray={ countryArray }
    cityArray={ cityArray }
    bind:countryCode={ property.countryCode }
    bind:countryName={ property.countryName }
    bind:cityId={ property.cityId }
    bind:cityName={ property.cityName }
    bind:streetName={ property.streetName }
    bind:buildingNumber={ property.buildingNumber }
    bind:apartmentNumber={ property.apartmentNumber }
    bind:propertyTypeId={ property.typeId }
    bind:showsPreciseLocation={ property.showsPreciseLocation }
    bind:latitude={ property.latitude }
    bind:longitude={ property.longitude }
    bind:errorArray={ errorArray }
/>

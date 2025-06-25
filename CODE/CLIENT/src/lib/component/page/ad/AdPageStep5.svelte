<script>
    // -- IMPORTS

    import AdCancellationPolicySection from '$component/page/ad/AdCancellationPolicySection.svelte';
    import LongTermRentalSection from '$component/page/ad/LongTermRentalSection.svelte';
    import ShortTermRentalSection from '$component/page/ad/ShortTermRentalSection.svelte';

    // -- VARIABLES

    export let property;
    export let propertyFeatureByTypeIdMap;
    export let handleFeatureChange = ( event ) => {};
    $: isFurnished = String( propertyFeatureByTypeIdMap[ 'is-furnished' ]?.value ) === 'true';
</script>

<style lang="stylus">
</style>

<LongTermRentalSection bind:isAvailableForLongTermRental={ property.isAvailableForLongTerm } />
{#if isFurnished }
    <ShortTermRentalSection
        bind:isAvailableForShortTermRental={ property.isAvailableForShortTerm }
    />
{/if}
<AdCancellationPolicySection
    bind:propertyFeatureByTypeIdMap={ propertyFeatureByTypeIdMap }
    on:change={ event => handleFeatureChange( event.detail ) }
/>

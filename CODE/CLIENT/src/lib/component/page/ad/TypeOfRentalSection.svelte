<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import Counter from './Counter.svelte';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let isPropertyFurnished;
    export let bedCount;
    export let handleFeatureChange = ( event ) => {};

    // -- STATEMENTS

    onMount(
        () =>
        {
            isPropertyFurnished = ( String( isPropertyFurnished ) === 'true' );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    // -- STYLES

    .ad-type-of-rental-section
    {
        margin-top: 1rem;

        display: flex;
        flex-direction: column;
    }

    .ad-type-of-rental-furnished
    {
        margin-bottom: 1rem;
        border-bottom: 1px solid lightGrayBorderColor;
        padding-bottom: 1rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .ad-type-of-rental-available-beds
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>

<section class="ad-type-of-rental-section">
    <div class="ad-type-of-rental-furnished">
        <div>
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'filter-property-furnished-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-100">
                { getLocalizedTextBySlug( 'filter-property-furnished-helper', $languageTagStore ) }
            </div>
        </div>
        <Switch
            value={ isPropertyFurnished }
            onChange={ ( checked ) => handleFeatureChange( { value: checked, featureTypeId: 'is-furnished' } ) }
        />
    </div>
    <div class="ad-type-of-rental-available-beds">
        <div class="font-size-90 font-weight-500 color-gray-100">
            { getLocalizedTextBySlug( 'ad-available-bed-label', $languageTagStore ) }
        </div>
        <Counter
            bind:count={ bedCount }
            on:change={ ( event ) => handleFeatureChange( { value: event.detail, featureTypeId: 'bed-count' } ) }
        />
    </div>
</section>

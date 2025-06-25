<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { clearAllfilterParameterByKeyMap } from '$lib/base';
    import { updateUrlParameter } from '$lib/url';
    import { filterParameterByKeyMapStore } from '$store/filterParameterByKeyMapStore';
    import PropertiesFilterTermTypePopup from '$component/page/properties/PropertiesFilterTermTypePopup.svelte';
    import PropertiesFilterLocationPopup from '$component/page/properties/PropertiesFilterLocationPopup.svelte';
    import PropertiesFilterPricePopup from '$component/page/properties/PropertiesFilterPricePopup.svelte';
    import PropertiesFilterDatePopup from '$component/page/properties/PropertiesFilterDatePopup.svelte';
    import PropertiesFilterPropertyTypePopup from '$component/page/properties/PropertiesFilterPropertyTypePopup.svelte';
    import PropertiesFilterRentalTypePopup from '$component/page/properties/PropertiesFilterRentalTypePopup.svelte';
    import PropertiesFilterFeatureTypePopup from '$component/page/properties/PropertiesFilterFeatureTypePopup.svelte';
    import * as Modal from '$component/modal';

    // -- VARIABLES

    export let selectedCity;
    let showPropertiesFilterPopup = false;

    // -- FUNCTIONS

    function closePopup(
        )
    {
        showPropertiesFilterPopup = false;
    }

    // ~~

    function handlefilterParameterByKeyMapShowResults(
        )
    {
        updateUrlParameter(
            $filterParameterByKeyMapStore
            );

        closePopup();
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .properties-filter-search-bar-filter-container
    {
        height: 100%;
        border-left: 1px solid grayColor800;
        padding-left: 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .properties-filter-popup-container
    {
        width: 100%;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
    }

    .properties-filter-search-bar-filter
    {
        flex-shrink: 0;

        background-color: greenColor500;
    }

    .properties-filter-search-bar-location.is-filled
    {
        color: blueColor;
    }
</style>

<button
    class="properties-filter-search-bar-filter-container"
    on:click={ () => ( showPropertiesFilterPopup = !showPropertiesFilterPopup ) }
>
    <div class="green-filter-icon size-150 properties-filter-search-bar-filter">
    </div>
    <div class="font-size-85 color-gray-400 properties-filter-search-bar-location">
        { getLocalizedTextBySlug( 'filter-your-filters-label' ) }
    </div>
</button>

<Modal.Root isOpen={ showPropertiesFilterPopup } --mobile-modal-overlay-top="-4rem">
    <Modal.Header title={ getLocalizedTextBySlug( 'filter-search-label' ) } onClose={ closePopup }/>
    <Modal.Content>
        <div class="properties-filter-popup-container">
            <PropertiesFilterTermTypePopup/>
            <PropertiesFilterLocationPopup bind:selectedCity={ selectedCity } />
            {#if $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] }
                <PropertiesFilterDatePopup/>
                <PropertiesFilterRentalTypePopup/>
                <PropertiesFilterPricePopup
                    termType="short-term"
                    minimumValue={ 0 }
                    maximumValue={ 2000 }
                />
                <PropertiesFilterPropertyTypePopup/>
                <PropertiesFilterFeatureTypePopup termType="short-term" />
            {:else if $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ]  }
                <PropertiesFilterPricePopup
                    termType="long-term"
                    minimumValue={ 0 }
                    maximumValue={ 10000 }
                />
                <PropertiesFilterRentalTypePopup/>
                <PropertiesFilterPropertyTypePopup/>
                <PropertiesFilterFeatureTypePopup termType="long-term" />
            {/if}
        </div>
    </Modal.Content>
    <Modal.Actions>
        <Modal.Button
            text={ getLocalizedTextBySlug( 'filter-clear-all-button' ) }
            variant="light"
            on:click={ clearAllfilterParameterByKeyMap }
            on:click={ closePopup }
        />
        <Modal.Button
            text={ getLocalizedTextBySlug( 'filter-apply-button' ) }
            on:click={ handlefilterParameterByKeyMapShowResults }
        />
    </Modal.Actions>
</Modal.Root>

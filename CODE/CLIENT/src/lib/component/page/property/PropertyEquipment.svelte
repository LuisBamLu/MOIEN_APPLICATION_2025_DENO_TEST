<script>
    // -- IMPORTS

    import { fade } from 'svelte/transition';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalButton from '../../modal/ModalButton.svelte';

    // -- VARIABLES

    export let featureArray = [];

    let showAllPropertyEquipment = false;
    let maximumFeatureCount = 15;
    $: visibleFeatureCount = showAllPropertyEquipment ? featureArray.length : Math.min( featureArray.length, maximumFeatureCount );
    $: visibleFeatureArray = featureArray.slice( 0, visibleFeatureCount );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-equipment
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .property-equipment-items
    {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 0.75rem;

        +media( desktop )
        {
            grid-template-columns: 1fr 1fr 1fr;
        }
    }

    .property-equipment-item
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: flex-start;
    }

    .property-equipment-icon
    {
        flex-shrink: 0;
    }
</style>

{#if featureArray.length > 0 }
    <div class="property-equipment">
        <div class="font-size-125 font-weight-600 color-black property-equipment-title">
            Equipment
        </div>
        <div class="property-equipment-items">
            {#each visibleFeatureArray as feature }
                <div class="property-equipment-item" transition:fade>
                    {#if typeof( feature.type ) != 'undefined' }
                        <div class="{ feature.type.iconImagePath ? 'green-default-icon' : 'green-default-icon' } size-150 property-equipment-icon">
                            <!-- style="{ feature.type.iconImagePath ? `background: url( '${ getStorageImagePath( '/image/icon/place.svg' /* :TODO: feature.type.iconImagePath*/, 640 ) }') no-repeat center center / contain` : '' }" -->
                        </div>
                        <div class="font-size-90 font-weight-500 color-gray property-equipment-name">
                            {#if feature.type.valueTypeId === 'boolean'
                                 || feature.type.valueTypeId === 'integer'
                                 || feature.type.valueTypeId === 'real'
                                 || feature.type.valueTypeId === 'text'
                                 || feature.type.valueTypeId === 'date'
                                 || feature.type.valueTypeId === 'heating-type'
                                 || feature.type.valueTypeId === 'energy-diagnosis'
                                 || feature.type.valueTypeId === 'rental-type'
                                 || feature.type.valueTypeId === 'cancellation-policy'
                                 || feature.type.valueTypeId === 'taxation'
                                 || feature.type.valueTypeId === 'currency-code'
                                 || feature.type.valueTypeId === 'booking-option'
                                 || feature.type.valueTypeId === 'employment-status'
                                 || feature.type.valueTypeId === 'time-range' }
                                { getLocalizedText( feature.type.text, { value: feature.value }, $languageTagStore ) }
                            {/if}
                        </div>
                    {/if}
                </div>
            {/each}
        </div>
        {#if featureArray.length > maximumFeatureCount && !showAllPropertyEquipment }
            <div class="margin-top-100">
                <ModalButton
                    variant="outlined"
                    fullWidth={ false }
                    text=
                        {
                            getLocalizedTextBySlug(
                                'property-equipment-amenity-button',
                                { featureCount: featureArray.length },
                                $languageTagStore
                                )
                        }
                    on:click={ () => ( showAllPropertyEquipment = true ) }
                />
            </div>
        {/if}
    </div>
{/if}

<script>
    // -- IMPORTS

    import { getFormattedPrice } from '$src/lib/base';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let shortTermNightsCount = 0;
    export let property;
    export let hasExtraFees = false;
    export let shortTermExtraFeeFeatureTypeIdArray;
    export let featureByTypeIdMap;
    export let shortTermTotalPrice;
    export let nightCountByPriceMap;
    export let getExtraFee = ( shortTermExtraFee ) => {};
    export let conversionRate = 1;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-reserve-price-rules
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 1.25rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: whiteColor;
    }

    .property-reserve-price-rules-container,
    .property-reserve-price-rules-total-container
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .property-reserve-price-rules-total-container
    {
        border-top: 1px solid grayColor700;
        padding-top: 1rem;
    }
</style>

<div class="property-reserve-price-rules">
    {#if shortTermNightsCount >= 1 }
        {#each Object.entries( nightCountByPriceMap ) as [ price, nightCount ] }
            <div class="property-reserve-price-rules-container">
                <div class="font-size-90 font-weight-500 color-gray-300 property-reserve-price-rules-label">
                    {
                        getFormattedPrice(
                            Number( price ) * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore?.currencyCode ?? 'EUR'
                            )
                    }
                    x { nightCount }
                    { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-gray-100 property-reserve-price-rules-label">
                    {
                        getFormattedPrice(
                            nightCount * Number( price ) * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore?.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/each}
    {:else}
        <div class="property-reserve-price-rules-container">
            <div class="font-size-90 font-weight-500 color-gray-300 property-reserve-price-rules-label">
                { getLocalizedTextBySlug( 'price-per-night-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-700 color-gray-100 property-reserve-price-rules-label">
                {
                    getFormattedPrice(
                        property.shortTermDailyPrice * conversionRate,
                        $languageTagStore,
                        $profileSignedInStore?.currencyCode ?? 'EUR'
                        )
                }
            </div>
        </div>
    {/if}
    <div class="property-reserve-price-rules-container">
        <div class="font-size-90 font-weight-500 color-gray property-reserve-price-rules-label">
            { getLocalizedTextBySlug( 'extra-fees-label', $languageTagStore ) }
        </div>
        {#if !hasExtraFees }
            <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                -/-
            </div>
        {/if}
    </div>
    {#if hasExtraFees }
        {#each shortTermExtraFeeFeatureTypeIdArray as shortTermExtraFee }
            {#if featureByTypeIdMap[ shortTermExtraFee ] }
                <div class="display-flex justify-content-space-between">
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedText( featureByTypeIdMap[ shortTermExtraFee ].type.name, $languageTagStore ) }
                    </div>
                    <div class="font-size-90 font-weight-700 color-gray-100">
                        {
                            getFormattedPrice(
                                Number( getExtraFee( shortTermExtraFee ) ) * conversionRate,
                                $languageTagStore,
                                $profileSignedInStore?.currencyCode ?? 'EUR'
                                )
                        }
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
    <div class="property-reserve-price-rules-total-container">
        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-label">
            { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
        </div>
        <div class="font-size-100 font-weight-700 color-black property-reserve-price-rules-total-price">
            {
                getFormattedPrice(
                    shortTermTotalPrice * conversionRate,
                    $languageTagStore,
                    $profileSignedInStore?.currencyCode ?? 'EUR'
                    )
                }
        </div>
    </div>
</div>

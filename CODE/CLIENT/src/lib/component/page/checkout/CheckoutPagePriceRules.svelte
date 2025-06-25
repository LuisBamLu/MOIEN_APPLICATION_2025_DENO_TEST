<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug, getLocalizedText } from 'senselogic-gist';
    import Counter from '$component/element/Counter.svelte';
    import { getFormattedPrice } from '$lib/base';
    import { bookedPropertyStore } from '$src/lib/store/bookingStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import CounterInput from '../../element/CounterInput.svelte';

    // -- VARIABLES

    export let nightCount;
    export let compensation;
    export let donation;
    export let totalPrice;
    export let basePrice;
    export let featureByTypeIdMap;
    export let getExtraFee = ( featureTypeId ) => {};
    let property = $bookedPropertyStore;
    let nightCountByPriceMap = $bookedPropertyStore.nightCountByPriceMap;
    let conversionRate = $bookedPropertyStore.conversionRate;
    let minDonation = basePrice * 0.01 * conversionRate;
    let hasExtraFees =
        (
            featureByTypeIdMap[ 'short-term-cleaning-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-sheets-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-towels-fee' ] !== undefined
            || featureByTypeIdMap[ 'short-term-other-fee' ] !== undefined
        );
    let shortTermExtraFeeFeatureTypeIdArray =
        [
            'short-term-cleaning-fee',
            'short-term-sheets-fee',
            'short-term-towels-fee',
            'short-term-other-fee'
        ];

    // -- FUNCTIONS

    function handleDonationChange(
        { detail }
        )
    {
        if ( detail === 'increase' )
        {
            donation = Math.floor( donation + 1 ) ;
        }
        else
        {
            donation = Math.round( donation - 1 );
        }

        if ( donation < minDonation )
        {
            donation = minDonation;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../mixin.styl';
    @import '../../../../constant.styl';

    // -- CLASSES

    .checkout-page-price-rules
    {
        border-radius: 1rem;
        padding: 1.25rem 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        background-color: whiteColor;
    }

    .checkout-page-price-rules
    {
        width: 100%;
        border: 2px solid grayColor800;

        background-color: grayColor800;

        +media( desktop )
        {
            background-color: grayColor900;
        }
    }

    .checkout-page-price-rules-group
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .checkout-page-price-rules-total-group
    {
        border-top: 1px solid grayColor700;
        padding-top: 1rem;
    }
</style>

<div class="checkout-page-price-rules">
    {#if nightCount >= 1 }
        {#each Object.entries( nightCountByPriceMap ) as [ price, nightCount ] }
            <div class="checkout-page-price-rules-group">
                <div class="font-size-90 font-weight-500 color-gray property-reserve-price-rules-label">
                    {
                        getFormattedPrice(
                            Number( price ) * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                    x { nightCount }
                    { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                    {
                        getFormattedPrice(
                            nightCount * Number( price ) * conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/each}
    {:else}
        <div class="checkout-page-price-rules-group">
            <div class="font-size-90 font-weight-500 color-gray property-reserve-price-rules-label">
                { getLocalizedTextBySlug( 'price-per-night-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-700 color-black property-reserve-price-rules-label">
                {
                    getFormattedPrice(
                        nightCount * property.shortTermDailyPrice * conversionRate,
                        $languageTagStore,
                        $profileSignedInStore.currencyCode ?? 'EUR'
                        )
                }
            </div>
        </div>
    {/if}
    <div class="checkout-page-price-rules-group">
        <div class="font-size-90 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'extra-fees-label', $languageTagStore ) }
        </div>
        {#if !hasExtraFees }
            <div class="checkout-page-price-rules-group-result">
                <div class="font-size-90 font-weight-700 color-gray-100">
                    -/-
                </div>
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
                                $profileSignedInStore.currencyCode ?? 'EUR'
                                )
                        }
                    </div>
                </div>
            {/if}
        {/each}
    {/if}
    <div class="checkout-page-price-rules-group">
        <div class="font-size-90 font-weight-500 color-gray-300">
            { getLocalizedTextBySlug( 'booking-checkout-page-carbon-compensation', $languageTagStore ) }
        </div>
        <div class="font-size-90 font-weight-700 color-gray-100">
            {
                getFormattedPrice(
                    compensation,
                    $languageTagStore,
                    $profileSignedInStore.currencyCode ?? 'EUR'
                    )
            }
        </div>
    </div>
    <div class="checkout-page-price-rules-group">
        <div class="font-size-90 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'booking-checkout-page-service-fees', $languageTagStore ) }
        </div>
        <div class="checkout-page-price-rules-group-result">
            <Counter
                count={ donation }
                minCount={ minDonation }
                maxCount={ 1000 }
                on:change={ handleDonationChange }
            >
                {
                    getFormattedPrice(
                        donation,
                        $languageTagStore,
                        $profileSignedInStore.currencyCode ?? 'EUR'
                        )
                }
            </Counter>
        </div>
    </div>
    <div class="checkout-page-price-rules-group checkout-page-price-rules-total-group">
        <div class="font-size-100 font-weight-700 color-gray-100">
            { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
        </div>
        <div class="font-size-100 font-weight-700 color-gray-100">
            {
                getFormattedPrice(
                    totalPrice * conversionRate,
                    $languageTagStore,
                    $profileSignedInStore.currencyCode ?? 'EUR'
                    )
            }
        </div>
    </div>
</div>

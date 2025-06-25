<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { getFormattedPrice } from '$src/lib/base';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    export let rentalBooking;
    export let property;
    export let rentalDayByDateMap;
    let dayCountByPriceMap = getDayCountByPriceMap();
    let reverseConversionRate = getReverseConversionRate();

    // -- FUNCTIONS

    function getDayCountByPriceMap(
        )
    {
        let dayCountByPriceMap = {};
        let arrivalDateString = rentalBooking.arrivalDate;
        let departureDateString = rentalBooking.departureDate;
        let departureDateMilisecondCount = new Date( departureDateString ).getTime();
        let date = new Date( arrivalDateString );

        while ( date.getTime() < departureDateMilisecondCount )
        {
            let dayPrice = getDayPrice( date.toISOString().slice( 0, 10 ) );

            if ( dayCountByPriceMap[ dayPrice ] === undefined )
            {
                dayCountByPriceMap[ dayPrice ] = 0;
            }

            dayCountByPriceMap[ dayPrice ] += 1;
            date.setUTCDate( date.getUTCDate() + 1 );
        }

        return dayCountByPriceMap;
    }

    // ~~

    function getDayPrice(
        dateString
        )
    {
        let rentalDay = rentalDayByDateMap[ dateString ];

        if ( rentalDay !== undefined )
        {
            if ( rentalBooking.dayCount > 30 )
            {
                if ( rentalDay.hasShortTermProlongedStayDiscount )
                {
                    return rentalDay.shortTermProlongedStayDailyPrice;
                }
                else if ( rentalDay.hasShortTermExtendedStayDiscount )
                {
                    return rentalDay.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return rentalDay.shortTermDailyPrice;
                }
            }
            else if ( rentalBooking.dayCount > 7 )
            {
                if ( rentalDay.hasShortTermExtendedStayDiscount )
                {
                    return rentalDay.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return rentalDay.shortTermDailyPrice;
                }
            }
            else
            {
                return rentalDay.shortTermDailyPrice;
            }
        }
        else
        {
            if ( rentalBooking.dayCount > 30 )
            {
                if ( property.hasShortTermProlongedStayDiscount )
                {
                    return property.shortTermProlongedStayDailyPrice;
                }
                else if ( property.hasShortTermExtendedStayDiscount )
                {
                    return property.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return property.shortTermDailyPrice;
                }
            }
            else if ( rentalBooking.dayCount > 7 )
            {
                if ( property.hasShortTermExtendedStayDiscount )
                {
                    return property.shortTermExtendedStayDailyPrice;
                }
                else
                {
                    return property.shortTermDailyPrice;
                }
            }
            else
            {
                return property.shortTermDailyPrice;
            }
        }
    }

    // ~~

    function getReverseConversionRate(
        )
    {
        let initialTotalNightPrice = 0;

        for ( let [ price, dayCount ] of Object.entries( dayCountByPriceMap ))
        {
            initialTotalNightPrice += Number( price ) * dayCount;
        }

        let correctedTotalNightPrice =
            rentalBooking.totalPrice
            - ( Number( rentalBooking.cleaningFee ) ?? 0 )
            - ( Number( rentalBooking.sheetsFee ) ?? 0 )
            - ( Number( rentalBooking.towelsFee ) ?? 0 )
            - ( Number( rentalBooking.otherFee )  ?? 0 )
            - ( Number( rentalBooking.donation ) ?? 0 )
            - ( Number( rentalBooking.carbonCompensationDonation ) ?? 0 );

        return correctedTotalNightPrice / initialTotalNightPrice;
    }
</script>

<style lang="stylus">
    // -- CLASSES

    .container
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>

<div class="rental-booking-details-step">
    <div class="font-size-75 font-weight-700 color-gray-300">
        { getLocalizedTextBySlug( 'rental-booking-page-fee-details-label', $languageTagStore ) }
    </div>
    <div>
        {#each Object.entries( dayCountByPriceMap ) as [ price, dayCount ] }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            Number( price ) * reverseConversionRate * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                    x { dayCount } { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            Number( price ) * dayCount * reverseConversionRate * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/each}
        {#if rentalBooking.cleaningFee }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'ad-extra-costs-cleaning-fee-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            rentalBooking.cleaningFee * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/if}
        {#if rentalBooking.sheetsFee }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'ad-extra-costs-sheet-cost-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            rentalBooking.sheetsFee * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/if}
        {#if rentalBooking.towelsFee }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'ad-extra-costs-towel-fee-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            rentalBooking.towelsFee * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/if}
        {#if rentalBooking.donation }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'booking-checkout-page-service-fees', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            rentalBooking.donation * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/if}
        {#if rentalBooking.carbonCompensationDonation }
            <div class="container">
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'booking-checkout-page-carbon-compensation', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-500 color-gray-300">
                    {
                        getFormattedPrice(
                            rentalBooking.carbonCompensationDonation * rentalBooking.conversionRate,
                            $languageTagStore,
                            $profileSignedInStore.currencyCode ?? 'EUR'
                            )
                    }
                </div>
            </div>
        {/if}
        <div class="container">
            <div class="font-size-100 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                {
                    getFormattedPrice(
                        rentalBooking.totalPrice * rentalBooking.conversionRate,
                        $languageTagStore,
                        $profileSignedInStore.currencyCode ?? 'EUR'
                        )
                }
            </div>
        </div>
    </div>
</div>

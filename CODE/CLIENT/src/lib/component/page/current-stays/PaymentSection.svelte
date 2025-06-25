<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import EditLeaseContractPageSection from '../edit-lease-contract/EditLeaseContractPageSection.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getFormattedPrice } from '$src/lib/base';
    import { countNightsBetweenArrivalDateAndDepartureDate } from '$src/lib/booking';

    // -- VARIABLES

    export let property;
    export let rentalDayByDateMap;
    export let rentalBooking;
    let nightCount = countNightsBetweenArrivalDateAndDepartureDate( rentalBooking.arrivalDate, rentalBooking.departureDate );
    let reverseConversionRate = getReverseConversionRate();
    let stayPrice =
        rentalBooking.totalPrice
        - rentalBooking.carbonCompensationDonation
        - rentalBooking.donation
        - Number( rentalBooking.cleaningFee ?? 0 )
        - Number( rentalBooking.sheetsFee ?? 0 )
        - Number( rentalBooking.towelsFee ?? 0 )
        - Number( rentalBooking.otherFee ?? 0 );
    let totalMoienFee = rentalBooking.donation + stayPrice * 0.01;
    let total = rentalBooking.totalPrice - rentalBooking.carbonCompensationDonation - totalMoienFee;

    // -- FUNCTIONS

    function getFormattedDateFromIndex(
        index
        )
    {
        return new Date(
            new Date( rentalBooking.arrivalDate )
                .setDate( new Date( rentalBooking.arrivalDate ).getDate() + index )
            )
            .toLocaleString(
                $languageTagStore,
                {
                    timeZone: 'UTC',
                    weekday: 'short',
                    month: '2-digit',
                    day: '2-digit'
                }
                );
    }

    // ~~

    function getDateISOStringFromIndex(
        index
        )
    {
        return new Date(
                new Date( rentalBooking.arrivalDate )
                    .setDate( new Date( rentalBooking.arrivalDate ).getDate() + index )
            )
            .toISOString()
            .slice( 0, 10 );
    }

    // ~~

    function getNightPrice(
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

        for ( let nightIndex = 0; nightIndex < nightCount; nightIndex++ )
        {
            let date = getDateISOStringFromIndex( nightIndex );
            let nightPrice = getNightPrice( date );

            initialTotalNightPrice += nightPrice;
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
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .container
    {
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .container:last-child,
    .container.no-border
    {
        border-bottom: none;
    }

    .container.no-border
    {
        padding: 0;
    }

    .shelf
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
</style>

<EditLeaseContractPageSection
    label={ getLocalizedTextBySlug( 'current-stays-page-payment-label', $languageTagStore ) }
>
    <div class="table">
        <div class="container">
            <div class="font-size-90 font-weight-500 color-gray-300">
                {
                    getLocalizedTextBySlug(
                        'current-stays-page-price-for-nights-label',
                        { nightCount: nightCount },
                        $languageTagStore
                        )
                }
            </div>
            <div class="font-size-90 font-weight-700 color-gray-300">
                { getFormattedPrice( rentalBooking.totalPrice, $languageTagStore ) }
            </div>
        </div>
        <div class="shelf">
            {#each new Array( nightCount ) as _, index }
                <div class="container no-border">
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getFormattedDateFromIndex( index ) }
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        {
                            getFormattedPrice(
                                getNightPrice( getDateISOStringFromIndex( index ) ) * reverseConversionRate,
                                $languageTagStore
                                )
                        }
                    </div>
                </div>
            {/each}
            {#if rentalBooking.cleaningFee }
                <div class="container no-border">
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'ad-extra-costs-cleaning-fee-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getFormattedPrice( rentalBooking.cleaningFee, $languageTagStore ) }
                    </div>
                </div>
            {/if}
            {#if rentalBooking.sheetsFee }
                <div class="container no-border">
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'ad-extra-costs-sheet-cost-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getFormattedPrice( rentalBooking.sheetsFee, $languageTagStore ) }
                    </div>
                </div>
            {/if}
            {#if rentalBooking.towelsFee }
                <div class="container no-border">
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getLocalizedTextBySlug( 'ad-extra-costs-towel-fee-label', $languageTagStore ) }
                    </div>
                    <div class="font-size-75 font-weight-500 color-gray-300">
                        { getFormattedPrice( rentalBooking.towelsFee, $languageTagStore ) }
                    </div>
                </div>
            {/if}
        </div>
        {#if rentalBooking.donation || rentalBooking.carbonCompensationDonation }
            <div class="shelf">
                {#if rentalBooking.donation }
                    <div class="container no-border">
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { getLocalizedTextBySlug( 'booking-checkout-page-service-fees', $languageTagStore ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { getFormattedPrice( totalMoienFee * -1, $languageTagStore ) }
                        </div>
                    </div>
                {/if}
                {#if rentalBooking.carbonCompensationDonation }
                    <div class="container no-border">
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { getLocalizedTextBySlug( 'booking-checkout-page-carbon-compensation', $languageTagStore ) }
                        </div>
                        <div class="font-size-75 font-weight-500 color-gray-300">
                            { getFormattedPrice( rentalBooking.carbonCompensationDonation * -1, $languageTagStore ) }
                        </div>
                    </div>
                {/if}
            </div>
            <div class="container">
                <div class="font-size-90 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'total-label', $languageTagStore ) }
                </div>
                <div class="font-size-90 font-weight-700 color-gray-300">
                    { getFormattedPrice( total, $languageTagStore ) }
                </div>
            </div>
        {/if}
    </div>
</EditLeaseContractPageSection>

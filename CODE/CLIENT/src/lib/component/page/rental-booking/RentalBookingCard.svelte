<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { getFormattedPrice } from '$src/lib/base';
    import Image from '../../element/Image.svelte';
    import { link } from 'svelte-routing';
    import { profileSignedInStore } from '$src/lib/store/profileStore';

    // -- VARIABLES

    export let property;
    export let rentalBooking;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .rental-booking-card
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem;

        display: flex;
        gap: 1.5rem;
        justify-content: space-between;
        align-items: center;
    }

    .rental-booking-card-text-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    :global( .rental-booking-card-image )
    {
        height: 5rem;
        width: 5rem;
        border-radius: 0.75rem;
    }
</style>

<div class="rental-booking-card">
    <div class="rental-booking-card-text-container">
        <a
            class="font-size-100 font-weight-700 color-blue"
            href="/property/{ property.id }"
            use:link
        >
            { getLocalizedText( property.title, $languageTagStore ) }
        </a>
        <div class="font-size-90 font-weight-500 color-gray-300">
            { rentalBooking.dayCount } { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
            &#183; { rentalBooking.guestCount } { getLocalizedTextBySlug( 'guests-label', $languageTagStore ) }
        </div>
        <div class="font-size-100 font-weight-500 color-gray-100">
            <span class="font-weight-700">
                {
                    getFormattedPrice(
                        property.shortTermDailyPrice * rentalBooking.conversionRate,
                        $languageTagStore,
                        $profileSignedInStore?.currencyCode ?? 'EUR'
                        )
                }
            </span>
            { getLocalizedTextBySlug( 'properties-property-card-per-night-label', $languageTagStore ) }
        </div>
    </div>
    <Image
        class="rental-booking-card-image"
        imagePath={ property.imagePath }
        imageSize={ 640 }
        alt={ getLocalizedText( property.title, $languageTagStore ) }
    />
</div>

<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { getFormattedPrice } from '$src/lib/base';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let profile;
    export let dayCount;
    export let guestCount;
    export let totalPrice;
</script>

<style lang="stylus">
    // -- CLASSES

    .rental-booking-guest-profile
    {
        width: 100%;

        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .rental-booking-guest-profile-text-container
    {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
    }

    .rental-booking-guest-profile-text-container > div
    {
        overflow: hidden;
        max-width: clamp(  20ch, 60dvw, 40ch );

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

<div class="rental-booking-guest-profile">
    <ProfileImage profile={ profile } size="extra-large" />
    <div class="rental-booking-guest-profile-text-container">
        <div class="font-size-90 font-weight-700 color-gray-300">
            { profile.firstName } { profile.lastName }
        </div>
        <div class="font-size-90 font-weight-500 color-gray-300">
            { dayCount }
            &#183; { guestCount } { getLocalizedTextBySlug( 'booking-checkout-page-travelers', $languageTagStore ) }
            &#183; { getFormattedPrice( totalPrice, $languageTagStore ) }
        </div>
        <a
            class="font-size-90 font-weight-700 color-green"
            href="/profile/{ profile.id }"
            use:link
        >
            { getLocalizedTextBySlug( 'lease-contract-page-view-profile-label', $languageTagStore ) }
        </a>
    </div>
</div>

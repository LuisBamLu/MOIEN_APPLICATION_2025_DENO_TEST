<script>
    // -- IMPORTS

    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    let criteriaDetails =
        {
            propertyCleanliness:
                {
                    image: '/image/icon/brush.svg',
                    title: `${ getLocalizedTextBySlug( 'cleanliness-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'was-accomodation-clean-label', $languageTagStore ) }`,
                },
            propertyAccuracy:
                {
                    image: '/image/icon/target.svg',
                    title: `${ getLocalizedTextBySlug( 'accuracy-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'accurately-listing-label', $languageTagStore ) }`,
                },
            propertyMoneyValue:
                {
                    image: '/image/icon/vertical_coins.svg',
                    title: `${ getLocalizedTextBySlug( 'money-value-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'accomodation-good-value-label', $languageTagStore ) }`,
                },
            propertyCommunication:
                {
                    image: '/image/icon/chat_bubble.svg',
                    title: `${ getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'host-communication-label', $languageTagStore ) }`,
                },
            hostCommunication:
                {
                    image: '/image/icon/chat_bubble.svg',
                    title: `${ getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'host-communication-label', $languageTagStore ) }`,
                },
            guestCommunication:
                {
                    image: '/image/icon/chat_bubble.svg',
                    title: `${ getLocalizedTextBySlug( 'transfer-to-account-modal-communication-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'guest-communication-label', $languageTagStore ) }`,
                },
            propertyCheckIn:
                {
                    image: '/image/icon/door.svg',
                    title: `${ getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'how-checkin-went-label', $languageTagStore ) }`,
                },
            hostCheckIn:
                {
                    image: '/image/icon/door.svg',
                    title: `${ getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'how-checkin-went-label', $languageTagStore ) }`,
                },
            guestCheckIn:
                {
                    image: '/image/icon/door.svg',
                    title: `${ getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'how-checkin-went-label', $languageTagStore ) }`,
                },
            propertyLocation:
                {
                    image: '/image/icon/map_pin_line.svg',
                    title: `${ getLocalizedTextBySlug( 'filter-location-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug( 'neighborhood-opinion-label', $languageTagStore ) }`,
                },
            propertyAmenities:
                {
                    image: '/image/icon/monitor.svg',
                    title: `${ getLocalizedTextBySlug('amenities-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug('were-amenities-available-label', $languageTagStore ) }`,
                },
            hostCompliance:
                {
                    image: '/image/icon/alert.svg',
                    title: `${ getLocalizedTextBySlug( 'compliance-with-rules-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug('did-host-respect-the-rules-label', $languageTagStore ) }`,
                },
            guestCompliance:
                {
                    image: '/image/icon/alert.svg',
                    title: `${ getLocalizedTextBySlug( 'compliance-with-rules-label', $languageTagStore ) }`,
                    description: `${ getLocalizedTextBySlug('did-traveler-respect-the-rules-label', $languageTagStore ) }`,
                }
        };
    export let criteria;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    img
    {
        height: 2rem;
        width: 2rem;
    }

    // -- CLASSES

    .rating-criteria-container
    {
        margin-bottom: .5rem;

        display: flex;
        flex-direction: column;
        align-items: center;

        color: grayColor300;
    }

    .criteria-title
    {
        line-height: 1.8rem;
        font-size: 1.25rem;
        font-weight: 700;
        font-style: normal;
    }

    .criteria-description
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 400;
        font-style: normal;
        text-align: center;
    }
</style>

<div class="rating-criteria-container">
    <img src={ criteriaDetails[ criteria ].image } alt="">
    <h1 class="criteria-title">{ criteriaDetails[ criteria ].title }</h1>
    <p class="criteria-description">{ criteriaDetails[ criteria ].description }</p>
</div>

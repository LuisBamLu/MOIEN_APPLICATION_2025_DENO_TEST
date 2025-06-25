<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import Image from '../../element/Image.svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { link } from 'svelte-routing';

    // -- VARIABLES

    export let imagePath ='';
    export let typeId = '';
    export let propertyName = '';
    export let profile = null;
    export let guestCount = null;
    export let nightCount = null;
    export let date = new Date();
    export let href = '#';
    export let timeZone = null;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- CLASSES

    .event-mini-card
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 1rem;
        padding: 0.5rem;

        display: flex;
        gap: 0.75rem;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 0px 2px 12px 0px rgba(23, 23, 23, 0.16);

        transition: all 300ms ease-in-out;
        &:hover
        {
            border-color: greenColor800;

            background-color: greenColor950;
        }
    }

    :global( .event-mini-card-image )
    {
        height: 4rem;
        width: 4rem;
        border-radius: 0.5rem;
    }

    .event-mini-card-text-group
    {
        display: flex;
        flex-direction: column;
    }

    .event-mini-card:hover
    {
        .event-mini-card-text-group
        {
            .color-gray-100
            {
                color: greenColor100;
            }

            .color-gray-300,
            .color-gray-500
            {
                color: greenColor300;
            }
        }
    }
</style>

<a class="event-mini-card" href={ href } use:link>
    {#if typeId.includes( 'guest' ) }
        <ProfileImage profile={ profile } size="large" variant="square" />
    {:else}
        <Image
            class="event-mini-card-image"
            imagePath={ imagePath }
            imageSize={ 640 }
        />
    {/if}
    <div class="event-mini-card-text-group">
        {#if profile }
            <div class="font-size-75 font-weight-500 color-gray-500">
                { getLocalizedText( propertyName, $languageTagStore ) }
            </div>
        {/if}
        <div class="font-size-90 font-weight-700 color-gray-100">
            {#if profile }
                { profile.firstName } { profile.lastName }
            {:else}
                { getLocalizedText( propertyName, $languageTagStore ) }
            {/if}
        </div>
        <div class="font-size-75 font-weight-500 color-gray-300">
            {#if typeId.includes( 'check-in' ) }
                { getLocalizedTextBySlug( 'events-page-check-in-label', $languageTagStore ) }
                &#183; { guestCount } { getLocalizedTextBySlug( 'filter-guests-label', $languageTagStore ) }
                &#183; { nightCount } { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
            {:else if typeId.includes( 'check-out' ) }
                { getLocalizedTextBySlug( 'events-page-check-out-label', $languageTagStore ) }
                &#183; { guestCount } { getLocalizedTextBySlug( 'filter-guests-label', $languageTagStore ) }
                &#183; { nightCount } { getLocalizedTextBySlug( 'nights-label', $languageTagStore ) }
            {:else if typeId.includes( 'visit' ) }
                { getLocalizedTextBySlug( 'events-page-vist-label', $languageTagStore ) }
                &#183; { date.toLocaleString( $languageTagStore, { timeZone: timeZone, hour: '2-digit', minute: '2-digit' } ) }
            {:else if typeId === 'move-in' }
                { getLocalizedTextBySlug( 'events-page-move-in-label', $languageTagStore ) }
                &#183; { date.toLocaleTimeString( $languageTagStore, { timeZone: timeZone, hour: '2-digit', minute: '2-digit' } ) }
            {/if}
        </div>
    </div>
</a>

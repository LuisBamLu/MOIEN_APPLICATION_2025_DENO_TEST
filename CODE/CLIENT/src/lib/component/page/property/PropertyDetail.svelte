<script>
    // -- IMPORTS

    import { getRealText, getLocalizedTextBySlug, isNaN } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { navigate } from 'svelte-routing';

    // -- VARIABLES

    export let userProfile;
    export let bedroomCount;
    export let bathroomCount;
    export let totalArea;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-detail
    {
        margin-top: 1.5rem;
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;

        display: flex;
        justify-content: space-between;

        +media( desktop )
        {
            border-top: 0;
        }
    }

    .property-detail-name
    {
        overflow: hidden;
        max-width: 30ch;

        display: block;

        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .property-detail-image:hover
    {
        cursor: pointer;
    }
</style>

<div class="property-detail">
    <div class="property-detail-content">
        <div class="font-size-100 font-weight-700 color-black property-detail-name">
            {#if userProfile.firstName }
                { getLocalizedTextBySlug( 'property-host-house-hosted-by-name-text', { hostName: userProfile.firstName }, $languageTagStore )  }
            {/if}
        </div>
        <div class="font-size-90 font-weight-500 color-gray property-detail-characteristics">
            {#if !isNaN( totalArea ) }
                { getRealText( totalArea, 0, 0 ) } { getLocalizedTextBySlug( 'property-detail-square-meters-label', $languageTagStore ) }
                &#x2022;
            {/if}
            {#if bedroomCount }
                { bedroomCount } { getLocalizedTextBySlug( 'property-detail-bedrooms-label', $languageTagStore ) }
                &#x2022;
            {/if}
            {#if bathroomCount }
                { bathroomCount } { getLocalizedTextBySlug( 'property-detail-bathrooms-label', $languageTagStore ) }
            {/if}
        </div>
    </div>
    <div
        class="property-detail-image"
        on:click={ () => navigate( `/profile/${ userProfile.id }` ) }
    >
        <ProfileImage profile={ userProfile } size="medium" />
    </div>
</div>

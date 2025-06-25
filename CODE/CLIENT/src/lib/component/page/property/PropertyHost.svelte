<script>
    // -- IMPORTS

    import { link, navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { getLocalizedMonthYearTextFromDateText } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { authModalStore } from '$store/authModalStore';
    import ModalButton from '../../modal/ModalButton.svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';

    // -- VARIABLES

    export let property;
    export let profile;
    export let profilePropertyArrayLength;

    // -- FUNCTIONS

    function contactHost(
        )
    {
        if ( $profileSignedInStore )
        {
            navigate( '/conversation/' + property.id + '/' + property.userId + '/' + 'contact' );
        }
        else
        {
            $authModalStore = 'sign-in';
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .property-host
    {
        border-top: 1px solid lightGrayBorderColor;
        padding: 1.5rem 0;
    }

    .property-host-head
    {
        margin-bottom: 1rem;

        display: flex;
        justify-content: space-between;
    }

    .property-host-date-properties
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
    }

    .property-host-email-verified
    {
        display: flex;
        flex-direction: row;
        gap: 0.5rem;
        align-items: flex-end;
    }

    .property-host-image
    {
        cursor: pointer;
    }
</style>

<div class="property-host">
    <div class="property-host-head">
        <div class="property-host-head-container">
            <div class="font-size-100 font-weight-700 color-black property-host-name">
                {#if profile.firstName }
                    { getLocalizedTextBySlug( 'property-host-hosted-by-label', $languageTagStore ) }
                    { profile.firstName }
                {/if}
            </div>
            <div class="property-host-date-properties">
                <div class="font-size-90 font-weight-500 color-gray property-host-date">
                    { getLocalizedTextBySlug( 'property-host-since-label', $languageTagStore ) }
                    { getLocalizedMonthYearTextFromDateText( profile.creationTimestamp, $languageTagStore ) }
                    &#x2022;
                </div>
                <a
                    href="/search?profileId={ profile.id }"
                    class="font-size-90 font-weight-700 color-green property-host-properties"
                    use:link
                >
                    { profilePropertyArrayLength }
                    { getLocalizedTextBySlug( 'property-host-properties-label', $languageTagStore ) }
                </a>
            </div>
        </div>
        <div
            class="property-host-image"
            on:click={ () => navigate( `/profile/${ profile.id }` ) }
        >
            {#if profile.imagePath }
                <ProfileImage profile={ profile } size="medium" />
            {/if}
        </div>
    </div>
    {#if profile.emailValidationStatusId === 'verified' }
        <div class="property-host-email-verified">
            <div class="green-verified-icon size-150 property-host-email-verified-icon">
            </div>
            <div class="font-size-90 font-weight-500 color-gray property-host-email-verified-label">
                { getLocalizedTextBySlug( 'property-host-verified-user-label', $languageTagStore ) }
            </div>
        </div>
    {/if}
    <div class="margin-top-200">
        <ModalButton
            variant="outlined"
            fullWidth={ false }
            text={ getLocalizedTextBySlug( 'property-host-contact-host-label', $languageTagStore ) }
            on:click={ contactHost }
        />
    </div>
</div>

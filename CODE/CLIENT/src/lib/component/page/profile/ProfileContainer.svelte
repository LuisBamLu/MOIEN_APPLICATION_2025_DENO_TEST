<script>
    // -- IMPORTS

    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { getLocalizedMonthYearTextFromDateText } from '$src/lib/base';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    export let profile;
</script>

<style lang="stylus">
    // -- CLASSES

    .profile-container
    {
        width: 100%;

        display: flex;
        gap: 0.5rem;
        align-items: center;
    }
</style>

<div class="profile-container">
    <ProfileImage profile={ profile } size="medium" />
    <div class="text-container">
        <div class="font-size-125 font-weight-700 color-gray-100">
            { profile.firstName } { profile.lastName }
        </div>
        <div class="font-size-90 font-weight-500 color-gray-300">
            {
                getLocalizedTextBySlug(
                    'profile-page-joined-in-label',
                    { date: getLocalizedMonthYearTextFromDateText( profile.creationTimestamp, $languageTagStore ) },
                    $languageTagStore
                    )
            }
        </div>
    </div>
</div>

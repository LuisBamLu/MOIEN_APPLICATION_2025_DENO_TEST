<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { getDigitsCompleteDate } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import ProfileImage from '$component/layout/ProfileImage.svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import ProfileImageInputModal from '$component/page/account/ProfileImageInputModal.svelte';
    import { genderArrayStore } from '$store/genderStore';
    import { currentPathname } from '$lib/router';

    // -- VARIABLES

    export let profile = {};

    let isUserSignedIn = $profileSignedInStore !== null;
    let isCurrentUserProfile = isUserSignedIn && profile.userId === $profileSignedInStore.userId;
    let isProfilePage = $currentPathname.includes( '/profile' );
    let goToPageText = '';
    let pronounByGenderMap =
        {
            'female': 'She/Her¨fr:Elle/La¨de:Sie/Sie',
            'male': 'He/Him¨fr:Il/Lui¨de:Er/Ihn',
            'non-binary': 'They/Them¨fr:Iels/Eux¨de:Sie/Sie'
        };

    // -- FUNCTIONS

    function getVerifiedState(
        )
    {
        return profile.emailValidationStatusId === 'verified';
    }

    // ~~

    function getPronounsByGenderName(
        genderName
        )
    {
        if ( genderName === 'other' )
        {
            return 'They/Them';
        }

        return  pronounByGenderMap[ genderName ]
    }

    // ~~

    function getShowProfileLink(
        )
    {
        if ( isProfilePage )
        {
            goToPageText = getLocalizedTextBySlug( 'go-to-dashboard-label', {}, $languageTagStore );
            return `/${ $languageTagStore }/dashboard`;
        }
        else
        {
            goToPageText = getLocalizedTextBySlug( 'profile-page-show-profile', {}, $languageTagStore );
            return `/${ $languageTagStore }/profile/${ profile.id }`;
        }
    }

    // -- STATEMENTS

    $: country = $countryArrayStore.find( ( _country ) => _country.code === profile.countryCode );
    $: language = $languageArrayStore.find( ( _language ) => _language.tag === profile.languageTag );
    $: gender = $genderArrayStore.find( ( _gender ) => _gender.id === profile.genderId );
    $: pronounByGenderMap =
        {
            'female': 'She/Her¨fr:Elle/La¨de:Sie/Sie',
            'male': 'He/Him¨fr:Il/Lui¨de:Er/Ihn',
            'non-binary': 'They/Them¨fr:Iels/Eux¨de:Sie/Sie'
        };
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .profile-card
    {
        overflow: hidden;
        height: 18.75rem;
        width: 100%;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
    }

    .profile-card-image-container
    {
        position: relative;

        overflow: hidden;
        width: 100%;

        flex: 1;
    }

    .profile-card-edit-button
    {
        position: absolute;
        top: 0.75rem;
        right: 0.75rem;

        display: flex;
        flex-direction: column;
        gap: 0.625rem;
        align-items: flex-start;
    }

    .profile-card-hosted-by
    {
        width: 100%;
        border: 0px solid grayColor800;
        border-radius: 0 0 1rem 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;

        +media( tablet )
        {
            flex-direction: column;
        }

        +media( desktop-large )
        {
            flex-direction: row;
            justify-content: space-between;
        }
    }

    .profile-card-hosted-by-user-information-container
    {
        width: 100%;

        display: flex;
        gap: 1rem;
        align-items: center;
        align-self: stretch;

        +media( desktop )
        {
            max-width: 50%;
        }
    }

    .profile-card-user-information-secondary
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        +media( desktop )
        {
            max-width: 50%;

            align-items: flex-end;
        }
    }

    .profile-card-hosted-by-user-information-content
    {
        width: 100%;

        display: flex;
        flex: 1 0 0;
        gap: 0.625rem;
        align-items: center;
    }

    .profile-card-hosted-by-user-avatar
    {
        width: auto;

        display: flex;
        align-items: flex-end;
    }

    .profile-avatar-badge
    {
        z-index: 2;

        margin-left: -1rem;
        height: 1.5rem;
        width: 1.5rem;
        border-radius: 1.5rem;
        padding: 0.25rem;

        display: flex;
        gap: 0.625rem;
        align-items: center;

        background: greenColor500;
    }

    .profile-card-infomation
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        gap: 0.25rem;
        justify-content: center;
        align-items: flex-start;
    }

    .name-container
    {
        display: flex;
        gap: 0.25rem;
        align-items: center;
    }

    .name-label {
        overflow: hidden;
        max-width: 8.5rem;

        display: block;
        gap: 0.25rem;

        white-space: nowrap;
        text-overflow: ellipsis;

        +media( desktop )
        {
            max-width: 15rem;

            justify-content: center;
            justify-content: flex-start;
            align-items: center;
        }
    }

    .country-label
    {
        display: flex;
        gap: 0.25rem;

        +media( desktop-large )
        {
            justify-content: end;
            align-items: center;
        }
    }

    @media ( min-width: 1024px ) and ( max-width: 1163px )
    {
        .dates-label
        {
            display: flex;
            flex-direction: column;
        }

        .dates-label span:nth-child(2)
        {
            display: none;
        }
    }

    @media ( max-width: 347px )
    {
        .dates-label
        {
            margin-top: 1rem;

            display: flex;
            flex-direction: column;
            flex-direction: start;
            align-items: start;
        }

        .dates-label span:nth-child(2)
        {
            display: none;
        }
    }
</style>

<div
    class="profile-card"
>
    <div
        class="profile-card-image-container"
        style="background: url({ getStorageImagePath( profile.backgroundImagePath, 1920, '' ) }) no-repeat center center / cover,
            url({ getStorageImagePath( profile.backgroundImagePath, 360, '' ) }) no-repeat center center / cover,
            linear-gradient( 92deg, #00FFC7 0%, #00D6A2 98.4% );"
    >
        {#if isCurrentUserProfile }
            <ProfileImageInputModal>
                <div class="profile-card-edit-button">
                    <span class="white-filled-pencil-icon size-100"/>
                </div>
            </ProfileImageInputModal>
        {/if}
    </div>

    <div class="profile-card-hosted-by">
        <div class="profile-card-hosted-by-user-information-container">
            <div class="profile-card-hosted-by-user-information-content">
                <div class="profile-card-hosted-by-user-avatar">
                    <ProfileImage profile={ profile } size="medium"/>
                    {#if getVerifiedState() }
                        <span class="profile-avatar-badge">
                            <span class="blue-100-verified-icon size-150"/>
                        </span>
                    {/if}
                </div>

                <div class="profile-card-infomation">
                    <div class="name-container">
                        <p class="color-gray-100 font-weight-700 line-height-150 name-label">
                            { profile.legalName || profile.firstName + ' ' + profile.lastName || '' }
                        </p>
                        <p class="font-size-75 color-gray-500 font-weight-500 gap-25 display-flex align-items-center">
                            ({ getLocalizedText( getPronounsByGenderName( profile.genderId ?? 'other' ), $languageTagStore ) })
                        </p>
                    </div>
                    {#if isCurrentUserProfile }
                        <a
                            href={ getShowProfileLink() }
                            class="color-green-300 font-size-90 font-weight-500"
                        >
                            { goToPageText }
                        </a>
                    {/if}
                </div>
            </div>
        </div>

        <div class="display-flex gap-50 flex-direction-column profile-card-user-information-secondary">
            <p class="font-size-75 color-gray-500 font-weight-500 gap-25 display-flex align-items-center dates-label">
                <span>
                    {
                        getLocalizedTextBySlug(
                            'profile-page-joined-in-label',
                            {
                                date: getDigitsCompleteDate( profile.creationTimestamp )
                            },
                            $languageTagStore
                            )
                    }
                </span>

                {#if profile.birthDate !== null }
                    <span class="font-size-50">•</span>
                    <span>
                        {
                            getLocalizedTextBySlug(
                                'date-of-birth-label',
                                {
                                    date: getDigitsCompleteDate( profile.birthDate )
                                },
                                $languageTagStore
                            )
                        }
                    </span>
                {/if}

            </p>

            <p class="display-flex gap-50 align-items-center country-label">
                <img src="/image/flag/{ profile.countryCode || 'WW' }.svg" alt="" width="22.4" height="16"/>

                <span class="font-size-75 font-weight-500 color-gray-500">
                    {#if country !== null && country !== undefined && 'name' in country }
                        { getLocalizedText( country.name, {}, $languageTagStore ) }
                    {/if}
                    {#if language !== null && language !== undefined && 'name' in language }
                        - { getLocalizedText( language.name, {}, $languageTagStore ) }
                    {/if}
                </span>
            </p>
        </div>
    </div>
</div>

<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { profileSignedInStore, profileStateStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import PersonalDetail from '$component/page/account/PersonalDetail.svelte';
    import ProfileImageInputModal from '$component/page/account/ProfileImageInputModal.svelte';
    import ProfileImage from '../../layout/ProfileImage.svelte';
    import { link, navigate } from 'svelte-routing';
    import { fade, slide } from 'svelte/transition';
    import { onDestroy } from 'svelte';

    // -- VARIABLES

    let isOpen = false;
    let isProfileImageInputModalOpen = false;
    let maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );
    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    let unsubscribe = profileStateStore.subscribe(
        value =>
        {
            isOpen = value.openProfile;
        }
        );

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // ~~

    function handleClick(
        )
    {
        if ( isMobileScreen )
        {
            navigate( '/dashboard/personal-details' );
        }
        else
        {
            isOpen = !isOpen;
        }
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            unsubscribe();
            profileStateStore.set( { openProfile: false } );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .container
    {
        width: 100%;
        border-radius: 0.5rem;
        padding: 1vw;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        align-self: center;

        background-color: white;
        &.open
        {
            box-shadow: 0 0 0.5rem 0.25rem lightGrayBorderColor;
        }
    }

    .dashboard-profile-group
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dashboard-profile-text-group
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        text-align: left;
        a
        {
            text-decoration: underline;
        }
    }

    .dashboard-profile-info
    {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .accordion-arrow-icon
    {
        transition: 0.4s all ease;
    }

    .accordion-arrow-icon.isOpen
    {
        transform: rotate( 90deg );
    }
</style>

<svelte:window on:resize={ handleResizeEvent } />
<div class="container" class:open={ isOpen }  transition:fade>
    <button class="dashboard-profile-group" on:click={ handleClick }>
        <div class="dashboard-profile-info">
            <button on:click={ () => isProfileImageInputModalOpen = true }>
                <ProfileImage profile={ $profileSignedInStore } size="extra-large"/>
            </button>
            <div class="dashboard-profile-text-group">
                <div class="font-size-125 font-weight-600 color-black text">
                    { $profileSignedInStore.firstName + ' ' + $profileSignedInStore.lastName }
                </div>
                <a
                    class="font-size-90 font-weight-500 color-green"
                    href="/profile/{ $profileSignedInStore.id }"
                    use:link
                    on:click|stopPropagation
                >
                    { getLocalizedTextBySlug( 'profile-page-show-profile', $languageTagStore ) }
                </a>
            </div>
        </div>
        <div class="gray-right-caret-icon size-150 accordion-arrow-icon" class:isOpen />
    </button>
    {#if isOpen }
        <div class="display-flex flex-direction-column gap-150" transition:slide>
            <PersonalDetail/>
        </div>
    {/if}
    <ProfileImageInputModal bind:isOpen={ isProfileImageInputModalOpen }/>
</div>

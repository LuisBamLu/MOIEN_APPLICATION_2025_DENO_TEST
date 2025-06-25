<script>
    // -- IMPORTS

    import { generateFilePath } from '$lib/filePath';
    import ProfileImage from '$src/lib/component/element/ProfileImage.svelte';
    import * as visitStore from '$store/visitStore';
    import { get } from 'svelte/store';

    // -- VARIABLES

    /** @type {{currentProfile: any}} */
    let { currentProfile = $bindable() } = $props();
    let IsSelectionOpen = false;

    // -- FUNCTIONS

    function handleProfileSelection( selectedProfile )
    {
        currentProfile = selectedProfile;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../../constant.styl';
    @import '../../../../../../mixin.styl';

    // -- ELEMENTS

    img
    {
        height: 2vw;
        width: 2vw;
        border-radius: 50%;
    }

    p
    {
        font-size: 1vw;
        font-weight: 500;
        color: blueColor500;
    }

    // -- CLASSES

    .profile-bar
    {
        position: relative;
    }

    .search-profile-bar
    {
        height: 3vw;
        border: 1px solid blueColor800;
        border-radius: 2vw;
        padding: 0.5vw;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;

        background-color: blueColor950;

        cursor: pointer;
    }

    .search-profile-bar-user
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }

    .search-profile-bar-selection
    {
        z-index: 1;
        position: absolute;
        top: 3rem;
        right: 0;

        border: 1px solid blueColor800;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        background-color: blueColor950;
        .search-profile-bar-user
        {
            border-radius: 0;
            padding: 0.5rem;

            display: flex;
            flex-direction: row;
            gap: 1rem;
            align-items: center;
        }
    }
</style>

<div class="profile-bar">
    <button
        class="search-profile-bar"
        onclick={() => {}}
    >
        <div class="search-profile-bar-user">
            <ProfileImage
                imagePath={ currentProfile.imagePath }
                userName={ currentProfile.firstName }
            />
            <p>{ `${ currentProfile.firstName } ${ currentProfile.lastName }` }</p>
        </div>
        <i class="blue-search-icon" style="height: 1.5vw; width: 1.5vw"></i>
    </button>
    {#if IsSelectionOpen }
        <div class="search-profile-bar-selection">
            {#each get( visitStore.profileArrayStore ) as profile }
                <button
                    class="search-profile-bar-user"
                    onclick={() => handleProfileSelection( profile )}
                >
                    <ProfileImage
                        imagePath={ generateFilePath( profile.imagePath ) }
                        userName={ profile.firstName }
                    />
                    <p>{ `${ profile.firstName } ${ profile.lastName }` }</p>
                </button>
            {/each}
        </div>
    {/if}
</div>

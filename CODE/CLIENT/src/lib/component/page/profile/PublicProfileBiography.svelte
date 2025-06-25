<script>

    // -- IMPORTS

    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { getJsonText, getLocalizedText, getLocalizedTextBySlug, logError } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { toast } from '$lib/toast';
    import ModalButton from '../../modal/ModalButton.svelte';
    import { currentPathname } from '$src/lib/router';

    // -- CONTANTS

    const maximumBiographyCharacterCount = 500;

    // -- VARIABLES

    export let profile = {};

    let showMore = false;
    let isEditing = false;
    let isUserSignedIn = $profileSignedInStore !== null;
    let isCurrentUserProfile = isUserSignedIn && profile.userId === $profileSignedInStore.userId;
    let aboutDescription = profile.aboutDescription;
    let isSubmitting = false;
    let biographyCharacterCount = 0;
    let isProfilePage = $currentPathname.includes( '/profile' );

    // -- FUNCTIONS

    async function handleSaveProfile(
        event
        )
    {
        try
        {
            isSubmitting = true;
            let profileData = { aboutDescription };
            let result = await fetchData(
                '/api/update-profile/' + $profileSignedInStore.id,
                {
                    method: 'POST',
                    body: getJsonText( profileData ),
                    credentials: 'include'
                }
                );

            if ( result.profile )
            {
                $profileSignedInStore = result.profile;
                toast.success( 'update-profile-update-successful' );
            }

            handleToggleEdit();
        }
        catch ( error )
        {
            logError( error );
        }
        finally
        {
            isSubmitting = false;
        }
    }

    // ~~

    function handleToggleEdit(
        )
    {
        isEditing = !isEditing;
    }

    // ~~

    function handleShowMore(
        )
    {
        showMore = !showMore;
    }

    // -- STATEMENTS

    $: biographyCharacterCount = aboutDescription?.length || 0;
    $: biographyCharacterCountText = biographyCharacterCount
        + '/' + maximumBiographyCharacterCount;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    textarea
    {
        outline: none;
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.5rem;
        padding: 0.75rem;

        background: white;

        color: grayColor300;

        resize: none;
    }

    .textarea-container
    {
        position: relative;
    }

    .textarea-container::after
    {
        position: absolute;
        bottom: 0.5rem;
        right: 1rem;

        content: attr( data-description-character-count );

        font-size: 0.75rem;
        font-weight: 700;
    }

    // -- CLASSES

    .public-profile-biography
    {
        width: 100%;
        border-bottom: var( --mobile-border-bottom, 1px solid grayColor700 );
        padding-bottom: 2rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        +media( desktop )
        {
            border-bottom: var( --desktop-border-bottom, 1px solid grayColor700 );
        }
    }

    .public-profile-biography > h2
    {
        font-size: 0.9rem;

        +media( desktop )
        {
            font-size: 1.25rem;
        }
    }

    .public-profile-biography > p
    {
        overflow: hidden;

        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }

    .public-profile-biography > p.show-more
    {
        display: block;
    }

    .public-profile-biography > button
    {
        width: fit-content;
    }

    button.is-submitting
    {
        cursor: wait;
    }

    .public-profile-biography-actions
    {
        display: flex;
        gap: 0.5rem;
    }

    // .public-profile-biography-charactecter-counter
    // {
    //     font-size: 0.75rem;
    //     width: 100%;
    //     text-align: right;
    // }

    .public-profile-biography-title
    {
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;

        +media( desktop )
        {
            gap: 1rem;
        }
    }
</style>

<div class="public-profile-biography">
    <div class="public-profile-biography-title">
        <h2 class="font-weight-700 color-gray-100">Bio</h2>

        {#if isEditing }
            <button
                type="button"
                class="font-size-75 font-weight-700 color-green-300"
                on:click={ handleToggleEdit }
            >
                { getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
            </button>
        {/if}
    </div>

    <p
        class="textarea-container font-size-75 font-weight-500 color-gray-300"
        class:show-more={ showMore }
        data-description-character-count={ isEditing ? biographyCharacterCountText : '' }
    >
        {#if isEditing}
            <textarea
                maxlength="{ maximumBiographyCharacterCount }"
                name="about-description"
                placeholder="Write yout bio..."
                bind:value={ aboutDescription }
                rows="4"
            />
        {:else}
            { profile.aboutDescription || 'No bio...' }
        {/if}
    </p>

    {#if isCurrentUserProfile }
        {#if isEditing}
            <div class="public-profile-biography-actions">
                <ModalButton
                    type="submit"
                    variant="light"
                    fullWidth={ true }
                    isLoading={ isSubmitting }
                    text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
                    on:click={ handleSaveProfile }
                />
            </div>
        {:else}
            {#if !isProfilePage}
                <button
                    type="button"
                    class="font-size-90 font-weight-700 color-green-300 is-submiting"
                    on:click={ handleToggleEdit }
                >
                    { getLocalizedTextBySlug( 'edit-bio-label', $languageTagStore ) }
                </button>
            {/if}
        {/if}
    {:else}
        <button
            type="button"
            class="font-size-90 font-weight-700 color-green-300"
            on:click={ handleShowMore }
        >
            {#if showMore}
                { getLocalizedTextBySlug( 'show-less-label', $languageTagStore ) }
            {:else}
                { getLocalizedTextBySlug( 'show-more-label', $languageTagStore ) }
            {/if}
        </button>
    {/if}
</div>

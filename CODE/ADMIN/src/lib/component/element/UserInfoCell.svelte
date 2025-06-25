<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { getLocalizedText } from 'senselogic-gist';
    import ProfileImage from './ProfileImage.svelte';

    // -- VARIABLES

    /** @type {{userName?: string, email?: string, imagePath?: string}} */
    let { userName = '', email = '', imagePath = '' } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .profile-info-container
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        +media( smaller-48em )
        {
            justify-content: flex-end;
        }
    }

    .profile-avatar
    {
        object-fit: cover;
        object-position: center;
        height: 2rem;
        width: 2rem;
        border-radius: 3rem;

        flex-shrink: 0;
    }

    .profile-info
    {
        display: flex;
        flex-direction: column;
    }

    .profile-username
    {
        overflow: hidden;

        line-height: 1.125rem;
        font-size: 0.75rem;
        font-weight: 700;
        text-overflow: ellipsis;
        color: grayColor100;
    }

    .profile-email
    {
        overflow: hidden;

        line-height: 1.125rem;
        font-size: 0.75rem;
        font-weight: 500;
        text-overflow: ellipsis;
        color: grayColor500;
    }
</style>

<div class="profile-info-container">
    <ProfileImage
        imagePath={ imagePath }
        userName={ userName }
    />
    <span class="profile-info">
        <span class="profile-username">{ userName }</span>
        <span class="profile-email">{ email }</span>
    </span>
</div>

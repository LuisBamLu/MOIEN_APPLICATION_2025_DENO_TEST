<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$lib/storage';
    import { profileSignedInStore } from '$store/profileStore';

    // -- VARIABLES

    /** @type {{imagePath: any, userName: any, size?: string}} */
    let { imagePath, userName, size = 'small' } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .profile-image-container
    {
        position:relative;

        overflow: hidden;
        box-sizing: border-box;
        height: 2rem;
        width: 2rem;
        border: 2px solid grayColor950;
        border-radius: 2rem;

        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;

        background-color: greenColor900;

        text-transform: uppercase;
        color: greenColor300;
    }

    .profile-image
    {
        box-sizing: border-box;
        height: 2rem;
        width: 2rem;
        aspect-ratio: 1;
        border: 2px solid grayColor950;
        border-radius: 2rem;

        display: flex;
        justify-content: center;
        align-items: center;
        object-fit: cover;

        background-color: greenColor900;

        text-transform: uppercase;
        color: greenColor300;
    }

    .profile-image.medium
    {
        height: 3rem;
        width: 3rem;
        border-radius: 3rem;

        font-size: 1.5rem;
    }

    .profile-image.large
    {
        height: 4.5rem;
        width: 4.5rem;
        border-radius: 4.5rem;

        font-size: 2.25rem;
    }
</style>

<div class="profile-image-container { size }">
    {#if !imagePath }
        { userName?.charAt( 0 ) }
    {:else}
        <img
            class="profile-image"
            src={ getStorageImagePath( imagePath, 640 ) ?? 'null' }
            alt={ userName }
            onerror={( event ) => event.target.style.display = 'none'}
        />
    {/if}
</div>

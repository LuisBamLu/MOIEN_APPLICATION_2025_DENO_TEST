<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$src/lib/storage';

    // -- VARIABLES

    /** @type {{profile: any, size?: string, variant?: string}} */
    let { profile, size = 'small', variant = 'round' } = $props();
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
        justify-content: center;
        align-items: center;

        background-color: greenColor900;

        text-transform: uppercase;
        color: greenColor300;
    }

    .profile-image
    {
        position: absolute;
        top: 0;
        left: 0;

        height: 100%;
        width: 100%;
        aspect-ratio: 1;

        object-fit: cover;

        color: transparent;
    }

    .profile-image-container.medium
    {
        height: 3rem;
        width: 3rem;
        border-radius: 3rem;

        font-size: 1.5rem;
    }

    .profile-image-container.large
    {
        height: 4rem;
        width: 4rem;
        border-radius: 4rem;

        font-size: 2rem;
    }

    .profile-image-container.extra-large
    {
        height: 4.5rem;
        width: 4.5rem;
        border-radius: 4.5rem;

        font-size: 2.25rem;
    }

    .profile-image-container.square
    {
        border-radius: 0.5rem;
    }
</style>

<div class="profile-image-container { size } { variant }">
    { profile?.firstName.charAt( 0 ) }
    <img
        class="profile-image"
        src={ getStorageImagePath( profile?.imagePath, 512 ) ?? 'null' }
        alt={ profile?.firstName }
        onerror={( event ) => event.target.style.display = 'none'}
    />
</div>

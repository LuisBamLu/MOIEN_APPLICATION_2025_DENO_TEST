<script>
    // -- IMPORTS

    import HeaderProfileImage from '../../element/HeaderProfileImage.svelte';

    // -- VARIABLES

    /** @type {{profile: any}} */
    let { profile } = $props();

</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .profile-card
    {
        overflow: hidden;

        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;

        text-overflow: ellipsis;

        +media( desktop )
        {
            justify-content: flex-start;
        }
    }

    .profile-image
    {
        height: 2rem;
        width: 2rem;
        border-radius: 100%;

        flex-shrink: 0;
        object-fit: cover;
    }
</style>

{#if profile}
    <div class="profile-card">
        <HeaderProfileImage profile={ profile }/>

        <div class="display-flex flex-direction-column">
            <div class="font-size-75 font-weight-700 color-gray-100">
                { profile?.firstName } { profile?.lastName }
            </div>
            <div class="font-size-75 font-weight-500 color-gray-300">
                { profile.email }
            </div>
        </div>
    </div>
{/if}

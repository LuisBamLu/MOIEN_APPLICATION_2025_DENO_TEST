<script>
    // -- IMPORTS

    import { link } from 'svelte5-router';
    import { getLocalizedTextBySlug, isSlugText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{page: any, icon: any, label: any}} */
    let { page, icon, label } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .admin-card
    {
        height: 15.5rem;
        width: 100%;
        border: 2px solid grayColor800;
        border-radius: 0.5rem;
        padding: 2rem;

        display: flex;
        flex: 1 0 calc( 22% - 1rem );
        flex-direction: column;
        justify-content: space-between;

        background-color: grayColor900;

        transition: all ease-in-out;
    }

    .admin-card:active,
    .admin-card:focus
    {
        outline: none;
        border: 2px solid greenColor800;

        background: greenColor950;
        box-shadow: none;
    }

    .admin-card:active .admin-card-label,
    .admin-card:focus .admin-card-label
    {
        color: greenColor;
    }

    .admin-card:hover
    {
        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .admin-card-label
    {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;

        font-size: 1.5rem;
        font-weight: 600;
        color: grayColor100;
    }
</style>

<a href={ page } use:link class="admin-card">
    <div class="{ icon }-icon size-200"></div>

    <div class="admin-card-label">
        { isSlugText( label ) ? getLocalizedTextBySlug( label, $languageTagStore ) : label }
    </div>
</a>

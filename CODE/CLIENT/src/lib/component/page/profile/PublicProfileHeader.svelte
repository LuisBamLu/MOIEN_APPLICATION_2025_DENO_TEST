<script>
    // -- IMPORTS

    import { getClassName } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .profile-header
    {
        min-height: 4rem;
        border-bottom: 1px solid grayColor800;
        padding: 0 0.75rem;

        gap: 0.625rem;

        +media( desktop )
        {
            min-height: auto;
            border-bottom: 0;
        }
    }

    .profile-header-text
    {
        flex: 1;

        line-height: 1.625rem;
    }

    .profile-header-button
    {
        border-radius: 0.75rem;
        padding: 0.625rem 0.75rem;

        gap: 0.25rem;

        background-color: whiteColor;
        box-shadow: 0px 0px 8px 0px rgba( 23, 23, 23, 0.04 );
    }
</style>

<header
    { ...$$restProps }
    class="profile-header display-flex align-items-center { getClassName( $$props.class ) }"
>
    <h1 class="profile-header-text color-blue font-size-150 font-weight-600">
        { getLocalizedTextBySlug( 'profile-label', {}, $languageTagStore ) }
    </h1>

    <slot/>
</header>

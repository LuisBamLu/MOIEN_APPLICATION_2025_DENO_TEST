<script>
    // -- IMPORTS

    import { getClassName } from '$lib/base';
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .profile-content
    {
        padding: 2rem 1.5rem 7.5rem 1.5rem;
        padding: 1.5rem 0.75rem;

        display: flex;
        flex: 1;
        flex-direction: column;
        gap: 1.5rem;
        align-items: center;

        +media( desktop )
        {
            padding: 0;
        }
    }
</style>

<main
    class="profile-content { getClassName( $$props.class ) }"
    { ...$$props.restProps }
>
    <slot/>
</main>

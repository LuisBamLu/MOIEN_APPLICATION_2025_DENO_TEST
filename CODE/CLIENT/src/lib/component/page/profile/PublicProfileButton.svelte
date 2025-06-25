<script>
    // -- IMPORTS

    import { getClassName } from '$lib/base';

    // -- VARIABLES

    export let isDisabled = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    button:disabled
    {
        cursor: default;
    }

    // -- CLASSES

    .profile-header-button
    {
        border-radius: 0.75rem;
        padding: 0.625rem 0.75rem;

        gap: 0.25rem;
        align-items: center;

        background-color: whiteColor;
        box-shadow: 0px 0px 8px 0px rgba( 23, 23, 23, 0.04 );
    }
</style>

<button
    disabled={ isDisabled }
    { ...$$restProps }
    on:click
    class="profile-header-button display-flex justify-content-center { getClassName( $$props.class ) }"
>
    <slot/>
</button>

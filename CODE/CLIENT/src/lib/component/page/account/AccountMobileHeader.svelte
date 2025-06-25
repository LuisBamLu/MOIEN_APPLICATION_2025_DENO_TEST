<script>
    // -- IMPORTS

    import { Link } from 'svelte-routing';

    // -- VARIABLES

    export let title;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .account-mobile-header
    {
        width: 100%;
        border-bottom: 1px solid grayColor800;
        padding: 0.5rem 3rem 0.5rem 1.5rem;

        display: flex;
        justify-content: space-between;

        background: grayColor900;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
    }

    .account-mobile-header-title
    {
        flex: 1;

        text-align: center;
    }
</style>

<header class="account-mobile-header">
    <Link to="/dashboard">
        <div class="green-left-caret-icon size-150"/>
    </Link>
    <span class="font-size-100 font-weight-700 color-blue account-mobile-header-title">
        { title }
    </span>
</header>

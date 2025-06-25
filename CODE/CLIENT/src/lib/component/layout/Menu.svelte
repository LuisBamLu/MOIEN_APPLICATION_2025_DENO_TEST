<script>
    //-- IMPORTS

    import { Link } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { currentPathname } from '$src/lib/router';
    import { isOnboardingCompletedStore } from '$src/lib/store/onboardingStore';

    //-- VARIABLES

    let activeMenuItem = '/';
    $: isMenuHidden = $currentPathname.includes( '/search' ) && !$isOnboardingCompletedStore;

    //-- FUNCTIONS

    function setActiveMenuItem(
        route
        )
    {
        activeMenuItem = route;
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    .menu
    {
        z-index: 999;
        position: fixed;
        bottom: 0;

        height: 4rem;
        width: var( --viewport-width );
        border-top: 1px solid grayColor800;
        padding-bottom: 0.5rem;

        display: flex;

        background-color: pageBackgroundColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            display: none;
        }
    }

    .menu.is-hidden
    {
        display: none;
    }

    .menu-container
    {
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    .menu-item
    {
        margin-top: -2px;
        padding: 0.5rem 0;

        display: flex;
        flex: 1;
        flex-direction: column;
        justify-content: center;

        cursor: pointer;
    }

    :global( .menu-item >a )
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .menu-item>div
    {
        width: 100%;

        text-align: center;
    }

    :global( .menu-item.is-active >a >div:first-child ),
    {
        background-color: greenColor;
    }

    :global( .menu-item.is-active >a >div:last-child ),
    {
        color: greenColor;
    }
</style>

<div
    class="menu"
    class:is-hidden={ isMenuHidden }
>
    <div class="menu-container">
        <button
            class="menu-item"
            class:is-active={ $currentPathname.includes( '/search' ) }
            on:click={ () => setActiveMenuItem( '/search' ) }
        >
            <Link to="/search">
                <div class="gray-500-search-icon size-150"/>
                <div class="font-size-75 font-weight-500 color-gray-500">
                    { getLocalizedTextBySlug( 'menu-explore-label', $languageTagStore ) }
                </div>
            </Link>
        </button>
        <button
            class="menu-item"
            class:is-active={ $currentPathname.includes( '/ads' ) }
            on:click={ () => setActiveMenuItem( '/ads' ) }
        >
            <Link to="/dashboard/ads">
                <div class="gray-500-house-icon size-150">
                </div>
                <div class="font-size-75 font-weight-500 color-gray-500">
                    { getLocalizedTextBySlug( 'menu-ads-label', $languageTagStore ) }
                </div>
            </Link>
        </button>
        <button
            class="menu-item"
            class:is-active={ $currentPathname.includes( '/events' ) }
            on:click={ () => setActiveMenuItem( '/dashboard/events' ) }
        >
            <Link to="/dashboard/events">
                <div class="gray-500-calendar-icon size-150">
                </div>
                <div class="font-size-75 font-weight-500 color-gray-500">
                    { getLocalizedTextBySlug( 'menu-events-label', $languageTagStore ) }
                </div>
            </Link>
        </button>
        <button
            class="menu-item"
            class:is-active={ $currentPathname.includes( '/conversation' ) }
            on:click={ () => setActiveMenuItem( '/dashboard/conversation' ) }
        >
            <Link to="/dashboard/conversation">
                <div class="gray-500-chat-icon size-150">
                </div>
                <div class="font-size-75 font-weight-500 color-gray-500">
                    { getLocalizedTextBySlug( 'menu-inbox-label', $languageTagStore ) }
                </div>
            </Link>
        </button>
    </div>
</div>

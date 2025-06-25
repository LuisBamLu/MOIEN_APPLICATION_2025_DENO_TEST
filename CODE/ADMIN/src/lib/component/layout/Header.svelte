<script>
    // -- IMPORTS

    import LanguageToggler from './LanguageToggler.svelte';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { Link } from 'svelte5-router';
    import { profileSignedInStore } from '$store/profileStore';
    import { isSidebarOpen } from '$store/sidebarStore';
    import { clickOutside } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import HeaderProfileImage from '$component/element/HeaderProfileImage.svelte';

    // -- CONSTANTS

    const maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );

    // -- VARIABLES

    let isMobileScreen = maxWidthInEmMediaScreen.matches;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;

        if ( !isMobileScreen )
        {
            isSidebarOpen.set( true );
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .header
    {
        z-index: 999;
        position: fixed;

        overflow: hidden;
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 2rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: pageBackgroundColor;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        transition: height 500ms ease-in-out;
    }

    .header-logo-image
    {
        height: 2.5rem;
        width: auto;
    }

    .header-actions
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }

    .popup
    {
        display: inline-block;
        text-rendering: optimizeLegibility;
        position: relative;

        +media( desktop )
        {
            display: none;
        }
    }

    .popup input
    {
        display: none;
    }

    .burger
    {
        position: relative;

        overflow: hidden;
        outline: 0.125em solid transparent;
        height: 2.125em;
        width: 2.125em;
        border: none;
        border-radius: 1.0625em;

        display: flex;
        justify-content: center;
        align-items: center;

        background: #ccf8e9;

        cursor: pointer;
        transition: all 0.1s ease-in-out;
        outline-offset: 0;
    }

    .burger span
    {
        position: absolute;

        height: 0.125em;
        width: 1.125em;
        border-radius: 0.1875em;

        background: blueColor;

        transition: 0.3s;
    }

    .burger span:nth-child(1)
    {
        top: 0.625em;
    }

    .burger span:nth-child(2)
    {
        bottom: 0.625em;
    }

    .burger span:nth-child(3)
    {
        top: 50%;
        transform: translateY(-50%);
    }

    .burger:hover
    {
        transform: scale(1.1);
    }

    .burger:active
    {
        transform: scale(0.95);
    }

    .burger:focus:not(:hover)
    {
        outline-color: rgba(0, 0, 0, 0.15);
        outline-offset: 0.125em;
    }

    .popup input:checked + .burger span:nth-child(1)
    {
        top: 50%;
        transform: translateY(-50%) rotate(45deg);

        width: 1.125em;
    }

    .popup input:checked + .burger span:nth-child(2)
    {
        bottom: 50%;
        transform: translateY(50%) rotate(-45deg);

        width: 1.125em;
    }

    .popup input:checked + .burger span:nth-child(3)
    {
        transform: translateX(calc(-2.125em - 1.125em));
    }

    .header-menu
    {
        height: 2rem;
        border-radius: 2rem;
        padding: 0 0.5rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background-color: grayColor950;
    }

    .header-menu.profile
    {
        height: 2rem;
        border-radius: 2rem;
        padding: 2px 2px 2px 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background-color: grayColor950;

        transition: box-shadow 0.2s cubic-bezier( 0.2,0,0,1 );
    }

    .header-menu.profile:hover
    {
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.18);
    }
</style>

<svelte:window onresize={handleResizeEvent}/>

<div class="header">
    {#if $profileSignedInStore }
        <label class="popup">
            <input type="checkbox" bind:checked={ $isSidebarOpen }>
            <div role="button" class="burger" tabindex="0">
            <span></span>
            <span></span>
            <span></span>
            </div>
        </label>
    {/if}
    <button class="header-logo">
        <Link to="/admin/">
            <img class="header-logo-image" src="/admin/image/icon/moien_header_logo.svg" alt="Moien logo"/>
        </Link>
    </button>

    <div class="display-flex align-items-center gap-100">
        <div class="header-actions">
            <div class="header-language">
                <LanguageToggler/>
            </div>
        </div>

        {#if $profileSignedInStore }
            <button
                class="header-menu { $profileSignedInStore ? 'profile' : '' }"
            >
                <HeaderProfileImage profile={ $profileSignedInStore }/>
            </button>
        {/if}
    </div>
</div>

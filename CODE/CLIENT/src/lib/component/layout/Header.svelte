<script>
    // -- IMPORTS

    import { Link, navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { clickOutside, clearAllfilterParameterByKeyMap, fetchData, platform } from '$lib/base';
    import { authModalStore } from '$store/authModalStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { notificationCenterStore } from '$store/notificationCenterStore';
    import { profileSignedInStore } from '$store/profileStore';
    import LanguageToggler from '$component/layout/LanguageToggler.svelte';
    import HeaderModal from '$component/layout/HeaderModal.svelte';
    import AuthModal from '$component/auth/AuthModal.svelte';
    import { onDestroy, onMount } from 'svelte';
    import ProfileImage from './ProfileImage.svelte';
    import PropertiesFilterSearch from '../page/properties/PropertiesFilterSearch.svelte';
    import { currentPathname } from '$src/lib/router';
    import MobileHeaderModal from './MobileHeaderModal.svelte';
    import { conversationArrayStore } from '$src/lib/store/conversationStore';

    // -- VARIABLES

    export let arrivalDate;
    export let departureDate;
    export let selectedCountry;
    export let selectedCity;
    let isHeaderModalOpen = false;
    let notificationCount;
    let newMessageCount;
    let showButton = false;
    let publicPaths =
    [
        '/blog',
        '/article',
        '/terms',
        '/privacy-policy',
        '/cookies-policy',
        '/contact-us',
        '/about',
        '/faq',
    ]
    $: isPublicPage =
        /^\/[a-z]{2}\/?$/.test( $currentPathname ) ||
        publicPaths.some( ( path ) => $currentPathname.includes( path ) );
    $: isMobileHeaderHidden =
        $currentPathname !== '/' + $languageTagStore
        && $currentPathname !== '/' + $languageTagStore + '/'
        && $currentPathname !== '/' + $languageTagStore + '/?'
        && $currentPathname !== '/' + $languageTagStore + '/search'
        && $currentPathname !== '/' + $languageTagStore + '/search?'
        && $currentPathname !== '/' + $languageTagStore + '/dashboard/ads'
        && !$currentPathname.includes( '/blog' )
        && !$currentPathname.includes( '/article' )
        && !$currentPathname.includes( '/terms' )
        && !$currentPathname.includes( '/privacy-policy' )
        && !$currentPathname.includes( '/cookies-policy' )
        && !$currentPathname.includes( '/contact-us' )
    let unsubscribeNotificationCenter =
            notificationCenterStore.subscribe(
                ( notificationArray ) =>
                    notificationCount =
                        notificationArray.filter(
                            ( notification ) => !notification.isRead
                            ).length
                );
    let unsubscribeNewMessageCount =
            conversationArrayStore.subscribe(
                ( conversationArray ) =>
                {
                    newMessageCount =
                        conversationArray.reduce(
                            ( messageCount, conversation ) =>
                            {
                                if ( !$profileSignedInStore?.userId )
                                {
                                    return messageCount;
                                }

                                if ( conversation === null || conversation === undefined )
                                {
                                    return messageCount;
                                }

                                if ( $profileSignedInStore.userId === conversation.targetUserProfileId )
                                {
                                    return messageCount + ( conversation.targetNewMessageCount || 0 );
                                }
                                else if ( $profileSignedInStore.userId === conversation.sourceUserProfileId )
                                {
                                    return messageCount + ( conversation.sourceNewMessageCount || 0 );
                                }

                                return messageCount;
                            },
                        0
                    );
                }
            );

    // -- FUNCTIONS

    function showBlogButton( currentPathname )
    {
        return !(
            currentPathname.includes( '/blog' )
            || currentPathname.includes( '/search' )
            || currentPathname.includes( '/property' )
            || currentPathname.includes( '/profile' )
            || currentPathname.includes( '/dashboard' )
            || currentPathname.includes( '/booking' )
            || currentPathname.includes( '/confirm-booking-payment' )
            || currentPathname.includes( '/auth' )
            || currentPathname.includes( '/conversation' )
        );
    }

    // ~~

    async function handleSignOut(
        )
    {
        if ( $currentPathname.includes( '/dashboard' ) )
        {
            navigate( '/' );
        }

        let result = await fetchData( '/api/sign-out', { method: 'POST', credentials: 'include' } );

        if ( result )
        {
            $profileSignedInStore = result.profile;
            isHeaderModalOpen = false;
        }
    }

    // -- STATEMENTS

    onDestroy(
        () =>
        {
            unsubscribeNotificationCenter();
            unsubscribeNewMessageCount();
        }
        );

    onMount(
        () =>
        {
            showButton = showBlogButton( $currentPathname );
        }
        );

    // ~~

    $: showButton = showBlogButton( $currentPathname );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .header
    {
        display: none;

        +media( desktop )
        {
            z-index: 999;
            position: fixed;

            height: headerHeight;
            width: 100%;
            padding: 1.5rem 2rem;

            display: flex;
            justify-content: space-between;
            align-items: center;

            background-color: pageBackgroundColor;

            transition: height 500ms ease-in-out;
        }
    }

    .header-logo-image
    {
        height: 2.5rem;
        width: auto;
    }

    .header-actions
    {
        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }

    .header-button
    {
        width: max-content;
        min-width: 2.5rem;
        border-radius: 0.75rem;
        padding: 0.375rem 0.75rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: blueColor;

        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 700;
        color: whiteColor;

        transition: background-color 400ms ease-in-out;
        &:hover
        {
            background-color: blueColor300;
        }

        +media( desktop )
        {
            padding: 0.75rem 2.5rem;
        }
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

    .mobile-profile-image-container [data-badge]::after
    {
        top: auto;
        bottom: 0;
    }

    [data-badge]
    {
        position: relative;

        content: attr( data-badge );
    }

    [data-badge]::after
    {
        position: absolute;
        top: 0;
        right: 0;

        height: 1rem;
        width: 1rem;
        border-radius: 50%;
        padding: 0 0.3125rem;

        align-items: center;

        content: attr( data-badge );
        background: redColor500;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        line-height: 1rem;
        font-size: 0.625rem;
        font-weight: 800;
        color: blueColor950;
    }

    .mobile-header
    {
        z-index: 999;
        position: fixed;
        top: 0;
        left: 0;

        width: 100%;
        padding: 4rem 1rem 0.75rem;

        display: flex;
        justify-content: space-between;
        align-items: center;

        background-color: pageBackgroundColor;

        +media( desktop )
        {
            display: none;
        }
    }

    .mobile-header.android
    {
        top: 2rem;
    }

    .mobile-header.ios
    {
        top: 2rem;
    }

    .mobile-header.is-hidden
    {
        display: none;
    }

    .vertical-separator
    {
        height: 1.5rem;
        width: 1px;

        background-color: grayColor700;
    }

    .header-language
    {
        padding: 0.375rem 0.5rem;

        line-height: 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor150;
    }
</style>

<div
    class="header"
>
    <button class="header-logo" on:click={ clearAllfilterParameterByKeyMap }>
        <Link to="/">
            <img class="header-logo-image" src="/image/icon/moien_logo.svg" alt="" height="42" width="128"/>
        </Link>
    </button>
    {#if $currentPathname.includes( '/search' ) }
        <PropertiesFilterSearch
            arrivalDate={ arrivalDate }
            departureDate={ departureDate }
            bind:selectedCity={ selectedCity }
            bind:selectedCountry={ selectedCountry }
        />
    {/if}
    <div class="header-actions">
        <div class="header-currency">
        </div>
        {#if showButton }
            <Link to="/blog">
                <div class="header-language">
                    { getLocalizedTextBySlug( 'blog-label', $languageTagStore ) }
                </div>
            </Link>
            <div class="vertical-separator"></div>
        {/if}
        <div class="header-language">
            <LanguageToggler/>
        </div>
        {#if !$profileSignedInStore }
            {#if !isPublicPage }
                <button class="font-size-100 font-weight-700 header-button" on:click={ () => ( $authModalStore = 'sign-in' ) }>
                    { getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore ) }
                </button>
            {/if}
        {:else}
            <button
                class="header-menu { $profileSignedInStore ? 'profile' : '' }"
                on:click={ () => isHeaderModalOpen = !isHeaderModalOpen }
                use:clickOutside on:clickOutside={ () => ( isHeaderModalOpen = false ) }
            >
                <div class="gray-hamburger-icon size-150 header-menu-hamburger"/>

                    {#if notificationCount > 0 || newMessageCount > 0 }
                        <div data-badge={ notificationCount > 9 ? '9+' : notificationCount + newMessageCount }/>
                    {/if}
                <ProfileImage profile={ $profileSignedInStore } />
                {#if isHeaderModalOpen }
                    <HeaderModal/>
                {/if}
            </button>
        {/if}
    </div>
</div>
<div
    class="mobile-header"
    class:is-hidden={ isMobileHeaderHidden }
    class:android={ platform === 'android' }
    class:ios={ platform === 'ios' }
>
    {#if $currentPathname.includes( '/search' ) }
        <PropertiesFilterSearch
            arrivalDate={ arrivalDate }
            departureDate={ departureDate }
            bind:selectedCity={ selectedCity }
            bind:selectedCountry={ selectedCountry }
        />
    {:else if $currentPathname === '/' + $languageTagStore + '/dashboard/ads'}
        <div class="font-size-150 font-weight-600 color-gray-100">
            { getLocalizedTextBySlug( 'profile-page-ads', $languageTagStore ) }
        </div>
    {:else}
        <button class="header-logo" on:click={ clearAllfilterParameterByKeyMap }>
            <Link to="/">
                <img class="header-logo-image" src="/image/icon/moien_logo.svg" alt="" height="42" width="128"/>
            </Link>
        </button>
    {/if}
    <div class="header-actions">
        {#if showButton }
            <Link to="/blog">
                <div class="header-language">
                    { getLocalizedTextBySlug( 'blog-label', $languageTagStore ) }
                </div>
            </Link>
            <div class="vertical-separator"></div>
            <LanguageToggler/>
        {:else if !$currentPathname.includes( '/blog' ) }
            {#if !$profileSignedInStore }
                <button class="font-size-100 font-weight-700 header-button" on:click={ () => ( $authModalStore = 'sign-in' ) }>
                    { getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore ) }
                </button>
            {:else}
                <button class="mobile-profile-image-container" on:click={ () => isHeaderModalOpen = true }>
                    <ProfileImage profile={ $profileSignedInStore } size="medium" />

                    {#if notificationCount > 0 || newMessageCount > 0 }
                        <div data-badge={ notificationCount > 9 ? '9+' : notificationCount + newMessageCount }/>
                    {/if}
                </button>
                {#if isHeaderModalOpen }
                    <MobileHeaderModal bind:isHeaderModalOpen={ isHeaderModalOpen } />
                {/if}
            {/if}
        {/if}
    </div>
</div>
<AuthModal/>

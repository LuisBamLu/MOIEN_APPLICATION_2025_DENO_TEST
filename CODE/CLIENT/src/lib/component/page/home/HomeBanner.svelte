<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { authModalStore } from '$store/authModalStore';
    import { profileSignedInStore } from '$store/profileStore';
    import BigButton from '$component/element/BigButton.svelte';
    import AnimatedBanner from './AnimatedBanner.svelte';
    import { onDestroy } from 'svelte';
    import DivBackground from '../../element/DivBackground.svelte';
    import { isMobileScreen } from '$src/lib/store/appDataStore';
    import { platform } from '$src/lib/base';

    // -- CONSTANTS

    const dirPath = '/image/home/banner/iphone/';

    // -- VARIABLES

    $: isAuthenticated = $profileSignedInStore;

    // -- FUNCTIONS

    function openMoienAppStore()
    {
        let isWeb = platform === 'web';
        let userAgent = navigator.userAgent;

        let isAndroidWeb = isWeb && /Android/i.test( userAgent );
        let isIosWeb = isWeb && /iPhone|iPad|iPod/i.test( userAgent );

        if ( isAndroidWeb)
        {
            window.open( 'https://play.google.com/store/apps/details?id=com.moien', '_blank' );
        }
        else if ( isIosWeb )
        {
            window.open( 'https://testflight.apple.com/join/29Wy4phw', '_blank' );
        }
        else
        {
            window.open( 'https://play.google.com/apps/testing/com.moien', '_blank' );
        }
    }

    // -- STATEMENTS

    let unsubscribe = profileSignedInStore.subscribe(
        ( profileSignedIn ) => isAuthenticated = profileSignedIn
        );

    // ~~

    onDestroy(
        () =>
        {
            unsubscribe();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home-main-banner
    {
        position: relative;

        width: 100%;
        padding-bottom: 0;
        // display: flex;
        // flex-direction: column;
        // justify-content: space-between;
        // align-items: center;

        +media( desktop )
        {
            padding-bottom: 180px;
        }
    }

    .home-main-banner-content
    {
        position: relative;

        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            gap: 0;
        }
    }

    .home-main-banner-text
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            gap: 1.5rem;
        }
    }

    .home-main-banner-text h1
    {
        line-height: 3rem;
        font-size: 2.5rem;
        font-weight: 700;
        letter-spacing: -0.4px;
        text-align: center;
        color: blueColor100;

        +media( desktop )
        {
            line-height: 4.5rem;
            font-size: 4rem;
        }
    }

    .home-main-banner-text p
    {
        line-height: 1.5rem;
        font-size: 1rem;
        font-weight: 500;
        text-align: center;
        color: grayColor300;
    }

    .iphone-container
    {
        position: relative;

        width: 100%;
        aspect-ratio: 1/1;

        display: flex;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            height: 65vh;
        }
    }

    .iphone
    {
        position: relative;

        margin-bottom: 1rem;
        height: 40rem;
        width: 76rem;

        display: none;

        +media( tablet )
        {
            max-height: 27rem;
            max-width: 50rem;

            display: block;
        }

        +media( desktop )
        {
            max-height: 100%;

            display: block;
        }
    }

    .iphone-mobile
    {
        position: relative;

        height: 60dvh;
        width: 100dvw;
        aspect-ratio: 1/1;

        display: block;

        +media( tablet )
        {
            display: none;
        }

        +media( desktop )
        {
            display: none;
        }
    }

    @keyframes float
    {
        0%,
        100%
        {
            transform: translateY( -10px );
        }

        50%
        {
            transform: translateY( 0 );
        }
    }
</style>

<section class="home-main-banner">
    <AnimatedBanner/>
    <div class="home-main-banner-content">
        <div class="home-main-banner-text">
            <h1>
                { getLocalizedTextBySlug( 'blog-slogan-label', $languageTagStore ) }
            </h1>
            <p>
                { getLocalizedTextBySlug( 'blog-discover-description-label', $languageTagStore ) }
            </p>
        </div>
        <!-- <Link to="/search"> -->
            <div class="iphone-container">
                <div class="iphone-mobile">
                    <DivBackground
                        isGlobal={ true }
                        imagePath={ '/global/home/banner/iphone_desktop' }
                        preload={ true }
                        highRes={ 1280 }
                    />
                </div>
                <div class="iphone">
                    <DivBackground
                        isGlobal={ true }
                        imagePath={ '/global/home/banner/iphone_desktop' }
                        preload={ true }
                        highRes={ 1920 }
                    />
                </div>

            </div>
        <!-- </Link> -->
        <!-- {#if !get( profileSignedInStore ) }
            <BigButton
                text={ 'auth-sign-in-button' }
                onClick={ () => ( $authModalStore = 'sign-in' ) }
            />
        {:else} -->
            <BigButton
                text={ $isMobileScreen ? 'Sign up to Moien' : 'Download Moïen' }
                onClick={ openMoienAppStore }
                isHomeScreen={ true }
            />
        <!-- {/if} -->
    </div>
</section>

<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onDestroy } from 'svelte';
    import DivBackground from '../../element/DivBackground.svelte';

    // -- CONSTANTS

    const windowMatchesMaxWidth56em = window.matchMedia( '(max-width: 56em)' );
    const contentImageArray =
        [
            '/global/home/content/relaxing_man_on_couch.avif',
            '/global/home/content/sitting_woman_on_calculator.avif',
            '/global/home/content/walking_woman_with_bagpack.avif'
        ]

    // -- VARIABLES

    let isScreenAtPhoneSize = windowMatchesMaxWidth56em.matches;

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isScreenAtPhoneSize = windowMatchesMaxWidth56em.matches;
    }

    // -- STATEMENTS

    window.addEventListener( "resize", handleResizeEvent );

    // ~~

    onDestroy(
        () =>
        {
            window.removeEventListener( "resize", handleResizeEvent );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .home-main-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: grayColor900;
    }

    .image-container
    {
        overflow: hidden;
        max-height: 30rem;
        width: 100%;
        max-width: 40rem;
        aspect-ratio: 4 / 3;
        border-radius: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: center;

        +media( desktop )
        {
            width: 50%;
            aspect-ratio: 1 / 1;
        }
    }

    .home-main-content-row.right
    {
        flex-direction: column;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .home-main-content-row.left
    {
        flex-direction: column-reverse;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .home-main-content-row
    {
        width: 90%;
        border-bottom: 1px solid grayColor700;
        padding: 2rem 0;

        display: flex;
        gap: 2rem;
        align-items: center;

        +media( desktop )
        {
            width: 64%;
            border-bottom: none;

            flex-direction: row;
            gap: 4.5rem;
            align-items: center;
        }
    }

    .home-main-card
    {
        width: 100%;
        max-width: 40rem;
        border-radius: 0.6rem;

        display: flex;
        flex-direction: column;
        justify-content: left;
        align-items: left;

        +media( desktop )
        {
            width: 50%;
            border-radius: 0.6rem;

            justify-content: left;
            align-items: left;
        }
    }

    .home-main-card h3
    {
        padding: 0 0 1rem;

        line-height: 2rem;
        font-size: 1.5rem;
        font-weight: 600;
        color: blueColor100;

        +media( desktop )
        {
            line-height: 3.5rem;
            font-size: 3rem;
            font-weight: 700;
            letter-spacing: -0.48px;
        }
    }

    .home-main-card p
    {
        line-height: 1.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        color: grayColor300;

        +media( desktop )
        {
            line-height: 1.5rem;
            font-size: 1rem;
        }
    }

    .home-main-card-checklist
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }

    .home-main-card-checklist-item
    {
        width: 100%;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        align-items: center;
    }
</style>

<section class="home-main-content">
    <div class="home-main-content-row right">
            <div class="image-container">
                <DivBackground
                    isGlobal={ true }
                    imagePath={ contentImageArray[ 0 ] }
                    lowRes={ 360 }
                    highRes={ 1280 }
                />
            </div>
        <div class="home-main-card">
            <h3>{ getLocalizedTextBySlug( 'home-first-card-head-title', $languageTagStore ) }</h3>
            <p class="home-main-card-description">{ getLocalizedTextBySlug( 'home-first-card-description-1', $languageTagStore ) }</p>
            <p>{ getLocalizedTextBySlug( 'home-first-card-description-2', $languageTagStore ) }</p>
        </div>
    </div>
    <div class="home-main-content-row left">
        <div class="home-main-card">
            <h3>{ getLocalizedTextBySlug( 'home-second-card-title', $languageTagStore ) }</h3>
            <p class="home-main-card-description">{ getLocalizedTextBySlug( 'home-second-card-description', $languageTagStore ) }</p>
            <div class="paragraph"/>
            <div class="paragraph"/>
            <div class="home-main-card-checklist">
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-1', $languageTagStore ) }</p>
                    </span>
                </div>
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-2', $languageTagStore ) }</p>
                    </span>
                </div>
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-3', $languageTagStore ) }</p>
                    </span>
                </div>
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-4', $languageTagStore ) }</p>
                    </span>
                </div>
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-5', $languageTagStore ) }</p>
                    </span>
                </div>
                <div class="home-main-card-checklist-item">
                    <span class="bullet-1">
                        <p>{ getLocalizedTextBySlug( 'home-second-card-checklist-item-6', $languageTagStore ) }</p>
                    </span>
                </div>
            </div>
        </div>
        <div class="image-container">
            <DivBackground
                isGlobal={ true }
                imagePath={ contentImageArray[ 1 ] }
                lowRes={ 360 }
                highRes={ 1280 }
            />
        </div>
    </div>
    <div class="home-main-content-row right">
        <div class="image-container">
            <DivBackground
                isGlobal={ true }
                imagePath={ contentImageArray[ 2 ] }
                lowRes={ 360 }
                highRes={ 1280 }
            />
        </div>
        <div class="home-main-card">
            <h3>{ getLocalizedTextBySlug( 'home-third-card-title', $languageTagStore ) }</h3>
            <p>{ getLocalizedTextBySlug( 'home-third-card-description', $languageTagStore ) }</p>
        </div>
    </div>
</section>

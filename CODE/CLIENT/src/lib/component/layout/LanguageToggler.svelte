<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { setLanguageCode } from 'senselogic-gist';
    import { clickOutside } from '$lib/base';
    import { currentPathname } from '$lib/router';
    import { languageTagStore } from '$store/languageTagStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagArrayStore } from '$store/languageTagArrayStore';

    // -- VARIABLES

    export let color = 'color-black';
    let isLanguageTogglerOpen = false;

    // -- FUNCTIONS

    function setLanguage(
        languageTag
        )
    {
        setLanguageCode( languageTag );
        languageTagStore.set( languageTag );
        localStorage.setItem( 'languageTag', languageTag );

        let currentPath = $currentPathname;

        let currentLanguageTag =
            $languageTagArrayStore.find(
                code =>
                (
                    currentPath === `/${ code }`
                    || currentPath.startsWith( `/${ code }/` )
                )
                );

        let newPath;

        if ( currentLanguageTag )
        {
            newPath = currentPath.replace( `/${ currentLanguageTag }`, `/${ languageTag }` );
        }
        else
        {
            newPath = `/${ languageTag }${ currentPath }`;
        }

        isLanguageTogglerOpen = false;

        navigate( newPath );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .language-toggler
    {
        position: relative;
    }

    .language-toggler-popup
    {
        z-index: -999;
        position: fixed;
        top: 4rem;
        transform: translateX( -34% );

        width: max-content;
        border-radius: 0.75rem;
        padding: 0 0.75rem;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        transition: all 400ms ease-in-out;
    }

    .language-toggler-button
    {
        line-height: 1.25rem;
        font-size: 0.875rem;
        font-weight: 500;
        text-transform: uppercase;
        color: grayColor150;
    }

    .language-toggler-popup.false
    {
        visibility: hidden;
        opacity: 0;
    }

    .language-toggler-popup.true
    {
        z-index: 999;

        opacity: 1;
    }

    .language-toggler-popup ul
    {
        overflow-y: auto;
    }

    .language-toggler-popup ul li
    {
        padding: 0.7rem;
    }

    .language-toggler-popup ul li:first-child
    {
        border-bottom: 1px solid lightGrayBorderColor;
    }

    .language-toggler-popup ul li button
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;

        text-transform: uppercase;
    }

    .language-toggler-popup ul li button:hover
    {
        color: greenColor300;
    }
</style>

<div class="language-toggler { isLanguageTogglerOpen }">
    <button
        class="{ color } language-toggler-button"
        on:click={ () => isLanguageTogglerOpen = !isLanguageTogglerOpen }
        use:clickOutside
        on:clickOutside={ () => ( isLanguageTogglerOpen = false ) }
    >
        { $languageTagStore }
    </button>
    <div class="language-toggler-popup { isLanguageTogglerOpen }">
        <div class="language-toggler-popup-container">
            <ul>
                {#if $languageArrayStore }
                    {#each $languageArrayStore as language }
                        {#if language.isAvailable && $languageTagStore != language.tag }
                            <li>
                                <button
                                    class="font-size-100 font-weight-700 color-black language-toggler-popup-button"
                                    on:click={ () => setLanguage( language.tag ) }
                                >
                                    { language.tag }
                                </button>
                            </li>
                        {/if}
                    {/each}
                {/if}
            </ul>
        </div>
    </div>
</div>

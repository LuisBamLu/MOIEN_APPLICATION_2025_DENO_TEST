<script>
    // -- IMPORTS

    import { getLocalizedText, setLanguageCode } from 'senselogic-gist';
    import { clickOutside } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { languageArrayStore } from '$store/languageArrayStore';

    // -- VARIABLES

    let isLanguageTogglerOpen = $state(false);

    // -- FUNCTIONS

    function setLanguage(
        languageTag
        )
    {
        setLanguageCode( languageTag );
        languageTagStore.set( languageTag );
        localStorage.setItem( 'languageTag', languageTag );

        isLanguageTogglerOpen = !isLanguageTogglerOpen;
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
        top: headerHeight;
        right: 0;

        width: max-content;
        padding: 0;

        background-color: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        transition: all 400ms ease-in-out;
    }

    .language-toggler-button
    {
        text-transform: uppercase;
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
        height: 10rem;
    }

    .language-toggler-popup ul li
    {
        padding: 1rem;
    }

    .language-toggler-popup ul li button
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .language-toggler-popup ul li button div
    {
        text-transform: uppercase;
    }
</style>

<div class="language-toggler { isLanguageTogglerOpen }">
    <button class="font-size-100 font-weight-500 color-black language-toggler-button" onclick={() => isLanguageTogglerOpen = !isLanguageTogglerOpen}>
        { $languageTagStore }
    </button>
    <div class="language-toggler-popup { isLanguageTogglerOpen }">
        <div class="language-toggler-popup-container" use:clickOutside onclickOutside={() => ( isLanguageTogglerOpen = false )}>
            <ul>
                {#if $languageArrayStore }
                    {#each $languageArrayStore as language }
                        {#if $languageTagStore != language.tag }
                            <li>
                                <button class="font-size-100 font-weight-700 color-black language-toggler-popup-button" onclick={setLanguage( language.tag )}>
                                    { getLocalizedText( language.name, $languageTagStore ) } <div>( { language.tag } )</div>
                                </button>
                            </li>
                        {/if}
                    {/each}
                {/if}
            </ul>
        </div>
    </div>
</div>

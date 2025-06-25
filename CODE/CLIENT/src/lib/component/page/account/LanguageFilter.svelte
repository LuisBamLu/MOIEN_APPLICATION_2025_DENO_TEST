<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { getLocalizedText, getLocalizedTextBySlug, setLanguageCode } from 'senselogic-gist';
    import { hostUrl } from '$lib/base';
    import { languageTagStore } from '$store/languageTagStore';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagArrayStore } from '$store/languageTagArrayStore';
    import { currentPathname } from '$lib/router';

    // -- VARIABLES

    let languageSearchTerm = '';
    $: filteredlanguageArray =  $languageArrayStore.filter( option => option.name.toLowerCase().includes( languageSearchTerm.toLowerCase() ) );
    let language = $languageArrayStore.filter( language => language.code === $languageTagStore )[ 0 ];

    // -- FUNCTIONS

    function handleLanguageChange(
        )
    {
        if ( language )
        {
            languageSearchTerm = getLocalizedText( language.name, $languageTagStore );
        }
    }

    // ~~

    function getCamelCasedString(
        string
        )
    {
        return string.replace( /-./g, x => x[ 1 ].toUpperCase() );
    }

    // ~~

    async function handleSubmit(
        event
        )
    {
        event.preventDefault();

        let formData = new FormData( event.target );

        let profileData = {};

        for ( let [ key, value ] of formData )
        {
            let camelCasedKey = getCamelCasedString( key );
            profileData[ camelCasedKey ] = value
        }

        let result = await fetch(
            hostUrl + '/api/update-profile/' + $profileSignedInStore.id ,
            {
                method: 'POST',
                body: JSON.stringify( profileData ),
                credentials: 'include'
            }
            )
            .then( response => response.json() )
            .then( response => $profileSignedInStore = response[ 0 ] );

        setLanguage( language.code );

        return false;
    }

    // ~~

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
                ( currentPath === `/${ code }`
                || currentPath.startsWith( `/${ code }/` ) )
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

        navigate( newPath );
        window.location.reload();
    }

    // -- STATEMENTS

    $:
    {
        language;
        handleLanguageChange();
    }

    // ~~

    handleLanguageChange();
</script>

<style lang="stylus">
   // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .language-select-modal-content
    {
        position: relative;

        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .language-select-search-input-container
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1rem 0.75rem;

        display: flex;
        gap: 0.5rem;
        align-items: center;

        background: grayColor950;

        transition: all 200ms ease-in-out;
        &:focus-within
        {
            border-color: greenColor900;

            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    .language-select-search-input
    {
        outline: none;
        border: none;
        border-radius: unset;
        padding: unset;

        background-color: transparent;

        font-size: 0.9rem;
        color: grayColor100;
    }

    .language-select-radio-group
    {
        -ms-overflow-style: none;
        z-index: modalZIndex;
        position: absolute;
        top: 4rem;

        overflow-y: auto;
        scrollbar-width: none;
        height: 8rem;
        width: 100%;
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.75rem 0.5rem;

        display: none;
        flex-direction: column;

        background-color: whiteColor;
    }

    .language-select-modal-content:focus-within  .language-select-radio-group
    {
        display: flex;
    }

    .language-filter-save-button
    {
        margin: 1rem 0;
        height: 3.5rem;
        width: 100%;
        border-radius: 0.5rem;
        padding: 1rem 2rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
        align-self: stretch;

        background: greenColor;
    }
</style>

<form on:submit|preventDefault={ handleSubmit }>
    <div class="language-select-modal-content">
        <div class="language-select-search-input-container">
            <div class="gray-search-icon size-150" />
            <input
                class="language-select-search-input"
                placeholder={ getLocalizedTextBySlug( 'ad-search-language-label', $languageTagStore ) }
                bind:value={ languageSearchTerm }
            />
        </div>

        <div class="language-select-radio-group">
            {#each filteredlanguageArray as _language }
                <label class="radio-input-container" for={ _language.code }>
                    <input
                        id={ _language.code }
                        type="radio"
                        value={ _language.code }
                        name="languageTag"
                        bind:group={ $languageTagStore }
                        on:change={ () => language = _language }
                    />
                    <div class="font-size-90 font-weight-500 color-gray-300">
                        { getLocalizedText( _language.name, $languageTagStore ) }
                        <span class="font-weight-700">
                            { _language.tag.toUpperCase() }
                        </span>
                    </div>
                </label>
            {/each}
        </div>
    </div>

    <button class="language-filter-save-button font-size-90 font-weight-700 color-white" type="submit">
        Save
    </button>
</form>

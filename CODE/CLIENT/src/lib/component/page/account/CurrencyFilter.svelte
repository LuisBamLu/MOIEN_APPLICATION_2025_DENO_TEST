<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData, hostUrl } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    let currencySearchTerm = '';
    let currencyArray = [];
    let currencyCode;
    $: filteredCurrencyArray =  currencyArray.filter( option => option.name.toLowerCase().includes( currencySearchTerm.toLowerCase() ) );
    let currency = currencyArray.filter( currency => currency.code === currencyCode )[ 0 ];

    // -- FUNCTIONS

    function handleCurrencyChange(
        )
    {
        if ( currency )
        {
            currencySearchTerm = getLocalizedText( currency.name, $languageTagStore );
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

        return false;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let currencyData = await fetchData(
                '/api/currency',
                {
                    method: 'POST',
                    body: JSON.stringify( { type: 'getCurrencyArray' } ),
                    headers: { 'Content-Type': 'application/json' },
                }
                );

            if ( currencyData )
            {
                currency = currencyData.currencyArray;
            }
        }
    );

    // ~~

    $:
    {
        currency;
        handleCurrencyChange();
    }

    // ~~

    handleCurrencyChange();
</script>

<style lang="stylus">
   // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .currency-select-modal-content
    {
        position: relative;

        width: 100%;

        display: flex;
        flex-direction: column;
    }

    .currency-select-search-input-container
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

    .currency-select-search-input
    {
        outline: none;
        border: none;
        border-radius: unset;
        padding: unset;

        background-color: transparent;

        font-size: 0.9rem;
        color: grayColor100;
    }

    .currency-select-radio-group
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

    .currency-select-modal-content:focus-within  .currency-select-radio-group
    {
        display: flex;
    }
</style>

<div class="currency-select-modal-content">
    <div class="currency-select-search-input-container">
        <div class="gray-search-icon size-150" />
        <input
            class="currency-select-search-input"
            placeholder={ getLocalizedTextBySlug( 'ad-search-currency-label', $languageTagStore ) }
            bind:value={ currencySearchTerm }
        />
    </div>

    <div class="currency-select-radio-group">
        {#each filteredCurrencyArray as _currency }
            <label class="radio-input-container" for={ _currency.code }>
                <input
                    id={ _currency.code }
                    type="radio"
                    value={ _currency.code }
                    name="currencyCode"
                    bind:group={ currencyCode }
                    on:change={ () => currency = _currency }
                />
                <div class="font-size-90 font-weight-500 color-gray-300">
                    { getLocalizedText( _currency.singularName, $languageTagStore ) + ' ' + _currency.symbol}
                </div>
            </label>
        {/each}
    </div>
</div>

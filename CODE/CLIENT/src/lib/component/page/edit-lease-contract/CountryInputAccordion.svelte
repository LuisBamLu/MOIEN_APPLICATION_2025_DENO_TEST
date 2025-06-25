<script>
    // -- IMPORTS

    import { getLocalizedText, getMap } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import Accordion from '$component/element/Accordion.svelte';
    import CountryModal from '$component/page/edit-lease-contract/CountryModal.svelte';

    // -- VARIABLES

    export let label = '';
    export let countryCode;
    export let countryName = '';
    let countryByCountryCodeMap = getMap( $countryArrayStore, 'code' );
    let isEditing = false;

    // -- FUNCTIONS

    function handleCountryCodeChange(
        )
    {
        if ( countryByCountryCodeMap[ countryCode ] && countryName !== countryByCountryCodeMap[ countryCode ].name )
        {
            countryName = getLocalizedText( countryByCountryCodeMap[ countryCode ].name, $languageTagStore );
        }
    }

    // -- STATEMENTS

    $:
    {
        countryCode;
        handleCountryCodeChange();
    }
</script>

<Accordion
    value={ countryName }
    label={ label }
    bind:isEditing={ isEditing }
>
    <CountryModal
        title={ label }
        bind:countryCode={ countryCode }
        bind:countryName={ countryName }
        bind:isOpen={ isEditing }
    />
</Accordion>

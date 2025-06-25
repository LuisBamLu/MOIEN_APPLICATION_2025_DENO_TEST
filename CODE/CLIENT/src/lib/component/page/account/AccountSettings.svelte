<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug, getMap } from 'senselogic-gist';
    import { profileSignedInStore } from '$store/profileStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import PersonalDetailInput from './PersonalDetailInput.svelte';
    import LabelledSelect from '../../element/LabelledSelect.svelte';
    import { currencyArrayStore } from '$src/lib/store/currencyArrayStore';
    import { onMount } from 'svelte';
    import { fetchData } from '$src/lib/base';
    import Loading from '../../element/Loading.svelte';

    // -- VARIABLES

    let isLoading = true;
    let languageByTagMap = getMap( $languageArrayStore, 'tag' );

    // -- FUNCTIONS

    function handleValidLanguage(
        event
        )
    {
        let selectedLanguage = event.target.value;

        let validLanguage = $languageArrayStore.find( language => language.tag === selectedLanguage );

        if ( validLanguage.isAvailable )
        {
            $languageTagStore = selectedLanguage;
        }
    }
    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( $currencyArrayStore === null )
            {
                let result = await fetchData( '/api/currency', { method: 'POST' } );

                $currencyArrayStore = result.currencyArray;
            }

            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .account-settings-container
    {
        display: flex;
        flex-direction: column;
        align-items: center;
        align-self: stretch;
    }

    :global( .account-settings-container .dashboard-accordion ),
    :global( .account-settings-container .dashboard-input )
    {
        border: 0;
    }
</style>

<div class="account-settings-container">
    <PersonalDetailInput
        label={ getLocalizedTextBySlug( 'ad-search-language-label', $languageTagStore ) }
        initialValue={ getLocalizedText( languageByTagMap[ $profileSignedInStore.languageTag ]?.name ?? '', $languageTagStore ) }
        editable={ true }
    >
        <LabelledSelect
            name="language-tag"
            value={ $profileSignedInStore.languageTag }
            onChange={ ( event ) => handleValidLanguage( event ) }
        >
            {#each $languageArrayStore as language }
                <option value={ language.tag }>
                    { getLocalizedText( language.name, $languageTagStore ) }
                </option>
            {/each}
        </LabelledSelect>
    </PersonalDetailInput>
    <PersonalDetailInput
        label={ getLocalizedTextBySlug( 'ad-search-currency-label', $languageTagStore ) }
        initialValue={ $profileSignedInStore.currencyCode ?? getLocalizedTextBySlug( 'select-label', $languageTagStore ) }
        editable={ true }
    >
        {#if isLoading }
            <Loading />
        {:else}
            <LabelledSelect
                name="currency-code"
                value={ $profileSignedInStore.currencyCode ?? 'EUR' }
            >
                {#each $currencyArrayStore as currency }
                    <option value={ currency.code }>
                        { getLocalizedText( currency.singularName, $languageTagStore ) }
                    </option>
                {/each}
            </LabelledSelect>
        {/if}
    </PersonalDetailInput>
</div>

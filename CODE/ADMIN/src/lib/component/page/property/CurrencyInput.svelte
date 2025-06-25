<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{label: any, value: any, onChange?: any}} */
    let { label, value = $bindable(), onChange = () => {} } = $props();
    let currencyArray = $state([]);
    let isLoading = $state(true);

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/currency', { method: 'POST' } );
            currencyArray = result.currencyArray;
            isLoading = false;
        }
        )
</script>

{#if isLoading }
    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
{:else}
    <LabelledSelect label={ label } bind:value={ value } onChange={ onChange }>
        {#each currencyArray as currency }
            <option value={ currency.code }>
                { getLocalizedText( currency.singularName, $languageTagStore ) }
            </option>
        {/each}
    </LabelledSelect>
{/if}

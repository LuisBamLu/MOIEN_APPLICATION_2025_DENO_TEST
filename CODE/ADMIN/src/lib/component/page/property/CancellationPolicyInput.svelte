<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';

    // -- VARIABLES

    /** @type {{label: any, value: any, onChange?: any}} */
    let { label, value = $bindable(), onChange = () => {} } = $props();
    let cancellationPolicyArray = $state([]);
    let isLoading = $state(true);

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/cancellation-policy', { method: 'POST' } );
            cancellationPolicyArray = result.cancellationPolicyArray;

            isLoading = false;
        }
        );
</script>

{#if isLoading }
    { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
{:else}
    <LabelledSelect
        label={ label }
        bind:value={ value }
        onChange={ onChange }
    >
        {#each cancellationPolicyArray as cancellationPolicy }
            <option value={ cancellationPolicy.id }>
                { getLocalizedText( cancellationPolicy.name, $languageTagStore ) }
            </option>
        {/each}
    </LabelledSelect>
{/if}

<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Input from '$component/element/Input.svelte';
    import { createEventDispatcher } from 'svelte';

    // -- VARIABLES

    /** @type {{value: any}} */
    let { value = $bindable() } = $props();
    const dispatch = createEventDispatcher();

    // -- FUNCTIONS

    function handleChange(
        )
    {
        dispatch( 'change', value );
    }

    run(() => { value; handleChange() });
</script>

<Input
    label={ getLocalizedTextBySlug( 'house-rules-page-check-in-time-label', $languageTagStore ) }
    type="time"
    bind:value={ value[ 0 ] }
/>
<Input
    label={ getLocalizedTextBySlug( 'house-rules-page-check-out-time-label', $languageTagStore ) }
    type="time"
    bind:value={ value[ 1 ] }
/>

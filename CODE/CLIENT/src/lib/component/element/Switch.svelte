<script>
    // -- IMPORTS

    import Switch from 'senselogic-flow/Switch.svelte';

    // -- EXPORTS

    export let value = false;
    export let onChange = ( value ) => {};
    $: checked = value;

    // -- FUNCTIONS

    function handleChange(
        event
        )
    {
        value = event.target.checked;

        onChange( value );
    }
</script>

<Switch on:change={ handleChange } />

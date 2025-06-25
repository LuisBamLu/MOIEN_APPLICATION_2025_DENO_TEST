<script>
    import { run } from 'svelte/legacy';

    // -- EXPORTS

    /** @type {{value?: boolean, onChange?: any, ariaLabel?: string, disabled?: boolean}} */
    let {
        value = $bindable(false),
        onChange = ( value ) => {},
        ariaLabel = 'Switch',
        disabled = false
    } = $props();

    let checked;
    run(() => {
        checked = value;
    });

    // -- FUNCTIONS

    function handleChangeEvent(
        event
        )
    {
        value = event.target.checked;

        onChange( value );
    }
</script>

<div class="switch" role="switch" aria-checked={ checked } aria-label="{ ariaLabel }">
    <input
        class="input"
        type="checkbox"
        bind:checked
        onchange={handleChangeEvent}
        disabled={ disabled }
    />
    <span class="slider"></span>
</div>

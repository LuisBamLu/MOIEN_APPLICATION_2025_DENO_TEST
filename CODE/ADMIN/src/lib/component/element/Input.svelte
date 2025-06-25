<script>
    // -- IMPORTS

    import { getRandomTuid } from 'senselogic-gist';
    import { getClassName } from '$lib/base';

    // -- VARIABLES
    let {
            disabled = false,
            error = false,
            fullWidth = true,
            helperText = '',
            id = '',
            label = '',
            multiline = false,
            name = '',
            readonly = false,
            required = false,
            value = $bindable(),
            rows = 1,
            cols = 1,
            type = 'text',
            allowPast = null,
            placeholder = '',
            color = false,
            class: className = '',
            change = () => {},
            startAdornment = null,
            endAdornment = null,
            ...rest
        } = $props();

    let shrink =
        $state(
            type === 'number'
            ? value
            : Boolean( value ) || type === 'date' || type === 'number'
            );

    let labelId = $state( id + getRandomTuid() );
    let minDate = $derived( allowPast ? null : new Date().toISOString().slice( 0, 16 ) );

    // -- FUNCTIONS

    function handleChange(
        )
    {
        change( value );
    }

    // ~~

    function handleShrink(
        )
    {
        shrink = Boolean( value );
    }

    // -- STATEMENTS

    $effect(
        () =>
        {
            handleChange();
        }
        );
</script>

<style lang="stylus">
    .full-width
    {
        width: 100%;
    }
</style>
<div class={[ "input-root input-container", fullWidth && "full-width" ]}>
    {#if label }
        <label
            class:error={ error }
            class="input-label"
            data-shrink={ Boolean( value ) || shrink }
            for={ labelId }
            id={ labelId + '-label' }
        >
            { label }
            { required ? ' *' : '' }
        </label>
    {/if}
    <div class="input-content" class:error={ error } class:blockItemColor={ color } class:adornment-end={ endAdornment !== null }>
        {#if startAdornment !== null }
            <div class="input-start-adornment">
                <p class="input-paragraphy">
                    {@render startAdornment()}
                </p>
            </div>
        {/if}
        {#if multiline }
            <textarea
                style="resize: none"
                placeholder={ placeholder }
                readonly={ readonly }
                aria-invalid="true"
                aria-describedby="outlined-error-helper-text-helper-text"
                id={ labelId }
                class="input"
                bind:value
                disabled={ disabled }
                required={ required }
                name={ name }
                onfocus={ handleShrink }
                onblur={ handleShrink }
                onchange={ handleChange }
                rows={ rows }
                cols={ cols }
            ></textarea>
        {:else}
            <input
                { ...rest }
                placeholder={ placeholder }
                readonly={ readonly }
                aria-invalid="true"
                aria-describedby="outlined-error-helper-text-helper-text"
                id={ labelId }
                class="input { getClassName( className ) }"
                bind:value
                disabled={ disabled }
                required={ required }
                name={ name }
                onfocus={ handleShrink }
                onblur={ handleShrink }
                onchange={ handleChange }
            />
        {/if}
        <fieldset
            aria-hidden="true"
            class="fieldset"
            class:has-label={ Boolean( label ) }
        >
            {#if label }
                <legend
                    class="legend"
                    data-input-filled={ Boolean( value ) || shrink }
                >
                    <span>
                        { label }
                        { required ? ' *' : '' }
                    </span>
                </legend>
            {/if}
        </fieldset>
        {#if endAdornment !== null }
            <div class="input-end-adornment">
                <p class="input-paragraphy">
                    {@render endAdornment()}
                </p>
            </div>
        {/if}
    </div>
    {#if error || helperText }
        <p
            class="helper-text"
            class:error={ error }
            id="outlined-error-helper-text-helper-text"
        >
            { helperText }
        </p>
    {/if}
</div>

<script>
    import { createBubbler } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- IMPORTS

    import { getRandomTuid } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{disabled?: boolean, error?: boolean, fullWidth?: boolean, helperText?: string, id?: string, label?: string, name?: string, required?: boolean, value: any, shrink?: any, children?: import('svelte').Snippet}} */
    let {
        disabled = false,
        error = false,
        fullWidth = false,
        helperText = '',
        id = '',
        label = '',
        name = '',
        required = false,
        value = $bindable(),
        shrink = $bindable(Boolean( value )),
        children
    } = $props();
    let labelId = id + getRandomTuid();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .input-root
    {
        margin: 0.5rem;
        width: var( --input-root-width, 25ch );
    }

    .input-container
    {
        position: relative;

        margin: 0px;
        min-width: 0px;
        border: 0px;
        padding: 0px;

        display: inline-flex;
        flex-direction: column;

        vertical-align: top;
    }

    .input-label.error
    {
        color: rgb(211, 47, 47);
    }

    .input-label
    {
        z-index: 1;
        position: absolute;
        top: 0px;
        left: 0px;
        transform-origin: left top;
        transform: translate(0.875rem, -0.5625rem) scale(0.75);

        overflow: hidden;
        max-width: calc(133% - 2rem);
        padding: 0px;

        display: block;

        line-height: 1.4375em;
        font-size: 1rem;
        font-weight: 400;
        white-space: nowrap;
        letter-spacing: 0.00938em;
        text-overflow: ellipsis;
        color: rgba(0, 0, 0, 0.6);

        user-select: none;
        pointer-events: auto;
        transition: color 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
            transform 200ms cubic-bezier(0, 0, 0.2, 1) 0ms,
            max-width 200ms cubic-bezier(0, 0, 0.2, 1) 0ms;
    }

    [data-shrink="false"]
    {
        transform: translate(0.875rem, 0.8rem) scale(1);

        max-width: calc(100% - 1.5rem);

        pointer-events: none;
    }

    .input-content
    {
        box-sizing: border-box;

        display: inline-flex;

        line-height: 1.4375em;
        font-size: 1rem;
        font-weight: 400;
        letter-spacing: 0.00938em;
        color: rgba(0, 0, 0, 0.87);

        cursor: text;
        -webkit-box-align: center;
        position: relative;

        border-radius: 1em;
        padding-right: 0.875rem;

        align-items: center;

        background: whiteColor;
    }

    .input
    {
        box-sizing: content-box;
        margin: 0px;
        outline: none;
        height: 1.4375em;
        border: 0px;

        background: none;

        font: inherit;
        letter-spacing: inherit;
        color: currentColor;
        -webkit-tap-highlight-color: transparent;
        width: 100%;
        min-width: 0px;
        padding: 1em 0.875rem;
        -webkit-appearance: none;
        margin-left: 0.5rem;

        display: block;

        background: url("/admin/image/icon/select_chevron.svg") no-repeat right white;

        font-size: 0.875rem;
        font-weight: 500;
        letter-spacing: inherit;
        color: currentcolor;

        animation-name: mui-auto-fill-cancel;
        animation-duration: 10ms;
    }

    .input-content.error .fieldset
    {
        border-color: rgb(211, 47, 47);
    }

    .fieldset
    {
        position: absolute;

        overflow: hidden;
        inset: -5px 0px 0px;
        margin: 0px;
        min-width: 0%;
        border-width: 2px;
        border-style: solid;
        border-color: grayColor800;
        border-radius: inherit;
        padding: 0px 0.5rem;

        text-align: left;

        pointer-events: none;
    }

    .legend
    {
        overflow: hidden;
        height: 0.6875rem;
        width: auto;
        padding: 0px;

        display: block;
        float: unset;

        visibility: hidden;

        font-size: 0.75em;
        white-space: nowrap;

        transition: max-width 100ms cubic-bezier(0, 0, 0.2, 1) 50ms;
    }

    [data-input-filled="true"]
    {
        max-width: 100%;
    }

    [data-input-filled="false"]
    {
        max-width: 0.01px;
    }

    .legend > span
    {
        padding-left: 0.3125rem;
        padding-right: 0.3125rem;

        display: inline-block;

        visibility: visible;
        opacity: 0;
    }

    .helper-text.error
    {
        color: rgb(211, 47, 47);
    }

    .helper-text
    {
        margin: 3px 0.875rem 0px;

        line-height: 1.66;
        font-size: 0.75rem;
        font-weight: 400;
        letter-spacing: 0.03333em;
        text-align: left;
        color: rgba(0, 0, 0, 0.6);
    }

    .full-width
    {
        width: 100%;
    }

    @-webkit-keyframes mui-auto-fill
    {
        from
        {
            display: block;
        }
    }

    @keyframes mui-auto-fill
    {
        from
        {
            display: block;
        }
    }

    @-webkit-keyframes mui-auto-fill-cancel
    {
        from
        {
            display: block;
        }
    }

    @keyframes mui-auto-fill-cancel
    {
        from
        {
            display: block;
        }
    }
</style>

<div class="input-root input-container" class:full-width={ fullWidth }>
    {#if label }
        <label
            class:error={ error }
            class="input-label"
            data-shrink={ Boolean( value ) || shrink }
            for={ labelId }
            id={ labelId + '-label' }
        >
            { label }{ required ? ' *' : '' }
        </label>
    {/if}
    <div class="input-content" class:error={ error }>
        <select
            aria-invalid="true"
            aria-describedby="{ labelId }-select"
            id={ labelId }
            class="input"
            bind:value
            disabled={ disabled }
            required={ required }
            name={ name }
            onfocus={() => ( shrink = true )}
            onblur={() => ( shrink = false )}
            onchange={bubble('change')}
        >
            {@render children?.()}
        </select>
        <fieldset
            aria-hidden="true"
            class="fieldset"
        >
                <legend
                    class="legend"
                    data-input-filled={ Boolean( value ) || shrink }
                >
                    {#if label }
                        <span>
                            { label }
                        </span>
                    {/if}
                </legend>
        </fieldset>
    </div>
    {#if error || helperText }
        <p
            class="helper-text"
            class:error={ error }
            id="{ labelId }-helper-text"
        >
            { helperText }
        </p>
    {/if}
</div>

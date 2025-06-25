<script>
    // -- IMPORTS

    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    export let label;
    export let iconClass = null;
    export let actionLabel = null;
    export let helper = null;
    export let value = null;
    export let showValue = true;
    export let isEditing = false;
    export let closeOnValueChange = false;
    export let isEditable = true;
    export let error = false;

    // -- STATEMENTS

    $:
    {
        value;

        if ( closeOnValueChange )
        {
            isEditing = false;
        }
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .accordion
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
    }

    .accordion.has-error
    {
        border-color: rgb(211, 47, 47);
    }

    .cluster
    {
        display: flex;
        gap: 0.75rem;
        align-items: center;
    }

    .accordion-label-group
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;

        cursor: pointer;
    }

    .accordion-arrow-icon
    {
        transition: 0.4s all ease;
    }

    .editing
    {
        transform: rotate( 90deg );
    }

    .has-error
    {
        color: rgb(211, 47, 47);
    }
</style>

<div
    class="accordion"
    class:has-error={ error }
    use:clickOutside
    on:clickOutside={ () => isEditing = false }
>
    <button
        type="button"
        class="accordion-label-group"
        on:click={ () => isEditing = !isEditing }
    >
        <div class="cluster">
            {#if iconClass }
                <div class={ iconClass }/>
            {/if}
            <div
                class="font-size-90 font-weight-500 color-gray-100"
                class:has-error={ error }
            >
                { label }
            </div>
        </div>
        <div class="cluster">
            {#if actionLabel }
                <div class="font-size-75 font-weight-700 color-gray-300">
                    { actionLabel }
                </div>
            {/if}
            {#if isEditable }
                <div
                    class="{ error ? 'red-500-right-caret' : 'gray-right-caret' }-icon size-150 accordion-arrow-icon"
                    class:editing={ isEditing }
                />
            {/if}
        </div>
    </button>
    {#if isEditing }
        <slot/>
    {:else}
        {#if ( value || helper ) && showValue }
            <div class="font-size-75 font-weight-500 color-gray-300">
                {#if value !== null && value !== undefined }
                    { value }
                {:else}
                    { helper }
                {/if}
            </div>
        {/if}
    {/if}
</div>

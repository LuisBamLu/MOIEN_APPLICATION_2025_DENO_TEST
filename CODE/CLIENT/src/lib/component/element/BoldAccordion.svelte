<script>
    // -- IMPORTS

    import { clickOutside } from '$lib/base';

    // -- VARIABLES

    export let label;
    export let isEditing = false;
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
</style>

<div
    class="accordion"
    use:clickOutside
    on:clickOutside={ () => isEditing = false }
>
    <button
        type="button"
        class="accordion-label-group"
        on:click={ () => isEditing = !isEditing }
    >
        <div class="font-size-100 font-weight-700 color-gray-100">
            { label }
        </div>
        <div class="gray-right-caret-icon size-150 accordion-arrow-icon" class:editing={ isEditing } />
    </button>
    {#if isEditing }
        <slot/>
    {/if}
</div>

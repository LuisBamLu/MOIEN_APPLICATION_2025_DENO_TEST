<script>
    // -- IMPORTS

    // -- CONSTANTS

    /** @type {{onEdit: any, onDelete: any, isShownEditing?: boolean, isShownDelete?: boolean}} */
    let {
        onEdit,
        onDelete,
        isShownEditing = false,
        isShownDelete = false
    } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .edit-row
    {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        opacity: 0;

        transition: opacity 0.2s ease-in-out;

        +media( smaller-48em )
        {
            justify-content: flex-end;

            opacity: 1;
        }
    }

    .button
    {
        border-radius: 0.75rem;
        padding: 0.5rem 1rem;

        display: flex;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;

        background: grayColor950;

        cursor: pointer;
    }

    .edit-row:hover
    {
        opacity: 1;
    }
</style>

<div class="edit-row">
    {#if isShownEditing }
        <button class="button" type="button" onclick={onEdit} disabled={ !isShownEditing }>
            <div class="blue-edit-outlined-icon size-150"></div>
        </button>
    {/if}

    {#if isShownDelete }
        <button class="button" type="button" onclick={onDelete} disabled={ !isShownDelete }>
            <div class="red-500-delete-icon size-150"></div>
        </button>
    {/if}
</div>

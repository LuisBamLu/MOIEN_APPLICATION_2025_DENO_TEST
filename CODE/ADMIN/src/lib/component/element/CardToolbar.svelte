<script>
    // -- IMPORTS

    import IconButton from './IconButton.svelte';

    // -- VARIABLES

    /** @type {{onSave: any, onDelete: any}} */
    let { onSave, onDelete } = $props();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .form-toolbar
    {
        margin-top: 1rem;

        display: flex;
        gap: 1rem;
        justify-content: end;
        align-items: center;
    }
</style>

<div class="form-toolbar">
    <IconButton on:click={ onSave }>
        <div class="blue-edit-icon size-150"></div>
    </IconButton>
    <IconButton on:click={ onDelete }>
        <div class="red-500-delete-icon size-150"></div>
    </IconButton>
</div>

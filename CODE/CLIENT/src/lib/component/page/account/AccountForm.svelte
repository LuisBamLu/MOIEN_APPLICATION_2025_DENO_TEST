<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalButton from '../../modal/ModalButton.svelte';

    // -- VARIABLES

    export let isEditing = false;
    export let isSubmitting = false;
    export let hasButton = true;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .dashboard-input-form
    {
        display: none;
    }

    .dashboard-input-form.visible
    {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        align-items: center;
    }

    .dashboard-input-container
    {
        width: 100%;

        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;

        +media( desktop )
        {
            flex-wrap: nowrap;
        }
    }
</style>

<form
    class="dashboard-input-form"
    class:visible={ isEditing }
    on:submit|preventDefault
>
    <div class="dashboard-input-container">
        <slot />
    </div>
    {#if hasButton }
        <ModalButton
            type="submit"
            variant="light"
            fullWidth={ true }
            isLoading={ isSubmitting }
            text={ getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
        />
    {/if}
    <!-- <button
        type="submit"
        class="dashboard-input-button font-size-100 font-weight-700 color-green"
    >
        { getLocalizedTextBySlug( 'save-label', $languageTagStore ) }
    </button> -->
</form>

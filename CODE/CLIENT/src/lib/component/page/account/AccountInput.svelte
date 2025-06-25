<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AccountForm from '$component/page/account/AccountForm.svelte';

    // -- VARIABLES

    export let label;
    export let initialValue;
    export let editable = false;
    export let helper = null;
    export let handleSubmit = ( event ) => {}
    export let isEditing = false;
    export let isSubmitting = false;
    export let hasButton = true;

    // -- FUNCTIONS

    function handleToggle(
        )
    {
        isEditing = !isEditing;
    }

    // ~~

    async function submit(
        event
        )
    {
        await handleSubmit( event );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl'

    // -- ELEMENTS

    :global( .label-and-input-container )
    {
        width: 100%;
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: column;

        background-color: whiteColor;
    }

    // -- CLASSES

    .dashboard-input
    {
        width: 100%;
        border-bottom: 1px solid lightGrayBorderColor;
        padding: 0.75rem 0;

        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }

    .dashboard-input-label-group
    {
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .dashboard-input-edit-toggler
    {
        text-decoration: none;
        color: greenColor300;

        cursor: pointer;
    }

    .non-editable
    {
        cursor: not-allowed;
    }

    .input-display
    {
        overflow: hidden;
        width: 50%;

        white-space: nowrap;
        text-overflow: ellipsis;
    }
</style>

<div
    class="dashboard-input"
    class:non-editable={ !editable }
>
    <div class="dashboard-input-label-group">
        <div class="font-size-90 font-weight-500 color-black dash-board-input-label">
            { label }
        </div>
        {#if editable }
            <button
                type="button"
                class="font-size-75 font-weight-700 dashboard-input-edit-toggler"
                on:click={ handleToggle }
            >
                {#if isEditing }
                    { getLocalizedTextBySlug( 'cancel-label', $languageTagStore ) }
                {:else}
                    { getLocalizedTextBySlug( 'edit-label', $languageTagStore ) }
                {/if}
            </button>
        {/if}
    </div>
    <AccountForm
        isSubmitting={ isSubmitting }
        bind:isEditing={ isEditing }
        on:submit={ submit }
        hasButton={ hasButton }
    >
        <slot />
    </AccountForm>
    {#if !isEditing }
        {#if initialValue }
            <div class="font-size-75 font-weight-500 color-gray input-display">
                { initialValue }
            </div>
        {/if}
    {:else}
        {#if helper }
            <div class="font-size-75 color-gray">
                { helper }
            </div>
        {/if}
    {/if}
</div>

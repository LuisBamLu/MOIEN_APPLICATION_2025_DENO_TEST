<script>
    import { run, createBubbler, preventDefault } from 'svelte/legacy';

    const bubble = createBubbler();
    // -- IMPORTS

    import { getNormalCaseFromSnakeCaseString, inputTypeFromDataTypeMap } from '$lib/base';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { fade, fly } from 'svelte/transition';
    import Input from './Input.svelte';
    import InputLocalizedForm from './InputLocalizedForm.svelte';

    // -- VARIABLES

    /** @type {{row: any, handleDelete?: any, form?: any}} */
    let { row, handleDelete = ( id ) => {}, form = $bindable(null) } = $props();

    run(() => {
        if ( form )
        {
            form.scrollIntoView( { behavior: 'smooth' } );
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- ELEMENTS

    button
    {
        padding: 0.5rem;

        text-transform: uppercase;

        cursor: pointer;
    }

    // -- CLASSES

    .generic-table-form
    {
        border: 2px solid lightGrayBorderColor;
        border-radius: 0.75rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .delete-button
    {
        background-color: red;

        color: white;
    }
</style>

<form
    class="generic-table-form"
    in:fade={ { duration: 250 } }
    out:fly={ { x: 250, duration: 250 } }
    bind:this={ form }
    onsubmit={preventDefault(bubble('submit'))}
>
    {#each Object.entries( row ) as [ fieldName, fieldValue ] }
        {#if fieldName === 'name' }
            <InputLocalizedForm
                name={ fieldName }
                label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                itemsString={ fieldValue }
                languageArray={ $languageArrayStore }
            />
        {:else if fieldName !== 'creationTimestamp' && fieldName !== 'updateTimestamp' }
            <Input
                name={ fieldName }
                label={ getNormalCaseFromSnakeCaseString( fieldName ) }
                value={ fieldValue }
                type={ inputTypeFromDataTypeMap[ typeof fieldValue ] }
            />
        {/if}
    {/each}
    <button type='submit'>Submit</button>
    <button class="delete-button" type="button" onclick={() => handleDelete( row.id )} >
        Delete
    </button>
</form>

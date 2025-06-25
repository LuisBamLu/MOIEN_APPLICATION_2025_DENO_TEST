<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { slide } from 'svelte/transition';
    import { generateFilePath } from '$lib/filePath';

    // -- VARIABLES

    /** @type {{isOpen: any, doc: any}} */
    let { isOpen = $bindable(), doc } = $props();
    let modal = $state();

    // -- STATEMENTS

    onMount(
        () =>
        {
            let handleClickOutside = (event) =>
            {
                if ( modal && !modal.contains( event.target ) )
                {
                    isOpen = false;
                }
            };

            setTimeout(
                () =>
                {
                    document.addEventListener('click', handleClickOutside);
                },
                500
                );

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
        );
</script>

<style lang="stylus">
    // -- ELEMENTS

    .doc-list-modal
    {
        z-index: 1000;
        position: fixed;
        top: 4rem;
        bottom: 0;
        left: 0;
        right: 0;

        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .doc-modal
    {
        min-width: 24rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: white;
    }

    .doc-modal-body
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 0 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: white;
    }

    .doc-modal-description
    {
        text-align: justify;
    }
</style>

<div class="doc-list-modal" transition:slide>
    <div class="doc-modal" bind:this={ modal }>
        <div class="doc-modal-body">
            <div class="font-size-100 font-weight-700 color-gray-100">
                { doc.name }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300 doc-modal-description">
                Description: { doc.description }
            </div>
            <img src={ generateFilePath( doc.filePath ) } alt={ doc.name }>
        </div>
    </div>
</div>

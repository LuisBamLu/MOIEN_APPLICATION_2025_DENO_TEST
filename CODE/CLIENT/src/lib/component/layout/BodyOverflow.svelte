<script>
    // -- IMPORTS

    import { onMount, onDestroy } from 'svelte';

    // -- FUNCTIONS

    function setOverflow(
        hidden
        )
    {
        window.scrollTo( 0, 0 );
        document.body.style.overflowY = hidden ? 'hidden' : '';
        document.body.style.overflowX = hidden ? 'hidden' : '';
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            setOverflow( true );
        }
        );
    // ~~

    onDestroy(
        () =>
        {
            setOverflow( false );
        }
        );
</script>

<script>
    // -- IMPORTS

    import { navigate } from 'svelte5-router';
    import { onMount } from 'svelte';

    // -- STATEMENTS

    onMount(
        () =>
        {
            navigate( '/admin/statistics/dashboard' );
        }
        );
</script>

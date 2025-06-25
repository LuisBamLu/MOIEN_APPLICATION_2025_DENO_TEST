<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { navigate, useLocation } from 'svelte5-router';
    import { profileSignedInStore } from '$store/profileStore';
    /** @type {{children?: import('svelte').Snippet}} */
    let { children } = $props();

    // -- VARIABLES

    let location = useLocation();

    // -- STATEMENTS

    run(() => {
        if ( !$profileSignedInStore )
        {
            navigate(
                '/admin',
                {
                    state :
                        {
                            from : $location.pathname
                        },
                    replace : true,
                }
                );
        }
    });
</script>

{#if $profileSignedInStore }
    {@render children?.()}
{/if}

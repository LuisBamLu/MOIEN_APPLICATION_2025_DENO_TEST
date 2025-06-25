<script>
    // -- IMPORTS

    import { Route } from 'svelte5-router';
    import PrivateRouteGuard from './PrivateRouteGuard.svelte';

    // -- VARIABLES

  /** @type {{path: any, children?: import('svelte').Snippet<[any]>}} */
  let { path, children } = $props();
</script>

<Route { path }  >
  {#snippet children({ params, location })}
    <PrivateRouteGuard>
      {@render children?.({ params, location, })}
    </PrivateRouteGuard>
  {/snippet}
</Route>

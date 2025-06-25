<script>
    // -- IMPORTS

    import { Route } from 'svelte-routing';
    import Menu from '$component/layout/Menu.svelte';
    import { onMount } from'svelte';
    import AnimatedRouteComponent from '../AnimatedRouteComponent.svelte';

    // -- VARIABLES

    export let path;
    export let component;
    export let componentParams = {};
    let moduleDefault = null;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( typeof component === 'function' )
            {
                const module = await component();
                moduleDefault = module.default;
            }
        }
        );
</script>

{#if moduleDefault }
    <Route path={ path } let:params>
        <AnimatedRouteComponent>
            <svelte:component this={ moduleDefault } { ...params } { ...componentParams } />
            <Menu/>
        </AnimatedRouteComponent>
    </Route>
{/if}

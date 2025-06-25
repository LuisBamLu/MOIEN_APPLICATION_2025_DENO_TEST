<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { navigate } from 'svelte-routing';

    // -- FUNCTIONS

    async function authCallback(
        code,
        next
        )
    {
        try
        {
            let response = await fetchData(
                '/api/auth/callback',
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify( { code } )
                }
                );

            if ( response.success )
            {
                navigate( `/${ next.slice( 1 ) }`, { replace: true } );
            }
            else
            {
                console.error( 'Authentication failed' );
            }
        }
        catch ( error )
        {
            console.error( 'Error during authentication', error );
        }
    }

    onMount(
        async () =>
        {
            let params = new URLSearchParams( window.location.search );
            let code = params.get( 'code' );
            let next = params.get( 'next' ) || '/';
            if ( code )
            {
                await authCallback( code, next );
            }
            else
            {
                console.error( 'No code found in query params' );
            }
        }
        );
</script>

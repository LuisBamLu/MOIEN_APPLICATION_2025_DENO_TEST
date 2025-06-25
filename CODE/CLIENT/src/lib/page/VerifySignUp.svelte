<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { hostUrl }from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response = await fetch(
                    hostUrl + '/api/verify-sign-up' + window.location.search,
                    {
                        credentials: 'include'
                    }
                    );

                if ( response.ok )
                {
                    let data = await response.json();
                    $profileSignedInStore = data;
                    navigate( '/' );
                }
                else
                {
                    navigate( '/error' );
                }
            }
            catch ( error )
            {
                console.error( 'ERROR:' + error );
                navigate( '/' );
            }
        }
        );
</script>

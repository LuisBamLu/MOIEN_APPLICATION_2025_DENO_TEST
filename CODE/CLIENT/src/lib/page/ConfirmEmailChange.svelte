<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { hostUrl } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response
                    = await fetch(
                        hostUrl + '/api/auth/confirm-email-change' + window.location.search,
                        { method: 'POST', credentials: 'include' }
                        );

                if ( response.ok )
                {
                    let data = await response.json();
                    $profileSignedInStore = { ...$profileSignedInStore, email: data.email };
                    navigate( '/' );
                }
                else
                {
                    navigate( '/error' );
                }
            }
            catch ( error )
            {
                console.error( 'ERROR:', error );
                navigate( '/' );
            }
        }
    );
</script>

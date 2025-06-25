<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { authModalStore } from '$store/authModalStore';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    let isLoading = true;

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( !$isLoadingProfile && !$profileSignedInStore )
            {
                $authModalStore = 'sign-in';
                navigate( '/' );
            }
            else
            {
                isLoading = false;
            }
        }
        );
</script>

{#if isLoading }
    <Loading />
{:else}
    <slot />
{/if}

<script>
    // -- IMPORTS

    import { navigate } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalActions from '$component/modal/ModalActions.svelte';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import ModalContent from '$component/modal/ModalContent.svelte';
    import ModalHeader from '$component/modal/ModalHeader.svelte';
    import ModalRoot from '$component/modal/ModalRoot.svelte';
    import { profileSignedInStore, profileStateStore } from '$store/profileStore';
    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { checkPropertyFavorite, handlePropertyFavorite } from '$lib/favorite';
    import { toast } from '$lib/toast';
    import { isVerifyIdentityModalOpen } from '$store/propertyArray';

    // -- VARIABLES

    export let property;
    let isPendingDocuments = false;
    let propertyId = property.id
    let isFavorite = checkPropertyFavorite( $profileSignedInStore, propertyId );

    // -- FUNCTIONS

    function navigateToDashboard(
        )
    {
        profileStateStore.set({ openProfile: true });
        navigate( '/dashboard' )
    }

    // ~~

    function navigateToSearch(
        )
    {
        navigate( '/search' )
    }

    // ~~

    async function setFavorite(
        )
    {
        if ( isFavorite === false )
        {
            isFavorite = await handlePropertyFavorite( $profileSignedInStore, propertyId, isFavorite );
            toast.success( getLocalizedTextBySlug( 'added-to-favorite-label', $languageTagStore ) );
        }

        isVerifyIdentityModalOpen.set( false );
        setTimeout(() => window.location.reload(), 2000);
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let data = await fetchData( '/api/page/user-documents', { method: 'POST', credentials: 'include' } );

            if ( data.length > 0 )
            {
                let idCard = data.find( ( item ) => item.typeId === 'id-card' );
                let pendingIdCard = idCard && idCard.validationStatusId === 'pending';

                if ( pendingIdCard )
                {
                    isPendingDocuments = true;
                }
            }
        }
    );
</script>

<ModalRoot bind:isOpen={ $isVerifyIdentityModalOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'complete-your-profile-label', $languageTagStore ) }
        onClose={ () => isVerifyIdentityModalOpen.set( false ) }
    />
    <ModalContent>
        {#if isPendingDocuments }
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'pending-documents-title-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'pending-documents-comment-label', $languageTagStore ) }
            </div>
        {:else}
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'unfinished-profile-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'unfinished-profile-message-label', $languageTagStore ) }
            </div>
        {/if}
    </ModalContent>
    <ModalActions>
        {#if isPendingDocuments }
            <ModalButton
                text={ getLocalizedTextBySlug( 'go-to-search-label', $languageTagStore ) }
                on:click={ navigateToSearch }
            />
            <ModalButton
                text={ getLocalizedTextBySlug( 'favorite-and-close-label', $languageTagStore ) }
                on:click={ setFavorite }
                variant="outlined"
            />
        {:else}
            <ModalButton
                text={ getLocalizedTextBySlug( 'go-to-dashboard-label', $languageTagStore ) }
                on:click={ navigateToDashboard }
            />
        {/if}
    </ModalActions>
</ModalRoot>

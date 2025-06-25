<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { navigate } from 'svelte-routing';
    import { fetchData } from '$lib/base';
    import { profileSignedInStore } from '$store/profileStore';

    // -- VARIABLES

    export let propertyId;
    export let propertyUserId;
    export let conversationTypeId;

    let conversation;

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadConversation();
        }
        );

    // -- FUNCTIONS

    async function loadConversation(
        )
    {
        try
        {
            let response
                = await fetchData(
                    '/api/conversation/get',
                    {
                        method: 'POST',
                        body: JSON.stringify(
                            {
                                type: 'getConversation',
                                propertyId: propertyId,
                                conversationTypeId: conversationTypeId,
                                sourceUserProfileId: $profileSignedInStore.userId,
                                targetUserProfileId: propertyUserId
                            }
                            ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            if ( response.conversation )
            {
                conversation = response.conversation;
            }
            else
            {
                conversation = await createConversation();
            }

            if ( conversation )
            {
                navigate( '/dashboard/conversation/' + '?conversationId=' + conversation.id );
            }
        }
        catch ( error )
        {
            console.error( 'Error loading conversation:', error );
        }
    }

    // ~~

    async function createConversation(
        )
    {
        let response = await fetchData( `/api/conversation/add`,
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'addConversation',
                            propertyId: propertyId,
                            conversationTypeId: conversationTypeId,
                            sourceUserProfileId: $profileSignedInStore.userId,
                            targetUserProfileId: propertyUserId
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

        return response.data;
    }
</script>

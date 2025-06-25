<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { fetchData } from '$lib/base';
    import { selectedConversation } from '$store/conversationStore';
    import { languageTagStore } from '$store/languageTagStore';
    import Loading from '$component/element/Loading.svelte';
    import Image from '../../element/Image.svelte';

    // -- VARIABLES

    export let isLoading = true;
    let property;

    // -- FUNCTIONS

    async function loadProperty(
        )
    {
        try
        {
            let propertyData = await fetchData( `/api/conversation/${ $selectedConversation.propertyId }`,
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'getPropertyOfConversationById'
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            property = propertyData.property;
        }
        catch ( error )
        {
            console.error( 'Error in load property:', error );
        }
        finally
        {
            isLoading = false;
        }
    }

    // -- STATEMENT

    onMount(
        async () =>
        {
            await loadProperty();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .conversation-message-property
    {
        border: 2px solid grayColor800;
        border-radius: 0.75rem;
        padding: 0.5rem;

        display: flex;
        gap: 1rem;
        align-items: flex-start;
        align-self: stretch;

        background: grayColor950;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        +media( desktop )
        {
            border-radius: 1rem;
            padding: 1rem;

            background: whiteColor;
            box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        }
    }

    :global( .conversation-message-property-image )
    {
        height: 4rem;
        width: 4rem;
        border-radius: 0.5rem;

        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;
        object-fit: cover;

        +media( desktop )
        {
            height: 8rem;
            width: 15rem;
        }
    }

    .conversation-message-property-description
    {
        display: flex;
        flex: 1 0 0;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
    }
</style>

{#if isLoading }
    <Loading/>
{:else}
    <header class="conversation-message-property">
        <Image
            class="conversation-message-property-image"
            imagePath={ property.imagePath }
            imageSize={ 640 }
        />
        <div class="conversation-message-property-description">
            <span class="font-size-90 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'visit-label', $languageTagStore ) }
                { getLocalizedText( property.title, $languageTagStore ) }
            </span>
            <span class="font-size-75 font-weight-500 color-gray">
                { getLocalizedText( property.title, $languageTagStore ) } .
                { getLocalizedTextBySlug( 'published-label', $languageTagStore ) }
            </span>
        </div>
    </header>
{/if}

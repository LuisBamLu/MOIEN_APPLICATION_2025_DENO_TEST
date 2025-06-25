<script>
    // -- IMPORTS

    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import Loading from '$lib/component/element/Loading.svelte';
    import Switch from 'senselogic-flow/Switch.svelte';
    import { messagingService } from '$src/lib/messaging_service';

    // -- VARIABLES

    let preferenceArray;
    let isLoading = true;

    // -- FUNCTIONS

    async function getNotificationPreferences(
        )
    {
        isLoading = true;

        try
        {
            let data = await fetchData(
                '/api/page/notification',
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

            preferenceArray = data.preferenceArray;
        }
        catch ( error )
        {
            console.error( error );
        }
        finally
        {
            isLoading = false;
        }
    }

    // ~~

    async function toggleNotificationPermission(
        permission
        )
    {
        try
        {
            await fetchData(
                '/api/page/notification/update',
                {
                    method : 'POST',
                    credentials : 'include',
                    body: JSON.stringify(
                        {
                            permission
                        }
                        )
                }
                );
        }
        catch ( error )
        {
            console.error( error );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await getNotificationPreferences();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .account-notification-settings-content
    {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-notification-settings-content-title
    {
        padding-bottom: 0.25rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: flex-start;
        align-self: stretch;
    }

    .account-notification-settings-content-switch
    {
        padding: 1rem 0px;

        display: flex;
        gap: 0.75rem;
        align-items: center;
        align-self: stretch;
    }

    .account-notification-settings-content-switch span
    {
        width: 100%;
    }
</style>

{#if isLoading }
    <p class="display-flex justify-content-center">
        <Loading/>
    </p>
{:else}
    <div class="account-notification-settings-content">
        {#each preferenceArray as preference }
            <div class="account-notification-settings-content-title">
                <span class="font-size-100 font-weight-700 color-gray-100">
                    { getLocalizedText( preference.name, $languageTagStore ) }
                </span>
                {#each preference.notificationMediumArray as { notificationMedium, permission } }
                    <div class="account-notification-settings-content-switch">
                        <span class="font-size-90 font-weight-700 color-gray-300">
                            { getLocalizedText( notificationMedium.name, $languageTagStore ) }
                        </span>
                        <Switch
                            bind:value={ permission.isGranted }
                            onChange={ () => toggleNotificationPermission( permission ) }
                        />
                    </div>
                {/each}
            </div>
        {/each}
    </div>
{/if}

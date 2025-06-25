<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import TableRow from '$component/element/table/TableRow.svelte';
    import TableCell from '$component/element/table/TableCell.svelte';
    import SubscriptionEdit from './SubscriptionEdit.svelte';

    // -- VARIABLES

    /** @type {{subscription: any}} */
    let { subscription = $bindable() } = $props();

    let isLoading = $state(true);
    let profile = $state();
    let provider = $state();
    let type = $state();
    let subscriptionEditIsOpen = $state(false);

    // -- FUNCTIONS

    async function loadData(
        )
    {
        isLoading = true;

        let data = await fetchData( '/api/subscription-item',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        type: 'getSubscriptionItem',
                        subscription: subscription
                    }
                ),
                headers: { 'Content-Type': 'application/json' }
            }
            );

        if ( data )
        {
            profile = data.profile;
            provider = data.provider;
            type = data.type;
        }
        else
        {
            profile = { firstName: 'Unknown' };
            provider = { name: 'Unknown' };
            type = { name: 'Unknown' };
        }

        isLoading = false;
    }

    // -- FUNCTIONS

    function onClick(
        )
    {
        subscriptionEditIsOpen = true;
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await loadData();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .subscription-list-item-status-active
    {
        height: 1.3rem;
        width: 1.3rem;
        border-radius: 50%;

        background-color: greenColor300;
    }

    .subscription-list-item-status-inactive
    {
        height: 1.3rem;
        width: 1.3rem;
        border-radius: 50%;

        background-color: redColor300;
    }
</style>

{#if isLoading }
    <div>{ getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }</div>
{:else}

        <TableRow on:click={ onClick }>
            <TableCell>
                {#if subscription.isActive }
                    <div class="subscription-list-item-status-active"></div>
                {:else}
                    <div class="subscription-list-item-status-inactive"></div>
                {/if}
            </TableCell>
            <TableCell>
                { getLocalizedText( type.name, $languageTagStore ) }
            </TableCell>
            <TableCell>
                { getLocalizedText( provider.name, $languageTagStore ) }
            </TableCell>
            <TableCell>
                { profile.email }
            </TableCell>
        </TableRow>
        {#if subscriptionEditIsOpen }
            <SubscriptionEdit
                bind:isOpen={ subscriptionEditIsOpen }
                bind:subscription={ subscription }
            />
        {/if}
{/if}

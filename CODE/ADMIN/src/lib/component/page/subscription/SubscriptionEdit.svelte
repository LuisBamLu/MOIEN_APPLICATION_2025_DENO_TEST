<script>
    import { preventDefault } from 'svelte/legacy';

    // -- IMPORTS

    import { onMount } from 'svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { subscriptionTypeArrayStore } from '$store/subscriptionTypeArrayStore';
    import { providerArrayStore } from '$store/providerArrayStore';
    import { getLocalizedText, getLocalizedTextBySlug, getRandomTuid } from 'senselogic-gist';
    import { slide } from 'svelte/transition';
    import { fetchData } from '$lib/base';
    import Switch from '$component/element/Switch.svelte';

    // -- VARIABLES

    /** @type {{isOpen: any, subscription?: any}} */
    let { isOpen = $bindable(), subscription = $bindable({
        id: getRandomTuid(),
        status: true,
        typeId: '',
        providerId: '',
        userId: ''
    }) } = $props();
    let modal = $state();

    // -- FUNCTIONS

    async function handleSubmit(
        )
    {
        if ( subscription.id )
        {
            let data = await fetchData(
                '/api/subscription-item/set',
                {
                    method: 'POST',
                    body: JSON.stringify(
                        {
                            type: 'setSubscription',
                            subscription: subscription
                        }
                        ),
                    headers: { 'Content-Type': 'application/json' }
                }
                );

            if ( data )
            {
                subscription = data.subscription;
            }
        }

        isOpen = false;
    }

    onMount(
        () =>
        {
            let handleClickOutside = ( event ) =>
            {
                if ( modal && !modal.contains( event.target ) )
                {
                    isOpen = false;
                }
            };

            setTimeout(
                () =>
                {
                    document.addEventListener('click', handleClickOutside);
                },
                500
                );

            return () => {
                document.removeEventListener('click', handleClickOutside);
            };
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    .property-subscription-modal
    {
        z-index: 1000;
        position: fixed;
        top: 4rem;
        bottom: 0;
        left: 0;
        right: 0;

        width: 100%;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        background-color: rgba( 0, 0, 0, 0.5 );
    }

    .subscription-modal
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .subscription-modal-head
    {
        min-width: 18rem;
        border-radius: 1rem;
        padding: 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: whiteColor;
    }

    .subscription-modal-body
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .subscription-form-vertical
    {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .subscription-form-switch
    {
        border-radius: 0.5rem;
        padding: 1rem;
        padding-left: 0;

        display: flex;
        flex-direction: row;
        justify-content: space-between;

        background-color: grayColor700;
    }

    .subscription-form-select
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    label
    {
        padding-left: 1rem;

        font-size: 1rem;
        font-weight: 700;
        color: greenColor300;
    }

    select
    {
        border: 1px solid grayColor500;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;
    }

    .subscription-button
    {
        border: 1px solid greenColor;
        border-radius: 0.75rem;
        padding: 0.75rem 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background-color: greenColor;

        color: whiteColor;

        cursor: pointer;
    }

    .subscription-button:hover
    {
        border: 1px solid greenColor300;

        background-color: greenColor300;
    }
</style>

<div
    class="property-subscription-modal"
    transition:slide
>
    <div
        class="subscription-modal"
        bind:this={ modal }
    >
        <div class="subscription-modal-head">
            <div class="font-size-100 font-weight-700 color-gray-100">
                { getLocalizedTextBySlug( 'subscription-edit-form-title-label', $languageTagStore ) }
            </div>
            <div class="font-size-90 font-weight-500 color-gray-300">
                { getLocalizedTextBySlug( 'subscription-edit-form-title-helper', $languageTagStore ) }
            </div>

        </div>
        <div class="subscription-modal-body">
            <form
                class="subscription-form-vertical"
                onsubmit={preventDefault(handleSubmit)}
            >
                <div class="subscription-form-switch">
                    <label for="status">
                        { getLocalizedText( 'Status¨fr:Statut¨de:Status', $languageTagStore ) }
                    </label>
                    <Switch
                        bind:value={ subscription.isActive }
                    />
                </div>
                <div class="subscription-form-select">
                    <label for="status">
                        { getLocalizedText( 'Type¨fr:Type¨de:Typ', $languageTagStore ) }
                    </label>
                    <select name="subscriptionTypeArray">
                        {#if $subscriptionTypeArrayStore.length > 0 }
                            {#each $subscriptionTypeArrayStore as subscriptionType }
                                <option value={ subscriptionType.id }>
                                    { getLocalizedText( subscriptionType.name, $languageTagStore ) }
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <div class="subscription-form-select">
                    <label for="status">
                        { getLocalizedText( 'Provider¨fr:Fournisseur¨de:Anbieter', $languageTagStore ) }
                    </label>
                    <select name="subscriptionTypeArray">
                        {#if $providerArrayStore.length > 0  }
                            {#each $providerArrayStore as provider }
                                <option value={ provider.id }>
                                    { getLocalizedText( provider.name, $languageTagStore ) }
                                </option>
                            {/each}
                        {/if}
                    </select>
                </div>
                <button
                    class="subscription-button"
                    type="submit"
                >
                    <div class="font-size-100 font-weight-700">
                        { getLocalizedTextBySlug( 'submit-edit-subscription-button-label', $languageTagStore ) }
                    </div>
                </button>
            </form>
        </div>
    </div>
</div>

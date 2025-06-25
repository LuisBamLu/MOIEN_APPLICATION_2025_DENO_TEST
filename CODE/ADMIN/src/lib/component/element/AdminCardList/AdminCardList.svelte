<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import AdminCard from './AdminCard.svelte';
    import { hasUserPermission } from '$store/profileStore';

    // -- VARIABLES

    /** @type {{cardArray?: any, name?: string}} */
    let { cardArray = [], name = '' } = $props();
    let value = $state('');
    let filteredCardArray = $state(cardArray);

    // -- STATEMENTS

    run(() => {
        filteredCardArray = cardArray.filter( card =>
            {
                return card.label.toLowerCase().includes( value.toLowerCase() );
            }
            );
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .admin-card-list
    {
        width: 100%;
        padding: 1rem 4rem 0;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;

        background-color: grayColor900;
        view-transition-name: admin-card-list;

        +media( smaller-48em )
        {
            padding-bottom: 2rem;
        }
    }

    .admin-card-list-head
    {
        width: 100%;
        padding-top: 0.5rem;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
    }

    .admin-card-list-title
    {
        font-size: 2rem;
        font-weight: 700;
        color: grayColor100;
    }

    .admin-card-list-search
    {
        width: 100%;
        border: 1px solid grayColor900;
        border-radius: 0.5rem;
        padding: 0.5rem 0.75rem;

        display: flex;
        flex-direction: row;
        gap: 0.5rem 0.5rem;
        align-items: center;

        background-color: white;

        +media( desktop )
        {
            width: 30%;
        }
    }

    .admin-card-list-search input
    {
        outline: none;
        width: 100%;
        border: none;

        background-color: transparent;

        font-size: 1rem;
        color: grayColor100;
    }

    .divisor
    {
        border-top: 1px solid grayColor700;
    }

    .admin-card-list-body
    {
        overflow-y: scroll;
        scrollbar-width: none;
        width: 100%;

        display: grid;
        grid-template-columns: repeat( auto-fill, minmax( 14rem , 1fr ) );
        gap: 2rem;
        &::-webkit-scrollbar
        {
            display: none;
        }

        +media( desktop )
        {
            height: 77vh;

            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
        }
    }
</style>

<main class="admin-card-list">
    <section class="admin-card-list-head">
        <div class="admin-card-list-title">
            { getLocalizedTextBySlug( name, $languageTagStore ) }
        </div>
        <div class="admin-card-list-search">
            <div class="gray-search-icon size-100"></div>
            <input bind:value placeholder={ getLocalizedTextBySlug( 'search-apply-button', $languageTagStore ) } />
        </div>
    </section>
    <div class="divisor"></div>
    <section class="admin-card-list-body">
        {#each filteredCardArray as card }
            {#if hasUserPermission( card.requiredPermissionSlug ) }
                <AdminCard
                    page={ card.page }
                    icon={ card.icon }
                    label={ card.label }
                />
            {/if}
        {/each}
    </section>
</main>

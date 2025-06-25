<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { fetchData } from '$lib/base';
    import { get } from 'svelte/store';
    import * as visitStore from '$store/visitStore';
    import ScheduleVisits from './ScheduleVisits.svelte';
    import ScheduleCalendar from './ScheduleCalendar.svelte';
    import SearchProfileBar from './SearchProfileBar.svelte';
    import Loading from '$component/element/Loading.svelte';

    // -- VARIABLES

    let currentVisits = $state();
    let profileArray;
    let currentProfile = $state();
    let isLoading = $state(true);

    // -- FUNCTIONS

    async function fetchUserVisits( user )
    {
        return await fetchData(
            '/api/visits',
            {
                method: 'POST',
                body: JSON.stringify(
                    {
                        type: 'user-visits',
                        user: user
                    }
                    )
            }
            );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            await visitStore.loadVisitArray();

            profileArray = get( visitStore.profileArrayStore );
            currentProfile = profileArray[ 0 ];

            isLoading = false;
        }
        );

    // ~~

    run(() => {
        async () => currentVisits = await fetchUserVisits( currentProfile );
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../../constant.styl';
    @import '../../../../../../mixin.styl';

    // -- CLASSES

    .horizontal-card
    {
        width: 48%;
        aspect-ratio: 2 / 1;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: center;

        background-color: white;
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);

        font-size: 1vw;
        font-weight: 500;
        color: grayColor;
        @media( max-width: 1200px )
        {
            width: 100%;
        }
    }

    .horizontal-card-head
    {
        margin-bottom: 1rem;
        min-height: 36px;
        width: 100%;

        display: flex;
        justify-content: space-between;
        align-items: center;
        h3
        {
            font-size: 1.5vw;
            font-weight: 700;
            color: grayColor100;
            @media( max-width: 1200px )
            {
                font-size: 3vw;
            }

            @media( max-width: 750px )
            {
                font-size: 5vw;
            }
        }
    }

    .horizontal-card-content
    {
        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: row;
    }

    .horizontal-card-left
    {
        height: 100%;
        width: 50%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }

    .horizontal-card-right
    {
        height: 100%;
        width: 50%;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
    }
</style>

<article class="horizontal-card">
    {#if isLoading }
        <Loading />
    {:else}
        <div class="horizontal-card-head">
            <h3>{ getLocalizedTextBySlug( 'Visit schedule', $languageTagStore ) }</h3>
            <SearchProfileBar bind:currentProfile />
        </div>
        <div class="horizontal-card-content">
            <div class="horizontal-card-left">
                <ScheduleVisits
                    bind:currentVisits
                    bind:currentProfile
                />
            </div>
            <div class="horizontal-card-right">
                <ScheduleCalendar bind:currentProfile />
            </div>
        </div>
    {/if}
</article>

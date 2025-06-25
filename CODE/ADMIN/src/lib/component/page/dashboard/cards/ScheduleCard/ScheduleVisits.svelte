<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { navigate } from 'svelte5-router';
    import { generateFilePath } from '$lib/filePath';

    // -- VARIABLES

    /** @type {{currentVisits?: any, currentProfile: any}} */
    let { currentVisits = [], currentProfile } = $props();

    // -- FUNCTIONS

    function handleVisitDetails()
    {
        navigate( `admin/edit-view/visit` );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../../../constant.styl';
    @import '../../../../../../mixin.styl';
    @import '../../../../../../class.styl';

    // -- ELEMENTS

    p
    {
        font-size: 1vw;
        font-weight: 700;
        color: grayColor100;
    }

    // -- CLASSES

    .schedule-visit
    {
        margin-right: 1vw;
        height: 100%;
        border: 1px solid grayColor800;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
    }

    .schedule-visit-head
    {
        border-bottom: 1px solid grayColor800;
        padding: 0.5vw 1vw 0.5rem;

        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .schedule-visit-list
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .schedule-visit-item
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .schedule-visit-property
    {
        display: flex;
        flex-direction: row;
        gap: 1rem;
        img
        {
            height: auto;
            aspect-ratio: 2 / 1;
            border-radius: 0.5rem;
        }

        .schedule-visit-property-info
        {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
            p
            {
                font-size: 1.5vw;
                font-weight: 700;
                color: grayColor100;
            }

            .city-status
            {
                display: flex;
                flex-direction: row;
                gap: 0.5rem;
            }

            span
            {
                font-size: 1.5vw;
                font-weight: 600;
                color: grayColor100;
            }
        }
    }

    .schedule-visit-button
    {
        border: 1px solid grayColor600;
        border-radius: 50%;

        background-color: transparent;

        color: grayColor500;
        .date
        {
            display: flex;

            font-size: 1.5vw;
            font-weight: 500;
            color: grayColor500;
        }

        .details
        {
            display: none;
        }

        &:hover
        {
            border: 1px solid blueColor;
            border-radius: 0.5rem;

            background-color: blueColor;

            color: white;
            .date
            {
                display: none;
            }

            .details
            {
                display: flex;

                font-size: 1.5vw;
                font-weight: 700;
                color: white;
            }
        }
    }

    .schedule-visit-none
    {
        height: 100%;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: column;
        gap: 0.5vw;
        justify-content: center;
        align-items: center;

        background-color: grayColor900;
        p
        {
            font-size: 1vw;
            font-weight: 500;
            color: grayColor500;
        }
    }

    .none-logo-size
    {
        height: auto;
        width: 4vw;
    }
</style>

<div class="schedule-visit">
    <div class="schedule-visit-head">
        <p>{ getLocalizedTextBySlug( 'Property', $languageTagStore ) }</p>
        <p>{ getLocalizedTextBySlug( 'Date - Time', $languageTagStore ) }</p>
    </div>
    {#if currentProfile }
        {#if currentVisits.length > 0 }
            <div class="schedule-visit-list">
                {#each currentVisits as visit }
                    <div class="schedule-visit-item">
                        <div class="schedule-visit-property">
                            <img src={ generateFilePath( visit.property.src ) } alt={ visit.property.title }>
                            <div class="schedule-visit-property-info">
                                <p></p>
                                <div class="city-status">
                                    <span>{ visit.property.city }</span>
                                    <span>·</span>
                                    <span>{ visit.status }</span>
                                </div>
                            </div>
                        </div>
                        <button
                            class="schedule-visit-button"
                            onclick={handleVisitDetails}
                        >
                            <div class="date">{ visit.datetime }</div>
                            <div class="details">{ getLocalizedTextBySlug( 'Details', $languageTagStore ) }</div>
                        </button>
                    </div>
                {/each}
            </div>
        {:else}
            <div class="schedule-visit-none">
                <i class="moien-icon" style="height: 3vw; width: 3vw"></i>
                <p>{ getLocalizedTextBySlug( 'No visits', $languageTagStore ) }</p>
            </div>
        {/if}
    {:else}
        <div class="schedule-visit-none">
            <i class="moien-icon" style="height: 3vw; width: 3vw"></i>
            <p>{ getLocalizedTextBySlug( 'No user selected', $languageTagStore ) }</p>
        </div>
    {/if}
</div>

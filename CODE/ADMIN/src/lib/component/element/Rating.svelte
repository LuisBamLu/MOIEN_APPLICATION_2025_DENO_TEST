<script>
    // -- IMPORTS

    import { getCeilInteger, getFloorInteger, getRandomTuid, getRoundInteger } from 'senselogic-gist';
    import Star from './Star.svelte';

    // -- CONSTANTS

    const fullStarId = getRandomTuid();
    const partialId = getRandomTuid();
    const grayStarId = getRandomTuid();

    // -- VARIABLES

    /** @type {{rating?: number, total?: number, size?: number, starIcon?: any}} */
    let {
        rating = 0,
        total = 5,
        size = 24,
        starIcon = Star
    } = $props();

    // -- STATEMENTS

    let fullStarCount = $derived(getFloorInteger( rating || 0 ));
    let rateDiffence = $derived(( rating || 0 ) - fullStarCount);
    let percentRating = $derived(getRoundInteger( rateDiffence * 100 ));
    let grayStarCount = $derived(( total || 5 ) - ( fullStarCount + getCeilInteger( rateDiffence ) ));
</script>

<div class="rating" style="display: flex;">
    {#each Array( fullStarCount ) as star}
        {@const SvelteComponent = starIcon}
        <SvelteComponent { size } fillPercent={ 100 } id={ fullStarId }/>
    {/each}
    {#if percentRating}
        {@const SvelteComponent_1 = starIcon}
        <SvelteComponent_1 { size } fillPercent={ percentRating } id={ partialId }/>
    {/if}
    {#each Array( grayStarCount ) as star}
        {@const SvelteComponent_2 = starIcon}
        <SvelteComponent_2 { size } fillPercent={ 0 } id={ grayStarId }/>
    {/each}
</div>

<script>
    export let slideCount
    export let slideIndex
</script>

<style lang="stylus">
    .blog-dot-list
    {
        margin-top: 1rem;
        height: 0.75rem;
        width: 100%;
        padding: 0;

        display: flex;
        gap: .5rem;
        justify-content: center;

        list-style-type: none;
    }

    .blog-dot
    {
        height: .5rem;
        width: .5rem;
        border-radius: 50%;

        background-color: rgba( 212, 212, 212, 0.5 );

        transition: all 0.3s ease-in-out;
    }

    .blog-dot:hover
    {
        +media( desktop )
        {
            background-color: rgba( 64, 220, 182, 0.85 );
        }
    }

    .blog-dot.active
    {
        height: 1rem;
        width: 1rem;

        background-color: rgba( 64, 220, 182, 1 );
    }
</style>

<!-- svelte-ignore missing-declaration -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div class="blog-dot-list">
    {#each { length: slideCount } as _, dotIndex }
        <div
            on:click={ () => setSlideIndexByDot( dotIndex ) }
            class="blog-dot {  dotIndex === ( slideIndex % slideCount ) ? 'active' : '' }"
            style="
                    width: {12 - Math.abs(dotIndex - slideIndex) * 1.5}px;
                    height: {12 - Math.abs(dotIndex - slideIndex) * 1.5}px;
                    opacity: {1 - Math.abs(dotIndex - slideIndex) * 0.2};
                "
        />
    {/each}
</div>

<script>
    // -- IMPORTS

    import { selectArticleArray } from '$src/lib/store/selectArticleArray';
    import { selectArticleCategoryArray } from '$src/lib/store/selectArticleCategoryArray';
    import { articleArrayStore } from '$src/lib/store/articleArrayStore';
    import { getLocalizedText } from 'senselogic-gist';
    import { categoryArrayStore } from '$src/lib/store/categoryArrayStore';
    import Tag from '../../element/Tag.svelte';

    // -- FUNCTIONS

    function selectCategory ( categoryArticle )
    {
        if ( $selectArticleCategoryArray.includes( categoryArticle ) )
        {
            $selectArticleCategoryArray.splice( $selectArticleCategoryArray.indexOf( categoryArticle ), 1 );
        }
        else
        {
            $selectArticleCategoryArray.push( categoryArticle );
        }

        $selectArticleArray = $articleArrayStore.filter( article =>
        {
            return article.categoryIdArray.some( categoryId => categoryId == categoryArticle.id )
        }
        );

        if ( $selectArticleCategoryArray.length == 0 )
        {
            $selectArticleArray = $articleArrayStore;
        }
    }

    // ~~

    function handleTagChange ( event, category )
    {
        selectCategory( category );
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- CLASSES

    .article-tags
    {
        padding: 0 0 2rem;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 0.5rem;
        justify-content: center;
        align-items: center;
    }
</style>

<div class="article-tags">
    {#if $categoryArrayStore }
        {#each $categoryArrayStore as category }
            <Tag
                label={ getLocalizedText( category.name ) }
                name="category"
                on:change={ () => selectCategory( category ) }
            />
        {/each}
    {/if}
</div>

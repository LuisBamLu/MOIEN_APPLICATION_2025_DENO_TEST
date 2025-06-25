<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$src/lib/storage';
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';

    // -- VARIABLES

    /** @type {{property: any}} */
    let { property = $bindable() } = $props();

    // -- FUNCTIONS

    function handleDeleteImage(
        index
        )
    {
        if ( index === null )
        {
            property.imagePath = property.imagePathArray[ 0 ] ?? null;
        }
        else
        {
            property.imagePathArray.splice( index, 1 );
            property.imagePathArray = property.imagePathArray;
        }

        if ( property.imagePath === null || property.imagePathArray.length < 5 )
        {
            property.statusId = 'offline';
        }
    }
</script>

<style lang="stylus">
    //  -- IMPORTS

    // -- CLASSES

    .property-image-iterator
    {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
    }

    .image-container
    {
        position: relative;

        height: 10rem;
        width: 10rem;
    }

    .delete-button
    {
        position: absolute;
        top: 0;
        right: 0;

        cursor: pointer;
    }

    .property-image
    {
        height: 100%;
        width: 100%;
        border-radius: 1rem;

        object-fit: cover;
    }
</style>

<div class="property-image-iterator">
    {#if property.imagePath !== null && property.imagePath !== property.imagePathArray[ 0 ] }
        <div class="image-container">
            <button
                class="x-circle-icon size-100 delete-button"
                onclick={() => handleDeleteImage( null )}
></button>
            <img
                class="property-image"
                src={ getStorageImagePath( property.imagePath, 640 ) }
                alt={ getLocalizedTextBySlug( 'property-label', $languageTagStore ) }
            />
        </div>
    {/if}
    {#each property.imagePathArray as imagePath, index }
        <div class="image-container">
            <button
                class="x-circle-icon size-100 delete-button"
                onclick={() => handleDeleteImage( index )}
></button>
            <img
                class="property-image"
                src={ getStorageImagePath( imagePath, 640 ) }
                alt={ getLocalizedTextBySlug( 'property-label', $languageTagStore ) }
            />
        </div>
    {/each}
</div>

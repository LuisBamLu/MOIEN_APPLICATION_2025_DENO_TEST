<script>
    // -- IMPORTS

    import { getStorageImagePath } from '$src/lib/storage';
    import AccordionItem from '$component/element/AccordionItem.svelte';
    import { getNormalCaseFromSnakeCaseString } from '$lib/base';

    // -- VARIABLES

    /** @type {{profile: any, label: any}} */
    let { profile, label } = $props();
</script>

<style lang="stylus">
    // -- CLASSES

    .container
    {
        padding: 0.25rem 0;

        display: flex;
        gap: 0.5rem;
    }

    .profile-container
    {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .profile-image
    {
        height: 3.5rem;
        width: 3.5rem;
        border-radius: 50%;
    }
</style>

<AccordionItem displayName={ label }>
    <div class="profile-container">
        <img class="profile-image" src={ getStorageImagePath( profile.imagePath, 640 ) } alt='payer profile' />
        <div class="profile-text-container">
            <div class="font-size-75 font-weight-600 color-gray-100">
                { profile.firstName } { profile.lastName }
            </div>
        </div>
    </div>
    {#each Object.entries( profile ) as [ fieldName, fieldValue ] }
        {#if !fieldName.includes( 'Id' ) && !fieldName.includes( 'Name' ) && fieldName !== 'imagePath' }
            <div class="container">
                <div class="font-size-75 font-weight-600 color-gray-100">
                   { getNormalCaseFromSnakeCaseString( fieldName ) }:
                </div>
                <div class="font-size-75 font-weight-500 color-gray-100">
                    { fieldValue }
                </div>
            </div>
        {/if}
    {/each}
</AccordionItem>

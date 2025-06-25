<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug, getMapById } from 'senselogic-gist';
    import AccordionItem from '$component/element/AccordionItem.svelte';
    import ModalActions from '$component/element/modal/ModalActions.svelte';
    import ModalButton from '$component/element/modal/ModalButton.svelte';
    import ModalContent from '$component/element/modal/ModalContent.svelte';
    import ModalHeader from '$component/element/modal/ModalHeader.svelte';
    import ModalRoot from '$component/element/modal/ModalRoot.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { fetchData, getNormalCaseFromSnakeCaseString } from '$lib/base';
    import { getStorageImagePath } from '$src/lib/storage';
    import LabelledSelect from '$component/element/LabelledSelect.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import Input from '$component/element/Input.svelte';

    // -- VARIABLES

    /** @type {{selectedSpaceIndex?: any, spaceId?: any, isOpen?: boolean, spaceArray?: any}} */
    let {
        selectedSpaceIndex = $bindable(null),
        spaceId = null,
        isOpen = false,
        spaceArray = $bindable([])
    } = $props();
    let space = $state(null);
    let property = $state(null);
    let bedArray = $state([]);
    let profile = $state(null);
    let bedTypeByIdMap = $state(null);
    let spaceTypeArray = $state([]);
    let isLoading = $state(true);

    // -- FUNCTIONS

    async function handleDelete(
        )
    {
        let result = await fetchData( '/api/space/delete/' + spaceId, { method: 'POST' } );

        if ( result )
        {
            spaceArray = spaceArray.filter( ( space ) => space.id !== spaceId );
            selectedSpaceIndex = null;
        }
    }

    // ~~

    async function handleUpdate(
        )
    {
        let result = await fetchData( '/api/space/update/' + spaceId, { method: 'POST', body: JSON.stringify( { space } ) } );
        space = result.space;

        if ( result )
        {
            selectedSpaceIndex = null;
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/space/' + spaceId, { method: 'POST' } );
            space = result.space;
            property = result.property;
            bedArray = result.bedArray;
            profile = result.profile;
            bedTypeByIdMap = result.bedTypeByIdMap;
            spaceTypeArray = result.spaceTypeArray;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .content-container
    {
        width: 100%;

        display: flex;
        flex-direction: column;
    }

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
        width: 3.5rem;
        width: 3.5rem;
        border-radius: 50%;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader title={ getLocalizedTextBySlug( 'space-label', $languageTagStore ) } onClose={ () => selectedSpaceIndex = null } />
    <ModalContent>
        <div class="content-container">
            {#if isLoading }
                { getLocalizedTextBySlug( 'loading-label', $languageTagStore ) }
            {:else}
                    <div class="display-flex flex-direction-column gap-100">
                        <LabelledSelect
                            label={ getLocalizedTextBySlug( 'space-type-label', $languageTagStore ) }
                            bind:value={ space.typeId }
                        >
                            {#each spaceTypeArray as spaceType }
                                <option value={ spaceType.id }>
                                    { getLocalizedText( spaceType.name, $languageTagStore ) }
                                </option>
                            {/each}
                        </LabelledSelect>
                        <InputLocalizedForm
                            label={ getLocalizedTextBySlug( 'name-label', $languageTagStore ) }
                            itemsString={ space.name }
                            languageArray={ $languageArrayStore }
                            on:update={ ( event ) => space.name = event.detail.text }
                        />
                        <InputLocalizedForm
                            label={ getLocalizedTextBySlug( 'description-label', $languageTagStore ) }
                            itemsString={ space.description }
                            languageArray={ $languageArrayStore }
                            isMultiLine={ true }
                            on:update={ ( event ) => space.description = event.detail.text }
                        />
                        <Input
                            label={ getLocalizedTextBySlug( 'area-label', $languageTagStore ) }
                            type={ 'number' }
                            bind:value={ space.area }
                        />
                    </div>
                {#if profile }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'profile-label', $languageTagStore ) }>
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
                {/if}
                {#if property }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'property-label', $languageTagStore ) }>
                        <img class="property-image" src={ getStorageImagePath( property.imagePath, 640 ) } alt="property" />
                        {#each Object.entries( property ) as [ fieldName, fieldValue ] }
                            {#if !fieldName.includes( 'Array' ) && fieldName !== 'imagePath' }
                                {#if fieldName === 'title' || fieldName === 'description' }
                                    <div class="container">
                                        <div class="font-size-75 font-weight-600 color-gray-100">
                                           { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                        </div>
                                        <div class="font-size-75 font-weight-500 color-gray-100">
                                            { getLocalizedText( fieldValue, $languageTagStore ) }
                                        </div>
                                    </div>
                                {:else}
                                    <div class="container">
                                        <div class="font-size-75 font-weight-600 color-gray-100">
                                           { getNormalCaseFromSnakeCaseString( fieldName ) }:
                                        </div>
                                        <div class="font-size-75 font-weight-500 color-gray-100">
                                            { fieldValue }
                                        </div>
                                    </div>
                                {/if}
                            {/if}
                        {/each}
                    </AccordionItem>
                {/if}
                {#if bedArray && bedArray?.length }
                    <AccordionItem displayName={ getLocalizedTextBySlug( 'admin-menu-beds-manager-label', $languageTagStore ) } >
                        {#each bedArray as bed }
                            <div class="container">
                                <div class="font-size-75 font-weight-600 color-gray-100">
                                    { getLocalizedText( bedTypeByIdMap[ bed.typeId ].name, $languageTagStore ) }:
                                </div>
                                <div class="font-size-75 font-weight-500 color-gray-100">
                                    { bed.count }
                                </div>
                            </div>
                        {/each}
                    </AccordionItem>
                {/if}

            {/if}
        </div>
    </ModalContent>
    <ModalActions>
        <ModalButton variant="error" on:click={ handleDelete } >
            { getLocalizedTextBySlug( 'admin-space-manager-page-delete-space-label', $languageTagStore ) }
        </ModalButton>
        <ModalButton on:click={ handleUpdate } >
            { getLocalizedTextBySlug( 'admin-space-manager-page-update-space-label', $languageTagStore ) }
        </ModalButton>
    </ModalActions>
</ModalRoot>

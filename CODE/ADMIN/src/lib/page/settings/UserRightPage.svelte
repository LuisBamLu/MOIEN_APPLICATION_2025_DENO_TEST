<script>
    // -- IMPORTS

    import AdminPage from '$component/element/AdminPage.svelte';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import InputLocalizedForm from '$component/element/InputLocalizedForm.svelte';
    import AccordionItem from '$src/lib/component/element/Accordion/AccordionItem.svelte';
    import AccordionList from '$src/lib/component/element/Accordion/AccordionList.svelte';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { hasUserPermission } from '$store/profileStore';
    import {
        handleCreateUserRight,
        handleDeleteUserRight,
        handleEditUserRight,
        isUserRightModalOpen,
        loadUserRightArray,
        selectedUserRightStore,
        toggleUserRightModal,
        userPermissionArrayStore,
        userRightArrayStore,
        addNavigationEventListener,
        removeNavigationEventListener,
        handleChange,
        isFormModified as isUserRightFormModified,
        finalizeNavigation,
        isConfirmationModalOpen,
        toggleConfirmModal,
        isSubmitting,
        userPermissionByTypeMap
    } from '$store/userRightStore';
    import { getLocalizedText } from 'senselogic-gist';
    import { onMount } from 'svelte';

    // -- VARIABLES

    let filterParameterByKeyMap =
        {
            id :
                {
                    type : 'text',
                    name : 'ID',
                    value : ''
                },
            number :
                {
                    type : 'text',
                    name : 'Number',
                    value : ''
                },
            slug :
                {
                    type : 'text',
                    name : 'Slug',
                    value : ''
                },
            name :
                {
                    type : 'select',
                    name : 'Role',
                    value : ''
                },
            permissionSlugArray :
                {
                    type : 'select',
                    name : 'Actions',
                    value : '',
                    optionArray : []
                },
            creationTimestamp :
                {
                    type : 'date',
                    name : 'Created at',
                    value : ''
                },
            updateTimestamp :
                {
                    type : 'date',
                    name : 'Update at',
                    value : ''
                },
        };
    let titleSlugMap =
        {
            editTitle: 'edit-user-right-label',
            addTitle: 'add-user-right-label'
        };
    let activeAccordionIndex = $state(null);

    // -- FUNCTIONS

    function arrayProcessing(
        )
    {
    }

    // ~~

    function handleUpdateUserRightLocalizedInput(
        event
        )
    {
        selectedUserRightStore.update( ( userRight ) => ( { ...userRight, name: event.detail.text } ) );
    }

    // ~~

    function handleChangeAccordionIndex(
        activeIndex
        )
    {
        if ( activeAccordionIndex === activeIndex )
        {
            activeAccordionIndex = null;
        }
        else
        {
            activeAccordionIndex = activeIndex;
        }
    }

    // ~~

    onMount(
        () =>
        {
            addNavigationEventListener();

            return () => removeNavigationEventListener();
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';

    // -- CLASSES

    .checkbox-wrapper input[ type="checkbox" ]
    {
        display: none;

        visibility: hidden;
    }

    .checkbox-wrapper .cbx
    {
        margin: auto;
        -webkit-user-select: none;
        display: flex;
        gap: 0.5rem;

        user-select: none;
        cursor: pointer;
    }

    .checkbox-wrapper .cbx span
    {
        transform: translate3d( 0, 0, 0 );

        border-radius: 0.25rem

        display: inline-block;
        align-items: center;

        line-height: 2rem;
        font-size: 1.25rem;
        vertical-align: middle;
        color: blueColor;
    }

    .checkbox-wrapper .cbx span:last-child
    {
        margin-left: 0.5rem;
    }

    .checkbox-wrapper .cbx span:first-child
    {
        position: relative;
        transform: scale( 1 );

        margin-top: 0.25rem;
        height: 1.5rem;
        width: 1.5rem;
        border: 2px solid grayColor700;

        display: flex;
        flex-shrink: 0;
        justify-content: center;
        align-items: center;

        vertical-align: middle;

        transition: all 0.2s ease;
    }

    .checkbox-wrapper .cbx span:first-child svg
    {
        position: absolute;
        fill: none;
        stroke: greenColor;
        stroke-width: 2;
        stroke-linecap: round;
        stroke-linejoin: round;
        stroke-dasharray: 1rem;
        stroke-dashoffset: 1rem;
        transform: translate3d( 0, 0, 0 );

        transition: all 0.3s ease;
        transition-delay: 0.1s;
    }

    .checkbox-wrapper .cbx span:first-child:before
    {
        transform: scale( 0 );

        height: 100%;
        width: 100%;
        border-radius: 50%;

        display: block;

        content: "";
        opacity: 1;
        background: greenColor900;
    }

    .checkbox-wrapper .cbx:hover span:first-child
    {
        border-color: greenColor900;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child
    {
        border-color: greenColor900;

        background: greenColor900;

        animation: wave 0.4s ease;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child svg
    {
        stroke-dashoffset: 0;
    }

    .checkbox-wrapper .inp-cbx:checked + .cbx span:first-child:before
    {
        transform: scale( 3.5 );

        opacity: 0;

        transition: all 0.6s ease;
    }

    @keyframes wave
    {
        50%
        {
            transform: scale( 0.9 );
        }
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ finalizeNavigation }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

<AdminPage
    pageTitle="admin-menu-user-right-manager-label"
    selectedObject={ selectedUserRightStore }
    objectArrayStore={ userRightArrayStore }
    isObjectModalOpen={ isUserRightModalOpen }
    filterParameterByKeyMap={ filterParameterByKeyMap }
    titleSlugMap={ titleSlugMap }
    loadObjectArray={ loadUserRightArray }
    arrayProcessing={ arrayProcessing }
    handleCreateObject={ () => handleCreateUserRight( arrayProcessing ) }
    handleEditObject={ () => handleEditUserRight( arrayProcessing ) }
    handleDeleteObject={ () => handleDeleteUserRight( arrayProcessing ) }
    toggleObjectModal={ toggleUserRightModal }
    showButton={ hasUserPermission( 'add-user-right' ) }
    isFormModified={ $isUserRightFormModified }
    search={ false }
    isSubmitting={ $isSubmitting }
>
    <form onchange={handleChange} class="edit-modal-form">
        <div class="input-row">
            <span class="font-weight-700 line-height-150 color-gray-100">Name</span>
            <InputLocalizedForm
                id='user-right-slug'
                name='name'
                itemsString={ $selectedUserRightStore.name }
                languageArray={ $languageArrayStore }
                on:update={ handleUpdateUserRightLocalizedInput }
            />
        </div>

        <span class="font-weight-700 line-height-150 color-gray-100">Access</span>

        <AccordionList>
            {#each Object.entries( userPermissionByTypeMap ) as [ userPermissionType, userPermissionArray ], userPermissionIndex }
                <AccordionItem
                    text={ userPermissionType }
                    isOpen={ userPermissionIndex === activeAccordionIndex }
                    on:click={ () => handleChangeAccordionIndex( userPermissionIndex ) }
                >
                    {#each userPermissionArray as userPermission ( userPermission.id ) }
                        <div class="checkbox-wrapper">
                            <input
                                type="checkbox"
                                class="inp-cbx"
                                bind:group={ $selectedUserRightStore.permissionSlugArray }
                                value={ userPermission.slug }
                                id={ userPermission.id }
                                name={ userPermission.name }
                            />
                            <label for={ userPermission.id } class="cbx">
                                <span>
                                <svg viewBox="0 0 12 10" height="12px" width="1rem">
                                    <polyline points="1.5 6 4.5 9 10.5 1"></polyline></svg
                                >
                                </span>
                                <span>{ userPermission.name }</span>
                            </label>
                        </div>
                    {/each}
                </AccordionItem>
            {/each}
        </AccordionList>
    </form>
</AdminPage>

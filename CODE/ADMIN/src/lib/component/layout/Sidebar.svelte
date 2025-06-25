<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { hasAnyUserRole, hasUserRole, profileSignedInStore } from '$store/profileStore';
    import { fetchData, isNullOrUndefined } from '$lib/base';
    import { slide } from 'svelte/transition';
    import { isSidebarOpen, toggleSidebar } from '$store/sidebarStore';
    import { navigate } from 'svelte5-router';
    import ConfirmModal from '$component/element/ConfirmModal.svelte';
    import { useConfirmationModal } from '$src/lib/confirmation_modal';
    import { pageTitle } from '$src/lib/store/pageTitleStore';
    import SideBarSignOut from '$component/element/SideBarSignOut.svelte';

    // -- VARIABLES

    let indexAccordionOpen = $state(null);
    let pathName = $state('');
    let hasPageTitle = $state();
    let tableItemHref = $state('');
    let
    {
        isConfirmationModalOpen,
        toggleConfirmModal
    } = useConfirmationModal();

    // -- FUNCTIONS

    function handleOpenAccordionByIndex(
        index
        )
    {
        indexAccordionOpen = index === indexAccordionOpen ? null : index;
    }

    // ~~

    function handleNavigate(
        pathUrl
        )
    {
        if ( pathName === pathUrl )
        {
            return;
        }

        navigate( pathUrl );
    }

    // ~~

    function openConfirmModalWithUrl(
        url
        )
    {
        tableItemHref = url;
        toggleConfirmModal();
    }

    // -- CONSTANTS

    const tableArray =
        [
            {
                icon : 'settings',
                slug : 'admin-sidebar-settings-label',
                href : '/admin/settings',
                roleSlugArray : [ 'administrator', 'backoffice', 'backoffice-senior', 'agency' ],
                isHidden : false
            },
            {
                icon : 'map',
                slug : 'admin-sidebar-edit-view-label',
                href : '/admin/edit-view',
                roleSlugArray : [ 'administrator', 'backoffice', 'backoffice-senior', 'agency' ],
                isHidden : false
            },
            {
                icon : 'statistics',
                slug : 'admin-sidebar-statistics-label',
                href : '/admin/statistics',
                roleSlugArray : [ 'administrator', 'backoffice', 'backoffice-senior', 'agency' ],
                isHidden : false
            }
        ];

    // -- STATEMENTS

    let hasActiveSession = $derived($profileSignedInStore !== null && $profileSignedInStore !== undefined);

    // ~~

    run(() => {
        pathName = window.location.pathname;
    });

    // ~~

    run(() => {
        if ( $pageTitle )
        {
            hasPageTitle = true
        }
    });
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- ELEMENTS

    button
    {
        cursor: pointer;
    }

    // -- CLASSES

    .left-side
    {
        z-index: 11;
        position: relative;

        height: calc( 100dvh - 7vh );
        width: auto;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;

        background-color: white;

        transition: all 0.3s cubic-bezier( 0.76, 0, 0.27, 1 );

        +media( smaller-48em )
        {
            z-index: sidebarZIndex;
            position: fixed;
            left: 0;

            width: 20.5em;
            border-right: 1px solid grayColor700;
        }
    }

    .left-side-button
    {
        display: none;
    }

    .logo
    {
        top: 0;

        height: 4.25rem;

        line-height: 4.25rem;
        font-size: 0.9375rem;
        font-weight: bold;
        letter-spacing: 0.25rem;
        text-align: center;
        text-transform: uppercase;
        color: whiteColor;
        color: blueColor;
    }

    .side-wrapper
    {
        overflow: auto;
        height: 100%;
        padding: 0 0.5rem;

        display: flex;
        flex-direction: column;
        justify-content: center;
    }

    .side-menu
    {
        white-space: nowrap;
        div
        {
            margin-right: 0.5rem;
        }

        .navigate-button,
        button
        {
            width: 100%;
            border-radius: 0.5rem;
            padding: 0.75rem 1.25rem;

            display: flex;
            align-items: center;

            background: transparent;

            font-size: 0.85rem;
            font-weight: bold;
            text-decoration: none;
            color: blueColor;
            &:hover
            {
                background-color: grayColor900;
            }

            &:not(:last-child)
            {
                margin-bottom: 1.25rem;
            }
        }

        .navigate-button.is-active
        {
            background: #E6FAF3;

            color: greenColor;
        }
    }

    .leave
    {
        position: absolute;
        top: -100%;
        left: 0;

        height: 100%;
        width: 100%;
        padding: 0 1.25rem;

        display: flex;
        align-items: center;

        background-color: blueColor;

        color: grayColor950;

        transition: 0.3s;
    }

    .accordion-text
    {
        width: 100%;

        text-align: left;
    }

    .chevron
    {
        transform: rotate( 90deg );

        transition: 0.4s all ease;
    }

    .chevron.is-opened
    {
        transform: rotate( 0 );
    }

    .accordion-list
    {
        margin-bottom: 1rem;
    }
</style>

<ConfirmModal
    isOpen={ $isConfirmationModalOpen }
    onConfirm={ () => handleNavigate( tableItemHref ) }
    onCancel={ toggleConfirmModal }
    confirmationText={ 'You have unsaved information, are you sure you wanna leave?' }
/>

{#if $isSidebarOpen }
    <div class="left-side" transition:slide={ { axis : 'x' } }>
        <button class="left-side-button" onclick={toggleSidebar}>
            <svg viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18">
                </line>
            </svg>
            <svg stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </button>
        <div class="side-wrapper">
        <div class="side-menu">
            {#each tableArray as tableItem, tableIndex }
                {#if hasAnyUserRole( tableItem.roleSlugArray ) && !tableItem.isHidden }
                    {#if !tableItem.href }
                        <button type="button" onclick={() => handleOpenAccordionByIndex( tableIndex )}>
                            <div class="{ tableItem.icon }-icon icon size-150"></div>
                            <span class="accordion-text">
                                { getLocalizedTextBySlug( tableItem.slug, $languageTagStore ) }
                            </span>
                            <div class="blue-chevron-icon chevron icon size-150" class:is-opened={ indexAccordionOpen === tableIndex }></div>
                        </button>
                        {#if indexAccordionOpen === tableIndex }
                            <ul class="accordion-list" transition:slide>
                                {#each tableItem.menuArray as menuItem }
                                    {#if hasAnyUserRole( menuItem.roleSlugArray ) && !menuItem.isHidden }
                                        <li>
                                            <button type="button" class="navigate-button" onclick={() => handleNavigate( menuItem.href )}>
                                                {#if menuItem.icon }
                                                    <div class="{ menuItem.icon }-icon icon size-150"></div>
                                                {/if}
                                                { getLocalizedTextBySlug( menuItem.slug, $languageTagStore ) }
                                            </button>
                                        </li>
                                    {/if}
                                {/each}
                            </ul>
                        {/if}
                    {:else}
                        {#if hasPageTitle }
                            <button class="navigate-button" type="button" onclick={() => openConfirmModalWithUrl( tableItem.href )} class:is-active={ pathName.includes( tableItem.href ) }>
                                <div class="{ pathName.includes( tableItem.href ) ? 'green-' : '' }{ tableItem.icon }-icon icon size-150"></div>
                                { getLocalizedTextBySlug( tableItem.slug, $languageTagStore ) }
                            </button>
                        {:else}
                            <button class="navigate-button" type="button" onclick={() => handleNavigate( tableItem.href )} class:is-active={ pathName.includes( tableItem.href ) }>
                                <div class="{ pathName.includes( tableItem.href ) ? 'green-' : '' }{ tableItem.icon }-icon icon size-150"></div>
                                { getLocalizedTextBySlug( tableItem.slug, $languageTagStore ) }
                            </button>
                        {/if}
                    {/if}
                {/if}
            {/each}
        </div>
        </div>
        <SideBarSignOut/>
    </div>
{/if}

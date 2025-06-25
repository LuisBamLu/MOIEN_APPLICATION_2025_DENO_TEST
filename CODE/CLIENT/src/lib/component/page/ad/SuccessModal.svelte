<script>
    // -- IMPORTS

    import { link } from 'svelte-routing';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import ModalRoot from '../../modal/ModalRoot.svelte';
    import ModalHeader from '../../modal/ModalHeader.svelte';

    // -- VARIABLES

    export let propertyId;
    export let isOpen = false;
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';

    // -- CLASSES

    .ad-page-last-step
    {
        overflow-y: auto;
        width: 100%;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        justify-content: center;
        align-items: center;

        background-color: blueColor950;
    }

    .ad-page-link
    {
        width: 100%;
        max-width: 22rem;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        justify-content: center;

        background-color: blueColor;

        transition: all 200ms ease-in-out;
        &:hover
        {
            background-color: blueColor300;

            color: white;
        }
    }

    .ad-page-anchor
    {
        border-radius: 0.75rem;
        padding: 0.8125rem 2.5rem;

        display: flex;
        gap: 1rem;
        align-items: center;

        background-color: white;

        cursor: pointer;
    }
</style>

<ModalRoot isOpen={ isOpen }>
    <ModalHeader
        title={ getLocalizedTextBySlug( 'menu-ads-label' ) }
        onClose={ () => isOpen = false }
    />
    <div class='ad-page-last-step'>
        <img
            src="/image/supporting-documents/heading.svg"
            class="ad-page-header-image"
            alt=""
        />
        <div class="font-size-125 font-weight-700 color-gray-100 text-align-center">
            { getLocalizedTextBySlug( 'new-ad-page-success-message', $languageTagStore ) }
        </div>
        <a
            class="font-size-100 font-weight-700 color-white ad-page-link"
            href="/property/{ propertyId }"
            use:link
        >
            { getLocalizedTextBySlug( 'view-label', $languageTagStore ) }
        </a>
        <a
            class="font-size-90 font-weight-700 color-green ad-page-anchor"
            href="/dashboard"
            use:link
        >
            <div class="green-right-arrow-icon size-150" />
            { getLocalizedTextBySlug( 'back-to-profile-label' ) }
        </a>
    </div>
</ModalRoot>

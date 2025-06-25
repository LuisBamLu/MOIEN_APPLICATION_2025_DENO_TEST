<script>
    // -- IMPORTS

    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { filterParameterByKeyMapStore, updatePropertyParameters } from '$store/filterParameterByKeyMapStore.js';
    import { isOnboardingCompletedStore } from '$store/onboardingStore';
    import { authModalStore } from '$store/authModalStore';
    import ModalButton from '$component/modal/ModalButton.svelte';
    import { cubicInOut } from 'svelte/easing';
    import { fly } from 'svelte/transition';
    import { onMount } from 'svelte';

    // -- VARIABLES

    export let goToNextStep;
    let maxWidthInEmMediaScreen = window.matchMedia( '(max-width: 56em)' );
    let isMobileScreen = maxWidthInEmMediaScreen.matches;
    $: transitionParameterMap
        = isMobileScreen
        ? { y: -1000, duration: 500, easing: cubicInOut }
        : { x: -1000, duration: 500, easing: cubicInOut }

    // -- FUNCTIONS

    function handleResizeEvent(
        )
    {
        isMobileScreen = maxWidthInEmMediaScreen.matches;
    }

    // ~~

    function handleTermTypeSelected(
        termType
        )
    {
        updatePropertyParameters( { [ termType ]: true } );

        setTimeout(
            () =>
            {
                goToNextStep();
            },
            500
            );
    }

    // ~~

    function handleBecomeHost(
        )
    {
        isOnboardingCompletedStore.set( true );
        $authModalStore = 'sign-in';
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            window.addEventListener( 'resize', handleResizeEvent );

            return () => window.removeEventListener( 'resize', handleResizeEvent );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    .onboarding-term-type
    {
        padding: 0 1.5rem;

        +media( desktop )
        {
            padding: 2.5rem 1.5rem;
        }

        display: flex;
        flex-direction: column;
        gap: 1rem;
        justify-content: space-between;
        align-items: center;
    }

    .onboarding-term-type::before
    {
        content: unset !important;
    }

    .onboarding-term-type-container
    {
        transform: translateY( 100vh );

        height: 100%;
        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 5rem;
        justify-content: center;
        align-items: center;

        animation: slide-in-bottom 500ms ease-in-out;
        animation-delay: 5s;
        animation-fill-mode: forwards;

        +media( desktop )
        {
            transform: none;

            gap: 3.125rem;

            animation: none;
        }
    }

    .onboarding-term-type-container > div
    {
        transform: none;

        animation: none;
    }

    .onboarding-term-type-content
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        align-items: center;
    }

    .onboarding-term-type-items
    {
        width: 100%;

        display: flex;
        gap: 0.75rem;
        justify-content: space-between;
    }

    .onboarding-term-type-item
    {
        position: relative;

        height: 10rem;
        max-height: 50vw;
        width: 100%;
        border: 2px solid grayColor800;
        border-radius: 1rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        justify-content: space-between;

        background-color: grayColor950;

        text-align: unset;
    }

    .onboarding-term-type-item:disabled
    {
        opacity: 0.8;
        background-color: grayColor900;
    }

    .onboarding-term-type-item.is-selected
    {
        border-color: greenColor800;

        background-color: greenColor950;

        color: greenColor100;
    }

    .onboarding-term-type-button-container
    {
        width: 100%;

        display: none;

        +media( desktop )
        {
            display: flex;
        }
    }

    .onboarding-term-type-mobile-actions
    {
        +media( desktop )
        {
            display: none;
        }

        margin-bottom: 2rem;
        width: 100%;

        display: flex;
        gap: 1rem;
    }

    @keyframes slide-in-bottom
    {
        0%
        {
            transform: translateY( 100vh );
        }

        100%
        {
            transform: translateY( 0 );
        }
    }
</style>

<div class="onboarding-term-type">
    <div class="onboarding-term-type-container">
        <div
            out:fly={ transitionParameterMap }
        >
            <div class="onboarding-term-type-content">
                <div class="font-size-125 font-weight-600 color-gray-300">
                    { getLocalizedTextBySlug( 'onboarding-welcome-label' ) }
                </div>
                <div class="moien-logo-icon height-400 width-1200" />
                <div class="font-size-100 font-weight-500 color-gray-300">
                    { getLocalizedTextBySlug( 'onboarding-message-label' ) }
                </div>
            </div>
            <div class="onboarding-term-type-items">
                <button
                    class="onboarding-term-type-item"
                    class:is-selected={ $filterParameterByKeyMapStore.propertyParameters.isAvailableForShortTerm === true }
                    on:click={ () => handleTermTypeSelected( 'isAvailableForShortTerm' ) }
                >
                    <div class=
                        "
                            { $filterParameterByKeyMapStore.propertyParameters.isAvailableForShortTerm === true ? 'green' : 'gray' }-backpack-icon
                            size-200
                            short-term
                        "
                    />
                    <div
                        class="font-size-100 font-weight-700 color-gray-100 onboarding-term-type-item-label"
                        class:color-green-100={ $filterParameterByKeyMapStore.propertyParameters.isAvailableForShortTerm === true }
                    >
                        { getLocalizedTextBySlug( 'term-type-short-term' ) }
                    </div>
                </button>
                <button
                    class="onboarding-term-type-item"
                    class:is-selected={ $filterParameterByKeyMapStore.propertyParameters.isAvailableForLongTerm === true }
                    disabled
                    on:click={ () => handleTermTypeSelected( 'isAvailableForLongTerm' ) }
                >
                    <div class="gray-house-icon size-200 long-term"/>
                    <div class="font-size-100 font-weight-700 color-gray-100 onboarding-term-type-item-label">
                        { getLocalizedTextBySlug( 'term-type-long-term' ) }
                    </div>
                </button>
            </div>
            <!-- <div class="onboarding-term-type-host">
                <div class="font-size-100 font-weight-600 color-blue">
                    { getLocalizedTextBySlug( 'onboarding-host-question-label' ) }
                </div>
                <button class="font-size-90 font-weight-600 color-green" on:click={ () => ( handleBecomeHost() ) }>
                    <div class="green-right-arrow-icon size-150"/>
                    { getLocalizedTextBySlug( 'onboarding-host-link-label' ) }
                </button>
            </div> -->
        </div>
    </div>
    <div class="onboarding-term-type-mobile-actions">
        <ModalButton
            variant="light"
            on:click={ goToNextStep }
            text={ getLocalizedTextBySlug( 'onboarding-skip-label' ) }
        />
    </div>
    <div class="onboarding-term-type-button-container">
        <ModalButton
            variant="outlined"
            on:click={ goToNextStep }
            text={ getLocalizedTextBySlug( 'onboarding-skip-label' ) }
        />
    </div>
</div>

<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { clickOutside, getInsets } from '$lib/base';
    import { updateUrlParameter } from '$lib/url';
    import { isOnboardingCompletedStore } from '$store/onboardingStore';
    import { filterParameterByKeyMapStore, updatePropertyParameters } from '$store/filterParameterByKeyMapStore';
    import OnboardingTermType from '$component/onboarding/OnboardingTermType.svelte';
    import OnboardingLocation from '$component/onboarding/OnboardingLocation.svelte';
    import OnboardingDate from '$component/onboarding/OnboardingDate.svelte';
    import OnboardingGuest from '$component/onboarding/OnboardingGuest.svelte';
    import OnboardingBudget from '$component/onboarding/OnboardingBudget.svelte';
    import OnboardingPropertyType from '$component/onboarding/OnboardingPropertyType.svelte';
    import { getJsonObject, getJsonText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { isMobileMapOpenStore } from '$src/lib/store/locationStore';
    import { languageTagStore } from '$src/lib/store/languageTagStore';
    import { authModalStore } from '$src/lib/store/authModalStore';
    import { profileSignedInStore } from '$src/lib/store/profileStore';
    import { fade, fly } from 'svelte/transition';
    import SplashScreen from '$component/onboarding/SplashScreen.svelte';

    // -- CONSTANTS

    const isOnboardingCompletedName = 'is-onboarding-completed';

    // -- VARIABLES

    let isLoading = true;
    let currentOnboardingStep = 0;

    let onboardingSteps =
        [
            { step: 0, component: OnboardingTermType },
            { step: 1, component: OnboardingLocation },
            { step: 2, component: OnboardingDate },
            { step: 3, component: OnboardingGuest },
            { step: 4, component: OnboardingBudget },
            { step: 5, component: OnboardingPropertyType }
        ];

    let longTermSteps = [ onboardingSteps[ 0 ], onboardingSteps[ 1 ], onboardingSteps[ 5 ], onboardingSteps[ 4 ] ];
    let currentLongTermStep = 0;
    let insetTop = 0;

    // -- FUNCTIONS

    function goToNextStep(
        )
    {
        if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForShortTerm' ] )
        {
            if ( currentOnboardingStep < 4 )
            {
                currentOnboardingStep += 1;
            }
            else
            {
                localStorage.setItem( isOnboardingCompletedName, getJsonText( true ) );
                isOnboardingCompletedStore.set( true );

                updateUrlParameter( $filterParameterByKeyMapStore );
                $isMobileMapOpenStore = false;
            }
        }
        else if ( $filterParameterByKeyMapStore.propertyParameters[ 'isAvailableForLongTerm' ] )
        {
            if ( currentLongTermStep < longTermSteps.length - 1 )
            {
                currentLongTermStep += 1;
                currentOnboardingStep = longTermSteps[ currentLongTermStep ].step;
            }
            else
            {
                localStorage.setItem( isOnboardingCompletedName, getJsonText( true ) );
                isOnboardingCompletedStore.set( true );

                updateUrlParameter( $filterParameterByKeyMapStore );
                $isMobileMapOpenStore = false;
            }
        }
        else
        {
            updatePropertyParameters( { [ 'isAvailableForShortTerm' ]: true } );

            if ( currentOnboardingStep < 4 )
            {
                currentOnboardingStep += 1;
            }
        }
    }

    // ~~

    onMount(
        async () =>
        {
            let isOnboardingCompleted =
                getJsonObject(
                    localStorage.getItem( isOnboardingCompletedName )
                    );

            isOnboardingCompletedStore.set( isOnboardingCompleted );

            if ( !isOnboardingCompleted )
            {
                $isMobileMapOpenStore = true;
            }

            insetTop = ( await getInsets() ).top;
            isLoading = false;
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    :global( .onboarding >div:first-child )
    {
        z-index: 999;
        position: fixed;
        bottom: 0;
        left: 0;

        height: var( --viewport-height );
        width: var( --viewport-width );
        max-width: var( --viewport-width );
        max-width: 100vw;

        background: rgba(209, 250, 225, 0.8);
        box-shadow: 1px 1px 8px 0px rgba(23, 23, 23, 0.08);
        -ms-overflow-style: none;
        overflow: hidden;
        overflow-y: hidden;
        overflow-x: hidden;
        scrollbar-width: none;

        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;

        +media( desktop )
        {
            top: 50%;
            left: 50%;
            transform: translate( -50%, -50% );

            height: 36.875rem;
            width: calc( var( --viewport-width ) - 3rem );
            max-width: 27.875rem;
            border-radius: 1.5rem;

            background-color: grayColor950;
        }
    }

    :global( .onboarding.onboarding-0 >div:first-child ),
    {
        background-color: greenColor950;
    }

    // :global( .onboarding.onboarding-2 >div:first-child )
    // {
    //     background-color: ;
    // }

    // :global( .onboarding.onboarding-3 >div:first-child )
    // {
    //     background-color: #FFECEA;
    // }

    // :global( .onboarding.onboarding-5 >div:first-child )
    // {
    //     background-color: #E8F1FF;
    // }

    :global( .onboarding >div:first-child::before )
    {
        z-index: 0;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;

        padding-top: 32vh;

        display: block;

        content: '';
        background-size: cover;

        +media( desktop )
        {
            display: none;
        }
    }

    :global( .onboarding >div >div:first-child:not( .onboarding-term-type-container, .onboarding-splash-container ), .onboarding >div >form:first-child:not( .onboarding-term-type-container, .onboarding-splash-container ) )
    {
        z-index: 9999;
        position: relative;

        overflow-y: auto;
        height: 100%;
        width: 100%;
        border-top: 1px solid grayColor800;
        border-radius: 2rem 2rem 0rem 0rem;
        padding: 2rem 1.5rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: grayColor900;
        box-shadow: 1px -8px 8px 0px rgba( 23, 23, 23, 0.08 );
        -ms-overflow-style: none;
        scrollbar-width: none;

        +media( desktop )
        {
            width: 100%;

            box-shadow: 1px 1px 8px 0px rgba( 23, 23, 23, 0.08 );
        }
    }

    :global( .onboarding >div >div >*:not( .modal-action-button ) )
    {
        transform: translateX( 100vw );

        width: 100%;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        animation: slide-in-right 500ms ease-in-out;
        animation-delay: 250ms;
        animation-fill-mode: forwards;
    }

    :global( .onboarding >div >div:first-child:not( .onboarding-term-type-container, .onboarding-splash-container )::-webkit-scrollbar, .onboarding >div >form:first-child:not( .onboarding-term-type-container, .onboarding-splash-container )::-webkit-scrollbar ),
    {
        display: none;
    }

    :global( .onboarding >div:not( .onboarding-term-type, .onboarding-splash )  )
    {
        padding-top: 30vh;

        +media( desktop )
        {
            padding-top: unset;
        }
    }

    .modal-overlay
    {
        display: none;

        +media( desktop )
        {
            z-index: 999;
            position: fixed;
            top: 0;
            bottom: 0;
            left: 0;
            right: 0;

            inset: 0 0 0 0;
            height: 100%;

            display: block;

            background-color: rgba( 0, 0, 0, 0.5 );
        }
    }

    .mobile-sign-in-button
    {
        z-index: 9999;
        position: fixed;
        right: 1.5rem;

        border: 1px solid blueColor;
        border-radius: 0.75rem;
        padding: 0.8125rem 2.5rem;

        background-color: transparent;

        color: blueColor;

        +media( desktop )
        {
            display: none;
        }
    }

    @keyframes slide-in-right
    {
        0%
        {
            transform: translateX( 100vw );

            opacity: 0;
            filter: blur( 6px );
        }

        75%
        {
            transform: translateX( 0 );
        }

        100%
        {
            transform: scale( 1 );

            opacity: 1;
            filter: blur( 0px );
        }
    }
</style>

{#if isLoading }
    <SplashScreen />
{:else}
    {#if !$isOnboardingCompletedStore}
        <div
            class="modal-overlay"
            out:fade
            on:click={ () => isOnboardingCompletedStore.set( true ) }
        />
        {#if !$profileSignedInStore}
            <button
                class="mobile-sign-in-button"
                style="top: calc( 1rem + { insetTop }px );"
                out:fade
                on:click={ () =>  $authModalStore = 'sign-in' }
            >
                { getLocalizedTextBySlug( 'auth-sign-in-button', $languageTagStore ) }
            </button>
        {/if}
        <div
            class="onboarding onboarding-{ currentOnboardingStep }"
            out:fly={ { y: 1000, duration: 750 } }
        >
            {#each onboardingSteps as { step, component } ( step ) }
                {#if step === currentOnboardingStep }
                    <svelte:component
                        this={ component }
                        goToNextStep={ goToNextStep }
                    />
                {/if}
            {/each}
        </div>
    {/if}
{/if}

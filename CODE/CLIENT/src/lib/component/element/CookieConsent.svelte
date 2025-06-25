<script>
    // -- IMPORTS

    import { analyticsStore } from '$store/analyticsStore';
    import { clickOutside } from '$lib/base';
    import { fade } from 'svelte/transition';
    import { getLocalizedText, getJsonObject, getJsonText } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import Button from '../element/Button.svelte';
    import Switch from '$component/element/Switch.svelte';
    import { enableTracking } from '$lib/tracking';
    import { link } from 'svelte-routing';
    // import { userLocationStore } from '$src/lib/store/userLocationStore';

    // -- VARIABLES

    let steps = [ 'weUseCookies', 'privacyPreferenceCenter', 'minimized' ];
    let cookiesModalOpenKey = 'cookie-modal-open-moien';
    let performanceCookieConsentKey = 'performance-cookie-consent-moien';
    let functionalCookieConsentKey = 'functional-cookie-consent-moien';
    let targetingCookieConsentKey = 'targeting-cookie-consent-moien';
    let textBySlugMap =
        {
            'accept-all-cookies-button' :
                `Accept all cookies`
                + `¨fr:Accepter tous les cookies`
                + `¨pt:Aceitar todos cookies`,
            'reject-all-cookies-button' :
                `Reject all`
                + `¨fr:Rejeter tous les`
                + `¨pt:Rejeitar todos`,
            'we-use-cookies-label' :
                `We use cookies`
                + `¨fr:Nous utilisons des cookies`
                + `¨pt:Nós usamos cookies`,
            'we-use-cookies-description-text' :
                `By clicking ”Accept All Cookies", you agree to the storing of cookies on your device to enhance site navigation, analyze site usage, and assist in our marketing efforts.`
                + `¨fr:En cliquant sur "Accepter tous les cookies", vous acceptez que des cookies soient stockés sur votre appareil afin d'améliorer la navigation sur le site, d'analyser l'utilisation du site et de nous aider dans nos efforts de marketing.`
                + `¨pt:Ao clicar em "Aceitar todos os cookies", você concorda com o armazenamento de cookies em seu dispositivo para aprimorar a navegação no site, analisar o uso do site e auxiliar em nossos esforços de marketing.`,
            'more-information-label' :
                `More information on `
                + `¨fr:Plus d'informations sur `
                + `¨pt:Mais informações na `,
            'cookies-policy-label' :
                `cookies policy page`
                + `¨fr:page sur la politique en matière de cookies`
                + `¨pt:página de política de cookies`,
            'privacy-preference-center-label' :
                `Privacy Preference Center`
                + `¨fr:Centre de préférences pour la protection de la vie privée`
                + `¨pt:Centro de preferência de privacidade`,
            'allow-all-button' :
                `Allow all`
                + `¨fr:Autoriser tous les`
                + `¨pt:Permitir todos`,
            'cookies-settings-button' :
                `Cookies settings`
                + `¨fr:Paramètres des cookies`
                + `¨pt:Configurações de cookies`,
            'manage-consent-prefereces-label' :
                ` Manage Consent Preferences`
                + `¨fr: Gérer les préférences en matière de consentement`
                + `¨pt: Gerenciar preferências de consentimento`,
            'confirm-my-choices-button' :
                `Confirm my choices`
                + `¨fr:Confirmer mes choix`
                + `¨pt:Confirmar minhas escolhas`,
            'strictly-necessary-cookies-label' :
                `Strictly Necessary Cookies`
                + `¨fr:Cookies strictement nécessaires`
                + `¨pt:Cookies Estritamente Necessários`,
            'performance-cookies-label' :
                `Performance Cookies`
                + `¨fr:Cookies de performance`
                + `¨pt:Cookies de Desempenho`,
            'functional-cookies-label' :
                `Functional Cookies`
                + `¨fr:Cookies de fonctionnalité`
                + `¨pt:Cookies Funcionais`,
            'targeting-cookies-label' :
                `Targeting Cookies`
                + `¨fr:Cookies pour une publicité ciblée`
                + `¨pt:Cookies para publicidade direcionada`,
            'dont-want-sell-personal-data-button' :
                `Don't want to sell personal data`
        };

    let activeStep = 0;
    let isCookieModalOpen = false;
    let strictlyNecessaryCookieConsentName = 'strictly-necessary-cookie-consent-moien';
    let strictlyNecessaryCookieConsent = true;
    let performanceCookieConsent = false;
    let functionalCookieConsent = false;
    let targetingCookieConsent = false;

    // -- FUNCTIONS

    function handleApplyConsentToStore(
        isGranted
        )
    {
        analyticsStore.set( isGranted );
    }

    // ~~

    function handleCloseCookiesModal(
        )
    {
        isCookieModalOpen = false;
        localStorage.setItem( cookiesModalOpenKey, getJsonText( isCookieModalOpen ) );
    }

    // ~~

    function handleClickOutside(
        )
    {
        localStorage.setItem( cookiesModalOpenKey, getJsonText( isCookieModalOpen ) );
        activeStep = 2;
    }

    // ~~

    function handleAcceptAllCookies(
        )
    {
        performanceCookieConsent = true;
        functionalCookieConsent = true;
        targetingCookieConsent = true;

        handleSaveCookies();
        handleCloseCookiesModal();
        handleApplyConsentToStore( true );
    }

    // ~~

    function handleRejectAllCookies(
        )
    {
        performanceCookieConsent = false;
        functionalCookieConsent = false;
        targetingCookieConsent = false;

        handleSaveCookies();
        handleCloseCookiesModal();
    }

    // ~~

    function hasCookieConsent(
        )
    {
        return (
            performanceCookieConsent
            || functionalCookieConsent
            || targetingCookieConsent
            );
    }

    // ~~

    function handleConfirmMyChoices(
        )
    {
        handleSaveCookies();
        handleCloseCookiesModal();
        let cookieConsent = hasCookieConsent();
        handleApplyConsentToStore( cookieConsent );
    }

    // ~~

    function handleSaveCookies(
        )
    {
        localStorage.setItem( strictlyNecessaryCookieConsentName, getJsonText( strictlyNecessaryCookieConsent ) );
        localStorage.setItem( performanceCookieConsentKey, getJsonText( performanceCookieConsent ) );
        localStorage.setItem( functionalCookieConsentKey, getJsonText( functionalCookieConsent ) );
        localStorage.setItem( targetingCookieConsentKey, getJsonText( targetingCookieConsent ) );
    }

    // -- STATEMENTS

    onMount(
        () =>
        {
            if ( window && window.localStorage )
            {
                strictlyNecessaryCookieConsent = getJsonObject( localStorage.getItem( strictlyNecessaryCookieConsentName ) );
                performanceCookieConsent = getJsonObject( localStorage.getItem( performanceCookieConsentKey ) );
                functionalCookieConsent = getJsonObject( localStorage.getItem( functionalCookieConsentKey ) );
                targetingCookieConsent = getJsonObject( localStorage.getItem( targetingCookieConsentKey ) );

                if ( strictlyNecessaryCookieConsentName === null )
                {
                    strictlyNecessaryCookieConsent = true;
                }

                if ( performanceCookieConsent === null )
                {
                    performanceCookieConsent = false;
                }

                if ( functionalCookieConsent === null )
                {
                    functionalCookieConsent = false;
                }

                if ( targetingCookieConsent === null )
                {
                    targetingCookieConsent = false;
                }

                isCookieModalOpen =  getJsonObject( localStorage.getItem( cookiesModalOpenKey ) );

                if ( isCookieModalOpen === null )
                {
                    isCookieModalOpen = true;
                }

                let cookieConsent = hasCookieConsent();

                if ( cookieConsent === true )
                {
                    analyticsStore.set( cookieConsent )
                    enableTracking();
                    isCookieModalOpen = false;
                }
            }
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- CLASSES

    .cookie-consent-modal
    {
        z-index: 10000;
        position: fixed;
        bottom: .3rem;
        left: .3rem;

        overflow: hidden;
        width: 21.5625rem;
        border-radius: 1rem;
        padding: 2rem;

        background: #fff;
        box-shadow: 0px 0px 8px 0px rgba(0, 0, 0, 0.40);
    }

    .cookie-consent-modal.minimized
    {
        height: 3rem;
        width: 3rem;
        border: 1px solid greenColor300;
        padding: 1rem;

        display: flex;
        justify-content: center;
        align-items: center;

        background: darkGreyColor;
        box-shadow: 0px 0px 24px 0px rgba(0, 0, 0, 0.40);
    }

    .cookie-consent-content
    {
        width: 100%;

        display: flex;
        flex-direction: column;
        flex-shrink: 0;
        gap: 2rem;
    }

    .cookie-consent-header
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .line-height-200
    {
        line-height: 2rem;
    }

    .line-height-175
    {
        line-height: 1.75rem;
    }

    .line-height-small
    {
        line-height: 1.125rem;
    }

    .cookie-consent-buttons
    {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    a,
    button,
    .cookie-consent-settings
    {
        background: transparent;

        text-decoration-line: underline;
        color: greenColor300;

        cursor: pointer;
    }

    .cookie-consent-manage-preferences
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .cookie-consent-manage-prerence-field
    {
        display: flex;
        gap: 0.5rem;
        justify-content: space-between;
        align-items: center;
    }
</style>

{#if isCookieModalOpen }
    {#key activeStep }
        <div
            class="cookie-consent-modal"
            class:minimized={ steps[ activeStep ] === 'minimized' }
            transition:fade
            use:clickOutside
            on:clickOutside={ handleClickOutside }
        >
            {#if steps[ activeStep ] === 'weUseCookies' }
                <div class="cookie-consent-content">
                    <div class="cookie-consent-header">
                        <span class="font-size-125 font-weight-600 color-gray-100 line-height-200">
                            { getLocalizedText( textBySlugMap[ 'we-use-cookies-label' ], $languageTagStore ) }
                        </span>
                        <span class="font-size-75 color-gray-300 line-height-small">
                            { getLocalizedText( textBySlugMap[ 'we-use-cookies-description-text' ], $languageTagStore ) }
                        </span>
                        <span class="font-size-75 color-gray-300 line-height-small">
                            { getLocalizedText( textBySlugMap[ 'more-information-label' ], $languageTagStore ) }
                            <a
                                class="font-size-75 line-height-small"
                                href="/{ $languageTagStore }/cookies-policy"
                                use:link
                            >
                                { getLocalizedText( textBySlugMap[ 'cookies-policy-label' ], $languageTagStore ) }
                            </a>
                        </span>
                    </div>

                    <div class="cookie-consent-buttons">
                        <Button
                            fullWidth
                            on:click={ handleAcceptAllCookies }
                        >
                            { getLocalizedText( textBySlugMap[ 'accept-all-cookies-button' ], $languageTagStore ) }
                        </Button>
                        <Button
                            fullWidth
                            invertColor
                            variant="borderless"
                            on:click={ handleRejectAllCookies }
                        >
                            { getLocalizedText( textBySlugMap[ 'reject-all-cookies-button' ], $languageTagStore ) }
                        </Button>
                    </div>

                    <button
                        class="cookie-consent-settings font-size-100 line-height-175"
                        on:click={ () => ( activeStep = 1 ) }
                    >
                        { getLocalizedText( textBySlugMap[ 'cookies-settings-button' ], $languageTagStore ) }
                    </button>
                </div>
            {:else if steps[ activeStep ] === 'privacyPreferenceCenter' }
                <div class="cookie-consent-content">
                    <div class="cookie-consent-header">
                        <span class="font-size-125 font-weight-600 color-gray-100 line-height-200">
                            { getLocalizedText( textBySlugMap[ 'privacy-preference-center-label' ], $languageTagStore ) }
                        </span>
                        <span class="font-size-75 color-gray-300 line-height-small">
                            { getLocalizedText( textBySlugMap[ 'we-use-cookies-description-text' ], $languageTagStore ) }
                        </span>
                        <span class="font-size-75 color-gray-300 line-height-small">
                            { getLocalizedText( textBySlugMap[ 'more-information-label' ], $languageTagStore ) }
                            <a
                                class="font-size-75 line-height-small"
                                href="/{ $languageTagStore }/cookies-policy"
                                use:link
                            >
                                { getLocalizedText( textBySlugMap[ 'cookies-policy-label' ], $languageTagStore ) }
                            </a>
                        </span>
                    </div>
                    <div class="cookie-consent-buttons">
                        <Button
                            on:click={ handleAcceptAllCookies }
                            fullWidth
                        >
                            { getLocalizedText( textBySlugMap[ 'allow-all-button' ], $languageTagStore ) }
                        </Button>
                    </div>
                    <div class="cookie-consent-manage-preferences">
                        <span class="font-size-125 color-gray-100 font-weight-600 line-height-200">
                            { getLocalizedText( textBySlugMap[ 'manage-consent-prefereces-label' ], $languageTagStore ) }
                        </span>
                        <label class="font-size-75 color-gray-300 line-height-small cookie-consent-manage-prerence-field" for="">
                            { getLocalizedText( textBySlugMap[ 'strictly-necessary-cookies-label' ], $languageTagStore ) }
                            <Switch disabled value={ strictlyNecessaryCookieConsentName }/>
                        </label>
                        <label class="font-size-75 color-gray-300 line-height-small cookie-consent-manage-prerence-field" for="">
                            { getLocalizedText( textBySlugMap[ 'performance-cookies-label' ], $languageTagStore ) }
                            <Switch
                                value={ performanceCookieConsent }
                                onChange={ () => ( performanceCookieConsent = !performanceCookieConsent ) }
                            />
                        </label>
                        <label class="font-size-75 color-gray-300 line-height-small cookie-consent-manage-prerence-field" for="">
                            { getLocalizedText( textBySlugMap[ 'functional-cookies-label' ], $languageTagStore ) }
                            <Switch
                                value={ functionalCookieConsent }
                                onChange={ () => ( functionalCookieConsent = !functionalCookieConsent ) }
                            />
                        </label>

                        <label class="font-size-75 color-gray-300 line-height-small cookie-consent-manage-prerence-field" for="">
                            { getLocalizedText( textBySlugMap[ 'targeting-cookies-label' ], $languageTagStore ) }
                            <Switch
                                value={ targetingCookieConsent }
                                onChange={ () => ( targetingCookieConsent = !targetingCookieConsent ) }
                            />
                        </label>
                    </div>

                    <div class="cookie-consent-buttons">
                        <Button
                            fullWidth
                            on:click={ handleConfirmMyChoices }
                        >
                            { getLocalizedText( textBySlugMap[ 'confirm-my-choices-button' ], $languageTagStore ) }
                        </Button>
                        <Button
                            fullWidth
                            invertColor
                            variant="borderless"
                            on:click={ handleRejectAllCookies }
                        >
                            { getLocalizedText( textBySlugMap[ 'reject-all-cookies-button' ], $languageTagStore ) }
                        </Button>
                    </div>
                </div>
            {:else}
                <button on:click={ () => { activeStep = 0; isCookieModalOpen = true; } }>
                    <div class="green-cookie-icon size-150"/>
                </button>
            {/if}
        </div>
    {/key}
{/if}

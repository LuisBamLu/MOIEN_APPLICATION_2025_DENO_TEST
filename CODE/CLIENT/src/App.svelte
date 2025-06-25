<script>
    // -- IMPORTS

    import { onMount } from 'svelte';
    import { Router, Route } from 'svelte-routing';
    import { getJsonObject, getJsonText, setTextBySlug } from 'senselogic-gist';
    import { messagingService } from '$src/lib/messaging_service.js';
    import { getUpdatedLanguageTag } from '$lib/language';
    import { fetchData, platform, getInsets } from '$lib/base.js';
    import { ensureLanguageTagInPath, currentPathname } from '$lib/router';
    import { cityArrayStore } from '$store/cityArrayStore';
    import { countryArrayStore } from '$store/countryArrayStore';
    import { featureTypeByCategoryAndSubCategoryArrayStore } from '$store/featureTypeByCategoryAndSubCategoryArrayStore';
    import { isLoadingProfile, profileSignedInStore } from '$store/profileStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagArrayStore } from '$store/languageTagArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { navigationAdjustedStore } from '$store/navigationStore';
    import { propertyTypeArrayStore } from '$store/propertyTypeArrayStore';
    import { rentalTypeArrayStore } from '$store/rentalTypeArrayStore';
    import { urlParamsStore } from '$store/urlParamsStore';
    import { loadNotificationArray, notificationCenterStore } from '$store/notificationCenterStore.js';
    import { genderArrayStore, genderByIdMapStore } from './lib/store/genderStore';
    import { trackRoute } from '$lib/tracking';
    import { propertyArrayStore } from '$lib/store/propertyArray';
    import { handleResizeEvent } from '$lib/store/appDataStore';
    import { defineTags } from '$lib/textProcessor';
    import { webSocketManager } from '$lib/web_socket_manager';
    import { loadConversationArray } from './lib/store/conversationStore';
    import { ScreenOrientation } from '@capacitor/screen-orientation';
    import RouteWithMenu from '$component/layout/RouteWithMenu.svelte';
    import Menu from '$component/layout/Menu.svelte';
    import AdLayout from '$component/layout/AdLayout.svelte';
    import BodyOverflow from '$component/layout/BodyOverflow.svelte';
    import BookingsLayout from '$component/layout/BookingsLayout.svelte';
    import DashboardRouterWrapper from '$component/layout/DashboardRouterWrapper.svelte';
    import Loading from '$component/layout/Loading.svelte';
    import Header from '$component/layout/Header.svelte';
    import HomePage from '$lib/page/HomePage.svelte';
    import ToastContainer from '$component/element/toast/ToastContainer.svelte';
    import AnimatedRouteComponent from '$component/AnimatedRouteComponent.svelte';
    import SplashScreen from '$lib/component/onboarding/SplashScreen.svelte';
    import AuthPage from './lib/page/AuthPage.svelte';

    // -- VARIABLES

    export let url = '';
    let isLoading = true;
    let arrivalDate;
    let departureDate;
    let cityId;
    let countryCode;
    let selectedCity;
    let termType;
    let typeId;
    let selectedCountry;
    let isMounted = false;
    let hash = window.location.hash;
    let hashParams = new URLSearchParams( hash.substring( 1 ) );
    let googleAccessToken = hashParams.get( 'access_token' );

    // -- FUNCTIONS

    async function loadData(
        )
    {
        try
        {
            await ScreenOrientation.lock( { orientation: 'portrait' } );

            let urlParams = new URLSearchParams( window.location.search );

            termType = urlParams.get( 'termType' );
            typeId = urlParams.get( 'typeId' );
            arrivalDate = urlParams.get( 'arrivalDate' );
            departureDate = urlParams.get( 'departureDate' );
            cityId = urlParams.get( 'cityId' );
            countryCode = urlParams.get( 'countryCode' )?.toUpperCase() ?? null;

            let selectedCityPromise
                = fetchData(
                    '/api/city/get-by-id',
                    {
                        method: 'POST',
                        body: getJsonText( { cityId, type: 'searchById' } ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            let selectedCountryPromise
                = fetchData(
                    '/api/country/get-by-code',
                    {
                        method: 'POST',
                        body: JSON.stringify( { countryCode, type: 'searchByCode' } ),
                        headers: { 'Content-Type': 'application/json' }
                    }
                    );

            let [ selectedCityResponse, selectedCountryResponse ] = await Promise.all( [ selectedCityPromise, selectedCountryPromise ] );

            if ( selectedCityResponse )
            {
                selectedCity = selectedCityResponse.city;
            }

            if ( selectedCountryResponse )
            {
                selectedCountry = selectedCountryResponse.country;
            }
        }
        catch ( error )
        {
            if ( selectedCity !== undefined )
            {
                selectedCity = selectedCity.city;
            }
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            $isLoadingProfile = true;

            try
            {
                webSocketManager.setupWebSocket();

                if ( googleAccessToken )
                {
                    let googleAuthProfile
                        = await fetchData(
                            '/api/google-auth?' + hash.substring( 1 ),
                            {
                                method: 'POST',
                                credentials: 'include'
                            }
                            );

                    $profileSignedInStore = googleAuthProfile;
                }
                else
                {
                    let sessionData
                        = await fetchData(
                            '/api/get-session',
                            {
                                method: 'POST',
                                credentials: 'include'
                            }
                            );

                    $profileSignedInStore = sessionData;
                }

                // if ( $appDataStore === null || $appDataStore === undefined )
                // {
                //     let apiRoute =
                //         hostUrl === 'http://localhost:8000'
                //         ? '/api/page/home'
                //         : '/api/client/app'

                //     appDataStore.set(
                //         await fetchData(
                //             apiRoute,
                //             { method: 'POST' }
                //             )
                //         );
                // }

                // if ( $textArrayStore && $textArrayStore.length < 2 )
                // {
                //     textArrayStore.set( $appDataStore.textArray );

                //     for ( let index = 0; index < $textArrayStore.length; index += 1 )
                //     {
                //         setTextBySlug( $textArrayStore[ index ].text, $textArrayStore[ index ].slug );
                //     }
                // }

                // let appStoreArray =
                //     [
                //         countryArrayStore,
                //         languageArrayStore,
                //         languageTagArrayStore,
                //         cityArrayStore,
                //         propertyTypeArrayStore,
                //         rentalTypeArrayStore,
                //         featureTypeByCategoryAndSubCategoryArrayStore,
                //         genderArrayStore,
                //         genderByIdMapStore
                //     ];

                // let appDataArray =
                //     [
                //         'countryArray',
                //         'languageArray',
                //         'languageTagArray',
                //         'cityArray',
                //         'propertyTypeArray',
                //         'rentalTypeArray',
                //         'featureTypeByCategoryAndSubCategoryArray',
                //         'genderArray',
                //         'genderByIdMap'
                //     ];

                // for ( let index = 0; index < appStoreArray.length; index++ )
                // {
                //     if ( !get( appStoreArray[ index ] ) && $appDataStore[ appDataArray[ index ] ] )
                //     {
                //         appStoreArray[ index ].set( $appDataStore[ appDataArray[ index ] ] );

                //         if ( appDataArray[ index ] === 'languageTagArray' )
                //         {
                //             languageTagStore.set( getUpdatedLanguageTag( $languageTagArrayStore ) );
                //             ensureLanguageTagInPath( window.location, $languageTagStore );
                //         }
                //     }
                // }

                let data = await fetchData( '/api/page/home', { method: 'POST' } );
                let textArray = data.textArray;

                for ( let index = 0; index < textArray.length; index += 1 )
                {
                    setTextBySlug( textArray[ index ].text, textArray[ index ].slug );
                }

                countryArrayStore.set( data.countryArray );
                languageArrayStore.set( data.languageArray );
                languageTagArrayStore.set(
                    data.languageArray
                        .filter( language => language.isAvailable )
                        .map( ( language ) => language.code )
                    );
                languageTagStore.set( getUpdatedLanguageTag( $languageTagArrayStore ) );
                ensureLanguageTagInPath( window.location, $languageTagStore );
                cityArrayStore.set( data.cityArray );
                propertyTypeArrayStore.set( data.propertyTypeArray );
                rentalTypeArrayStore.set( data.rentalTypeArray );
                featureTypeByCategoryAndSubCategoryArrayStore.set( data.featureTypeByCategoryAndSubCategoryArray );
                genderArrayStore.set( data.genderArray );
                genderByIdMapStore.set( data.genderByIdMap );

                if ( !window.location.href.includes( '/property/' ) )
                {
                    let insets = await getInsets();
                    let insetTop = insets.top;
                    let insetBottom = insets.bottom;
                    document.body.style.paddingTop = `${ insetTop }px`;
                    document.body.style.paddingBottom = `${ insetBottom }px`;
                }
            }
            catch ( error )
            {
                if ( platform !== 'web' )
                {
                    alert( error );
                }
                console.error( 'Error :', error );
            }
            finally
            {
                isLoading = false;
                isMounted = true;
                $isLoadingProfile = false;
            }
        }
        );

    // ~~

    $: if ( $profileSignedInStore )
    {
        messagingService.initPush( $profileSignedInStore );
        webSocketManager.setupWebSocket();
        loadNotificationArray();
        loadConversationArray();
    }

    // ~~

    $: if ( isMounted )
    {
        $currentPathname, ensureLanguageTagInPath( window.location, $languageTagStore );
        $urlParamsStore, loadData(), trackRoute();
    }

    // ~~

    defineTags();
</script>

<style lang="stylus">
    // -- IMPORTS

    @import 'constant.styl';
    @import 'mixin.styl';

    // -- ELEMENTS

    *
    {
        font-family: 'Plus Jakarta Sans', sans-serif;
    }

    div
    {
        position: relative;

        overflow-y: auto;
        &::-webkit-scrollbar
        {
            display: none;
        }

        -ms-overflow-style: none;  /* IE and Edge */
        scrollbar-width: none;  /* Firefox */

        +media( desktop )
        {
            margin-top: headerHeight;
            height: calc( 100dvh - 4.5rem );
            &::-webkit-scrollbar
            {
                display: auto;
            }

            -ms-overflow-style: auto;  /* IE and Edge */
            scrollbar-width: auto;  /* Firefox */
        }
    }

    // -- CLASSES

    .mobile-top-margin
    {
        margin-top: 4rem;

        +media( desktop )
        {
            margin-top: headerHeight;
        }
    }
</style>

<svelte:head>
    <html lang={ $languageTagStore } />

    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no" />
</svelte:head>

<svelte:window on:resize={ handleResizeEvent }/>

{#if isLoading && navigationAdjustedStore }
    <Loading/>
{:else}
    <SplashScreen />
    <Router { url }>
        <nav>
            <Header
                selectedCity={ selectedCity }
                selectedCountry={ selectedCountry }
                arrivalDate={ arrivalDate }
                departureDate={ departureDate }
            />
        </nav>
        <div
            class:mobile-top-margin=
                {
                    $currentPathname === '/' + $languageTagStore
                    || $currentPathname === '/' + $languageTagStore + '/'
                    || $currentPathname === '/' + $languageTagStore + '/?'
                    || $currentPathname.includes( '/blog' )
                    || $currentPathname.includes( '/article' )
                    || $currentPathname.includes( '/contact-us' )
                    || $currentPathname.includes( '/privacy-policy' )
                    || $currentPathname.includes( '/terms' )
                    || $currentPathname.includes( '/cookies-policy' )
                }
        >
            <Route path='/:languageTag/*'>
                <Router basepath=':/languageTag'>
                    <Route path='/'>
                        <AnimatedRouteComponent>
                            <HomePage/>
                        </AnimatedRouteComponent>
                    </Route>
                    <Route path='/auth'>
                        <AnimatedRouteComponent>
                            <AuthPage/>
                        </AnimatedRouteComponent>
                    </Route>
                    <Route path='/blog/*'>
                        <Router basepath='/blog'>
                            <Route>
                                {#await import( '$lib/page/BlogPage.svelte' ) then { default: BlogPage } }
                                    <AnimatedRouteComponent>
                                        <BlogPage/>
                                    </AnimatedRouteComponent>
                                {/await}
                            </Route>
                            <Route path='/article/:id' let:params>
                                {#await import( '$lib/page/ArticlePage.svelte' ) then { default: ArticlePage } }
                                    <AnimatedRouteComponent>
                                        <ArticlePage
                                            id={ params.id }
                                        />
                                    </AnimatedRouteComponent>
                                {/await}
                            </Route>
                            <Route path='/article/:id/:slug' let:params>
                                {#await import( '$lib/page/ArticlePage.svelte' ) then { default: ArticlePage } }
                                    <AnimatedRouteComponent>
                                        <ArticlePage
                                            id={ params.id }
                                            slug={ params.slug }
                                        />
                                    </AnimatedRouteComponent>
                                {/await}
                            </Route>
                        </Router>
                    </Route>
                    <Route path='/contact-us'>
                        {#await import( '$lib/page/ContactUsPage.svelte' ) then { default: ContactUsPage } }
                            <AnimatedRouteComponent>
                                <ContactUsPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <Route path='/privacy-policy'>
                        {#await import( '$lib/page/PrivacyPolicyPage.svelte' ) then { default: PrivacyPolicyPage } }
                            <AnimatedRouteComponent>
                                <PrivacyPolicyPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <Route path='/terms'>
                        {#await import( '$lib/page/LegalTermsPage.svelte' ) then { default: LegalTermsPage } }
                            <AnimatedRouteComponent>
                                <LegalTermsPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <Route path='/cookies-policy'>
                        {#await import( '$src/lib/page/CookiesPolicyPage.svelte' ) then { default: CookiesPolicyPage } }
                            <AnimatedRouteComponent>
                                <CookiesPolicyPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <Route path='/faq'>
                        {#await import( '$lib/page/FaqPage.svelte' ) then { default: FaqPage } }
                            <AnimatedRouteComponent>
                                <FaqPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <Route path='/about'>
                        {#await import( '$lib/page/AboutPage.svelte' ) then { default: AboutPage } }
                            <AnimatedRouteComponent>
                                <AboutPage/>
                            </AnimatedRouteComponent>
                        {/await}
                    </Route>
                    <RouteWithMenu
                        path='/search'
                        component={ () => import( '$lib/page/PropertiesPage.svelte' ) }
                        componentParams=
                            {
                                {
                                    selectedCity,
                                    selectedCountry,
                                    arrivalDate,
                                    departureDate
                                }
                            }
                    />
                    <RouteWithMenu
                        path='/property/:id'
                        component={ () => import( '$lib/page/PropertyPage.svelte' ) }
                    />
                    <RouteWithMenu
                        path='/profile/:id'
                        component={ () => import( '$lib/page/ProfilePage.svelte' ) }
                    />
                    <Route path='/dashboard/*'>
                        <DashboardRouterWrapper>
                            <Menu/>
                            <Router basepath='/dashboard'>
                                <Route>
                                    {#await import( '$src/lib/page/DashboardPage.svelte' ) then { default: DashboardPage } }
                                        <AnimatedRouteComponent>
                                            <DashboardPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/favorites'>
                                    {#await import( '$lib/page/FavoritesPage.svelte' ) then { default: FavoritesPage } }
                                        <AnimatedRouteComponent>
                                            <FavoritesPage
                                                selectedCity={ selectedCity }
                                                selectedCountry={ selectedCountry }
                                            />
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/history'>
                                    <div class="color-black">History</div>
                                </Route>
                                <Route path='/invoices'>
                                    {#await import ('$lib/page/InvoicePage.svelte' ) then { default: InvoicePage } }
                                        <AnimatedRouteComponent>
                                            <InvoicePage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/personal-details'>
                                    {#await import ('$lib/page/PersonalDetailsPage.svelte' ) then { default: PersonalDetailsPage } }
                                        <AnimatedRouteComponent>
                                            <PersonalDetailsPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/banking-information'>
                                    {#await import( '$lib/page/AccountBankingInformationPage.svelte' ) then { default: AccountBankingInformationPage } }
                                        <AnimatedRouteComponent>
                                            <AccountBankingInformationPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/statistics'>
                                    {#await import ('$lib/page/StatisticsPage.svelte' ) then { default: StatisticsPage } }
                                        <AnimatedRouteComponent>
                                            <StatisticsPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/settings'>
                                    {#await import ('$lib/page/SettingsPage.svelte' ) then { default: SettingsPage } }
                                        <AnimatedRouteComponent>
                                            <SettingsPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/notifications'>
                                    {#await import( '$lib/page/NotificationsPage.svelte' ) then { default: NotificationsPage } }
                                        <AnimatedRouteComponent>
                                            <NotificationsPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/faq'>
                                    {#await import( '$lib/page/FaqPage.svelte' ) then { default: FaqPage } }
                                        <AnimatedRouteComponent>
                                            <FaqPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/balance'>
                                    {#await import( '$lib/page/AccountBalancePage.svelte' ) then { default: AccountBalancePage } }
                                        <AnimatedRouteComponent>
                                            <AccountBalancePage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/bookings'>
                                    {#await import( '$lib/page/BookingsPage.svelte' ) then { default: BookingsPage } }
                                        <AnimatedRouteComponent>
                                            <BookingsLayout>
                                                <BookingsPage/>
                                            </BookingsLayout>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/user-rentals'>
                                    {#await import( '$lib/page/UserRentalsPage.svelte' ) then { default: UserRentalsPage } }
                                        <AnimatedRouteComponent>
                                            <BookingsLayout>
                                                <UserRentalsPage/>
                                            </BookingsLayout>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/rental-file'>
                                    {#await import( '$lib/page/RentalFilePage.svelte' ) then { default: RentalFilePage } }
                                        <AnimatedRouteComponent>
                                            <RentalFilePage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/supporting-document'>
                                    {#await import( '$lib/page/SupportingDocumentPage.svelte' ) then { default: SupportingDocumentPage } }
                                        <AnimatedRouteComponent>
                                            <SupportingDocumentPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/ads/*'>
                                    <Router basepath='/dashboard/ads'>
                                        <Route path='/'>
                                            {#await import( '$lib/page/AdsPage.svelte' ) then { default: AdsPage } }
                                                <AnimatedRouteComponent>
                                                    <AdsPage/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                        <Route path='/ongoing-contracts'>
                                            {#await import( '$lib/page/OngoingContractsPage.svelte' ) then { default: OngoingContractsPage } }
                                                <AnimatedRouteComponent>
                                                    <OngoingContractsPage/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                        <Route path="/lease-contract/:id" let:params>
                                            {#await import( '$lib/page/LeaseContractPage.svelte' ) then { default: LeaseContractPage } }
                                                <AnimatedRouteComponent>
                                                    <LeaseContractPage id={ params.id }/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                        <Route path="/lease-contract/supporting-documents/:id" let:params>
                                            {#await import( '$lib/page/LeaseContractSupportingDocumentsPage.svelte' ) then { default: LeaseContractSupportingDocumentsPage } }
                                                <AnimatedRouteComponent>
                                                    <LeaseContractSupportingDocumentsPage id={ params.id }/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                        <Route path='/subscribe-services'>
                                            <div class="color-black">Subscribe services</div>
                                        </Route>
                                        {#await import ( '$lib/page/CurrentStays.svelte' ) then { default: CurrentStays } }
                                            <Route path='/current-stays'>
                                                <AnimatedRouteComponent>
                                                    <CurrentStays id={ null }/>
                                                </AnimatedRouteComponent>
                                            </Route>
                                            <Route path='/current-stays/:id' let:params >
                                                <AnimatedRouteComponent>
                                                    <CurrentStays id={ params.id }/>
                                                </AnimatedRouteComponent>
                                            </Route>
                                        {/await}
                                        <Route path='/completed-stays'>
                                            <div class="color-black">Completed stays</div>
                                        </Route>
                                        <Route path='/new'>
                                            <AdLayout>
                                                {#await import( '$src/lib/page/AdPage.svelte' ) then { default: AdPage } }
                                                    <AnimatedRouteComponent>
                                                        <AdPage/>
                                                    </AnimatedRouteComponent>
                                                {/await}
                                            </AdLayout>
                                        </Route>
                                        <Route path='/:propertyId' let:params>
                                            <AdLayout>
                                                {#await import( '$src/lib/page/AdPage.svelte' ) then { default: AdPage } }
                                                    <AnimatedRouteComponent>
                                                        <AdPage propertyId="{ params.propertyId }"/>
                                                    </AnimatedRouteComponent>
                                                {/await}
                                            </AdLayout>
                                        </Route>
                                        <Route path='/manage/:propertyId' let:params>
                                            {#await import( '$lib/page/HouseManagementPage.svelte' ) then { default: HouseManagementPage } }
                                                <AnimatedRouteComponent>
                                                    <HouseManagementPage propertyId="{ params.propertyId }"/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                        <Route path='/availability'>
                                            {#await import( '$lib/page/AvailabilityPage.svelte' ) then { default: AvailabilityPage } }
                                                <AnimatedRouteComponent>
                                                    <AvailabilityPage/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                    </Router>
                                </Route>
                                <Route path='/help'>
                                    <div class="color-black">Help</div>
                                </Route>
                                <Route path='/conversation'>
                                    {#await import( '$src/lib/page/ConversationPage.svelte' ) then { default: ConversationPage } }
                                        <AnimatedRouteComponent>
                                            <ConversationPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/events'>
                                    {#await import( '$lib/page/EventsPage.svelte' ) then { default: EventsPage } }
                                        <AnimatedRouteComponent>
                                            <EventsPage/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path="/visit-request/:id" let:params>
                                    {#await import( '$src/lib/page/VisitRequestPage.svelte' ) then { default: VisitRequestPage } }
                                        <AnimatedRouteComponent>
                                            <VisitRequestPage id="{ params.id }"/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path="/edit-lease-contract/:id" let:params>
                                    {#await import( '$lib/page/EditLeaseContractPage.svelte' ) then { default: EditLeaseContractPage } }
                                        <AnimatedRouteComponent>
                                            <EditLeaseContractPage id={ params.id }/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path="/rental-booking/:id" let:params>
                                    {#await import( '$lib/page/RentalBookingPage.svelte' ) then { default: RentalBookingPage } }
                                        <AnimatedRouteComponent>
                                            <RentalBookingPage id={ params.id }/>
                                        </AnimatedRouteComponent>
                                    {/await}
                                </Route>
                                <Route path='/property-management/*'>
                                    <Router basepath="/dashboard/property-management">
                                        <Route path='/:id' let:params >
                                            {#await import ( '$lib/page/PropertyManagementPage.svelte' ) then { default: PropertyManagementPage }  }
                                                <AnimatedRouteComponent>
                                                    <PropertyManagementPage id={ params.id }/>
                                                </AnimatedRouteComponent>
                                            {/await}
                                        </Route>
                                    </Router>
                                </Route>
                            </Router>
                        </DashboardRouterWrapper>
                    </Route>
                    <RouteWithMenu
                        path="/booking/checkout/:id"
                        component={ () => import( '$lib/page/CheckoutPage.svelte' ) }
                    />
                    <RouteWithMenu
                        path="/confirm-booking-payment/:id"
                        component={ () => import( '$lib/page/ConfirmBookingPayment.svelte' ) }
                    />
                    <RouteWithMenu
                        path="/auth/confirm-email-change"
                        component={ () => import( '$lib/page/ConfirmEmailChange.svelte' ) }
                    />
                    <RouteWithMenu
                        path="/auth/verify-sign-up"
                        component={ () => import( '$lib/page/VerifySignUp.svelte' ) }
                    />
                    <RouteWithMenu
                        path="/conversation/:propertyId/:propertyUserId/:conversationTypeId"
                        component={ () => import( '$lib/page/ConversationHelperPage.svelte' ) }
                    />
                </Router>
            </Route>
        </div>
        {#await import( '$component/element/CookieConsent.svelte' ) then { default: CookieConsent } }
            <AnimatedRouteComponent>
                <CookieConsent/>
            </AnimatedRouteComponent>
        {/await}
        <ToastContainer/>
    </Router>
    <BodyOverflow/>
{/if}

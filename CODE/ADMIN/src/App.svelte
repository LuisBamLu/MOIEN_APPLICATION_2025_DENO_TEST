<script>
    // -- IMPORTS

    import { connectionStore } from '$store/connectionStore';
    import { fetchData, isNullOrUndefined } from '$lib/base';
    import { getUpdatedLanguageTag } from '$lib/language';
    import { hasAnyUserRole, isLoadingProfile, permissionSlugArrayStore } from '$store/profileStore';
    import { languageArrayStore } from '$store/languageArrayStore';
    import { languageTagArrayStore } from '$store/languageTagArrayStore';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { profileSignedInStore } from '$store/profileStore';
    import { Router, Route, navigate } from 'svelte5-router';
    import { setTextBySlug } from 'senselogic-gist';
    import { currencyArrayStore } from '$lib/store/currencyArrayStore';
    import { countryArrayStore } from '$lib/store/countryArrayStore';
    import { cityArrayStore } from '$lib/store/cityArrayStore';
    import ToastContainer from '$lib/component/element/toast/ToastContainer.svelte';
    import Header from '$component/layout/Header.svelte';
    import Loading from '$lib/component/layout/Loading.svelte';
    import ProtectedRoute from '$lib/component/layout/ProtectedRoute.svelte';
    import ArticleManagerPage from './lib/page/settings/ArticleManagerPage.svelte';

    // -- CONSTANTS

    const apiEndpoints =
        {
            connection: '/api/connection',
            session: '/api/get-session',
            homePage: '/api/page/home',
            permissionList: '/admin/api/permission/list'
        }

    // -- VARIABLES

    let isLoading = $state(true);
    /** @type {{url?: string}} */
    let { url = '' } = $props();

    // -- FUNCTIONS

    async function loadConnection(
        )
    {
        try
        {
            let response = await fetchData(
                apiEndpoints.connection,
                {
                    method : 'POST',
                    body :
                        JSON.stringify(
                            {
                                type: 'getConnectionByBrowserAddress'
                            }
                            )
                }
                );

            connectionStore.set( response.connection );
        }
        catch ( error )
        {
            console.error( 'Error :', error );
        }
    }

    // ~~

    async function loadSessionData(
        )
    {
        try
        {
            $isLoadingProfile = true;

            let sessionData = await fetchData(
                apiEndpoints.session,
                {
                    method: 'POST',
                    credentials: 'include'
                }
                );

            $profileSignedInStore = sessionData;

            let [ data, { permissionSlugArray } ] = await Promise.all(
                [
                    fetchData(
                        apiEndpoints.homePage,
                        {
                            method: 'POST'
                        }
                        ),
                    $profileSignedInStore
                    ? fetchData(
                        apiEndpoints.permissionList,
                        {
                            method: 'POST',
                            credentials: 'include'
                        }
                        )
                    : Promise.resolve( { permissionSlugArray: null } )
                ]
                );

            updateStores( data, permissionSlugArray );
        }
        catch ( error )
        {
            console.error( 'Error :', error );
        }
        finally
        {
            isLoading = false;
            isLoadingProfile.set( false );
        }
    }

    // ~~

    function updateStores(
        data,
        permissionSlugArray
        )
    {
        let {
                textArray,
                languageArray,
                languageTagArray,
                currencyArray,
                countryArray,
                cityArray
            } = data;

        textArray.forEach( ( { text, slug } ) => setTextBySlug( text, slug ) );
        languageArrayStore.set(languageArray);
        languageTagArrayStore.set(languageTagArray);
        languageTagStore.set( getUpdatedLanguageTag( $languageTagArrayStore ) );
        currencyArrayStore.set( currencyArray );
        countryArrayStore.set( countryArray );
        cityArrayStore.set( cityArray );

        if ( permissionSlugArray )
        {
            permissionSlugArrayStore.set( permissionSlugArray );
        }
    }

    // ~~

    function updateView(
        )
    {
        if ( isNullOrUndefined( document.startViewTransition ) )
        {
            return;
        }

        return new Promise(
            ( resolve ) =>
            {
                document.startViewTransition(
                    async () =>
                    {
                        resolve();
                    }
                    );
            }
            );
    }

    // ~~

    function redirectIfUnauthorized(
        )
    {
        let hasRole =
            hasAnyUserRole(
                [
                    'backoffice',
                    'backoffice-senior',
                    'agency',
                    'administrator'
                ]
                );

        if ( $profileSignedInStore && !hasRole )
        {
            navigate(
                '/',
                {
                    replace: true
                }
                );
        }
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            if ( $profileSignedInStore === null )
            {
                await loadConnection();
            }

            await loadSessionData();
            redirectIfUnauthorized();
        }
        );

    // ~~

    $effect(
        () =>
        {
            document.documentElement.setAttribute( 'lang', $languageTagStore );
        }
        );
</script>

<svelte:head>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet">
</svelte:head>

<style lang="stylus">
    *
    {
        font-family: 'Plus Jakarta Sans';
    }
</style>

{#if isLoading }
    <Loading/>
{:else}
    <Router { url }>
        <nav>
            <Header/>
        </nav>
        <div>
            <Route path="/admin/*">
                <Router basepath="/admin">
                    <Route>
                        {#await import ( '$src/lib/page/LoginPage.svelte' ) then { default: LoginPage } }
                            <LoginPage/>
                        {/await}
                    </Route>
                    <Route path="/reset-password">
                        {#await import ( '$src/lib/page/ResetPasswordPage.svelte' ) then { default: ResetPasswordPage } }
                            <ResetPasswordPage/>
                        {/await}
                    </Route>
                    <ProtectedRoute path="/home" >
                        {#snippet children({ location })}
                                                {#await import ( '$src/lib/page/statistics/HomePage.svelte' ) then { default: HomePage } }
                                <HomePage/>
                            {/await}
                                                                    {/snippet}
                                        </ProtectedRoute>
                    <ProtectedRoute path="/settings/*">
                        <Router basepath="/admin/settings">
                            <Route>
                                {#await import ( '$src/lib/page/SettingsSectionPage.svelte' ) then { default: SettingsSectionPage } }
                                    <SettingsSectionPage/>
                                {/await}
                            </Route>
                            <Route path="/blog/*">
                                <Router basepath="/admin/settings/blog">
                                    <Route>
                                        {#await import ( '$src/lib/page/settings/BlogPage.svelte' ) then { default: BlogPage } }
                                            <BlogPage/>
                                        {/await}
                                    </Route>
                                    <Route path="/article/:id"  >
                                        {#snippet children(params)}
                                            <ArticleManagerPage id={ params.id }/>
                                        {/snippet}
                                    </Route>
                                </Router>
                            </Route>
                            <Route path="/notification-center">
                                {#await import ( '$src/lib/page/settings/NotificationCenterPage.svelte' ) then { default: NotificationCenterPage } }
                                    <NotificationCenterPage/>
                                {/await}
                            </Route>
                            <Route path="/email-templates">
                                {#await import ( '$src/lib/page/settings/EmailTemplatesPage.svelte' ) then { default: EmailTemplatesPage } }
                                    <EmailTemplatesPage/>
                                {/await}
                            </Route>
                            <Route path="/email-templates/:id"  >
                                {#snippet children(params) }
                                    {#await import ( '$src/lib/page/settings/EmailTemplatePage.svelte' ) then { default: EmailTemplatePage } }
                                        <EmailTemplatePage id={ params }/>
                                    {/await}
                                {/snippet}
                            </Route>
                            <Route path="/user-rights">
                                {#await import ( '$src/lib/page/settings/UserRightPage.svelte' ) then { default: UserRightPage } }
                                    <UserRightPage/>
                                {/await}
                            </Route>
                            <Route path="/document-type">
                                {#await import ( '$src/lib/page/settings/DocumentTypeManagerPage.svelte' ) then { default: DocumentTypeManagerPage } }
                                    <DocumentTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/payment-type">
                                {#await import ( '$src/lib/page/settings/PaymentTypeManagerPage.svelte' ) then { default: PaymentTypeManagerPage } }
                                    <PaymentTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/payment-method-type">
                                {#await import ( '$src/lib/page/settings/PaymentMethodTypeManagerPage.svelte' ) then { default: PaymentMethodTypeManagerPage } }
                                    <PaymentMethodTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/property-type">
                                {#await import ( '$src/lib/page/settings/PropertyTypeManagerPage.svelte' ) then { default: PropertyTypeManagerPage } }
                                    <PropertyTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/property-status">
                                {#await import ( '$src/lib/page/settings/PropertyStatusManagerPage.svelte' ) then { default: PropertyStatusManagerPage } }
                                    <PropertyStatusManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/texts">
                                {#await import ( '$src/lib/page/settings/TextPage.svelte' ) then { default: TextPage } }
                                    <TextPage/>
                                {/await}
                            </Route>
                            <Route path="/space-type">
                                {#await import ( '$src/lib/page/settings/SpaceTypeManagerPage.svelte' ) then { default: SpaceTypeManagerPage } }
                                    <SpaceTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/cancellation-policy">
                                {#await import ( '$src/lib/page/settings/CancellationPolicyPage.svelte' ) then { default: CancellationPolicyPage } }
                                    <CancellationPolicyPage/>
                                {/await}
                            </Route>
                            <Route path="/bill-type">
                                {#await import ( '$src/lib/page/settings//BillTypeManagerPage.svelte' ) then { default: BillTypeManagerPage } }
                                    <BillTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/notification-type">
                                {#await import ( '$src/lib/page/settings/NotificationTypeManagerPage.svelte' ) then { default: NotificationTypeManagerPage } }
                                    <NotificationTypeManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/notification-medium">
                                {#await import ( '$src/lib/page/settings/NotificationMediumManagerPage.svelte' ) then { default: NotificationMediumManagerPage } }
                                    <NotificationMediumManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/visit-status">
                                {#await import ( '$src/lib/page/settings/VisitStatusManagerPage.svelte' ) then { default: VisitStatusManagerPage } }
                                    <VisitStatusManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/images">
                                {#await import ( '$src/lib/page/settings/ImageListPage.svelte' ) then { default: ImageListPage } }
                                    <ImageListPage/>
                                {/await}
                            </Route>
                            <Route path="/connections">
                                {#await import ( '$src/lib/page/settings/ConnectionManagerPage.svelte' ) then { default: ConnectionManagerPage } }
                                    <ConnectionManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/mailchimp">
                                {#await import ( '$src/lib/page/settings/MailchimpPage.svelte' ) then { default: MailchimpPage } }
                                    <MailchimpPage/>
                                {/await}
                            </Route>
                            <Route path="/mailchimp/contacts">
                                {#await import ( '$src/lib/page/settings/MailchimpContactListPage.svelte' ) then { default: MailchimpContactListPage } }
                                    <MailchimpContactListPage/>
                                {/await}
                            </Route>
                            <Route path="/mailchimp/campaigns">
                                {#await import ( '$src/lib/page/settings/MailchimpCampaignListPage.svelte' ) then { default: MailchimpCampaignListPage } }
                                    <MailchimpCampaignListPage/>
                                {/await}
                            </Route>
                            <Route path="/mailchimp/campaigns/:campaignId"  >
                                {#snippet children({ location, params })}
                                                                {#await import ( '$src/lib/page/settings/MailchimpCampaignPage.svelte' ) then { default: MailchimpCampaignPage } }
                                        <MailchimpCampaignPage campaignId={ params }/>
                                    {/await}
                                                                                            {/snippet}
                                                        </Route>
                            <Route path="/mailchimp/analytics">
                                {#await import ( '$src/lib/page/settings/MailchimpAnalyticsPage.svelte' ) then { default: MailchimpAnalyticsPage } }
                                    <MailchimpAnalyticsPage/>
                                {/await}
                            </Route>
                        </Router>
                    </ProtectedRoute>
                    <ProtectedRoute path="/edit-view/*">
                        <Router basepath="/admin/edit-view">
                            <Route>
                                {#await import ( '$src/lib/page/EditViewSectionPage.svelte' ) then { default: EditViewSectionPage } }
                                    <EditViewSectionPage/>
                                {/await}
                            </Route>
                            <Route path="/users">
                                {#await import ( '$src/lib/page/exploiting/UsersPage.svelte' ) then { default: UsersPage } }
                                    <UsersPage/>
                                {/await}
                            </Route>
                            <Route path="/users/:userId" >
                                {#snippet children( params )}
                                    {#await import ( '$src/lib/page/exploiting/EditUserPage.svelte' ) then { default: EditUserPage } }
                                        <EditUserPage userId={ params.userId }/>
                                    {/await}
                                {/snippet}
                            </Route>
                            <Route path="/properties">
                                {#await import ( '$src/lib/page/exploiting/PropertyManagerPage.svelte' ) then { default: PropertyManagerPage } }
                                    <PropertyManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/spaces">
                                {#await import ( '$src/lib/page/exploiting/SpaceManagerPage.svelte' ) then { default: SpaceManagerPage } }
                                    <SpaceManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/beds">
                                {#await import ( '$src/lib/page/exploiting/BedManagerPage.svelte' ) then { default: BedManagerPage } }
                                    <BedManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/energy-diagnosis">
                                {#await import ( '$src/lib/page/exploiting/EnergyDiagnosisManagerPage.svelte' ) then { default: EnergyDiagnosisManagerPage } }
                                    <EnergyDiagnosisManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/messages">
                                {#await import ( '$src/lib/page/exploiting/MessageManagerPage.svelte' ) then { default: MessageManagerPage } }
                                    <MessageManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/payment">
                                {#await import ( '$src/lib/page/exploiting/PaymentManagerPage.svelte' ) then { default: PaymentManagerPage } }
                                    <PaymentManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/documents">
                                {#await import ( '$src/lib/page/exploiting/DocumentManagerPage.svelte' ) then { default: DocumentManagerPage } }
                                    <DocumentManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/documents/:documentId" >
                                {#snippet children( params )}
                                    {#await import ( '$src/lib/page/exploiting/EditDocumentPage.svelte' ) then { default: EditDocumentPage } }
                                        <EditDocumentPage documentId={ params.documentId }/>
                                    {/await}
                                {/snippet}
                            </Route>
                            <Route path="/subscription">
                                {#await import ( '$src/lib/page/exploiting/SubscriptionManagerPage.svelte' ) then { default: SubscriptionManagerPage } }
                                    <SubscriptionManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/payment-status">
                                {#await import ( '$src/lib/page/exploiting/PaymentStatusManagerPage.svelte' ) then { default: PaymentStatusManagerPage } }
                                    <PaymentStatusManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/payment-method-status">
                                {#await import ( '$src/lib/page/exploiting/PaymentMethodStatusManagerPage.svelte' ) then { default: PaymentMethodStatusManagerPage } }
                                    <PaymentMethodStatusManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/rental-booking">
                                {#await import ( '$src/lib/page/exploiting/RentalBookingManagerPage.svelte' ) then { default: RentalBookingManagerPage } }
                                    <RentalBookingManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/rental-booking-status">
                                {#await import ( '$src/lib/page/exploiting/RentalBookingStatusManagerPage.svelte' ) then { default: RentalBookingStatusManagerPage } }
                                    <RentalBookingStatusManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/invoice">
                                {#await import ( '$src/lib/page/exploiting/InvoiceManagerPage.svelte' ) then { default: InvoiceManagerPage } }
                                    <InvoiceManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/notification-permission">
                                {#await import ( '$src/lib/page/exploiting/NotificationPermissionsManagerPage.svelte' ) then { default: NotificationPermissionsManagerPage } }
                                    <NotificationPermissionsManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/review">
                                {#await import ( '$src/lib/page/exploiting/ReviewsManagerPage.svelte' ) then { default: ReviewsManagerPage } }
                                    <ReviewsManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/visit">
                                {#await import ( '$src/lib/page/exploiting/VisitManagerPage.svelte' ) then { default: VisitManagerPage } }
                                    <VisitManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/lease-contract">
                                {#await import ( '$src/lib/page/exploiting/LeaseContractManagerPage.svelte' ) then { default: LeaseContractManagerPage } }
                                    <LeaseContractManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/lease-signatory">
                                {#await import ( '$src/lib/page/exploiting/LeaseSignatoryManagerPage.svelte' ) then { default: LeaseSignatoryManagerPage } }
                                    <LeaseSignatoryManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/rental-cost">
                                {#await import ( '$src/lib/page/exploiting/RentalCostManagerPage.svelte' ) then { default: RentalCostManagerPage } }
                                    <RentalCostManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/rental-announcements">
                                {#await import ( '$src/lib/page/exploiting/RentalAnnouncementManager.svelte' ) then { default: RentalAnnouncementManager } }
                                    <RentalAnnouncementManager/>
                                {/await}
                            </Route>
                            <Route path="/inventory">
                                {#await import ( '$src/lib/page/exploiting/InventoryManagerPage.svelte' ) then { default: InventoryManagerPage } }
                                    <InventoryManagerPage/>
                                {/await}
                            </Route>
                            <Route path="/services">
                                {#await import ( '$src/lib/page/exploiting/ServiceManagerPage.svelte' ) then { default: ServiceManagerPage } }
                                    <ServiceManagerPage/>
                                {/await}
                            </Route>
                        </Router>
                    </ProtectedRoute>
                    <ProtectedRoute path="/statistics/*">
                        <Router basepath="/admin/statistics">
                            <Route>
                                {#await import ( '$src/lib/page/StatisticsSectionPage.svelte' ) then { default: StatisticsSectionPage } }
                                    <StatisticsSectionPage/>
                                {/await}
                            </Route>
                            <Route path="/statistics-page">
                                {#await import ( '$src/lib/page/statistics/StatisticsPage.svelte' ) then { default: StatisticsPage } }
                                    <StatisticsPage/>
                                {/await}
                            </Route>
                            <Route path="/dashboard/*">
                                <Router basepath="/admin/statistics/dashboard">
                                    <Route>
                                        {#await import ( '$src/lib/page/statistics/DashboardPage.svelte' ) then { default: DashboardPage } }
                                            <DashboardPage/>
                                        {/await}
                                    </Route>
                                    <Route path="/ticket/:id"  >
                                        {#snippet children( params )}
                                            {#await import ( '$src/lib/page/statistics/TicketPage.svelte' ) then { default: TicketPage } }
                                                <TicketPage id={ params.id }/>
                                            {/await}
                                        {/snippet}
                                    </Route>
                                </Router>
                            </Route>
                        </Router>
                    </ProtectedRoute>
                </Router>
            </Route>
        </div>
        <ToastContainer/>
    </Router>
{/if}

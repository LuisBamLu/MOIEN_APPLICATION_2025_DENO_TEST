<script>
    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import AdminCardList from '$component/element/AdminCardList/AdminCardList.svelte';

    // -- VARIABLES

    let settingCardArray =
    [
        {
            label: getLocalizedTextBySlug( 'mailchimp-label', $languageTagStore ),
            icon: 'gray-100-mailchimp',
            page: '/admin/settings/mailchimp',
            requiredPermissionSlug: 'list-notification'
        },
        {
            label: getLocalizedTextBySlug( 'blog-label', $languageTagStore ),
            icon: 'blog',
            page: '/admin/settings/blog',
            requiredPermissionSlug: 'list-blog'
        },
        {
            label: getLocalizedTextBySlug( 'notification-settings-notifications-label', $languageTagStore ),
            icon: 'gray-100-bell',
            page: '/admin/settings/notification-center',
            requiredPermissionSlug: 'list-notification'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-email-template-manager-label', $languageTagStore ),
            icon: 'email',
            page: '/admin/settings/email-templates',
            requiredPermissionSlug: 'list-email-template'
        },
        {
            label: getLocalizedTextBySlug( 'user-rights-label', $languageTagStore ),
            icon: 'rights',
            page: '/admin/settings/user-rights',
            requiredPermissionSlug: 'list-user-right'
        },
        {
            label: getLocalizedTextBySlug( 'personal-information-document-type', $languageTagStore ),
            icon: 'doctype',
            page: '/admin/settings/document-type',
            requiredPermissionSlug: 'list-document-type'
        },
        {
            label: getLocalizedTextBySlug( 'payment-type-label', $languageTagStore ),
            icon: 'wallet',
            page: '/admin/settings/payment-type',
            requiredPermissionSlug: 'list-payment-type'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-payment-methods-label', $languageTagStore ),
            icon: 'cardholder',
            page: '/admin/settings/payment-method-type',
            requiredPermissionSlug: 'list-payment-method-type'
        },
        {
            label: getLocalizedTextBySlug( 'property-type-label', $languageTagStore ),
            icon: 'property',
            page: '/admin/settings/property-type',
            requiredPermissionSlug: 'list-property-type'
        },
        {
            label: getLocalizedTextBySlug( 'property-status-label', $languageTagStore ),
            icon: 'build',
            page: '/admin/settings/property-status',
            requiredPermissionSlug: 'list-property-status'
        },
        {
            label: getLocalizedTextBySlug( 'schema-text-field-label', $languageTagStore ),
            icon: 'gray-text',
            page: '/admin/settings/texts',
            requiredPermissionSlug: 'list-text'
        },
        {
            label: getLocalizedTextBySlug( 'space-type-label', $languageTagStore ),
            icon: 'space',
            page: '/admin/settings/space-type',
            requiredPermissionSlug: 'list-space-type'
        },
        {
            label: getLocalizedTextBySlug( 'cancellation-policy-label', $languageTagStore ),
            icon: 'gray-policy',
            page: '/admin/settings/cancellation-policy',
            requiredPermissionSlug: 'list-cancellation-policy'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-bill-type-label', $languageTagStore ),
            icon: 'gray-100-cards',
            page: '/admin/settings/bill-type',
            requiredPermissionSlug: 'list-bill-type'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-notification-type-label', $languageTagStore ),
            icon: 'gray-100-bell-ringing',
            page: '/admin/settings/notification-type',
            requiredPermissionSlug: 'list-notification-type'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-notification-medium-label', $languageTagStore ),
            icon: 'gray-100-notification',
            page: '/admin/settings/notification-medium',
            requiredPermissionSlug: 'list-notification-medium'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-visits-status-label', $languageTagStore ),
            icon: 'gray-100-address-book',
            page: '/admin/settings/visit-status',
            requiredPermissionSlug: 'list-visit-status'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-images-manager-label', $languageTagStore ),
            icon: 'gray-100-image',
            page: '/admin/settings/images',
            requiredPermissionSlug: 'list-image'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-connection-manager-label', $languageTagStore ),
            icon: 'gray-100-plug',
            page: '/admin/settings/connections',
            requiredPermissionSlug: 'list-connection'
        },
    ];
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../constant.styl';
    @import '../../mixin.styl';

    // -- STYLES

    .page-container
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: flex;

        background-color: grayColor900;
    }
</style>

<div class="page-container">
    <Sidebar/>
    <AdminCardList
        cardArray={ settingCardArray }
        name="admin-sidebar-settings-label"
    />
</div>

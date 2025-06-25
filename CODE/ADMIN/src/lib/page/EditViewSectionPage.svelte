<script>
    import { languageTagStore } from '$store/languageTagStore';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import AdminCardList from '$component/element/AdminCardList/AdminCardList.svelte';

    let editViewCardArray =
    [
        {
            label: getLocalizedTextBySlug( 'admin-menu-users-label', $languageTagStore ),
            icon: 'users',
            page: '/admin/edit-view/users',
            requiredPermissionSlug: 'list-user'

        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-properties-label', $languageTagStore ),
            icon: 'house',
            page: '/admin/edit-view/properties',
            requiredPermissionSlug: 'list-property'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-spaces-label', $languageTagStore ),
            icon: 'space',
            page: '/admin/edit-view/spaces',
            requiredPermissionSlug: 'list-space'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-beds-label', $languageTagStore ),
            icon: 'bed',
            page: '/admin/edit-view/beds',
            requiredPermissionSlug: 'list-bed'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-diagnosis-label', $languageTagStore ),
            icon: 'energy',
            page: '/admin/edit-view/energy-diagnosis',
            requiredPermissionSlug: 'list-diagnosis'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-messages-label', $languageTagStore ),
            icon: 'chats',
            page: '/admin/edit-view/messages',
            requiredPermissionSlug: 'list-message'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-payments-label', $languageTagStore ),
            icon: 'card',
            page: '/admin/edit-view/payment',
            requiredPermissionSlug: 'list-payment'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-documents-label', $languageTagStore ),
            icon: 'documents',
            page: '/admin/edit-view/documents',
            requiredPermissionSlug: 'list-document'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-subscriptions-label', $languageTagStore ),
            icon: 'gray-subscription',
            page: '/admin/edit-view/subscription',
            requiredPermissionSlug: 'list-subscription'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-payment-status-label', $languageTagStore ),
            icon: 'gray-payment-status',
            page: '/admin/edit-view/payment-status',
            requiredPermissionSlug: 'list-payment-status'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-payment-method-status-label', $languageTagStore ),
            icon: 'gray-payment-method-status',
            page: '/admin/edit-view/payment-method-status',
            requiredPermissionSlug: 'list-payment-method-status'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-rental-booking-label', $languageTagStore ),
            icon: 'gray-rental-booking',
            page: '/admin/edit-view/rental-booking',
            requiredPermissionSlug: 'list-rental-booking'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-rental-booking-status-label', $languageTagStore ),
            icon: 'gray-rental-booking-status',
            page: '/admin/edit-view/rental-booking-status',
            requiredPermissionSlug: 'list-rental-booking-status'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-invoice-label', $languageTagStore ),
            icon: 'invoice',
            page: '/admin/edit-view/invoice',
            requiredPermissionSlug: 'list-invoice'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-notification-permission-label', $languageTagStore ),
            icon: 'permission',
            page: '/admin/edit-view/notification-permission',
            requiredPermissionSlug: 'list-notification-permission'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-reviews-label', $languageTagStore ),
            icon: 'review',
            page: '/admin/edit-view/review',
            requiredPermissionSlug: 'list-review'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-visits-label', $languageTagStore ),
            icon: 'visit',
            page: '/admin/edit-view/visit',
            requiredPermissionSlug: 'list-visit'
        },
        {
            label: getLocalizedTextBySlug( 'lease-contract-page-lease-contract-label', $languageTagStore ),
            icon: 'lease-contract',
            page: '/admin/edit-view/lease-contract',
            requiredPermissionSlug: 'list-lease-contract'
        },
        {
            label: getLocalizedTextBySlug( 'rental-file-page-lease-signatories-label', $languageTagStore ),
            icon: 'lease-signatory',
            page: '/admin/edit-view/lease-signatory',
            requiredPermissionSlug: 'list-lease-signatory'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-rental-cost-label', $languageTagStore ),
            icon: 'rental-cost',
            page: '/admin/edit-view/rental-cost',
            requiredPermissionSlug: 'list-rental-cost'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-rental-announcements-label', $languageTagStore ),
            icon: 'rental-announcements',
            page: '/admin/edit-view/rental-announcements',
            requiredPermissionSlug: 'list-rental-announcements'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-inventories-manager-label', $languageTagStore ),
            icon: 'inventory',
            page: '/admin/edit-view/inventory',
            requiredPermissionSlug: 'list-inventory'
        },
        {
            label: getLocalizedTextBySlug( 'admin-menu-services-manager-label', $languageTagStore ),
            icon: 'services',
            page: '/admin/edit-view/services',
            requiredPermissionSlug: 'list-service'
        }
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
    <Sidebar />
    <AdminCardList
        cardArray={ editViewCardArray }
        name="admin-sidebar-edit-view-label"
    />
</div>

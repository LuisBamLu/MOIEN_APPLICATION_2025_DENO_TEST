// -- IMPORTS

import { getNotificationPreferenceByUserId, updateNotificationPermission } from '../../controller/admin/page/notification_controller';
import { getAllProfiles, getProfileById } from '../../controller/api/profile_controller';
import { getPropertyData } from '../../controller/page/ads_page_controller';
import { getVisitArrayByUserId } from '../../controller/page/availability_page_controller';
import { bedManagerPageData } from '../../controller/admin/page/bed_manager_page_controller';
import { getBillArray } from '../../controller/page/bill_page_controller';
import { getBlogPageData } from '../../controller/page/blog_page_controller';
import { getPropertyArrayByRentalBooking } from '../../controller/page/booking_page_controller';
import { checkoutPageData } from '../../controller/page/checkout_page_controller';
import { getCurrentStays } from '../../controller/page/current_stays_page_controller';
import { getEditLeaseContractPageData } from '../../controller/page/edit_lease_contract_page_controller';
import { getEventsPageData } from '../../controller/page/events_page_controller';
import { getHomePageData } from '../../controller/page/home_page_controller';
import { getHouseRulesPageData } from '../../controller/page/house_rules_page_controller';
import { getInvoiceArray } from '../../controller/page/invoice_page_controller';
import { getLeaseContractData } from '../../controller/page/lease_contract_page_controller';
import { getLeaseContractSupportingDocumentsData } from '../../controller/page/lease_contract_supporting_documents_page_controller';
import { getAdByPropertyId, getNewAdData } from '../../controller/page/new_ad_page_controller';
import { getOngoingContracts } from '../../controller/page/ongoing_contracts_page_controller';
import { getPropertyManagementById } from '../../controller/page/property_management_page_controller';''
import { getPropertyPageData } from '../../controller/page/property_page_controller';
import { rentalBookingPageData } from '../../controller/page/rental_booking_page_controller';
import { getRentalFilePageData } from '../../controller/page/rental_file_page_controller';
import { getStaticsPageData } from '../../controller/page/statistics_page_controller';
import { getDocumentData } from '../../controller/page/supporting_document_page_controller';
import { getVisitRequestPageData } from '../../controller/page/visit_request_page_controller';
import { getProfilePage } from '../../controller/page/profile_page_controller';
import { getUserRentals } from '../../controller/page/user_rentals_page_controller';
import { getUserDocumentArray } from '../../controller/page/document_controller';
import { getBookingCalendarPageData } from '../../controller/page/booking_calendar_page_controller';
import { getArticleDataByIdAndSlug, getArticleSlugById } from '../../controller/page/article_page_controller';

// -- STATEMENTS

export async function pageRoutes( fastify, options )
{
    fastify.post( '/api/page/article/:articleId/get-slug', getArticleSlugById );
    fastify.post( '/api/page/article/:articleId/:articleSlug', getArticleDataByIdAndSlug );
    fastify.post( '/api/page/bookings', getPropertyArrayByRentalBooking );
    fastify.post( '/api/page/checkout', checkoutPageData );
    fastify.post( '/api/page/bills', getBillArray );
    fastify.post( '/api/page/invoices', getInvoiceArray );
    fastify.post( '/api/page/ads', getPropertyData );
    fastify.post( '/api/page/supporting-document', getDocumentData );
    fastify.post( '/api/page/ads/new', getNewAdData );
    fastify.post( '/api/page/ads/:propertyId', getAdByPropertyId );
    fastify.post( '/api/page/property/:propertyId', getPropertyPageData );
    fastify.post( '/api/page/home', getHomePageData );
    fastify.post( '/api/page/events', getEventsPageData );
    fastify.post( '/api/page/rental-file', getRentalFilePageData );
    fastify.post( '/api/page/availability', getVisitArrayByUserId );
    fastify.post( '/api/page/visit-request/:id', getVisitRequestPageData );
    fastify.post( '/admin/page/blog/list', getBlogPageData );
    fastify.post( '/api/page/bed-manager', bedManagerPageData );
    fastify.post( '/api/profile/get-by-id', getProfileById );
    fastify.post( '/api/profile', getAllProfiles );
    fastify.post( '/api/page/statistics', getStaticsPageData );
    fastify.post( '/api/page/notification', getNotificationPreferenceByUserId );
    fastify.post( '/api/page/notification/update', updateNotificationPermission );
    fastify.post( '/api/page/edit-lease-contract/:id', getEditLeaseContractPageData );
    fastify.post( '/api/page/ongoing-contracts', getOngoingContracts );
    fastify.post( '/api/page/lease-contract/:id', getLeaseContractData );
    fastify.post( '/api/page/lease-contract-supporting-documents/:id', getLeaseContractSupportingDocumentsData );
    fastify.post( '/api/page/current-stays', getCurrentStays );
    fastify.post( '/api/page/rental-booking/:id', rentalBookingPageData );
    fastify.post( '/api/page/property-management/:id', getPropertyManagementById );
    fastify.post( '/api/page/house-rules/:id', getHouseRulesPageData );
    fastify.post( '/api/page/profile/:id', getProfilePage );
    fastify.post( '/api/page/user-rentals', getUserRentals );
    fastify.post( '/api/page/user-documents', getUserDocumentArray );
    fastify.post( '/api/page/booking-calendar/:propertyId', getBookingCalendarPageData );
}

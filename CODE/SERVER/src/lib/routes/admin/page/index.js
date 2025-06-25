// -- IMPORTS

// TODO: Fix routes shared with admin/api

import { requireAdmin } from '../../../../lib/base';
import { bedManagerPageData, removeBedData, setBedData } from '../../../../lib/controller/admin/page/bed_manager_page_controller';
import { getDashboardData } from '../../../../lib/controller/admin/page/dashboard_page_controller'
import { getStaticsPage } from '../../../../lib/controller/admin/page/statistics_page_controller';
import { getAdminConversations } from '../../../../lib/controller/admin/page/conversation_controller';
import { getDocumentById } from '../../../../lib/controller/admin/page/document_controller';
import { getDocumentManagerData } from '../../../../lib/controller/admin/page/document_manager_page_controller';
import { getEmailTemplate, getEmailTemplateById } from '../../../../lib/controller/admin/api/email_template_controller';
import { addInvoice, deleteInvoice, getAllInvoiceData, setInvoice } from '../../../../lib/controller/admin/page/invoice_controller';
import { deleteLeaseContractManager, getLeaseContractManager, setLeaseContractManager } from '../../../../lib/controller/admin/page/lease_contract_manager_page_controller';
import { deleteLeaseSignatoryManager, getLeaseSignatoryManager, setLeaseSignatoryManager } from '../../../../lib/controller/admin/page/lease_signatory_manager_page_controller';
import { deleteNotificationPermissionData, getNotificationPermissionData, setNotificationPermissionData } from '../../../../lib/controller/admin/page/notification_controller';
import { cancelPayment, getPaymentData, removePaymentData, setPaymentData } from '../../../../lib/controller/admin/page/payment_controller';
import { deletePaymentMethodStatus, getPaymentMethodStatus, setPaymentMethodStatus } from '../../../../lib/controller/admin/page/payment_method_status_controller';
import { addPaymentStatus, deletePaymentStatus, getPaymentStatus, setPaymentStatus } from '../../../../lib/controller/admin/api/payment_status_controller';
import { addRentalAnnouncement, deleteRentalAnnouncement, getRentalAnnouncement, setRentalAnnouncement } from '../../../../lib/controller/admin/page/rental_announcement_controller';
import { addRentalBookingStatus, deleteRentalBookingStatus, getRentalBookingStatus, setRentalBookingStatus } from '../../../../lib/controller/admin/page/rental_booking_status_controller';
import { getRentalCostData, setRentalCostById, addRentalCost } from '../../../../lib/controller/admin/page/rental_cost_manager_page_controller';
import { getManagerRentalReview } from '../../../../lib/controller/admin/page/rental_review_manager_page_controller';
import { addRentalBooking, getAdminRentalBooking, removeAdminRentalBooking, setAdminRentalBooking, refundAdminRentalBooking, getAdminRentalBookingTickets } from '../../../../lib/controller/admin/page/rental_booking_controller';
import { getServiceManager } from '../../../../lib/controller/admin/page/service_manager_controller';
import { getImageArray } from '../../../../lib/controller/admin/page/storage_controller';
import { getSubscriptionManager } from '../../../../lib/controller/admin/page/subscription_manager_page_controller';
import { getProfileArray, getProfileByUserId } from '../../../../lib/controller/admin/page/user_page_controller';
import { getUserReviewData } from '../../../../lib/controller/admin/page/user_review_manager_page_controller';
import { getVisitManager, removeVisitManager, setVisitManager } from '../../../../lib/controller/admin/page/visit_manager_page_controller';
import { addTicket, getTicket, getTicketById, setTicketById } from '../../../controller/admin/page/ticket_controller';
import { getSpaceArray, setSpaceData, removeSpaceData } from '../../../../lib/controller/admin/page/space_controller';
import { deleteInventoryData, getInventoryManager, setInventoryData, addInventoryData } from '../../../../lib/controller/admin/page/inventory_manager_controller';
import { adminGetProperty } from '../../../controller/admin/page/property_controller';
import { getEnergyDiagnosis, setEnergyDiagnosis, removeEnergyDiagnosis } from '../../../controller/admin/page/energy_diagnosis_controller';
import { handleAddUserRightAdminApiDataRequest, setUserRightData, removeUserRightData, getUserRightData } from '../../../controller/page/user_right_page_controller';
import { getConnectionArray, addConnectionData, setConnectionData, removeConnectionData } from '../../../controller/api/connection_controller';
import { getArticleData } from '../../../controller/page/article_page_controller';
import { getAudienceArray, getCampaign, getMailchimpCampaignById, getMailchimpAnalytics, getMemberArrayByListId, removeMemberById, setMemberById, getMailchimpCampaignSendChecklist, getMailchimpCampaignReport, sendCampaignById, setMailchimpCampaignContent, setMailchimpCampaignById, getMailchimpTemplateArray, setMailchimpCampaignSchedule, addMailchimpCampaign } from '../../../controller/api/mailchimp_page_controller';

// -- STATEMENTS

export async function adminPageRoutes( fastify, options )
{
    fastify.post( '/api/admin/page/dashboard', getDashboardData );

    fastify.post( '/admin/page/article/:articleId/get', getArticleData );

    fastify.post( '/api/admin/page/ticket', getTicket );
    fastify.post( '/api/admin/page/ticket/:ticketId', getTicketById );
    fastify.post( '/api/admin/page/ticket/set/:ticketId', setTicketById );
    fastify.post( '/api/admin/page/ticket/add', addTicket );
    fastify.post( '/api/admin/page/statistics', getStaticsPage );

    fastify.post( '/admin/page/connection/list', getConnectionArray );
    fastify.post( '/admin/page/connection/add', addConnectionData );
    fastify.post( '/admin/page/connection/set/:connectionId', setConnectionData );
    fastify.post( '/admin/page/connection/remove/:connectionId', removeConnectionData );

    fastify.post( '/api/email/template', getEmailTemplate );
    fastify.post( '/api/email/template/:id', getEmailTemplateById );

    fastify.post( '/admin/page/user-right/list', getUserRightData );
    fastify.post( '/admin/page/user-right/set/:userRoleId', setUserRightData );
    fastify.post( '/admin/page/user-right/remove/:userRoleId', removeUserRightData );
    fastify.post( '/admin/page/user-right/add', handleAddUserRightAdminApiDataRequest );

    fastify.post( '/admin/page/image/list', getImageArray );

    fastify.post( '/api/admin/page/users', getProfileArray );
    fastify.post( '/api/admin/page/users/:userId', getProfileByUserId );

    fastify.post( '/api/admin/page/property', adminGetProperty );

    fastify.post( '/admin/page/space/list', getSpaceArray );
    fastify.post( '/admin/page/space/set/:spaceId', setSpaceData );
    fastify.post( '/admin/page/space/remove/:spaceId', removeSpaceData );

    fastify.post( '/admin/page/bed/list', bedManagerPageData );
    fastify.post( '/admin/page/bed/set/:bedId', setBedData );
    fastify.post( '/admin/page/bed/remove/:bedId', removeBedData );

    fastify.post( '/admin/page/energy-diagnosis/list', getEnergyDiagnosis );
    fastify.post( '/admin/page/energy-diagnosis/set/:energyDiagnosisId', setEnergyDiagnosis );
    fastify.post( '/admin/page/energy-diagnosis/remove/:energyDiagnosisId', removeEnergyDiagnosis );

    fastify.post( '/api/admin/page/conversation/get', getAdminConversations );

    fastify.post( '/api/admin/page/payment', getPaymentData );
    fastify.post( '/api/admin/page/payment/set/:paymentId', setPaymentData );
    fastify.post( '/api/admin/page/payment/remove/:paymentId', removePaymentData );

    fastify.post(
        '/api/admin/page/payment/set',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setPayment );
        }
        );

    fastify.post(
        '/api/admin/page/payment/cancel',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, cancelPayment );
        }
        );

    fastify.post( '/api/admin/page/document-manager', getDocumentManagerData );
    fastify.post( '/api/admin/page/document-manager/:id', getDocumentById );

    fastify.post( '/api/admin/page/subscription', getSubscriptionManager );

    fastify.post( '/api/admin/page/payment-status', getPaymentStatus );
    fastify.post( '/api/admin/page/payment-status/add', addPaymentStatus );
    fastify.post( '/api/admin/page/payment-status/:paymentStatusId/set', setPaymentStatus );
    fastify.post( '/api/admin/page/payment-status/:paymentStatusId/remove', deletePaymentStatus );

    fastify.post( '/api/admin/page/payment-method-status', getPaymentMethodStatus );
    fastify.post( '/api/admin/page/payment-method-status/add', addPaymentStatus );
    fastify.post( '/api/admin/page/payment-method-status/:paymentMethodStatusId/set', setPaymentMethodStatus );
    fastify.post( '/api/admin/page/payment-method-status/:paymentMethodStatusId/remove', deletePaymentMethodStatus );

    fastify.post( '/api/admin/page/rental-booking', getAdminRentalBooking );
    fastify.post( '/api/admin/page/rental-booking/add', addRentalBooking );
    fastify.post( '/api/admin/page/rental-booking/:rentalBookingId/set', setAdminRentalBooking );
    fastify.post( '/api/admin/page/rental-booking/:rentalBookingId/refund', refundAdminRentalBooking );
    fastify.post( '/api/admin/page/rental-booking/:rentalBookingId/remove', removeAdminRentalBooking );
    fastify.post( '/api/admin/page/rental-booking/:rentalBookingId/tickets', getAdminRentalBookingTickets );

    fastify.post( '/api/admin/page/rental-booking-status', getRentalBookingStatus );
    fastify.post( '/api/admin/page/rental-booking-status/add', addRentalBookingStatus );
    fastify.post( '/api/admin/page/rental-booking-status/:rentalBookingStatusId/set', setRentalBookingStatus );
    fastify.post( '/api/admin/page/rental-booking-status/:rentalBookingStatusId/remove', deleteRentalBookingStatus );

    fastify.post( '/api/admin/page/invoice', getAllInvoiceData );
    fastify.post( '/api/admin/page/invoice/add', addInvoice );
    fastify.post( '/api/admin/page/invoice/:invoiceId/set', setInvoice );
    fastify.post( '/api/admin/page/invoice/:invoiceId/remove', deleteInvoice );

    fastify.post( '/admin/page/notification-permission/list', getNotificationPermissionData );
    fastify.post( '/admin/page/notification-permission/:notificationPermissionId/set', setNotificationPermissionData );
    fastify.post( '/admin/page/notification-permission/:notificationPermissionId/remove', deleteNotificationPermissionData );

    fastify.post( '/api/admin/page/rental-review', getManagerRentalReview );

    fastify.post( '/api/admin/page/user-review', getUserReviewData );

    fastify.post( '/api/admin/page/visit', getVisitManager );
    fastify.post( '/api/admin/page/visit/:visitId/set', setVisitManager );
    fastify.post( '/api/admin/page/visit/:visitId/remove', removeVisitManager );

    fastify.post( '/api/admin/page/lease-contract', getLeaseContractManager );
    fastify.post( '/api/admin/page/lease-contract/:leaseContractId/set', setLeaseContractManager );
    fastify.post( '/api/admin/page/lease-contract/:leaseContractId/remove', deleteLeaseContractManager );

    fastify.post( '/api/admin/page/lease-signatory', getLeaseSignatoryManager );
    fastify.post( '/api/admin/page/lease-signatory/:leaseSignatoryId/set', setLeaseSignatoryManager );
    fastify.post( '/api/admin/page/lease-signatory/:leaseSignatoryId/remove', deleteLeaseSignatoryManager );

    fastify.post( '/api/admin/page/rental-cost', getRentalCostData );
    fastify.post( '/api/admin/page/rental-cost/:rentalCostId/set', setRentalCostById );
    fastify.post( '/api/admin/page/rental-cost/add', addRentalCost );

    fastify.post(
        '/api/admin/page/rental-announcement',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getRentalAnnouncement);
        }
        );

    fastify.post(
        '/api/admin/page/rental-announcement/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addRentalAnnouncement);
        }
        );

    fastify.post(
        '/api/admin/page/rental-announcement/set',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setRentalAnnouncement);
        }
        );

    fastify.post(
        '/api/admin/page/rental-announcement/delete',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deleteRentalAnnouncement);
        }
        );

    fastify.post( '/api/admin/page/inventory', getInventoryManager );
    fastify.post( '/api/admin/page/inventory/add', addInventoryData );
    fastify.post( '/api/admin/page/inventory/:inventoryId/set', setInventoryData );
    fastify.post( '/api/admin/page/inventory/:inventoryId/remove', deleteInventoryData );

    fastify.post(
        '/api/admin/page/service',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getServiceManager );
        }
        );

    fastify.post( '/api/admin/page/mailchimp/contact/list', getMemberArrayByListId );
    fastify.post( '/api/admin/page/mailchimp/contact/remove/:email', removeMemberById );
    fastify.post( '/api/admin/page/mailchimp/contact/set/:id', setMemberById );
    fastify.post( '/api/admin/page/mailchimp/', getAudienceArray );
    fastify.post( '/api/admin/page/mailchimp/campaign/list', getCampaign );
    fastify.post( '/api/admin/page/mailchimp/campaign/send/:campaignId', sendCampaignById );
    fastify.post( '/api/admin/page/mailchimp/campaign/checklist/:campaignId', getMailchimpCampaignSendChecklist );
    fastify.post( '/api/admin/page/mailchimp/campaign/report/:campaignId', getMailchimpCampaignReport );
    fastify.post( '/api/admin/page/mailchimp/campaign/:campaignId', getMailchimpCampaignById );
    fastify.post( '/api/admin/page/mailchimp/campaign/:campaignId/set', setMailchimpCampaignById );
    fastify.post( '/api/admin/page/mailchimp/campaign/schedule/:campaignId', setMailchimpCampaignSchedule );
    fastify.post( '/api/admin/page/mailchimp/campaign/:campaignId/template/set', setMailchimpCampaignContent );
    fastify.post( '/api/admin/page/mailchimp/campaign/template/list', getMailchimpTemplateArray );
    fastify.post( '/api/admin/page/mailchimp/campaign/add', addMailchimpCampaign );
    fastify.post( '/api/admin/page/mailchimp/analytics', getMailchimpAnalytics );
}

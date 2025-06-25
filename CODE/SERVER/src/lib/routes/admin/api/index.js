// -- IMPORTS

import { requireAdmin } from '../../../base';
import { resetPassword, sendResetPasswordLink, signInWithPassword } from '../../../../lib/controller/admin/api/authentication_controller';
import { addEnergyDiagnosis } from '../../../../lib/controller/admin/page/energy_diagnosis_controller';
import { addPaymentType, removePaymentType, setPaymentType } from '../../../../lib/controller/admin/api/payment_type_controller';
import { addPropertyStatus, deletePropertyStatus, updatePropertyStatus } from '../../../../lib/controller/admin/api/property_status_controller';
import { addPropertyType, deletePropertyType, updatePropertyType } from '../../../../lib/controller/admin/api/property_type_controller';
import { addRentalBookingStatus, deleteRentalBookingStatus, setRentalBookingStatus } from '../../../controller/admin/page/rental_booking_status_controller';
import { addRentalAnnouncement, deleteRentalAnnouncement, getRentalAnnouncement, setRentalAnnouncement } from '../../../../lib/controller/admin/page/rental_announcement_controller';
import { addDocumentType, deleteDocumentType, setDocumentType } from '../../../controller/api/document_type_controller';
import { addPaymentStatus, deletePaymentStatus, setPaymentStatus } from '../../../../lib/controller/admin/api/payment_status_controller';
import { deleteFile, updateFile } from '../../../../lib/controller/admin/page/storage_controller';
import { getAssignees } from '../../../../lib/controller/admin/page/ticket_controller';
import { addVisitStatus, deleteVisitStatus, getVisitStatus, setVisitStatus } from '../../../../lib/controller/admin/api/visit_status_controller';
import { cancelPayment, getPayment } from '../../../controller/admin/page/payment_controller';
import { updateEmailTemplate } from '../../../controller/admin/api/email_template_controller';
import { adminGetProperty, adminRemoveProperty, adminUpdateProperty, adminGetPropertyArray } from '../../../controller/admin/page/property_controller';
import { getAdminRentalBooking, getRentalBookingById } from '../../../controller/admin/page/rental_booking_controller';
import { addSpaceType, deleteSpaceType, setSpaceType } from '../../../controller/api/space_type_controller';
import { addPaymentMethodType, deletePaymentMethodType, setPaymentMethodType } from '../../../controller/api/payment_method_type_controller';
import { addPaymentMethodStatus, deletePaymentMethodStatus, setPaymentMethodStatus } from '../../../controller/admin/page/payment_method_status_controller';
import { getPermission } from '../../../controller/page/permission_controller';
import { addBillType, deleteBillType, updateBillType } from '../../../controller/admin/api/bill_type_controller';
import { addNotificationMedium, deleteNotificationMedium, updateNotificationMedium } from '../../../controller/admin/api/notification_medium_controller';
import { addNotificationType, deleteNotificationType, setNotificationType } from '../../../controller/admin/api/notification_type_controller';
import { updateProfile } from '../../../controller/admin/page/user_page_controller';
import { getSimplifiedProfileArray } from '../../../controller/api/profile_controller';
import { addTicketStatus, getTicketStatus, getTicketStatusById, removeTicketStatusById, setTicketStatusById } from '../../../controller/admin/api/ticket_status_controller';
import { addTicketType, getTicketType, getTicketTypeById, removeTicketTypeById, setTicketTypeById } from '../../../controller/admin/api/ticket_type_controller';
import { acceptDocument, declineDocument } from '../../../controller/admin/page/document_controller';
import { getMailchimpVerifiedDomainArray } from '../../../controller/api/mailchimp_page_controller';

// -- STATEMENTS

export async function adminApiRoutes( fastify, options )
{
    fastify.post( '/admin/api/property-type/set/:propertyTypeId', updatePropertyType );
    fastify.post( '/admin/api/property-type/remove/:propertyTypeId', deletePropertyType );
    fastify.post( '/admin/api/property-type/add', addPropertyType );

    fastify.post( '/admin/api/property-status/set/:propertyStatusId', updatePropertyStatus );
    fastify.post( '/admin/api/property-status/remove/:propertyStatusId', deletePropertyStatus );
    fastify.post( '/admin/api/property-status/add', addPropertyStatus );

    fastify.post( '/admin/api/property/:propertyId', adminGetProperty );
    fastify.post( '/admin/api/property/set/:propertyId', adminUpdateProperty );
    fastify.post( '/admin/api/property/remove/:propertyId', adminRemoveProperty );
    fastify.post( '/admin/api/property/list', adminGetPropertyArray );

    fastify.post( '/admin/api/space-type/add', addSpaceType );
    fastify.post( '/admin/api/space-type/set/:spaceTypeId', setSpaceType );
    fastify.post( '/admin/api/space-type/remove/:spaceTypeId', deleteSpaceType );

    fastify.post( '/admin/api/bill-type/add', addBillType );
    fastify.post( '/admin/api/bill-type/set/:billTypeId', updateBillType );
    fastify.post( '/admin/api/bill-type/remove/:billTypeId', deleteBillType );

    fastify.post( '/admin/api/notification-type/add', addNotificationType );
    fastify.post( '/admin/api/notification-type/set/:notificationTypeId', setNotificationType );
    fastify.post( '/admin/api/notification-type/remove/:notificationTypeId', deleteNotificationType );

    fastify.post( '/admin/api/notification-medium/add', addNotificationMedium );
    fastify.post( '/admin/api/notification-medium/set/:notificationMediumId', updateNotificationMedium );
    fastify.post( '/admin/api/notification-medium/remove/:notificationMediumId', deleteNotificationMedium );

    fastify.post( '/admin/api/document/:documentId/accept', acceptDocument );
    fastify.post( '/admin/api/document/:documentId/decline', declineDocument );

    fastify.post(
        '/api/energy-diagnosis/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addEnergyDiagnosis );
        }
        );

    fastify.post(
        '/api/admin/rental-booking/get-by-id/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getRentalBookingById );
        }
        );

    fastify.post(
        '/api/admin/rental-booking',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getAdminRentalBooking );
        }
        );

    fastify.post(
        '/api/rental-booking-status/update/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setRentalBookingStatus );
        }
        );

    fastify.post(
        '/api/rental-booking-status/delete/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deleteRentalBookingStatus );
        }
        );

    fastify.post(
        '/api/rental-announcement',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getRentalAnnouncement);
        }
        );

    fastify.post(
        '/api/rental-announcement/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addRentalAnnouncement );
        }
        );

    fastify.post(
        '/api/rental-announcement/update/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setRentalAnnouncement );
        }
        );

    fastify.post(
        '/api/rental-announcement/delete/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deleteRentalAnnouncement );
        }
        );

    fastify.post( '/admin/api/document-type/add', addDocumentType );
    fastify.post( '/admin/api/document-type/set/:documentTypeId', setDocumentType );
    fastify.post( '/admin/api/document-type/remove/:documentTypeId', deleteDocumentType );

    fastify.post( '/admin/api/payment-type/add', addPaymentType );
    fastify.post( '/admin/api/payment-type/set/:paymentTypeId', setPaymentType );
    fastify.post( '/admin/api/payment-type/remove/:paymentTypeId', removePaymentType );

    fastify.post(
        '/api/payment-status/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addPaymentStatus );
        }
        );

    fastify.post(
        '/api/payment-status/update/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setPaymentStatus );
        }
        );

    fastify.post(
        '/api/payment-status/delete/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deletePaymentStatus );
        }
        );

    fastify.post(
        '/api/payment-method-status/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addPaymentMethodStatus );
        }
        );

    fastify.post(
        '/api/payment-method-status/update/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setPaymentMethodStatus );
        }
        );

    fastify.post(
        '/api/payment-method-status/delete/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deletePaymentMethodStatus );
        }
        );

    fastify.post(
        '/api/payment-method-type/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addPaymentMethodType );
        }
        );

    fastify.post(
        '/api/payment-method-type/update/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setPaymentMethodType );
        }
        );

    fastify.post(
        '/api/payment-method-type/delete/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deletePaymentMethodType );
        }
        );

    fastify.post(
        '/api/payment/get-by-id/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getPayment );
        }
        );

    fastify.post(
        '/api/payment/cancel/:id',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, cancelPayment );
        }
        );

    fastify.post(
        '/api/visit-status',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, getVisitStatus );
        }
        );

    fastify.post(
        '/api/visit-status/add',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, addVisitStatus );
        }
        );

    fastify.post(
        '/api/visit-status/set',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, setVisitStatus );
        }
        );

    fastify.post(
        '/api/visit-status/delete',
        async ( request, reply ) =>
        {
            return await requireAdmin( request, reply, deleteVisitStatus );
        }
        );

    fastify.post( '/admin/page/image/set', updateFile );
    fastify.post( '/admin/api/storage/remove', deleteFile );

    fastify.post( '/api/admin/assignees', getAssignees );

    fastify.post( '/api/email/template/update/:id', updateEmailTemplate );
    fastify.post( '/admin/api/permission/list', getPermission );

    fastify.post( '/admin/api/set-profile/:profileId', updateProfile );
    fastify.post( '/admin/api/get-simplified-profile-array', getSimplifiedProfileArray );

    fastify.post( '/admin/api/ticket-status', getTicketStatus );
    fastify.post( '/admin/api/ticket-status/:ticketStatusId', getTicketStatusById );
    fastify.post( '/admin/api/ticket-status/set/:ticketStatusId', setTicketStatusById );
    fastify.post( '/admin/api/ticket-status/remove/:ticketStatusId', removeTicketStatusById );
    fastify.post( '/admin/api/ticket-status/add', addTicketStatus );

    fastify.post( '/admin/api/ticket-type', getTicketType );
    fastify.post( '/admin/api/ticket-type/:ticketTypeId', getTicketTypeById );
    fastify.post( '/admin/api/ticket-type/set/:ticketTypeId', setTicketTypeById );
    fastify.post( '/admin/api/ticket-type/remove/:ticketTypeId', removeTicketTypeById );
    fastify.post( '/admin/api/ticket-type/add', addTicketType );

    fastify.post( '/admin/api/mailchimp/verified-domain/list', getMailchimpVerifiedDomainArray );
}

export async function adminAuthRoutes( fastify, options )
{
    fastify.post(
        '/api/admin/sign-in',
        signInWithPassword
        );

    fastify.post(
        '/api/admin/send-reset-link',
        sendResetPasswordLink
        );

    fastify.post(
        '/api/admin/reset-password',
        resetPassword
        );
}

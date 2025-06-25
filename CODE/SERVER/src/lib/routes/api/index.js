// -- IMPORTS

import { openAuth, confirmEmailChange, requestToken, betaApply, signIn, signOut, signUp, checkPhoneNumberExists, verifySignUp, authCallback } from '../../../lib/controller/admin/api/authentication_controller';
import { addArticle, deleteArticleById, getArticleArray, getArticleById, setArticleById, sortBlockIdByArticleId } from '../../../lib/controller/api/article_controller';
import { addBlock, deleteBlockById, getBlockArray, getBlockByArticleId, setBlockById } from '../../../lib/controller/api/block_controller';
import { getBlockTypeArray, getBlockTypeArrayById } from '../../../lib/controller/api/block_type_controller';
import { addArticleCategory, getArticleCategoryArray, setArticleCategoryById, deleteArticleCategory } from '../../../lib/controller/api/article_category_controller';
import { getFavoritePropertyArray, getPropertyArray, getPropertyById, setProperty, getNearestPropertyArray } from '../../../lib/controller/admin/page/property_controller';
import { addQuestion, setQuestionById } from '../../controller/api/question_controller.js';
import { getArticleTypeArray } from '../../../lib/controller/api/article_type_controller';
import { addConversation, getConversation, getConversationArrayByUserProfileId, getConversationById, getPropertyOfConversationById } from '../../../lib/controller/admin/page/conversation_controller';
import { getText, setTextBySlug } from '../../../lib/controller/api/text_controller';
import { getLanguage } from '../../../lib/controller/api/language_controller';
import { getAllCities, getCityArrayByCountryCode, getCityByCode, getCityById, getCityByName, getCityBySearchName } from '../../../lib/controller/api/city_controller';
import { getCountryByCode } from '../../../lib/controller/api/country_controller';
import { addSpace, getSpaceById, removeSpace, setSpace } from '../../../lib/controller/admin/page/space_controller';
import { getPropertyType } from '../../../lib/controller/admin/api/property_type_controller';
import { getPropertyStatus } from '../../../lib/controller/admin/api/property_status_controller';
import { getRentalType } from '../../../lib/controller/api/rental_type_controller';
import { getFeatureByCategoryAndSubCategoryMap } from '../../../lib/controller/api/feature_type_controller';
import { getBedType } from '../../../lib/controller/api/bed_type_controller';
import { getBalance } from '../../../lib/controller/api/balance_controller';
import { getHeatingType } from '../../../lib/controller/api/heating_type_controller';
import { getSpaceType } from '../../../lib/controller/api/space_type_controller';
import { addRentalReview, getRentalReview } from '../../../lib/controller/api/rental_review_controller';
import { addRentalBooking, cancelRentalBooking, confirmRentalBooking, payRentalBooking, setRentalBooking } from '../../../lib/controller/admin/page/rental_booking_controller';
import { addRentalBookingStatus, getRentalBookingStatus } from '../../controller/admin/page/rental_booking_status_controller.js';
import { upsertAd } from '../../../lib/controller/api/ad_controller';
import { getBillArray } from '../../../lib/controller/api/bill_controller';
import { addCancellationPolicy, getAllCancellationPolicy, getCancellationPolicyById, removeCancellationPolicy, setCancellationPolicy } from '../../../lib/controller/api/cancellation_policy_controller';
import { getCompanyType } from '../../../lib/controller/api/company_type_controller';
import { confirmBookingPayment } from '../../../lib/controller/api/confirm_booking_payment_controller';
import { getConnectionByBrowserAddress } from '../../../lib/controller/api/connection_controller';
import { getCurrencyArray } from '../../../lib/controller/api/currency_controller';
import { addDocument, deleteDocument, getDocumentArray, setDocument, setDocumentImage } from '../../../lib/controller/admin/page/document_controller';
import { verifyDocumentation } from '../../../lib/controller/api/document_hook_controller.js';
import { getDocumentStatus } from '../../../lib/controller/api/document_status_controller';
import { getDocumentType } from '../../../lib/controller/api/document_type_controller';
import { setFeature } from '../../../lib/controller/api/feature_controller';
import { updateLeaseContract } from '../../../lib/controller/api/lease_contract_controller';
import { addBankAccount, addCardRegistration, addPayout, getPaymentMethodMap, setCardRegistration, setCard } from '../../../lib/controller/api/mangopay_controller';
import { getMessageArrayByConversationId } from '../../../lib/controller/api/message_controller';
import { addNewsletterSubscription } from '../../../lib/controller/api/newsletter_subscription_controller.js';
import { addNotification, getNotificationArray, getNotificationCenter, getNotificationMediumData, getNotificationTypeData, getPublicKey, notifyAllByNotificationType, registerToken, setDismissNotification, setReadNotificationRead } from '../../../lib/controller/admin/page/notification_controller';
import { getPaymentMethodType } from '../../../lib/controller/api/payment_method_type_controller';
import { getPaymentType } from '../../../lib/controller/admin/api/payment_type_controller';
import { addManyProfiles, setProfileFavoriteProperty, updateProfileImage, updateProfile } from '../../../lib/controller/api/profile_controller';
import { getSubscriptionItem, setSubscription } from '../../../lib/controller/api/subscription_controller';
import { addVisit, getAvailableVisitArrayByUserId, setVisit } from '../../../lib/controller/api/visit_controller';
import { progetisService } from '../../../lib/service/progetis_rental_announcement_platform_service';
import { getPaymentMethodStatus } from '../../controller/admin/page/payment_method_status_controller.js';
import { getTransactionArray } from '../../controller/api/transaction_controller.js';
import { getBillType } from '../../controller/admin/api/bill_type_controller.js';
import { getEmploymentStatusArray } from '../../controller/api/employment_status_controller.js';
import { getClientAppData } from '../../controller/api/client_app_controller.js';
import { addUserReview, getUserReviewData } from '../../controller/page/user_review_manager_page_controller.js';
import { addFile, removeFile } from '../../controller/api/file_controller.js';
import { addRentalDay } from '../../controller/api/rental_day_controller.js';
import { getLocationByName } from '../../controller/api/location_controller.js';
import { getConversionRate } from '../../controller/api/currency_conversion_controller.js';
import { getRecommendProperties } from '../../controller/api/recommended_crontroller.js';
import { sendContactUsEmail } from '../../controller/api/contact_controller.js';
import { getInfoPage } from '../../controller/api/info_pages_controller.js';
import { getUserReviewValue } from '../../controller/admin/page/dashboard_page_controller.js';
import { migrateProperties } from '../../controller/api/progetis_rental_announcement_platform_controller.js';
import { validateAddress } from '../../controller/api/address_controller.js';

// -- STATEMENTS

export async function apiRoutes(
    fastify,
    options
    )
{
    fastify.post( '/api/client/app', getClientAppData );
    fastify.post( '/api/blog/articles/get', getArticleArray );
    fastify.post( '/api/blog/articles/add', addArticle );
    fastify.post( '/api/blog/articles/sort-block-by-article-id/:id', sortBlockIdByArticleId );
    fastify.post( '/api/blog/articles/set-by-id/:id', setArticleById );
    fastify.post( '/api/blog/articles/get-by-id/:id', getArticleById );
    fastify.post( '/api/blog/articles/delete-by-id/:id', deleteArticleById );
    fastify.post( '/api/blog/blocks/get', getBlockArray );
    fastify.post( '/api/blog/blocks/add', addBlock );
    fastify.post( '/api/blog/blocks/get-by-article-id/:id', getBlockByArticleId );
    fastify.post( '/api/blog/blocks/delete-by-id/:id', deleteBlockById );
    fastify.post( '/api/blog/blocks/set-by-id/:id', setBlockById );
    fastify.post( '/api/blog/block-type/get', getBlockTypeArray );
    fastify.post( '/api/blog/block-type/get-by-id', getBlockTypeArrayById );
    fastify.post( '/api/blog/article-type/get', getArticleTypeArray );
    fastify.get( '/api/blog/categories', getArticleCategoryArray );
    fastify.post( '/api/blog/article-categories/get', getArticleCategoryArray );
    fastify.post( '/api/blog/article-categories/set/:categoryId', setArticleCategoryById );
    fastify.post( '/api/blog/article-categories/add', addArticleCategory );
    fastify.post( '/api/blog/article-categories/remove/:categoryId', deleteArticleCategory );
    fastify.post( '/api/property/get', getPropertyArray );
    fastify.post( '/api/property/get-nearest-properties', getNearestPropertyArray );
    fastify.post( '/api/property/get/:id', getPropertyById );
    fastify.post( '/api/property/get-filtered', getFavoritePropertyArray );
    fastify.post( '/api/property/set/:id', setProperty );
    fastify.post( '/api/property/question/set', setQuestionById );
    fastify.post( '/api/property/question/add', addQuestion );
    fastify.post( '/api/message/get-by-conversation-id', getMessageArrayByConversationId );
    fastify.post( '/api/conversation/get', getConversation );
    fastify.post( '/api/conversation/add', addConversation );
    fastify.post( '/api/conversation/get-by-id', getConversationById );
    fastify.post( '/api/conversation/get-by-user-id', getConversationArrayByUserProfileId );
    fastify.post( '/api/conversation/:propertyId', getPropertyOfConversationById );
    fastify.post( '/api/text/get', getText );
    fastify.post( '/api/text/set-by-slug', setTextBySlug );
    fastify.post( '/api/language', getLanguage );
    fastify.post( '/api/city', getAllCities );
    fastify.post( '/api/city/get-by-id', getCityById );
    fastify.post( '/api/city/get-by-name', getCityByName );
    fastify.post( '/api/city/get-by-search-name', getCityBySearchName );
    fastify.post( '/api/city/get-city-by-country-code', getCityArrayByCountryCode );
    fastify.post( '/api/city/get-by-code', getCityByCode );
    fastify.post( '/api/country/get-by-code', getCountryByCode );
    fastify.post( '/api/space/:id', getSpaceById );
    fastify.post( '/api/space/update/:id', setSpace );
    fastify.post( '/api/space/add', addSpace );
    fastify.post( '/api/space/delete/:id', removeSpace );
    fastify.post( '/api/property-type/get', getPropertyType );
    fastify.post( '/api/property-status/get', getPropertyStatus );
    fastify.post( '/api/rental-type', getRentalType );
    fastify.post( '/api/feature-type/get-by-category-and-subcategory-map', getFeatureByCategoryAndSubCategoryMap );
    fastify.post( '/api/bed-type', getBedType );
    fastify.post( '/api/heating-type', getHeatingType );
    fastify.post( '/api/space-type/get', getSpaceType );
    fastify.post( '/api/rental-review', getRentalReview );
    fastify.post( '/api/profile/add-many', addManyProfiles );
    fastify.post( '/api/profile/set-favorite-property', setProfileFavoriteProperty );
    fastify.post( '/api/rental-booking/add', addRentalBooking );
    fastify.post( '/api/pay-rental-booking/pay', payRentalBooking );
    fastify.post( '/api/rental-booking/update/:id', setRentalBooking );
    fastify.post( '/api/rental-booking/confirm/:id', confirmRentalBooking );
    fastify.post( '/api/rental-booking/cancel/:id', cancelRentalBooking );
    fastify.post( '/api/rental-booking-status', getRentalBookingStatus );
    fastify.post( '/api/rental-booking-status/add', addRentalBookingStatus );
    fastify.post( '/api/set-ad', upsertAd );
    fastify.post( '/api/document-type/list', getDocumentType );
    fastify.post( '/api/payment-type', getPaymentType );
    fastify.post( '/api/payment-method-status', getPaymentMethodStatus );
    fastify.post( '/api/payment-method-type', getPaymentMethodType );
    fastify.post( '/api/document-status', getDocumentStatus );
    fastify.post( '/api/document', getDocumentArray );
    fastify.post( '/api/document/update', setDocument );
    fastify.post( '/api/balance', getBalance );
    fastify.post( '/api/transaction', getTransactionArray );
    fastify.post( '/api/feature/update', setFeature );
    fastify.post( '/api/update-document-validation', verifyDocumentation );
    fastify.post( '/api/document/new', addDocument );
    fastify.post( '/api/document/update-image/:id', setDocumentImage );
    fastify.post( '/api/document/delete/:id', deleteDocument );
    fastify.post( '/api/create-card-registration', addCardRegistration );
    fastify.post( '/api/update-card-registration', setCardRegistration );
    fastify.post( '/api/set-card', setCard );
    fastify.post( '/api/create-bank-account', addBankAccount );
    fastify.post( '/api/create-payout', addPayout );
    fastify.post( '/api/get-payment-method-map', getPaymentMethodMap );
    fastify.post( '/api/create-rental-visit', addVisit );
    fastify.post( '/api/bill', getBillArray );
    fastify.post( '/api/bill-type', getBillType );
    fastify.post( '/api/update-profile/:profileId', updateProfile );
    fastify.post( '/api/update-profile-image', updateProfileImage );
    fastify.post( '/api/get-available-rental-visit-array-by-user-id', getAvailableVisitArrayByUserId );
    fastify.post( '/api/update-rental-visit', setVisit );
    fastify.post( '/api/newsletter-subscription', addNewsletterSubscription );
    fastify.post( '/api/update-lease-contract/:id', updateLeaseContract );
    fastify.post( '/api/company-type', getCompanyType );
    fastify.post( '/api/subscription-item', getSubscriptionItem );
    fastify.post( '/api/subscription-item/set', setSubscription );
    fastify.post( '/api/currency', getCurrencyArray );
    fastify.post( '/admin/api/cancellation-policy/:id/get', getCancellationPolicyById );
    fastify.post( '/admin/api/cancellation-policy/set/:id', setCancellationPolicy );
    fastify.post( '/admin/api/cancellation-policy/remove/:id', removeCancellationPolicy );
    fastify.post( '/admin/api/cancellation-policy/add', addCancellationPolicy );
    fastify.post( '/admin/api/cancellation-policy/list', getAllCancellationPolicy );
    fastify.post( '/api/notification-type', getNotificationTypeData );
    fastify.post( '/api/notification-medium', getNotificationMediumData );
    fastify.post( '/api/notification/public-key', getPublicKey );
    fastify.post( '/api/notification/token', registerToken );
    fastify.post( '/api/notification/add', addNotification );
    fastify.post( '/api/notification/notify', notifyAllByNotificationType );
    fastify.post( '/api/notification', getNotificationCenter );
    fastify.post( '/api/notifications', getNotificationArray );
    fastify.post( '/api/notification/read/:id', setReadNotificationRead );
    fastify.post( '/api/notification/dismiss/:id', setDismissNotification );
    fastify.get( '/api/confirm-booking-payment', confirmBookingPayment );
    fastify.post( '/api/employment-status/list', getEmploymentStatusArray );
    fastify.post( '/api/add-file', addFile );
    fastify.post( '/api/remove-file', removeFile );
    fastify.post( '/api/add-property-review', addRentalReview );
    fastify.post( '/api/add-user-review', addUserReview );
    fastify.post( '/api/rental-day/add/:propertyId', addRentalDay );
    fastify.post( '/api/location/get-by-name', getLocationByName );
    fastify.post( '/api/contact-us', sendContactUsEmail );
    fastify.post( '/api/get-currency-conversion-rate', getConversionRate );
    fastify.post( '/api/recommended-properties', getRecommendProperties );
    fastify.post( '/api/get-info-page', getInfoPage );
    fastify.post( '/api/get-user-review', getUserReviewValue );
    fastify.post( '/api/validate-address', validateAddress )
}

export async function authRoutes(
    fastify,
    options
    )
{
    fastify.post( '/api/request-token', requestToken );
    fastify.post( '/api/auth/open-auth', openAuth );
    fastify.post( '/api/auth/callback', authCallback );
    fastify.post( '/api/beta-apply', betaApply );
    fastify.post( '/api/check-phone-number', checkPhoneNumberExists )
    fastify.post( '/api/sign-in', signIn );
    fastify.post( '/api/sign-up', signUp );
    fastify.post( '/api/sign-out', signOut );
    fastify.post( '/api/auth/confirm-email-change', confirmEmailChange );
    fastify.get( '/api/verify-sign-up', verifySignUp );
    fastify.post( '/api/connection', getConnectionByBrowserAddress );
}

export async function progretisRoutes(
    fastify,
    options
    )
{
    fastify.post( '/api/migrate-properties/:agencyUuid', migrateProperties );
}

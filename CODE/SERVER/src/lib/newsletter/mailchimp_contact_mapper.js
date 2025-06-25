// -- TYPES

export class MailchimpContactMapper
{
    // -- OPERATIONS

    static toDomain(
        persistenceMailchimpContact
        )
    {
        let domainMailchimpContactArray = [];

        for ( let mailchimpContact of persistenceMailchimpContact.members )
        {
            domainMailchimpContactArray.push(
                {
                    id: mailchimpContact.id,
                    email: mailchimpContact.email_address,
                    uniqueEmailId: mailchimpContact.unique_email_id,
                    contactId: mailchimpContact.contact_id,
                    fullName: mailchimpContact.full_name,
                    webId: mailchimpContact.web_id,
                    emailType: mailchimpContact.email_type,
                    status: mailchimpContact.status,
                    unsubscribeReason: mailchimpContact?.unsubscribe_reason,
                    consentToOneToOneMessaging: mailchimpContact.consents_to_one_to_one_messaginga,
                    smsPhoneNumber: mailchimpContact.sms_phone_number,
                    smsSubscriptionStatus: mailchimpContact.sms_subscription_status,
                    smsSubscriptionLastUpdated: mailchimpContact.sms_subscription_last_updated,
                    mergeFieldMap:
                        {
                            firstName: mailchimpContact.merge_fields.FNAME,
                            lastName: mailchimpContact.merge_fields.LNAME,
                            phoneNumber: mailchimpContact.merge_fields.PHONE,
                            birthday: mailchimpContact.merge_fields.BIRTHDAY,
                            address:
                                {
                                    addressLine1: mailchimpContact.merge_fields.ADDRESS.addr1,
                                    addressLine2: mailchimpContact.merge_fields.ADDRESS.addr2,
                                    city: mailchimpContact.merge_fields.ADDRESS.city,
                                    state: mailchimpContact.merge_fields.ADDRESS.state,
                                    zipCode: mailchimpContact.merge_fields.ADDRESS.zip,
                                    countryCode: mailchimpContact.merge_fields.ADDRESS.country,
                                }
                        },
                    campaignMetricsStatMap:
                        {
                            averageOpenRate: mailchimpContact.stats.avg_open_rate,
                            averageClickRate: mailchimpContact.stats.avg_click_rate
                        },
                    ipSignUp: mailchimpContact.ip_signup,
                    timestampSignUp: mailchimpContact.timestamp_signup,
                    ipOpt: mailchimpContact.ip_opt,
                    timestampOpt: mailchimpContact.timestamp_opt,
                    memberRating: mailchimpContact.member_rating,
                    lastChanged: mailchimpContact.last_changed,
                    language: mailchimpContact.language,
                    vip: mailchimpContact.vip,
                    emailClient: mailchimpContact.email_client,
                    location:
                        {
                            latitude: mailchimpContact.latitude,
                            longitude: mailchimpContact.longitude,
                            gmtOffset: mailchimpContact.gmtoff,
                            daylightSavingTimeOffset: mailchimpContact.dstoff,
                            countryCode: mailchimpContact.country_code,
                            timezone: mailchimpContact.timezone,
                            region: mailchimpContact.region
                        },
                    lastNote:
                        {
                            noteId: mailchimpContact.last_note?.note_id,
                            createdAt: mailchimpContact.last_note?.create_at,
                            createdBy: mailchimpContact.last_note?.create_by,
                            note: mailchimpContact.last_note?.note
                        },
                    source: mailchimpContact.source,
                    tagCount: mailchimpContact.tags_count,
                    tagArray: mailchimpContact.tags,
                    listId: mailchimpContact.list_id
                }
                );
            }

        return (
            {
                contactArray: domainMailchimpContactArray,
                totalItemCount: persistenceMailchimpContact.total_items
            }
            );
    }

    // ~~

    static toPersistence(
        domainMailchimpContact
        )
    {
        return (
            {
                id: domainMailchimpContact.id,
                emailAddress: domainMailchimpContact.email,
                emailType: domainMailchimpContact.emailType,
                status: domainMailchimpContact.status,
                marketingPermissions: domainMailchimpContact.consentToOneToOneMessaging,
                mergeFields:
                    {
                        FNAME: domainMailchimpContact.firstName || '',
                        LNAME: domainMailchimpContact.lastName || '',
                        PHONE: domainMailchimpContact.phoneNumber || '',
                        BIRTHDAY: domainMailchimpContact.birthday || '',
                        ADDRESS:
                            {
                                addr1: domainMailchimpContact.addressLine1 || '',
                                addr2: domainMailchimpContact.addressLine2 || '',
                                city: domainMailchimpContact.city || '',
                                state: domainMailchimpContact.state || '',
                                zip: domainMailchimpContact.zipCode || '',
                                country: domainMailchimpContact.countryCode || '',
                            }
                    },
                ipSignup: domainMailchimpContact.ipSignUp,
                timestampSignup: domainMailchimpContact.timestampSignUp,
                ipOpt: domainMailchimpContact.ipOpt,
                timestampOpt: domainMailchimpContact.timestampOpt,
                listId: domainMailchimpContact.listId
            }
            );
    }
}

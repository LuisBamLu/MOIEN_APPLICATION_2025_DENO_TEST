// -- TYPES

export class MailchimpCampaignMapper
{
    // -- OPERATIONS

    static toDomain(
        persistenceMailchimpCampaign
        )
    {
        let domainMailchimpCampaignArray = [];

        for ( let mailchimpCampaign of persistenceMailchimpCampaign.campaigns )
        {
            domainMailchimpCampaignArray.push(
                {
                    id: mailchimpCampaign.id,
                    type: mailchimpCampaign.type,
                    createTime: mailchimpCampaign.create_time,
                    archiveUrl: mailchimpCampaign.archive_url,
                    longArchiveUrl: mailchimpCampaign.long_archive_url,
                    status: mailchimpCampaign.status,
                    emailSentCount: mailchimpCampaign.emails_sent,
                    sendTime: mailchimpCampaign.send_time,
                    contentType: mailchimpCampaign.content_type,
                    resendable: mailchimpCampaign.resendable,
                    recipientMap:
                        {
                            listId: mailchimpCampaign.recipients.list_id,
                            listIsActive: mailchimpCampaign.recipients.list_is_active,
                            listName: mailchimpCampaign.recipients.list_name,
                            segmentText: mailchimpCampaign.recipients.segment_text,
                            recipientCount: mailchimpCampaign.recipients.recipient_count
                        },
                    settingMap:
                        {
                            subjectLine: mailchimpCampaign.settings.subject_line,
                            title: mailchimpCampaign.settings.title,
                            fromName: mailchimpCampaign.settings.from_name,
                            replyTo: mailchimpCampaign.settings.reply_to,
                            useConversation: mailchimpCampaign.settings.use_conversation,
                            toName: mailchimpCampaign.settings.to_name,
                            folderId: mailchimpCampaign.settings.folder_id,
                            authenticate: mailchimpCampaign.settings.authenticate,
                            autoFooter: mailchimpCampaign.settings.auto_footer,
                            inlineCss: mailchimpCampaign.settings.inline_css,
                            autoTweet: mailchimpCampaign.settings.auto_tweet,
                            facebookComment: mailchimpCampaign.settings.fb_comments,
                            timewarp: mailchimpCampaign.settings.timewarp,
                            templateId: mailchimpCampaign.settings.template_id,
                            dragAndDrop: mailchimpCampaign.settings.drag_and_drop
                        },
                    trackingMap:
                        {
                            open: mailchimpCampaign.tracking.opens,
                            htmlClick: mailchimpCampaign.tracking.html_clicks,
                            textClick: mailchimpCampaign.tracking.text_clicks,
                            goalTracking: mailchimpCampaign.tracking.goal_tracking,
                            ecommerce360: mailchimpCampaign.tracking.ecomm360,
                            googleAnalytics: mailchimpCampaign.tracking.google_analytics,
                            clicktable: mailchimpCampaign.tracking.clicktale
                        },
                    ...( mailchimpCampaign.report_summary
                         &&
                            {
                                reportSummaryMap:
                                    {
                                        openCount: mailchimpCampaign.report_summary.opens,
                                        uniqueOpenCount: mailchimpCampaign.report_summary.unique_opens,
                                        openRate: mailchimpCampaign.report_summary.open_rate,
                                        clickCount: mailchimpCampaign.report_summary.clicks,
                                        subscriberClickCount: mailchimpCampaign.report_summary.subscriber_clicks,
                                        clickRate: mailchimpCampaign.report_summary.click_rate,
                                        ecommerce:
                                            {
                                                totalOrderCount: mailchimpCampaign.report_summary.ecommerce.total_orders,
                                                totalSpentCount: mailchimpCampaign.report_summary.ecommerce.total_spent,
                                                totalRevenueCount: mailchimpCampaign.report_summary.ecommerce.total_revenue
                                            }
                                    }
                            }
                        ),
                    deliveryStatusMap:
                        {
                            enabled: mailchimpCampaign.delivery_status.enabled
                        }
                }
                );
        }

        return (
            {
                campaignArray: domainMailchimpCampaignArray,
                totalItemCount: persistenceMailchimpCampaign.total_items
            }
            );
    }

    // ~~

    static toPersistence(
        domainMailchimpCampaign
        )
    {
    }
}

// -- IMPORTS

import { deleteListMember, getListMember, getListMemberArray, updateListMember } from '../../newsletter/lists/members';
import md5 from 'md5';
import { getInteger, getJsonObject } from 'senselogic-gist';
import { getMemberNoteArray } from '../../newsletter/lists/member_notes';
import { addCampaign, getCampaignArray, scheduleCampaign, sendCampaign, updateCampaign } from '../../newsletter/campaign';
import { getCampaignUnsubscribedListMember } from '../../newsletter/reports/unsubscribes';
import { MailchimpCampaignMapper } from '../../newsletter/mailchimp_campaing_mapper';
import { MailchimpContactMapper } from '../../newsletter/mailchimp_contact_mapper';
import { getCampaignReport, getCampaignReportArray } from '../../newsletter/reports';
import { getCampaignSendChecklist } from '../../newsletter/campaigns/send_checklist';
import { getListArray } from '../../newsletter/lists';
import { getCampaignContent, setCampaignContent } from '../../newsletter/campaigns/content';
import { getCampaign as getCampaignById } from '../../newsletter/campaign';
import { getCampaignDomainPerformance } from '../../newsletter/reports/domain_performance';
import { getVerifiedDomains } from '../../newsletter/verified_domains';

// -- CONTANTS

const mapping =
    {
        'members': 'contactArray',
        'list_id': 'litsId',
        'total_items': 'totalItemCount',
        '_links': 'linkArray'
    };

// -- FUNCTIONS

export async function getAudienceArray(
    request,
    reply
    )
{
    let response = await getListArray();

    return reply.send( response );
}

// ~~

export async function getMemberArrayByListId(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { count = 10, offset = 0 } = body;

    let response = await getListMemberArray(
        process.env.MAILCHIMP_LIST_ID,
        undefined,
        [ '_links' ],
        count,
        offset
        );

    let mailchimpMappedResponse = MailchimpContactMapper.toDomain( response );
    let pageCount = mailchimpMappedResponse.totalItemCount;
    let hasMorePage = offset + count < pageCount;

    return reply.send( { ...mailchimpMappedResponse, hasMorePage } );
}

// ~~

export async function removeMemberById(
    request,
    reply
    )
{
    let { email } = request.params;
    let response = await deleteListMember(
        process.env.MAILCHIMP_LIST_ID,
        md5( email )
        );

    return reply.send( { message: 'mailchimp-contact-removed-successfully' } );
}

// ~~

export async function setMemberById(
    request,
    reply
    )
{
    let { id } = request.params;
    let body = getJsonObject( request.body );

    let member = MailchimpContactMapper.toPersistence( body );

    let response = await updateListMember(
        member.listId,
        md5( member.emailAddress ),
        false,
        member.emailAddress,
        member.emailType,
        member.status,
        member.mergeFields,
        member.interests,
        member.language,
        member.vip,
        member.location,
        member.marketingPermissions,
        member.ipSignup,
        member.timestampSignup,
        member.ipOpt,
        member.timestampOpt
        );

    return reply.send( { message: 'mailchimp-contact-updated-successfully' } );
}

// ~~

export async function getCampaign(
    request,
    reply
    )
{
    let body = getJsonObject( request.body );
    let { count = 10, offset = 0 } = body;
    let response = await getCampaignArray(
        process.env.MAILCHIMP_LIST_ID,
        undefined,
        [ '_links' ],
        count,
        offset,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        'create_time',
        'DESC'
        );
    let mailchimpMappedResponse = MailchimpCampaignMapper.toDomain( response );
    let pageCount = mailchimpMappedResponse.totalItemCount;
    let hasMorePage = offset + count < pageCount;

    return reply.send( { ...mailchimpMappedResponse, hasMorePage } );
}

// ~~

export async function addMailchimpCampaign(
    request,
    reply
    )
{
    let response = await addCampaign(
        'regular',
        'template',
        {
            list_id: process.env.MAILCHIMP_LIST_ID
        },
        {
            from_name: 'Moiën',
            template_id: 214
        }
        );

    return reply.send( { message: 'campaign-created-sucessfully', campaignId: response.id, response } );
}

// ~~

export async function getMailchimpAnalytics(
    request,
    reply
    )
{
    let { startDate, endDate } = request.query;

    let reportArray = await getEmailReportArray( startDate, endDate );
    let pastReportArray = await getEmailReportArray( getPastDate( startDate ), getPastDate( endDate ) );

    let metricMap = calculateMetricMap( reportArray, pastReportArray );

    return reply.send( metricMap );
}

// ~~

async function getEmailReportArray(
    startDate,
    endDate
    )
{
    let { reports: reportArray } = await getCampaignReportArray( startDate, endDate );

    return reportArray;
}

// ~~

function getPastDate(
    date
    )
{
    let pastDate = new Date( date );
    pastDate.setDate( pastDate.getDate() - 30 );

    return pastDate.toISOString();
}

// ~~

function calculateMetricMap(
    reportArray,
    pastReportArray
    )
{
    let totalSentCount = 0;
    let pastTotalSentCount = 0;

    for ( let report of reportArray )
    {
        totalSentCount += report.emails_sent;
    }

    for ( let report of pastReportArray )
    {
        pastTotalSentCount += report.emails_sent;
    }

    let openRate = calculateRate( reportArray , 'opens' );
    let pastOpenRate = calculateRate( pastReportArray , 'opens' );

    let clickRate = calculateRate( reportArray , 'clicks' );
    let pastClickRate = calculateRate( pastReportArray , 'clicks' );

    let unsubscribeRate = calculateRate( reportArray , 'unsubscribed' );
    let pastUnsubscribeRate = calculateRate( pastReportArray , 'unsubscribed' );

    let deliveryArray = [];

    for ( let report of reportArray )
    {
        deliveryArray.push(
            {
                date: report.send_time,
                abuseReportRate: ( report.abuse_reports / report.emails_sent ) * 100 || 0
            }
            );
    }

    let performanceLabelArray = [];
    let performanceValueArray = [];

    for ( let report of reportArray )
    {
        performanceLabelArray.push( report.send_time );
        performanceValueArray.push( report.opens?.unique_opens / report.emails_sent || 0 );
    }

    let conversionLabelArray =
        [
            'Deliveries¨fr:Livraisons¨de:Lieferungen',
            'Opened¨fr:Ouvert¨de:Geöffnet',
            'Clicked¨fr:Cliquer¨de:Geklickt',
            'Orders¨fr:Commandes¨de:Bestellungen'
        ];
    let conversionDataMap =
        {
            delivery: { converted: 0, dropoff: 0 },
            opened: { converted: 0, dropoff: 0 },
            clicked: { converted: 0, dropoff: 0 },
            order: { converted: 0, dropoff: 0 }
        };

    for ( let report of reportArray )
    {
        let totalSentCount = report.emails_sent || 0;
        let uniqueOpenCount = report.opens?.unique_opens || 0;
        let uniqueClickCount = report.clicks?.unique_clicks || 0;
        let totalOrderCount = report.ecommerce?.total_orders || 0;
        let totalBounceCount = ( report.bounces?.hard_bounces || 0 )
              + ( report.bounces?.soft_bounces || 0 )
              + ( report.bounces?.syntax_errors || 0 );

        let dropoffDelivery = totalSentCount ? ( totalBounceCount / totalSentCount ) * 100 : 0;
        let convertedDelivery = totalSentCount ? ( (totalSentCount - totalBounceCount ) / totalSentCount ) * 100 : 0;

        let convertedOpen = totalSentCount ? ( uniqueOpenCount / totalSentCount ) * 100 : 0;
        let dropoffOpen = 100 - convertedOpen;

        let convertedClick = totalSentCount ? ( uniqueClickCount / totalSentCount ) * 100 : 0;
        let dropoffClick = 100 - convertedClick;

        let convertedOrder = totalSentCount ? ( totalOrderCount / totalSentCount ) * 100 : 0;
        let dropoffOrder = totalOrderCount > 0 ? 100 - convertedOrder : 0;

        conversionDataMap.delivery.converted += convertedDelivery;
        conversionDataMap.delivery.dropoff += dropoffDelivery;

        conversionDataMap.opened.converted += convertedOpen;
        conversionDataMap.opened.dropoff += dropoffOpen;

        conversionDataMap.clicked.converted += convertedClick;
        conversionDataMap.clicked.dropoff += dropoffClick;

        conversionDataMap.order.converted += convertedOrder;
        conversionDataMap.order.dropoff += dropoffOrder;
    }

    for ( let categoryKey in conversionDataMap )
    {
        let categoryData = conversionDataMap[ categoryKey ];

        let total = categoryData.converted + categoryData.dropoff;

        if ( total !== 100 )
        {
            let conversionFactor = 100 / total;
            categoryData.converted *= conversionFactor;
            categoryData.dropoff *= conversionFactor;
        }
    }

    return (
        {
            generalMetricMap:
                {
                    openRate: formatMetric( openRate , pastOpenRate ),
                    clickRate: formatMetric( clickRate , pastClickRate ),
                    totalSentCount: formatMetric( totalSentCount , pastTotalSentCount ),
                    unsubscribeRate: formatMetric( unsubscribeRate , pastUnsubscribeRate )
                },
            performanceOverTime:
                {
                    labelArray: performanceLabelArray,
                    valueArray: performanceValueArray
                },
            conversion:
                {
                    labelArray: conversionLabelArray,
                    ...conversionDataMap
                },
            delivery:
                {
                    totalDeliveryCount: formatMetric( totalSentCount , pastTotalSentCount ),
                    abuseReportRateArray: deliveryArray
                }
        }
        );
}

// ~~

function calculateRate(
    reportArray,
    key
    )
{
    let totalCount = 0;
    let totalSentCount = 0;

    for ( let report of reportArray )
    {
        if ( key === 'opens' )
        {
            totalCount += report[ key ]?.unique_opens || 0;
        }
        else if ( key === 'clicks' )
        {
            totalCount += report[ key ]?.unique_clicks || 0;
        }
        else
        {
            totalCount += report[ key ] || 0;
        }

        totalSentCount += report.emails_sent;
    }

    let percentage = totalSentCount
         ? ( totalCount / totalSentCount )
         : 0;

    return percentage;
}

// ~~

function formatMetric(
    current,
    past
    )
{
    return (
        {
            value: current,
            variation: past ? ( current - past ) / past : 0
        }
        );
}

// ~~

export async function getMailchimpCampaignSendChecklist(
    request,
    reply
    )
{
    let { campaignId } = request.params;

    let response = await getCampaignSendChecklist( campaignId );

    return reply.send(
        {
            isReadyToSend: response.is_ready,
            itemArray: response.items
        }
        );
}

// ~~

export async function getMailchimpCampaignById(
    request,
    reply
    )
{
    let { campaignId } = request.params;

    let campaign = await getCampaignById( campaignId );
    let content = await getCampaignContent( campaignId );

    let response =
        {
            id: campaign.id,
            webId: campaign.web_id,
            type: campaign.type,
            createTime: campaign.create_time,
            archiveUrl: campaign.archive_url,
            longArchiveUrl: campaign.long_archive_url,
            status: campaign.status,
            emailSentCount: campaign.emails_sent,
            sendTime: campaign.send_time,
            contentType: campaign.content_type,
            needBlockRefresh: campaign.needs_block_refresh,
            resendable: campaign.resendable,
            recipientMap:
                {
                    listId: campaign.recipients.list_id,
                    listIsActive: campaign.recipients.list_is_active,
                    listName: campaign.recipients.list_name,
                    segmentText: campaign.recipients.segment_text,
                    recipientCount: campaign.recipients.recipient_count
                },
            settingMap:
                {
                    title: campaign.settings.title,
                    fromName: campaign.settings.from_name,
                    replyTo: campaign.settings.reply_to,
                    useConversation: campaign.settings.use_conversation,
                    toName: campaign.settings.to_name,
                    folderId: campaign.settings.folder_id,
                    authenticate: campaign.settings.authenticate,
                    autoFooter: campaign.settings.auto_footer,
                    inlineCss: campaign.settings.inline_css,
                    autoTweet: campaign.settings.auto_tweet,
                    facebookComment: campaign.settings.fb_comments,
                    timewarp: campaign.settings.timewarp,
                    templateId: campaign.settings.template_id,
                    dragAndDrop: campaign.settings.drag_and_drop,
                    subjectLine: campaign.settings.subject_line,
                    previewText: campaign.settings.preview_text
                },
            trackingMap:
                {
                    open: campaign.tracking.opens,
                    htmlClick: campaign.tracking.html_clicks,
                    textClick: campaign.tracking.text_clicks,
                    goalTracking: campaign.tracking.goal_tracking,
                    ecommerce360: campaign.tracking.ecomm360,
                    googleAnalytics: campaign.tracking.google_analytics,
                    clicktale: campaign.tracking.clicktale
                },
            deliveryStatusMap:
                {
                    enabled: campaign.delivery_status.enabled
                },
            content
        };

    return reply.send( response );
}

// ~~

export async function getMailchimpCampaignReport(
    request,
    reply
    )
{
    let { campaignId } = request.params;

    let report = await getCampaignReport( campaignId, undefined, [ '_links' ] );
    let domain = await getCampaignDomainPerformance( campaignId );

    let response =
        {
            id: report.id,
            campaignTitle: report.campaign_title,
            type: report.type,
            listId: report.list_id,
            listIsActive: report.list_is_active,
            listName: report.list_name,
            subjectLine: report.subject_line,
            previewText: report.preview_text,
            emailSentCount: report.emails_sent,
            abuseReportCount: report.abuse_reports,
            unsubscribeCount: report.unsubscribed,
            sendTime: report.send_time,
            bounceMap:
                {
                    hardBounceCount: report.bounces.hard_bounces,
                    softBounceCount: report.bounces.soft_bounces,
                    syntaxErrorCount: report.bounces.syntax_errors
                },
            forwardMap:
                {
                    forwardCount: report.forwards.forwards_count,
                    forwardOpenCount: report.forwards.forwards_opens
                },
            openMap:
                {
                    totalOpenCount: report.opens.opens_total,
                    proxyExcludedOpenCount: report.opens.proxy_excluded_opens,
                    uniqueOpenCount: report.opens.unique_opens,
                    proxyExcludedUniqueOpenCount: report.opens.proxy_excluded_unique_opens,
                    openRate: report.opens.open_rate,
                    proxyExcludedOpenRate: report.opens.proxy_excluded_open_rate,
                    lastOpen: report.opens.last_open
                },
            clickMap:
                {
                    totalClickCount: report.clicks.clicks_total,
                    uniqueClickCount: report.clicks.unique_clicks,
                    uniqueSubscriberClickCount: report.clicks.unique_subscriber_clicks,
                    clickRate: report.clicks.click_rate,
                    lastClick: report.clicks.last_click
                },
            facebookLikeMap:
                {
                    recipientLikeCount: report.facebook_likes.recipient_likes,
                    uniqueLikeCount: report.facebook_likes.unique_likes,
                    facebookLikeCount: report.facebook_likes.facebook_likes
                },
            listStatsMap:
                {
                    subscribeRate: report.list_stats.sub_rate,
                    unsubscribeRate: report.list_stats.unsub_rate,
                    openRate: report.list_stats.open_rate,
                    proxyExcludedOpenRate: report.list_stats.proxy_excluded_open_rate,
                    clickRate: report.list_stats.click_rate
                },
            ecommerceMap:
                {
                    totalOrderCount: report.ecommerce.total_orders,
                    totalSpentCount: report.ecommerce.total_spent,
                    totalRevenueCount: report.ecommerce.total_revenue,
                    currencyCode: report.ecommerce.currency_code
                },
            deliveryStatusMap:
                {
                    enabled: report.delivery_status.enabled
                }
        };

    return reply.send( response );
}

// ~~

export async function sendCampaignById(
    request,
    reply
    )
{
    let { campaignId } = request.params;

    let response = await sendCampaign( campaignId );

    return reply.send( { message: 'campaign-sending-sucessfully' } );
}

// ~~

export async function setMailchimpCampaignContent(
    request,
    reply
    )
{
    let { campaignId } = request.params;
    let body = getJsonObject( request.body );
    let { html } = body;

    let response = await setCampaignContent(
        campaignId,
        archive = undefined,
        template = undefined,
        plainText = undefined,
        html
        );

    return reply.send( { message: 'campaign-content-updated-sucessfully', response } );
}

// ~~

export async function setMailchimpCampaignById(
    request,
    reply
    )
{
    let { campaignId } = request.params;
    let body = getJsonObject( request.body );
    let { campaign } = body;
    let response = await updateCampaign(
        campaignId,
        {
            list_id: campaign.recipientMap.listId,
            list_is_active: campaign.recipientMap.listIsActive,
            list_name: campaign.recipientMap.listName,
            segment_text: campaign.recipientMap.segmentText,
            recipient_count: campaign.recipientMap.recipientCount
        },
        {
            title: campaign.settingMap.title,
            from_name: campaign.settingMap.fromName,
            reply_to: campaign.settingMap.replyTo,
            use_conversation: campaign.settingMap.useConversation,
            to_name: campaign.settingMap.toName,
            folder_id: campaign.settingMap.folderId,
            authenticate: campaign.settingMap.authenticate,
            auto_footer: campaign.settingMap.autoFooter,
            inline_css: campaign.settingMap.inlineCss,
            auto_tweet: campaign.settingMap.autoTweet,
            fb_comments: campaign.settingMap.facebookComment,
            timewarp: campaign.settingMap.timewarp,
            template_id: campaign.settingMap.templateId,
            drag_and_drop: campaign.settingMap.dragAndDrop,
            subject_line: campaign.settingMap.subjectLine,
            preview_text: campaign.settingMap.previewText
        }
        );

    return reply.send( { message: 'campaign-updated-sucessfully'} );
}

// ~~

export async function getMailchimpTemplateArray(
    request,
    reply
    )
{
    let response = await getMailchimpTemplateArray();

    return reply.send( { templateArray: response.templates } );
}

// ~~

export async function setMailchimpCampaignSchedule(
    request,
    reply
    )
{
    let { campaignId } = request.params;
    let body = getJsonObject( request.body );
    let { sendTime } = body;

    let response = await scheduleCampaign( campaignId, sendTime );

    return reply.send( { message: 'campaign-scheduled-sucessfully' } );
}

// ~~

export async function getMailchimpVerifiedDomainArray(
    request,
    reply
    )
{
    let response = await getVerifiedDomains();

    let domainArray = [];

    for ( let domain of response.domains )
    {
        domainArray.push(
            {
                status: domain.status,
                isFreeEmailProvider: domain.is_free_email_provider,
                domain: domain.domain,
                verified: domain.verified,
                authenticated: domain.authenticated,
                verificationEmail: domain.verification_email
            }
            );
    }

    return reply.send( { domainArray } );
}

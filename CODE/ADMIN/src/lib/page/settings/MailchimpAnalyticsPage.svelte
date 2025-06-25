<script>
    // -- IMPORTS

    import PageTitle from '$component/element/PageTitle.svelte';
    import Sidebar from '$component/layout/Sidebar.svelte';
    import { onMount } from 'svelte';
    import Bar from '$component/element/charts/Bar.svelte';
    import Line from '$component/element/charts/Line.svelte';
    import { Chart as ChartJS, Tooltip, BarElement, LinearScale, CategoryScale, LineElement, PointElement, LineController, Filler } from 'chart.js';
    import { fetchData, formatDate, formatPercentage } from '$lib/base';
    import { writable } from 'svelte/store';
    import { getFormattedDateText, getLocalizedText, languageTag, logError } from 'senselogic-gist';
    import Loading from '$component/element/Loading.svelte';
    import { languageTagStore } from '$store/languageTagStore';
    import MonitorPerfomance from '$component/page/mailchimp/MonitorPerfomance.svelte';
    import MonitorPerformanceCard from '$component/page/mailchimp/MonitorPerformanceCard.svelte';
    import MonitorPerfomanceCardList from '$component/page/mailchimp/MonitorPerfomanceCardList.svelte';

    // -- CONTANTS

    const dayBeforeEndCount = 30;
    const dayAndMonthFormatDateOptionMap =
        {
            day: '2-digit',
            month: 'short'
        };
    const fullDateFormatOptionMap =
        {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

    // -- VARIABLES

    let startDate = new Date();
    let endDate = new Date();
    startDate.setDate( startDate.getDate() - dayBeforeEndCount );
    endDate.setDate( endDate.getDate() );
    let isLoading = $state(true);
    let mailchimpAnalyticsStore = writable(
        {
            generalMetricMap:
                {
                    openRate:
                        {
                            value: 0,
                            variation: 0
                        },
                    clickRate:
                        {
                            value: 0,
                            variation: 0
                        },
                    totalSentCount:
                        {
                            value: 0,
                            variation: 0
                        },
                    unsubscribeRate:
                        {
                            value: 0,
                            variation: 0
                        }
                },
            performanceOverTime:
                {
                    labelArray: [],
                    valueArray: []
                },
            conversion:
                {
                    labelArray: [],
                    delivery: { converted: 0, dropoff: 0 },
                    opened: { converted: 0, dropoff: 0 },
                    clicked: { converted: 0, dropoff: 0 },
                    order: { converted: 0, dropoff: 0 }
                },
            delivery:
                {
                    totalDeliveryCount:
                        {
                            value: 0,
                            variation: 0
                        },
                    abuseReportRateArray: []
                }
        }
        );
    let conversionData =
        $derived({
            labels: $mailchimpAnalyticsStore.conversion.labelArray.map( label => getLocalizedText( label, {}, $languageTagStore ) ),
            datasets:
                [
                    {
                        label: getLocalizedText( 'Converted (%)¨fr:Converti (%)¨de:Umgerechnet (%)', {}, $languageTagStore ),
                        data:
                            [
                                $mailchimpAnalyticsStore.conversion.delivery.converted,
                                $mailchimpAnalyticsStore.conversion.opened.converted,
                                $mailchimpAnalyticsStore.conversion.clicked.converted,
                                $mailchimpAnalyticsStore.conversion.order.converted
                            ],
                        backgroundColor: [ '#40DCB6' ],
                        barPercentage: 1
                    },
                    {
                        label: getLocalizedText( 'Drop-off (%)¨fr:Abandon (%)¨de:Rückgang (%)', {}, $languageTagStore ),
                        data:
                            [
                                $mailchimpAnalyticsStore.conversion.delivery.dropoff,
                                $mailchimpAnalyticsStore.conversion.opened.dropoff,
                                $mailchimpAnalyticsStore.conversion.clicked.dropoff,
                                $mailchimpAnalyticsStore.conversion.order.dropoff
                            ],
                        backgroundColor: [ '#D4D4D4' ],
                        barPercentage: 1
                    }
                ]
        });
    let performanceOverTimeData =
        $derived({
            labels: $mailchimpAnalyticsStore.performanceOverTime.labelArray.map( label => formatDate( label, dayAndMonthFormatDateOptionMap ) ),
            datasets:
                [
                    {
                        label: 'Email (%)',
                        fill: true,
                        lineTension: 0.0,
                        backgroundColor: 'rgba(225, 204,230, .0)',
                        borderColor: '#40DCB6',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#40DCB6',
                        pointBackgroundColor: '#40DCB6',
                        pointBorderWidth: 5,
                        pointHoverRadius: 1,
                        pointHoverBackgroundColor: '#40DCB6',
                        pointHoverBorderColor: '#40DCB6',
                        pointHoverBorderWidth: 10,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: $mailchimpAnalyticsStore.performanceOverTime.valueArray.map( value => value * 100 )
                    }
                ]
        });
    let deliveryData =
        $derived({
            labels: $mailchimpAnalyticsStore.delivery.abuseReportRateArray.map( item => formatDate( item.date, dayAndMonthFormatDateOptionMap ) ),
            datasets:
                [
                    {
                        label: getLocalizedText( 'Abuse report rate (%)¨fr:Taux de signalement des abus (%)¨de:Rate der Missbrauchsmeldungen (%)', {}, $languageTagStore ),
                        fill: true,
                        lineTension: 0.0,
                        backgroundColor: 'rgba(225, 204,230, .0)',
                        borderColor: '#40DCB6',
                        borderDash: [],
                        borderDashOffset: 0.0,
                        borderJoinStyle: 'miter',
                        pointBorderColor: '#40DCB6',
                        pointBackgroundColor: '#40DCB6',
                        pointBorderWidth: 5,
                        pointHoverRadius: 1,
                        pointHoverBackgroundColor: '#40DCB6',
                        pointHoverBorderColor: '#40DCB6',
                        pointHoverBorderWidth: 10,
                        pointRadius: 1,
                        pointHitRadius: 10,
                        data: $mailchimpAnalyticsStore.delivery.abuseReportRateArray.map( item => item.abuseReportRate )
                    }
                ]
        });

    // -- FUNCTIONS

    async function fetchMailchimpAnalytics(
        startDate,
        endDate
        )
    {
        isLoading = true;

        try
        {
            let metricMap = await fetchData(
                `/api/admin/page/mailchimp/analytics?startDate=${ startDate }&endDate=${ endDate }`,
                { method: 'POST' }
                );
            mailchimpAnalyticsStore.set( metricMap );
        }
        catch ( error )
        {
            logError( error );
        }
        finally
        {
            isLoading = false;
        }
    }

    // -- STATEMENTS

    ChartJS.register(
        LineElement,
        LinearScale,
        PointElement,
        CategoryScale,
        Filler,
        Tooltip,
        BarElement,
        CategoryScale,
        LinearScale
        );

    // ~~

    onMount(
        async () =>
        {
            await fetchMailchimpAnalytics( startDate.toISOString(), endDate.toISOString() );
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../constant.styl';
    @import '../../../mixin.styl';

    // -- STYLES

    .page-container
    {
        min-height: 100dvh;
        padding-top: 7vh;

        display: flex;

        background-color: grayColor900;
    }

    .main-section
    {
        overflow: auto;
        height: calc( 100dvh - 7vh );
        width: 100%;
        padding: 0 3vh 2rem;

        display: flex;
        flex-direction: column;
        gap: 2vh;

        +media( smaller-48em )
        {
            padding: 1em 1.5vh;
        }
    }

    .monitor-performance
    {
        margin: 0 auto;
        width: 100%;
        max-width: 1192px;
        border: 1px solid grayColor800;
        border-radius: 1rem;
    }

    .monitor-performance-header
    {
        width: 100%;
        padding: 1.5rem 1.5rem 1rem;
    }

    .monitor-performance-section
    {
        width: 100%;
        padding: 0 1.5rem 1.5rem;
    }

    .monitor-performance-section-content
    {
        border-top: 1px solid grayColor800;
        padding-top: 1.5rem;
    }

    .monitor-performance-section-content-cards
    {
        display: flex;
        flex-wrap: wrap;
        align-content: flex-start;
        align-items: stretch;
    }

    .monitor-performance-section-content-card
    {
        margin-top: 1rem;
        margin-left: 1rem;
        margin-right: 2rem;

        display: flex;
        flex: 1 1 0;
        flex-direction: column;
        justify-content: flex-start;
    }

    .monitor-performance-section-content-card-content
    {
        margin: 0;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .monitor-performance-section-content-card-content-value
    {
        margin-top: 0.25rem;
        margin-left: 2rem;

        display: flex;
        flex-direction: column;
        justify-content: flex-start;
    }

    .pill-container
    {
        margin-top: 0.25rem;
    }

    .pill
    {
        border-radius: 1.875rem;
        padding: 0.25rem 0.5rem;

        display: inline-flex;
        gap: 0.25rem;
        align-items: center;
    }

    .pill.down
    {
        background-color: rgba(242, 95, 37, .1);

        color: #a73205;
    }

    .pill.up
    {
        background-color: rgba(0,193,78,.1);

        color: #008547;
    }

    .up-icon,
    .down-icon
    {
        fill: currentColor;
    }

    .up-icon
    {
        transform: rotate( 0.5turn );
    }

    .monitor-performance-section-content-card-content-header
    {
        margin-top: -1rem;
        margin-left: -1rem;

        display: flex;
        justify-content: flex-start;
        align-items: center;
    }

    .margin-header
    {
        margin-top: 1rem;
        margin-left: 1rem;
    }
</style>

<div class="page-container">
    <Sidebar/>

    <main class="display-flex flex-direction-column gap-100 main-section">
        <PageTitle
            title={ getLocalizedText( 'Marketing dashboard¨fr:Tableau de bord marketing¨de:Marketing-Dashboard', {}, $languageTagStore ) }
        />

        {#if isLoading}
            <Loading/>
        {:else}
            <MonitorPerfomance
                title={ getLocalizedText( 'Monitor performance¨fr:Contrôler les performances¨de:Leistung überwachen', {}, $languageTagStore ) }
                subtitle=
                    {
                        `${ formatDate( startDate, fullDateFormatOptionMap ) }`
                            + ` - ${ formatDate( endDate, fullDateFormatOptionMap ) }`
                            + getLocalizedText( ' • Compared to last {dayBeforeEndCount} days¨fr: • Par rapport aux {dayBeforeEndCount} derniers jours¨de: • Im Vergleich zu den letzten {dayBeforeEndCount} Tagen', { dayBeforeEndCount }, $languageTagStore )
                    }
            >
                <MonitorPerfomanceCardList>
                    <MonitorPerformanceCard
                        text={ getLocalizedText( `Total sends¨fr:Nombre total d'envois¨de:Total sendet`, {}, $languageTagStore ) }
                        value={ $mailchimpAnalyticsStore.generalMetricMap.totalSentCount.value }
                        variation={ $mailchimpAnalyticsStore.generalMetricMap.totalSentCount.variation }
                    />

                    <MonitorPerformanceCard
                        text={ getLocalizedText( `Open rate¨fr:Taux d'ouverture¨de:Öffnungsrate`, {}, $languageTagStore ) }
                        value={ formatPercentage( $mailchimpAnalyticsStore.generalMetricMap.openRate.value ) }
                        variation={ $mailchimpAnalyticsStore.generalMetricMap.openRate.variation }
                    />

                    <MonitorPerformanceCard
                        text={ getLocalizedText( 'Click rate¨fr:Taux de clics¨de:Klickrate', {}, $languageTagStore ) }
                        value={ formatPercentage( $mailchimpAnalyticsStore.generalMetricMap.clickRate.value ) }
                        variation={ $mailchimpAnalyticsStore.generalMetricMap.clickRate.variation }
                    />

                    <MonitorPerformanceCard
                        text={ getLocalizedText( 'Unsubscribe rate¨fr:Taux de désabonnement¨de:Abbestellungsrate', {}, $languageTagStore ) }
                        value={ formatPercentage( $mailchimpAnalyticsStore.generalMetricMap.unsubscribeRate.value ) }
                        variation={ $mailchimpAnalyticsStore.generalMetricMap.unsubscribeRate.variation }
                    />
                </MonitorPerfomanceCardList>
            </MonitorPerfomance>

            <MonitorPerfomance
                title={ getLocalizedText( 'Performance over time¨fr:Performance dans le temps¨de:Leistung im Laufe der Zeit', {}, $languageTagStore ) }
            >
                <Line height={ 70 } data={ performanceOverTimeData } options={ { responsive: true } }/>
            </MonitorPerfomance>

            <MonitorPerfomance
                title={ getLocalizedText( 'Conversions¨de:Umrechnungen', {}, $languageTagStore ) }
            >
                <Bar height={ 70 } data={ conversionData } options={ { responsive: true } }/>
            </MonitorPerfomance>

            <MonitorPerfomance
                title={ getLocalizedText( 'Delivery¨fr:Livraison¨de:Lieferung', {}, $languageTagStore ) }
            >
                <Line height={ 70 } data={ deliveryData } options={{ responsive: true }}/>
            </MonitorPerfomance>
        {/if}
    </main>
</div>

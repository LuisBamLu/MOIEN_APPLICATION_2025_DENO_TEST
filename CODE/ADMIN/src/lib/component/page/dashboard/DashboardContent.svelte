<script>
    // -- IMPORTS

    import { navigate } from 'svelte5-router';
    import { fetchData } from '$lib/base';
    import { getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import { getProfileName, hasUserRole } from '$store/profileStore';
    import TicketSection from './tickets/TicketSection.svelte';
    import UploadCard from './cards/UploadCard.svelte';
    import DataCard from './cards/DataCard.svelte';
    import HorizontalChartCard from './cards/HorizontalChartCard.svelte';
    import Loading from '$component/element/Loading.svelte';
    import IconChart from '$component/element/charts/IconChart.svelte';
    import ScheduleCard from './cards/ScheduleCard/ScheduleCard.svelte';
    import Pie from '$component/element/charts/Pie.svelte';
    import Treemap from '$component/element/charts/Treemap.svelte';
    import Line from '$component/element/charts/Line.svelte';

    const npsTagColorArray =
        [
            'red',
            'orange',
            'yellow',
            'green',
            'blue'
        ];

    let paymentData =
        {
            dataArray:
            [
                [ 65, 59, 80, 81, 56, 55, 40 ],
                [ 28, 35, 40, 19, 6, 27, 19 ]
            ]
        };

    // -- VARIABLES

    let isLoading = true;
    let profileRole = hasUserRole( 'agency' ) ? 'agency' : 'admin';
    let documentCardData =
        {
            documentTagLabel: getLocalizedTextBySlug( 'validated-label', $languageTagStore ),
            documentTagColor: 'green',
            documentLabelArray:  [],
            documentDataArray: [],
            documentCount: 35
        };
    let paymentCardData = {};
    let reviewCardData =
        {
            rentalReviewRating: 0,
            userReviewRating: 0
        };

    // -- FUNCTIONS

    function handleDocumentAction()
    {
        navigate( '/admin/edit-view/documents' );
    }

    // ~~

    function handleIncomeAction()
    {
        navigate( `/admin/edit-view/payment?payeeUserProfile=${ getProfileName() }` );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            let result = await fetchData( '/api/admin/page/dashboard', { method: 'POST' } );

            if ( result && result.documentData )
            {
                let data = result.documentData;

                documentCardData =
                {
                    ...documentCardData,
                    documentLabelArray: data.documentLabelArray,
                    documentDataArray: data.documentDataArray,
                    documentCount: data.documentCount
                }
            }

            if ( result && result.paymentData )
            {
                let data = result.paymentData;

                let paymentTypeAndStatusArray = [];

                for ( let key of Object.keys( data.paymentTypeAndStatus ) )
                {
                    for ( let value of data.paymentTypeAndStatus[ key ] )
                    {
                        paymentTypeAndStatusArray.push( value );
                    }
                }

                paymentCardData =
                {
                    ...paymentCardData,
                    amount: data.paymentDataArray.reduce( ( sum,  item) => sum + item.amount, 0 ),
                    paymentDataArray: data.paymentDataArray,
                    dataArray: paymentTypeAndStatusArray,
                    paymentStatusMap: data.paymentStatusMap,
                    paymentAnommalieArray: data.paymentAnommalieArray,
                    total: data.total
                }
            }

            if ( result && result.reviewData )
            {
                let data = result.reviewData;
                reviewCardData =
                {
                    ...reviewCardData,
                    rentalReviewRating: data.generalRentReviewRating,
                    userReviewRating: data.generalUserReviewRating,
                    tagColor: npsTagColorArray[ Math.floor( data.generalRentReviewRating ) ]
                }
            }

            paymentData[ 'sum' ] = paymentData.dataArray[ 0 ].reduce( ( a, b ) => a + b, 0 );
            paymentData[ 'sum' ] += paymentData.dataArray[ 1 ].reduce( ( a, b ) => a + b, 0 );

            isLoading = false;
        }
    );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    main
    {
        overflow-y: auto;
        scrollbar-width: none;
        height: 76vh;
        padding-bottom: 2rem;

        display: flex;
        flex-direction: column;
        gap: 2vw;
        &::-webkit-scrollbar
        {
            display: none;
        }
    }

    // -- CLASSES

    .dashboard-content-head
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: 1rem;
        justify-content: space-between;
    }

    .dashboard-content-body
    {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        row-gap: 1rem;
        justify-content: space-between;
    }
</style>

<main>
    {#if isLoading }
        <Loading/>
    {:else}
        {#if profileRole === 'agency' }
            <div class="dashboard-content-head">
                <UploadCard/>
                <DataCard
                    title="income-label"
                    total={ paymentCardData.total }
                    handleAction={ handleIncomeAction }
                />
                <ScheduleCard/>
            </div>
            <TicketSection/>
            <div class="dashboard-content-body">
                <HorizontalChartCard
                    bind:tag={ documentCardData.documentTagLabel }
                    bind:tagColor={ documentCardData.documentTagColor }
                    bind:total={ documentCardData.documentCount }
                    title="admin-menu-documents-manager-label"
                    handleAction={ handleDocumentAction }
                >
                    <Pie
                        title={ 'documents_pie_chart' }
                        labels={ documentCardData.documentLabelArray }
                        dataArray={ documentCardData.documentDataArray }
                    />
                </HorizontalChartCard>
                <HorizontalChartCard/>
                <HorizontalChartCard/>
                <HorizontalChartCard/>
            </div>
        {:else}
            <div class="dashboard-content-head">
                <UploadCard/>
                <DataCard
                    title="transacted-label"
                    total={ paymentCardData.total }
                />
                <ScheduleCard/>
            </div>
            <TicketSection/>
            <div class="dashboard-content-body">
                <HorizontalChartCard
                    bind:tag={ documentCardData.documentTagLabel }
                    bind:tagColor={ documentCardData.documentTagColor }
                    bind:total={ documentCardData.documentCount }
                    title="admin-menu-documents-manager-label"
                    handleAction={ handleDocumentAction }
                >
                    <Pie
                        title={ 'documents_pie_chart' }
                        labels={ documentCardData.documentLabelArray }
                        dataArray={ documentCardData.documentDataArray }
                    />
                </HorizontalChartCard>
                <HorizontalChartCard
                    tag={ 'Type/ Status' }
                    tagColor={ 'blue' }
                    title="Payments"
                    total={ paymentCardData.amount }
                    handleAction={ handleDocumentAction }
                >
                    <Treemap
                        title="documents_treemap_chart"
                        dataArray={ paymentCardData.paymentDataArray }
                    />
                    <!-- data={ paymentCardData.dataArray } -->
                </HorizontalChartCard>
                <HorizontalChartCard
                    tag={ 'Payments' }
                    tagColor={ 'red' }
                    title="Anommalies"
                    total={ paymentData.sum }
                    handleAction={ handleDocumentAction }
                >
                    <Line
                        title="documents_line_chart"
                        dataArray ={
                            [
                                {
                                    label: 'Created',
                                    data: paymentData.dataArray[ 0 ],
                                    borderColor: '#FED584',
                                    backgroundColor: '#F58709',
                                    pointBackgroundColor: '#FED584'
                                },
                                {
                                    label: 'Failed',
                                    data: paymentData.dataArray[ 1 ],
                                    borderColor: '#F0384A',
                                    backgroundColor: '#7A1A23',
                                    pointBackgroundColor: '#F0384A'
                                }
                            ]
                        }
                    />
                </HorizontalChartCard>
                <HorizontalChartCard
                    bind:tagColor={ reviewCardData.tagColor }
                    bind:total={ reviewCardData.rentalReviewRating }
                    title="admin-menu-reviews-label"
                >
                    <IconChart
                        dashboard={ true }
                        data=
                        {
                            [
                                reviewCardData.rentalReviewRating,
                            ]
                        }
                    />
                </HorizontalChartCard>
            </div>
        {/if}
    {/if}
</main>

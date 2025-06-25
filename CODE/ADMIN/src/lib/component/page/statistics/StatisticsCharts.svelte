<script>
    import { run } from 'svelte/legacy';

    // -- IMPORTS

    import Bar from '$component/element/charts/Bar.svelte';
    import Column from '$component/element/charts/Column.svelte';
    import Line from '$component/element/charts/Line.svelte';
    import Area from '$component/element/charts/Area.svelte';
    import Treemap from '$component/element/charts/Treemap.svelte';
    import IconChart from '$component/element/charts/IconChart.svelte';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import { onMount } from 'svelte';
    import Loading from '$component/element/Loading.svelte';
    import { fetchData, getLocalizedMonthNameArray, getLocalizedWeekdayNameArray } from '$lib/base';
    import ChartCard from './ChartCard.svelte';

    // -- CONSTANTS

    const monthsInYear = 12;
    const daysInMonth = 31;
    const daysInWeek = 7;
    const hoursInDay = 24;
    const rangeArray =
    [
        monthsInYear,
        daysInMonth,
        daysInWeek,
        hoursInDay,
    ];
    const monthNameArray = getLocalizedMonthNameArray();
    const weekDayNameArray = getLocalizedWeekdayNameArray();
    const rangeLabelArray = createTimeRangeLabelArray();
    const detailSlugMapArray =
    [
        {
            summary: `Reservations that are currently active.`,
            verbose: `
                      A bar graph of current reservations for short-term, long-term, and sublet
                      categories shows the number of ongoing reservations in each category at a
                      specific point in time. Each bar represents one of the categories—short-term,
                      long-term, or sublet—with its height indicating the count of current
                      reservations. This graph helps to compare the distribution of active
                      reservations across different types, providing a snapshot of which category
                      has the highest or lowest number of current bookings.
                     `
        },
        {
            summary: `New reservations that have been made.`,
            verbose: `
                      A bar graph of new reservations for short-term, long-term, and sublet
                      categories displays the number of reservations in each category over a
                      specific period. Each bar represents a category—short-term, long-term,
                      or sublet—with its height corresponding to the number of new reservations.
                      This type of graph is useful for comparing the popularity or demand across
                      different reservation types, making it easy to see which category has the
                      most or least activity during the given timeframe.
                     `
        },
        {
            summary: `The total number of users in the system.`,
            verbose: `
                      A line (and dots) area chart of the total users represents the cumulative
                      number of users over time. The line connects data points (dots) that show
                      the total user count at specific intervals, while the shaded area beneath
                      the line illustrates the growth. This chart type is effective for
                      visualizing overall user base expansion, making it easy to see trends,
                      such as consistent growth or periods of stagnation.
                     `
        },
        {
            summary: `The number of created ads (properties) in the system.`,
            verbose: `
                      A line (and dots) area chart of new ads (properties) shows the number of
                      ads or properties being added over time. The line connects data points
                      (dots) that represent the count of new ads at specific intervals, while
                      the shaded area beneath the line emphasizes the volume added during each
                      period. This chart is useful for tracking the frequency and patterns of
                      new listings, helping to identify trends like peak times for ad postings
                      or periods of decline.
                     `
        },
        {
            summary: `The number of new users that have joined the system.`,
            verbose: `
                      A line (and dots) area chart of new users visually represents the number
                      of users joining over time. The line connects data points (dots) that
                      show the count of new users at specific intervals, while the shaded area
                      beneath the line highlights the cumulative growth. This type of chart
                      helps to easily observe trends, such as spikes or declines in user
                      acquisition, and provides a clear view of overall growth patterns over
                      time.
                     `
        },
        {
            summary: `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
            verbose: `
                      Ipsum mollit Lorem exercitation non dolore labore anim Lorem. Pariatur
                      id consectetur nostrud tempor anim irure. Adipisicing tempor duis
                      laboris eu velit. Amet laborum proident officia minim qui culpa
                      excepteur ad eu nisi adipisicing consectetur commodo. Et culpa Lorem
                      ullamco Lorem elit. Duis non cillum commodo qui officia. Sint elit elit
                      cupidatat nisi ex ad.
                     `
        },
        {
            summary: `Treemap chart summary.`,
            verbose: `
                      A treemap is a data visualization tool that displays hierarchical data
                      as a set of nested rectangles, where each rectangle represents a
                      branch of the hierarchy. The size of each rectangle is proportional to
                      the value of the data it represents, allowing for quick comparison of
                      categories and subcategories. Treemaps are particularly useful for
                      visualizing large datasets and identifying patterns, such as which
                      categories contribute most to the whole.
                     `
        },
        {
            summary: `This is the average NPS score of the users in the selected time range.`,
            verbose: `
                      NPS, or Net Promoter Score, measures customer loyalty by asking how
                      likely they are to recommend a company on a scale of 0-10. Customers
                      are grouped into Promoters (9-10), Passives (7-8), and Detractors
                      (0-6). The NPS is calculated by subtracting the percentage of
                      Detractors from Promoters, with scores ranging from -100 to +100,
                      indicating overall customer satisfaction and likelihood to promote
                      the brand.
                     `
        },
    ];

    // -- VARIABLES

    let isLoading =  $state( true );
    let statisticsData = {};
    let range = [ 'year-label', 'month-label', 'week-label', 'day-label' ];
    let selectedRange = 0;
    let timeRangeLabels = $state( rangeLabelArray[ selectedRange ] );
    let detailSlugMap =
    {
        summary: 'admin-dashboard-chart-summary',
        verbose: 'admin-dashboard-chart-verbose'
    };

    // -- FUNCTIONS

    // ~~

    function getMonth(
        date
        )
    {
        let month = date.getMonth();
        return monthNameArray[ month ];
    }

    // ~~

    function getDayOfMonth(
        date
        )
    {
        let getDayOfMonth = date.getDate();
        return String( getDayOfMonth );
    }

    // ~~

    function getDayOfWeek(
        date
        )
    {
        let dayOfWeek = date.getDay();
        return weekDayNameArray[ dayOfWeek ];
    }

    // ~~

    function getHour(
        date
        )
    {
        let hour = date.getHours();
        return String( hour );
    }

    // ~~

    function createTimeRangeLabelArray(
        )
    {
        let now = new Date();
        let month = getMonth( now );
        let monthDay = getDayOfMonth( now );
        let weekDay = getDayOfWeek( now );
        let hour = getHour( now );

        let result =
        [
            [ month ],
            [ monthDay ],
            [ weekDay ],
            [ hour ]
        ];

        let rangeArray = [ 12, monthDay, 7, 24 ];

        for ( let rangeIndex = 0; rangeIndex < rangeArray.length; rangeIndex++ )
        {
            let range = Number( rangeArray[ rangeIndex ] );

            for (let timeRange = 1; timeRange < range; timeRange++)
            {
                let date;

                if ( rangeIndex === 0 )
                {
                    date = new Date( now.getFullYear(), now.getMonth() - timeRange, 1 );
                    result[ rangeIndex ].push( getMonth( date ) );
                }
                else if ( rangeIndex === 1 )
                {
                    date = new Date( now.getFullYear(), now.getMonth(), Number( monthDay ) - timeRange );
                    result[ rangeIndex ].push( getDayOfMonth( date ) );
                }
                else if ( rangeIndex === 2 )
                {
                    date = new Date( Date.now() - timeRange * 24 * 60 * 60 * 1000 );
                    result[ rangeIndex ].push( getDayOfWeek( date ) );
                }
                else if ( rangeIndex === 3 )
                {
                    date = new Date( Number( now ) - timeRange * 60 * 60 * 1000 );
                    result[ rangeIndex ].push( getHour( date ) );
                }
            }
        }

        return result.map( item => item.reverse() );
    }

    // -- STATEMENTS

    onMount(
        async () =>
        {
            try
            {
                let response =
                    await fetchData(
                        '/api/admin/page/statistics',
                        {
                            method: 'POST',
                            credentials: 'include'
                        }
                        );

                if ( !response )
                {
                    throw new Error( 'No response' );
                }
                else if ( Object.keys( response ).length === 0 )
                {
                    throw new Error( 'Empty response' );
                }
                else
                {
                    statisticsData = response;
                }
            }
            catch ( error )
            {
                console.error( error );
            }
            finally
            {
                isLoading = false;
            }
        }
        );

    // ~~

    $effect(
        () =>
        {
            timeRangeLabels = rangeLabelArray[ selectedRange ];
        }
        );
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- ELEMENTS

    section
    {
        overflow-y: scroll;
        scrollbar-width: none;
        max-height: calc( 100dvh - 13rem );
        width: 100%;
        border-radius: 0.5rem;

        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 1%;
        justify-content: space-between;

        background-color: grayColor900;
        &::-webkit-scrollbar
        {
            display: none;
        }
    }

    // -- CLASSES

    .range-selection
    {
        width: 100%;
        padding: 1rem;

        display: flex;
        flex-direction: row;
        gap: 1rem;
        justify-content: center;
        align-items: center;
    }

    .range-selection-button
    {
        border: 1px solid blueColor100;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;

        background-color: blueColor100;

        font-size: 1rem;
        font-weight: bold;
        color: white;

        cursor: pointer;
        &:hover
        {
            border: 1px solid blueColor100;

            background-color: grayColor900;

            color: blueColor100;
        }

        &.active
        {
            border: 1px solid blueColor300;

            background-color: blueColor300;
            &:hover
            {
                border: 1px solid blueColor300;

                background-color: grayColor900;

                color: blueColor300;
            }
        }
    }

    .dashboard-column
    {
        width: 49%;
        padding-bottom: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        @media ( max-width: 1000px )
        {
            width: 100%;
        }
    }
</style>

<section>
    {#if isLoading }
        <Loading />
    {:else}
        <div class="range-selection">
            {#each range as item, index }
                <button
                    class="range-selection-button"
                    class:active={ selectedRange === index }
                    onclick={() => selectedRange = index}
                >
                    { getLocalizedTextBySlug( item, $languageTagStore ) }
                </button>
            {/each}
        </div>
        <div class="dashboard-column">
            <ChartCard
                title="Ads View x Turnover  ad view"
                chartData={ statisticsData.turnoverAdView.result }
                labels={ rangeLabelArray }
                description="admin-dashboard-area-chart-description"
                detailSlugMap={ detailSlugMapArray[ 1 ] }
            >
                <Area
                    title="Ads View x Turnover ad view"
                    bind:labels={ timeRangeLabels }
                    bind:selectedRange
                    dataArray=
                    {
                        [
                            {
                                label: 'Ad view',
                                lineTension: 0.3,
                                backgroundColor: 'rgba(225, 204,230, .3)',
                                borderColor: 'rgb(35, 26, 136)',
                                data: statisticsData.adView.result
                            },
                            {
                                label: 'Turnover ad view',
                                lineTension: 0.3,
                                backgroundColor: 'rgba(184, 185, 210, .3)',
                                borderColor: '#40DCB6',
                                data: statisticsData.turnoverAdView.result
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="Current reservations"
                chartData={ statisticsData.currentBookings.data }
                labels={ rangeLabelArray }
                description="admin-dashboard-column-chart-description"
                detailSlugMap={ detailSlugMapArray[ 0 ] }
            >
                <Column
                    title="Current reservations"
                    labels={ [ 'Short term', 'Long term', 'Sublet' ] }
                    selectedRange={ null }
                    dataArray=
                    {
                        [
                            {
                                label: getLocalizedTextBySlug( 'Reservations', $languageTagStore ),
                                data: statisticsData.currentBookings.data,
                                backgroundColor: [ '#022B62', '#40DCB6' ]
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="Total users"
                chartData={ statisticsData.totalUsers.data }
                labels={ rangeLabelArray }
                description="admin-dashboard-area-chart-description"
                detailSlugMap={ detailSlugMapArray[ 1 ] }
            >
                <Area
                    title="Total users"
                    bind:labels={ timeRangeLabels }
                    bind:selectedRange
                    dataArray=
                    {
                        [
                            {
                                label: getLocalizedTextBySlug( 'Short term', $languageTagStore ),
                                data: statisticsData.totalUsers.data,
                                borderColor: '#02367B',
                                backgroundColor: '#125FB8'
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="New users"
                chartData={ statisticsData.newUsers.data }
                labels={ rangeLabelArray }
                description="admin-dashboard-area-chart-description"
                detailSlugMap={ detailSlugMapArray[ 2 ] }
            >
                <Area
                    title="New users"
                    bind:labels={ timeRangeLabels }
                    bind:selectedRange
                    dataArray=
                    {
                        [
                            {
                                label: getLocalizedTextBySlug( 'Short term', $languageTagStore ),
                                data: statisticsData.newUsers.data,
                                borderColor: '#40DCB6',
                                backgroundColor: '#A6F4C5'
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="admin-dashboard-treemap-chart-label"
                labels={ rangeLabelArray }
                description="admin-dashboard-treemap-chart-description"
                detailSlugMap={ detailSlugMapArray[ 3 ] }
            >
                <Treemap
                    title="admin-dashboard-treemap-chart-label"
                />
            </ChartCard>
        </div>
        <div class="dashboard-column">
            <ChartCard
                title="New reservations"
                chartData={ statisticsData.newReservations.data }
                labels={ rangeLabelArray }
                description="admin-dashboard-bar-chart-description"
                detailSlugMap={ detailSlugMapArray[ 4 ] }
            >
                <Bar
                    title="New reservations"
                    labels={ [ 'Short term', 'Long term', 'Sublet' ] }
                    bind:selectedRange
                    dataArray=
                    {
                        [
                            {
                                label: getLocalizedTextBySlug( 'Year', $languageTagStore ),
                                data: statisticsData.newReservations.data,
                                backgroundColor: [ '#022B62', '#40DCB6' ]
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="New ads"
                chartData={ statisticsData.newAds.data }
                labels={ rangeLabelArray }
                description="admin-dashboard-area-chart-description"
                detailSlugMap={ detailSlugMapArray[ 5 ] }
            >
                <Area
                    title="New ads"
                    bind:labels={ timeRangeLabels }
                    bind:selectedRange
                    dataArray=
                    {
                        [
                            {
                                label: getLocalizedTextBySlug( 'Short term', $languageTagStore ),
                                data: statisticsData.newAds.data,
                                borderColor: '#40DCB6',
                                backgroundColor: '#A6F4C5'
                            }
                        ]
                    }
                />
            </ChartCard>
            <ChartCard
                title="admin-dashboard-line-chart-label"
                labels={ rangeLabelArray }
                description="admin-dashboard-line-chart-description"
                detailSlugMap={ detailSlugMapArray[ 6 ] }
            >
                <Line
                    title="admin-dashboard-line-chart-label"
                    selectedRange={ null }
                />
            </ChartCard>
            <ChartCard
                title="icon-chart-label"
                labels={ rangeLabelArray }
                description="admin-dashboard-icon-chart-description"
                detailSlugMap={ detailSlugMapArray[ 7 ] }
            >
                <IconChart/>
            </ChartCard>
        </div>
    {/if}
</section>

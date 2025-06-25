<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title?: string, labels?: any, selectedRange?: any, dataArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, borderWidth?: number, fill?: boolean, smooth?: boolean, responsive?: boolean, maintainAspectRatio?: boolean, displayLegend?: boolean, beginAtZero?: boolean,}} */
    let {
            title,
            labels = $bindable( [ 'Short-term', 'Long-term', 'Selling', 'Sold' ] ),
            selectedRange = $bindable( null ),
            dataArray = $bindable(
                [
                    {
                        data: 120,
                        backgroundColor: '#40DCB6',
                        hoverBackgroundColor: '#A6F4C5'
                    },
                    {
                        data: 97,
                        backgroundColor: '#3392FF',
                        hoverBackgroundColor: '#ADD3FF'
                    },
                    {
                        data: 60,
                        backgroundColor: '#00584A',
                        hoverBackgroundColor: '#007D69'
                    },
                    {
                        data: 35,
                        backgroundColor: '#022B62',
                        hoverBackgroundColor: '#02367B'
                    }
                ]
                ),
            defaultBorderColor = '#40DCB6',
            defaultBackgroundColor = '#A6F4C5',
            borderWidth = 2,
            fill = true,
            smooth = false,
            responsive = true,
            maintainAspectRatio = false,
            displayLegend = true,
            beginAtZero = true
        } = $props();

    let options =
        {
            borderWidth,
            fill,
            smooth,
            responsive,
            maintainAspectRatio,
            displayLegend,
            beginAtZero
        };
</script>

<Chart
    { title }
    type="doughnut"
    bind:labels
    bind:selectedRange
    bind:dataArray
    { defaultBorderColor }
    { defaultBackgroundColor }
    { options }
/>

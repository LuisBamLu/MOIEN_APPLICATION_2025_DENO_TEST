<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    export let title;
    export let labels = [ 'Short-term', 'Long-term', 'Selling', 'Sold' ];
    export let selectedRange = null;
    export let dataArray =
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
        ];
    export let defaultBorderColor = '#40DCB6';
    export let defaultBackgroundColor = '#A6F4C5';
    export let borderWidth = 2;
    export let fill = true;
    export let smooth = false;
    export let responsive = true;
    export let maintainAspectRatio = false;
    export let displayLegend = true;
    export let beginAtZero = true;

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

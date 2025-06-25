<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    export let title;
    export let labels =
    [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday'
    ];
    export let selectedRange = null;
    export let dataArray =
    [
        {
            label: 'First',
            lineTension: 0.3,
            backgroundColor: '#A6F4C5',
            borderColor: '#40DCB6'
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
    type="line"
    bind:labels
    bind:selectedRange
    bind:dataArray
    { defaultBorderColor }
    { defaultBackgroundColor }
    { options }
/>

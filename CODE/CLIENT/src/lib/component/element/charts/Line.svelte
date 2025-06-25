<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    export let title;
    export let labels = [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ];
    export let selectedRange = null;
    export let dataArray =
        [
            {
                label: 'First',
                borderColor: '#40DCB6',
                backgroundColor: '#A6F4C5',
                pointBackgroundColor: '#40DCB6'
            },
            {
                borderColor: '#022B62',
                backgroundColor: '#02367B',
                pointBackgroundColor: '#022B62'
            }
        ];
    export let defaultBorderColor = '#40DCB6';
    export let defaultBackgroundColor = '#A6F4C5';
    export let borderWidth = 2;
    export let fill = false;
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

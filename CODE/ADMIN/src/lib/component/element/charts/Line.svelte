<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title?: string, labels?: any, selectedRange?: any, dataArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, borderWidth?: number, fill?: boolean, smooth?: boolean, responsive?: boolean, maintainAspectRatio?: boolean, displayLegend?: boolean, beginAtZero?: boolean,}} */
    let {
            title,
            labels = $bindable( [ 'January', 'February', 'March', 'April', 'May', 'June', 'July' ] ),
            selectedRange = $bindable( null ),
            dataArray = $bindable(
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
                ]
                ),
            defaultBorderColor = '#40DCB6',
            defaultBackgroundColor = '#A6F4C5',
            borderWidth = 2,
            fill = false,
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
    type="line"
    bind:labels
    bind:selectedRange
    bind:dataArray
    { defaultBorderColor }
    { defaultBackgroundColor }
    { options }
/>

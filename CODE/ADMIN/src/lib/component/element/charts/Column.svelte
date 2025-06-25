<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title?: string, labels: any, selectedRange?: any, dataArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, borderWidth?: number, fill?: boolean, smooth?: boolean, responsive?: boolean, maintainAspectRatio?: boolean, displayLegend?: boolean, beginAtZero?: boolean,}} */
    let {
            title,
            labels = $bindable( [ '2+', '7+', '30+' ] ),
            selectedRange = $bindable( null ),
            dataArray = $bindable(
                [
                    {
                        label: 'Reservations',
                        data: [ 654, 234, 86 ],
                        backgroundColor: [ '#022B62', '#40DCB6' ]
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
    type="bar"
    bind:labels
    bind:selectedRange
    bind:dataArray
    { defaultBorderColor }
    { defaultBackgroundColor }
    { options }
/>

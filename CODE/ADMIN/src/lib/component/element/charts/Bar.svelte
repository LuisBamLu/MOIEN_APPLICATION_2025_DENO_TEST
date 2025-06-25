<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title?: string, labels: any, selectedRange?: any, dataArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, borderWidth?: number, fill?: boolean, smooth?: boolean, responsive?: boolean, maintainAspectRatio?: boolean, displayLegend?: boolean, beginAtZero?: boolean,}} */
    let {
            title,
            labels = $bindable( [ 'French', 'Luxembourg', 'Belgium', 'Germany', 'Netherlands', 'United Kingdom'] ),
            selectedRange = $bindable( null ),
            dataArray = $bindable(
                [
                    {
                        label: 'First',
                        data: [ 100, 200, 300, 485, 287 , 90 ],
                        backgroundColor: [ '#40DCB6', '#022B62' ]
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

<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title?: string, labels?: any, selectedRange?: any, dataArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, responsive?: boolean, aspectRatio?: number}} */
    let {
            title,
            labels = $bindable( [ 'Short-term', 'Long-term', 'Selling', 'Sold' ] ),
            selectedRange = $bindable( null ),
            dataArray = $bindable(
                [
                    {
                        data: 70,
                        backgroundColor: '#40DCB6',
                        hoverBackgroundColor: '#A6F4C5'
                    },
                    {
                        data: 90,
                        backgroundColor: '#3392FF',
                        hoverBackgroundColor: '#ADD3FF'
                    },
                    {
                        data: 40,
                        backgroundColor: '#00584A',
                        hoverBackgroundColor: '#007D69'
                    },
                    {
                        data: 50,
                        backgroundColor: '#022B62',
                        hoverBackgroundColor: '#02367B'
                    }
                ]
                ),
            defaultBorderColor = '#40DCB6',
            defaultBackgroundColor = '#A6F4C5',
            responsive = true,
            aspectRatio = 2
        } = $props();

    let options =
        {
            responsive,
            aspectRatio
        };
</script>

<Chart
    { title }
    type="pie"
    bind:labels
    bind:selectedRange
    bind:dataArray
    { defaultBorderColor }
    { defaultBackgroundColor }
    { options }
/>

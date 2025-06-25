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
        ];
    export let defaultBorderColor = '#40DCB6';
    export let defaultBackgroundColor = '#A6F4C5';
    export let responsive = true;
    export let aspectRatio = 2;

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

<script>
    // -- IMPORTS

    import Chart from "./Chart.svelte";

    // -- VARIABLES

    /** @type {{title: any, label?: string, keyText?: string, dataArray?: any, colorArray?: any}} */
    let {
            title,
            label = 'admin-menu-payments-label',
            keyText = 'amount',
            dataArray =
                [
                    {
                        typeId: 'payin',
                        methodId: null,
                        amount: 789,
                        statusId: 'succeeded'
                    },
                    {
                        typeId: 'payin',
                        methodId: null,
                        amount: 524,
                        statusId: 'created'
                    },
                    {
                        typeId: 'payin',
                        methodId: null,
                        amount: 828,
                        statusId: 'failed'
                    },
                    {
                        typeId: 'transfer',
                        methodId: null,
                        amount: 92,
                        statusId: 'succeeded'
                    },
                    {
                        typeId: 'transfer',
                        methodId: null,
                        amount: 368,
                        statusId: 'created'
                    },
                    {
                        typeId: 'transfer',
                        methodId: null,
                        amount: 103,
                        statusId: 'failed'
                    },
                    {
                        typeId: 'refund',
                        methodId: null,
                        amount: 500,
                        statusId: 'succeeded'
                    },
                    {
                        typeId: 'refund',
                        methodId: null,
                        amount: 730,
                        statusId: 'created'
                    },
                    {
                        typeId: 'refund',
                        methodId: null,
                        amount: 160,
                        statusId: 'failed'
                    }
                ],
            colorArray =
                [
                    '#ADD3FF',
                    '#FED584',
                    '#F0384A'
                ]
        } = $props();
</script>

<Chart
    bind:dataArray
    type="treemap"
    labels={ [ label ] }
    { keyText }
    { title }
    { colorArray }
/>

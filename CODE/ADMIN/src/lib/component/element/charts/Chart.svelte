<script>

    // -- IMPORTS

    import { languageTagStore } from '$store/languageTagStore';
    import { getRgbString } from '$src/lib/base';
    import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';
    import { Chart, registerables } from 'chart.js';
    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { onMount } from 'svelte';

    // -- VARIABLES

    /** @type {{title?: string, type: string, labels: string[], keyText?: string, selectedRange?: any, dataArray?: any, colorArray?: any, defaultBorderColor?: string, defaultBackgroundColor?: string, options?: {borderWidth?: number, fill?: boolean, smooth?: boolean, responsive?: boolean, maintainAspectRatio?: boolean, aspectRatio?: number, displayTitle?: boolean, displayLegend?: boolean, beginAtZero?: boolean}}} */
    let {
            title,
            type,
            labels = $bindable(),
            keyText,
            selectedRange = $bindable( null ),
            dataArray = $bindable(),
            colorArray = [],
            defaultBorderColor = '#40DCB6',
            defaultBackgroundColor = '#A6F4C5',
            options = {
                borderWidth: 2,
                fill: false,
                smooth: false,
                responsive: true,
                maintainAspectRatio: false,
                aspectRatio: 2,
                displayTitle: false,
                displayLegend: true,
                beginAtZero: true
            }
        } = $props();

    let canvasRef;
    let chart;

    // -- FUNCTIONS

    function createChartConfig(
        type,
        defaultBorderColor,
        defaultBackgroundColor,
        options = {
            borderWidth: 2,
            fill: false,
            smooth: false,
            responsive: true,
            maintainAspectRatio: false,
            displayTitle: false,
            displayLegend: true,
            beginAtZero: true
        }
        )
    {
        let rawConfigs = {};

        rawConfigs.type = type;
        rawConfigs.dataset = [];

        for ( let i = 0; i < dataArray.length; i++ )
        {
            if ( !dataArray[ i ].label )
            {
                dataArray[ i ].label = 'Dataset ' + ( i + 1 );
            }
            if ( !dataArray[ i ].data )
            {
                dataArray[ i ].data = labels.map( () => Math.random() * 100 );
            }
            if ( !dataArray[ i ].borderColor )
            {
                dataArray[ i ].borderColor = defaultBorderColor;
            }
            if ( !dataArray[ i ].backgroundColor )
            {
                dataArray[ i ].backgroundColor = defaultBackgroundColor;
            }
            if ( type === 'line' && !dataArray[ i ].pointBackgroundColor )
            {
                dataArray[ i ].pointBackgroundColor = dataArray[ i ].borderColor;
            }
            if ( ( type === 'pie' || type === 'doughnut' ) && !dataArray[ i ].hoverBackgroundColor )
            {
                dataArray[ i ].hoverBackgroundColor = dataArray[ i ].backgroundColor.replace( '1)', '0.5)' );
            }

            let dataset =
                {
                    label: dataArray[ i ].label,
                    backgroundColor: dataArray[ i ].backgroundColor,
                    data:
                        selectedRange !== null
                        ? dataArray[ i ].data[ selectedRange ]
                        : dataArray[ i ].data,
                    borderColor:
                        type === 'line'
                        ? dataArray[ i ].borderColor
                        : null,
                    pointBackgroundColor:
                        type === 'line'
                        ? dataArray[ i ].pointBackgroundColor
                        : null,
                    borderWidth:
                        type === 'line'
                        ? options.borderWidth
                        : null,
                    fill:
                        type === 'line' || type === 'area'
                        ? options.fill
                        : null,
                    smooth:
                        type === 'line'
                        ? options.smooth
                        : null,
                    lineTension:
                        type === 'line'
                        ? dataArray[ i ].lineTension
                        : null,
                    hoverBackgroundColor:
                        type === 'pie' || type === 'doughnut'
                        ? dataArray[ i ].hoverBackgroundColor
                        : null,
                };

            rawConfigs.dataset.push( dataset );
        }

        let structuredConfig =
            {
                type: rawConfigs.type,
                data:
                {
                    labels: labels.map(
                        label => getLocalizedText( label, $languageTagStore )
                        ),
                    datasets: rawConfigs.dataset
                },
                options:
                {
                    responsive: options.responsive,
                    maintainAspectRatio: options.maintainAspectRatio,
                    aspectRatio: options.aspectRatio,
                    plugins:
                    {
                        legend:
                        {
                            display: options.displayLegend
                        }
                    },
                    scales:
                    {
                        y:
                        {
                            beginAtZero: options.beginAtZero
                        }
                    }
                }
            };

        return structuredConfig;
    }

    // ~~

    function createTreemapChartConfig()
    {
        let config =
            {
                type: 'treemap',
                data:
                {
                    datasets:
                    [
                        {
                            label: getLocalizedTextBySlug( labels[ 0 ], $languageTagStore ),
                            tree: dataArray,
                            key: getLocalizedTextBySlug( keyText, $languageTagStore ),
                            spacing: 2,
                            borderWidht: 1,
                            borderRadius: 5,
                            borderColor: ( context ) => colorFromRaw( context, true, dataArray, colorArray ),
                            backgroundColor: ( context ) => colorFromRaw( context, false, dataArray, colorArray )
                        }
                    ]
                },
                options:
                {
                    plugins:
                    {
                        title:
                        {
                            display: false
                        },
                        legend:
                        {
                            display: false
                        },
                        tooltip:
                        {
                            display: true,
                            enabled: true,
                            callbacks:
                            {
                                title( context )
                                {
                                    return `${ context[ 0 ].dataIndex ?? 'NO DATA INDEX' }`;
                                },
                                label( context )
                                {
                                    return `${ context.dataset.label ?? 'NO DATASET LABEL' }: ${ context.raw.v }`;
                                }
                            }
                        }
                    }
                }
            };

        return config;
    }

    //

    function colorFromRaw(
        context,
        border,
        data,
        color
        )
    {
        let sliceSize = Math.ceil ( data.length / color.length );
        let index = Math.floor( context.index / sliceSize );
        // let index = 0;

        // switch ( item.statusId )
        // {
        //     case 'succeeded':
        //         index = 0;
        //         break;
        //     case 'created':
        //         index = 1;
        //         break;
        //     case 'failed':
        //         index = 2;
        //         break;
        // }

        if ( context.type !== 'data' )
        {
            return 'transparent';
        }

        const value = context.raw.v;
        let alpha = ( 1 + Math.log( value ) ) / 5;

        if ( border )
        {
            alpha += 0.2;
        }

        return getRgbString( color[ index ], alpha );
    }

    // -- STATEMENTS

    Chart.register( TreemapController, TreemapElement, ...registerables );

    // ~~

    onMount(
        () =>
        {
            let context = canvasRef.getContext( '2d' );
            let config;

            if ( type === 'treemap' )
            {
                config = createTreemapChartConfig();
            }
            else
            {
                let configOptions =
                    {
                        borderWidth: options.borderWidth,
                        fill: options.fill,
                        smooth: options.smooth,
                        responsive: options.responsive,
                        maintainAspectRatio: options.maintainAspectRatio,
                        displayTitle: options.displayTitle,
                        displayLegend: options.displayLegend,
                        beginAtZero: options.beginAtZero
                    };

                config =
                    createChartConfig(
                        type, defaultBorderColor, defaultBackgroundColor, configOptions
                        );
            }

            chart = new Chart( context, config );
        }
        );
</script>

<canvas id={ title } bind:this={ canvasRef }></canvas>

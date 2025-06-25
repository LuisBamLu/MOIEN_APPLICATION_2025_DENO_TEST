<script>
    // -- IMPORTS

    import { getLocalizedText, getLocalizedTextBySlug } from 'senselogic-gist';
    import { languageTagStore } from '$store/languageTagStore';
    import jsPDF from 'jspdf';

    // -- VARIABLES

    /** @type {{title: any, labels: any, chartData?: any, description?: string, detailSlugMap?: any, children?: import('svelte').Snippet}} */
    let {
        title,
        labels,
        chartData = null,
        description = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
        detailSlugMap = {
        summary: 'Deserunt esse nostrud dolor anim.',
        verbose: 'Aliquip eiusmod Lorem aliqua proident ex officia ut laboris ad excepteur pariatur aliqua veniam. Nostrud deserunt nostrud non et adipisicing sunt proident eu est in ipsum amet. Consequat laboris est ex dolor enim irure quis. Sunt deserunt laboris officia irure occaecat irure incididunt occaecat sit magna aliqua. Enim velit anim do sunt pariatur velit esse.'
    },
        children
    } = $props();

    let isChartExportMenuOpen = $state(false);

    // -- FUNCTIONS

    function toggleChartExportMenu()
    {
        isChartExportMenuOpen = !isChartExportMenuOpen;
    }

    // ~~

    function exportChartToPng()
    {
        let png;
        let element = document.getElementById( title );
        let link = document.createElement( 'a' );

        if ( element && element instanceof HTMLCanvasElement )
        {
            png = element.toDataURL( 'image/png' );
            link.href = png;
            link.download = `${ title }.png`;
            link.click();
            toggleChartExportMenu();
        }
        else
        {
            console.error( 'No canvas element found.' );
        }
    }

    // ~~

    function exportChartToSvg()
    {
        let canvaElement = document.getElementById( title );
        let link = document.createElement( 'a' );

        if ( canvaElement && canvaElement instanceof HTMLCanvasElement )
        {
            let image = new Image();
            let svgElement = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

            svgElement.setAttribute( 'width', canvaElement.width.toString() );
            svgElement.setAttribute( 'height', canvaElement.height.toString() );

            image.src = canvaElement.toDataURL( 'image/png' );
            image.onload = () =>
            {
                let svgNS = svgElement.namespaceURI;
                let svgImage = document.createElementNS(svgNS, 'image');

                svgImage.setAttribute( 'x', '0' );
                svgImage.setAttribute( 'y', '0' );
                svgImage.setAttribute( 'width', canvaElement.width.toString() );
                svgImage.setAttribute( 'height', canvaElement.height.toString() );
                svgImage.setAttributeNS( 'http://www.w3.org/1999/xlink', 'href', image.src );
                svgElement.appendChild( svgImage );

                let serializer = new XMLSerializer();
                let svgString = serializer.serializeToString( svgElement );
                let blob = new Blob(
                    [ svgString ],
                    {
                        type: 'image/svg+xml;charset=utf-8'
                    }
                    );
                let url = URL.createObjectURL( blob );

                link.href = url;
                link.download = `${ title }.svg`;
                link.click();

                URL.revokeObjectURL( url );
            };

            toggleChartExportMenu();
        }
        else
        {
            console.error( 'No canvas element found.' );
        }
    }

    // ~~

    function exportChartToPdf()
    {
        let element = document.getElementById( title );

        if ( element && element instanceof HTMLCanvasElement )
        {
            let image = element.toDataURL( 'image/png' );
            let pdf = new jsPDF();

            let margin = 20;

            let pageWidth = pdf.internal.pageSize.getWidth() - margin;
            let pageHeight = pdf.internal.pageSize.getHeight() - margin;

            let canvasAspectRatio = element.width / element.height;
            let pdfAspectRatio = pageWidth / pageHeight;

            let imgWidth, imgHeight;

            if ( canvasAspectRatio > pdfAspectRatio )
            {
                imgWidth = pageWidth;
                imgHeight = pageWidth / canvasAspectRatio;
            }
            else
            {
                imgWidth = pageHeight * canvasAspectRatio;
                imgHeight = pageHeight;
            }

            let offsetX = ( pdf.internal.pageSize.getWidth() - imgWidth ) / 2;
            let offsetY = ( pdf.internal.pageSize.getHeight() - imgHeight ) / 2;

            pdf.addImage(
                image,
                'PNG',
                offsetX,
                offsetY,
                imgWidth,
                imgHeight
                );

            pdf.save( `${ title }.pdf` );
            toggleChartExportMenu();
        }
        else
        {
            console.error( 'No canvas element found.' );
        }
    }

    // ~~

    function exportChartToCsv()
    {
        let csv = 'data:text/csv;charset=utf-8,';
        let anchorElement = document.createElement( 'a' );
        let rangeLabel =
        [
            `Last year:¨fr:L'année dernière:¨de:Letztes Jahr:`,
            `Last month:¨fr:Le mois dernier:¨de:Letzter Monat:`,
            `Last week:¨fr:Dernière semaine:¨de:Letzte Woche:`,
            `Last 24h:¨fr:Dernières 24h:¨de:Letzte 24h:`
        ];

        let chartCount = chartData.length;

        for ( let chartIndex = 0; chartIndex < chartCount; chartIndex++ )
        {
            let row = chartData[ chartIndex ];

            csv += getLocalizedText( rangeLabel[ chartIndex ] || ' ', $languageTagStore ) + ',';

            csv += chartIndex === 3
                ? labels[ chartIndex ].join( 'h,') + 'h\n'
                : labels[ chartIndex ].join( ',' ) + '\n';

            csv += ' ,' + row.join( ',' ) + '\n\n';
        }

        anchorElement.href = encodeURI( csv );
        anchorElement.download = `${ title }.csv`;

        anchorElement.click();
        toggleChartExportMenu();
    }
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .chart-card
    {
        width: 100%
        padding: 1rem;
        min-width: 350px;
        border-radius: 0.5rem;
        padding: 1rem;

        display: flex;
        flex-direction: column;
        gap: 1rem;

        background-color: white;
    }

    .chart-head
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        h2 {
            font-size: 1.2rem;
            font-weight: 700;
            color: grayColor100;
        }

        p {
            font-size: 0.8rem;
        }
    }

    .chart-head-row
    {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }

    .dropdown-export-menu
    {
        position: relative;
    }

    .chart-head-button
    {
        border: 1px solid grayColor700;
        border-radius: 50%;
        padding: 5px;

        background: none;

        cursor: pointer;
    }

    .chart-head-export-menu
    {
        z-index: 1000;
        position: absolute;
        top: 2rem;
        right: 0;

        border: 1px solid grayColor700;
        border-radius: 0.5rem;
        padding: 0.3rem;

        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        background-color: grayColor950;
    }

    .chart-head-export-button
    {
        width: 5rem;
        border-radius: 0.5rem;
        padding: 5px;

        background: none;

        font-size: 0.8rem;

        cursor: pointer;
        &:hover
        {
            background-color: greenColor300;

            color: white;
        }
    }

    .chart-footer
    {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        details
        {
            border-radius: 0.5rem;

            background-color: blueColor950;
        }

        details[open] summary
        {
            border-radius: 0.5rem 0.5rem 0 0;

            list-style-type: '⬆ ';
        }

        summary
        {
            border-radius: 0.5rem;
            padding: 0.5rem;

            background-color: grayColor900;

            list-style-type: '⬇ ';
            font-size: 0.8rem;
            font-weight: 700;
            color: grayColor100;

            cursor: pointer;
            &::marker
            {
                color: blueColor300;
            }
        }

        .pre
        {
            margin: 0.5rem;
            border-radius: 0.5rem;
            padding: 0.5rem;

            background-color: grayColor900;
        }

        code
        {
            font-size: 0.8rem;
            color: grayColor100;
        }
    }
</style>

<article class="chart-card">
    <div class="chart-head">
        <div class="chart-head-row">
            <h2>{ getLocalizedTextBySlug( title, $languageTagStore ) }</h2>
            <div class="dropdown-export-menu">
                <button
                    class="chart-head-button"
                    onclick={toggleChartExportMenu}
                    title={ getLocalizedTextBySlug( 'Export menu', $languageTagStore ) }
                >
                    <div class="gray-elipsis-icon size-90"></div>
                </button>
                {#if isChartExportMenuOpen }
                    <div class="chart-head-export-menu">
                        <button
                            class="chart-head-export-button"
                            onclick={exportChartToSvg}
                        >
                            { getLocalizedTextBySlug( 'Export as SVG', $languageTagStore ) }
                        </button>
                        <button
                            class="chart-head-export-button"
                            onclick={exportChartToPng}
                        >
                            { getLocalizedTextBySlug( 'Export as PNG', $languageTagStore ) }
                        </button>
                        <button
                            class="chart-head-export-button"
                            onclick={exportChartToPdf}
                        >
                            { getLocalizedTextBySlug( 'Export as PDF', $languageTagStore ) }
                        </button>
                        <button
                            class="chart-head-export-button"
                            onclick={exportChartToCsv}
                        >
                            { getLocalizedTextBySlug( 'Export as CSV', $languageTagStore ) }
                        </button>
                    </div>
                {/if}
            </div>
        </div>
        <p>{ description }</p>
    </div>
    {@render children?.()}
    <div class="chart-footer">
        <details>
            <summary>{ getLocalizedText( detailSlugMap.summary, $languageTagStore ) }</summary>
            <div class="pre">
                <code>
                    { getLocalizedText( detailSlugMap.verbose, $languageTagStore ) }
                </code>
            </div>
        </details>
    </div>
</article>

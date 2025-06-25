<script>
    // -- VARIABLES

    export let number = 0;
    export let index = 0;
    export let text = ''

    // -- FUNCTIONS

    function processLinkLine(
        line
        )
    {
        let newLine = '';
        let partArray = line.split( '[' );
        let partCount = partArray.length;

        for ( let partIndex = 0; partIndex < partCount; partIndex )
        {
            let part = partArray[ partIndex ];

            if ( index === 0 )
            {
                newLine += part;
            }
            else
            {
                let text = part.split( ']' )[ 0 ];
                let url = part.split( '](' )[ 1 ].split( ')' )[ 0 ];
                let after = part.split( ')' )[ 1 ];

                newLine += `<a href="${ url }">${ text }</a>${ after }`;
            }
        }

        return newLine;
    }

// ~~

function getTextHtml(
    text
    )
{
    let innerHTML = '';

    let content = `<p>${  processLinkLine( text ) }</p>`;

    innerHTML += content;

    return innerHTML;
}
</script>

<style lang="stylus">
    // -- IMPORTS

    @import '../../../../constant.styl';
    @import '../../../../mixin.styl';

    // -- STYLES

    .item
    {
        margin: 1rem 0;
        width: 100%;
        padding: 1rem;
    }

    .item-wrap
    {
        display: flex;
        flex-direction: column;
        align-items: left;

        +media( desktop )
        {
            flex-direction: row;
        }
    }

    .item-index
    {
        width: 5%;
        min-width: 60px;

        font-size: 1.3rem;
        font-weight: bold;
        color: greenColor600;
    }

    .item-body
    {
        width: 99%;

        font-size: 1.1rem;
        font-weight: 500;
        color: blueColor300;
        + media(desktop, tablet)
        {
            text-align: justify;
        }
    }
</style>

<div class="item">
    <div class="item-wrap">
        <div class="item-index">
            <p>{ number }. { index + 1 }</p>
        </div>
        <div class="item-body">
            {@html getTextHtml( text )}
        </div>
    </div>
</div>

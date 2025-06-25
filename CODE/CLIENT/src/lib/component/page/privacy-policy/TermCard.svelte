<script>
    // -- VARIABLES

    export let number = 0;
    export let title = '';
    export let text = '';

    // -- FUNCTIONS

    function processLinkLine(
        line
        )
    {
        let newLine = '';
        line.split( '[' ).forEach(
            ( part, index ) =>
            {
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
            );

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

    .card
    {
        margin: 1rem;
        border: 1px solid greenColor600;
        border-radius: 5px;
        padding: 1rem;
    }

    .card h3
    {
        margin: 0 0 1rem;

        font-size: 1.3rem;
        font-weight: bold;
        color: greenColor600;
    }

    .card-body
    {
        font-size: 1.1rem;
        font-weight: 500;
        color: blueColor300;
    }
</style>

<div class="card">
    <h3>{ number }. { title }</h3>
    <div class="card-body">
        {@html getTextHtml( text )}
    </div>
</div>

// -- FUNCTIONS

export function disableScroll(
    )
{
    window.scrollTo( 0, 0 );

    const element = document.getElementById( 'html' );

    if ( element )
    {
        element.style.overflowY = 'hidden';
        element.style.overflowX = 'hidden';
    }
}

// ~~

export function enableScroll(
    )
{
    const element = document.getElementById( 'html' );

    if ( element )
    {
        element.style.overflowY = '';
        element.style.overflowX = '';
    }
}

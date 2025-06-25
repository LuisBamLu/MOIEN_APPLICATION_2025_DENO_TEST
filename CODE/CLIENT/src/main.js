// -- IMPORTS

import './app.css'
import './app.styl'
import App from './App.svelte'

// -- STATEMENTS

let app =
    new App(
        {
            target: document.getElementById( 'app' )
        }
        );

export default app;

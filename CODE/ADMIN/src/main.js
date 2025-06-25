// -- IMPORTS

import './app.styl';
import App from './App.svelte';
import './app.css';
import { mount } from "svelte";

// -- STATEMENTS

let app =
    mount(
        App,
        {
            target: document.getElementById( 'app' )
        }
        );

export default app;
